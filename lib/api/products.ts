import apiClient from './client';
import { Product } from '@/types/models';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface ProductFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

export const productApi = {
  getProducts: (params?: ProductFilters) =>
    apiClient.get<{ success: boolean; products: Product[] }>('/api/products', { params }),

  getProduct: (id: string) =>
    apiClient.get<{ success: boolean; product: Product }>(`/api/products/${id}`),

  getProductBySlug: (slug: string) =>
    apiClient.get<{ success: boolean; product: Product }>(`/api/products/slug/${slug}`),

  getFeaturedProducts: () =>
    apiClient.get<{ success: boolean; products: Product[] }>('/api/products/featured'),

  createProduct: (data: Partial<Product>) =>
    apiClient.post<{ success: boolean; product: Product }>('/api/products', data),

  updateProduct: (id: string, data: Partial<Product>) =>
    apiClient.put<{ success: boolean; product: Product }>(`/api/products/${id}`, data),

  deleteProduct: (id: string) =>
    apiClient.delete(`/api/products/${id}`),

  updateStock: (id: string, quantity: number) =>
    apiClient.patch(`/api/products/${id}/stock`, { quantity }),
};

export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: async () => {
      const { data } = await productApi.getProducts(filters);
      const apiData = data as any;
      
      // Handle different response structures
      // { success: true, products: [...] }
      if (apiData.products && Array.isArray(apiData.products)) {
        return apiData.products;
      }
      // { success: true, data: { products: [...] } }
      if (apiData.data?.products && Array.isArray(apiData.data.products)) {
        return apiData.data.products;
      }
      // { success: true, data: [...] }
      if (apiData.data && Array.isArray(apiData.data)) {
        return apiData.data;
      }
      // Direct array
      if (Array.isArray(apiData)) {
        return apiData;
      }
      
      console.log('[useProducts] Unexpected response structure:', apiData);
      return [];
    },
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const response = await productApi.getProduct(id);
      const apiData = response.data as any;
      
      // API returns { success: true, data: {...} }
      if (apiData.data) {
        return apiData.data;
      }
      // Fallback for { success: true, product: {...} }
      if (apiData.product) {
        return apiData.product;
      }
      // Direct data
      return apiData;
    },
    enabled: !!id,
  });
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: async () => {
      const { data } = await productApi.getFeaturedProducts();
      return data.products;
    },
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productApi.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Product> }) =>
      productApi.updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productApi.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}
