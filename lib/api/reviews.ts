import apiClient from './client';
import { Review } from '@/types/models';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const reviewApi = {
  getProductReviews: (productId: string) =>
    apiClient.get<{ success: boolean; reviews: Review[] }>(`/api/products/${productId}/reviews`),

  getProductRating: (productId: string) =>
    apiClient.get<{ success: boolean; averageRating: number; reviewCount: number }>(
      `/api/products/${productId}/rating`
    ),

  getReview: (id: string) =>
    apiClient.get<{ success: boolean; review: Review }>(`/api/reviews/${id}`),

  getPendingReviews: () =>
    apiClient.get<{ success: boolean; reviews: Review[] }>('/api/reviews/pending'),

  createReview: (data: {
    productId: string;
    orderId: string;
    rating: number;
    title: string;
    comment: string;
    images?: string[];
  }) => apiClient.post<{ success: boolean; review: Review }>('/api/reviews', data),

  updateReview: (id: string, data: Partial<Review>) =>
    apiClient.put<{ success: boolean; review: Review }>(`/api/reviews/${id}`, data),

  approveReview: (id: string) =>
    apiClient.patch(`/api/reviews/${id}/approve`),

  rejectReview: (id: string) =>
    apiClient.patch(`/api/reviews/${id}/reject`),

  deleteReview: (id: string) =>
    apiClient.delete(`/api/reviews/${id}`),

  markHelpful: (id: string) =>
    apiClient.patch(`/api/reviews/${id}/helpful`),
};

export function useProductReviews(productId: string) {
  return useQuery({
    queryKey: ['reviews', 'product', productId],
    queryFn: async () => {
      const { data } = await reviewApi.getProductReviews(productId);
      const apiData = data as any;
      return apiData.reviews || apiData.data?.reviews || apiData.data || [];
    },
    enabled: !!productId,
  });
}

export function usePendingReviews() {
  return useQuery({
    queryKey: ['reviews', 'pending'],
    queryFn: async () => {
      try {
        const { data } = await reviewApi.getPendingReviews();
        const apiData = data as any;
        
        if (apiData.reviews && Array.isArray(apiData.reviews)) {
          return apiData.reviews;
        }
        if (apiData.data?.reviews && Array.isArray(apiData.data.reviews)) {
          return apiData.data.reviews;
        }
        if (apiData.data && Array.isArray(apiData.data)) {
          return apiData.data;
        }
        if (Array.isArray(apiData)) {
          return apiData;
        }
        
        return [];
      } catch (error) {
        console.error('[usePendingReviews] Error:', error);
        return [];
      }
    },
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reviewApi.createReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
}

export function useApproveReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reviewApi.approveReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
}

export function useRejectReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reviewApi.rejectReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reviewApi.deleteReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
}
