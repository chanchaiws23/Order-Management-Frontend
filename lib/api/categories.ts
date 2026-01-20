import apiClient from './client';
import { Category } from '@/types/models';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const categoryApi = {
  getCategories: (params?: { page?: number; limit?: number; search?: string }) =>
    apiClient.get<{ success: boolean; categories: Category[] }>('/api/categories', { params }),

  getCategory: (id: string) =>
    apiClient.get<{ success: boolean; category: Category }>(`/api/categories/${id}`),

  getCategoryBySlug: (slug: string) =>
    apiClient.get<{ success: boolean; category: Category }>(`/api/categories/slug/${slug}`),

  createCategory: (data: Partial<Category>) =>
    apiClient.post<{ success: boolean; category: Category }>('/api/categories', data),

  updateCategory: (id: string, data: Partial<Category>) =>
    apiClient.put<{ success: boolean; category: Category }>(`/api/categories/${id}`, data),

  deleteCategory: (id: string) => apiClient.delete(`/api/categories/${id}`),
};

export function useCategories(params?: { page?: number; limit?: number; search?: string }) {
  return useQuery({
    queryKey: ['categories', params],
    queryFn: async () => {
      try {
        const { data } = await categoryApi.getCategories(params);
        const apiData = data as any;

        if (apiData.categories && Array.isArray(apiData.categories)) {
          return apiData.categories;
        }
        if (apiData.data?.categories && Array.isArray(apiData.data.categories)) {
          return apiData.data.categories;
        }
        if (apiData.data && Array.isArray(apiData.data)) {
          return apiData.data;
        }
        if (Array.isArray(apiData)) {
          return apiData;
        }

        return [];
      } catch {
        return [];
      }
    },
  });
}

export function useCategory(id: string) {
  return useQuery({
    queryKey: ['category', id],
    queryFn: async () => {
      const { data } = await categoryApi.getCategory(id);
      const apiData = data as any;
      return apiData.category || apiData.data?.category || apiData.data || apiData;
    },
    enabled: !!id,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: categoryApi.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Category> }) =>
      categoryApi.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: categoryApi.deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}
