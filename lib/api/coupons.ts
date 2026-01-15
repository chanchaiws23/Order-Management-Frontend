import apiClient from './client';
import { Coupon } from '@/types/models';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const couponApi = {
  getCoupons: (params?: { page?: number; limit?: number }) =>
    apiClient.get<{ success: boolean; coupons: Coupon[] }>('/api/coupons', { params }),

  getActiveCoupons: () =>
    apiClient.get<{ success: boolean; coupons: Coupon[] }>('/api/coupons/active'),

  getCoupon: (id: string) =>
    apiClient.get<{ success: boolean; coupon: Coupon }>(`/api/coupons/${id}`),

  validateCoupon: (code: string, orderTotal: number) =>
    apiClient.post<{ success: boolean; coupon: Coupon; discount: number }>('/api/coupons/validate', {
      code,
      orderTotal,
    }),

  createCoupon: (data: Partial<Coupon>) =>
    apiClient.post<{ success: boolean; coupon: Coupon }>('/api/coupons', data),

  updateCoupon: (id: string, data: Partial<Coupon>) =>
    apiClient.put<{ success: boolean; coupon: Coupon }>(`/api/coupons/${id}`, data),

  deleteCoupon: (id: string) =>
    apiClient.delete(`/api/coupons/${id}`),

  toggleCoupon: (id: string) =>
    apiClient.patch(`/api/coupons/${id}/toggle`),
};

export function useCoupons(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: ['coupons', params],
    queryFn: async () => {
      try {
        const { data } = await couponApi.getCoupons(params);
        const apiData = data as any;
        
        if (apiData.coupons && Array.isArray(apiData.coupons)) {
          return apiData.coupons;
        }
        if (apiData.data?.coupons && Array.isArray(apiData.data.coupons)) {
          return apiData.data.coupons;
        }
        if (apiData.data && Array.isArray(apiData.data)) {
          return apiData.data;
        }
        if (Array.isArray(apiData)) {
          return apiData;
        }
        
        console.log('[useCoupons] Unexpected response:', apiData);
        return [];
      } catch (error) {
        console.error('[useCoupons] Error:', error);
        return [];
      }
    },
  });
}

export function useCoupon(id: string) {
  return useQuery({
    queryKey: ['coupon', id],
    queryFn: async () => {
      const { data } = await couponApi.getCoupon(id);
      const apiData = data as any;
      return apiData.coupon || apiData.data?.coupon || apiData.data || apiData;
    },
    enabled: !!id,
  });
}

export function useCreateCoupon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: couponApi.createCoupon,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
    },
  });
}

export function useUpdateCoupon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Coupon> }) =>
      couponApi.updateCoupon(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
    },
  });
}

export function useDeleteCoupon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: couponApi.deleteCoupon,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
    },
  });
}

export function useToggleCoupon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: couponApi.toggleCoupon,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
    },
  });
}
