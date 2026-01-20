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

  getAllProducts: (params?: ProductFilters) =>
    apiClient.get<{
      success: boolean;
      data: Product[];
      total: number;
      totalPages: number;
      page: number;
    }>('/api/products/all', { params }),

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

  deleteProduct: (id: string) => apiClient.delete(`/api/products/${id}`),

  updateStock: (id: string, quantity: number) =>
    apiClient.patch(`/api/products/${id}/stock`, { quantity }),
};

export interface ProductsResponse {
  products: Product[];
  total: number;
  totalPages: number;
  page: number;
}

export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: async () => {
      const { data } = await productApi.getProducts(filters);
      const apiData = data as any;

      // Handle different response structures and extract pagination info
      let products: Product[] = [];
      let total = 0;
      let totalPages = 1;
      let page = 1;

      // { success: true, data: [...], total, totalPages }
      if (apiData.data && Array.isArray(apiData.data)) {
        products = apiData.data;
        total = apiData.total || products.length;
        totalPages = apiData.totalPages || 1;
        page = apiData.page || 1;
      }
      // { success: true, products: [...] }
      else if (apiData.products && Array.isArray(apiData.products)) {
        products = apiData.products;
        total = apiData.total || products.length;
        totalPages = apiData.totalPages || 1;
        page = apiData.page || 1;
      }
      // { success: true, data: { products: [...] } }
      else if (apiData.data?.products && Array.isArray(apiData.data.products)) {
        products = apiData.data.products;
        total = apiData.data.total || apiData.total || products.length;
        totalPages = apiData.data.totalPages || apiData.totalPages || 1;
        page = apiData.data.page || apiData.page || 1;
      }
      // Direct array
      else if (Array.isArray(apiData)) {
        products = apiData;
        total = products.length;
      }

      return { products, total, totalPages, page } as ProductsResponse;
    },
  });
}

export function useAllProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: ['allProducts', filters],
    queryFn: async () => {
      const { data } = await productApi.getAllProducts(filters);
      const apiData = data as any;

      const products = apiData.data || apiData.products || [];
      const total = apiData.total || apiData.pagination?.total || products.length;
      const totalPages =
        apiData.totalPages ||
        apiData.pagination?.totalPages ||
        Math.ceil(total / (filters?.limit || 10));
      const page = apiData.page || apiData.pagination?.page || 1;

      return { products, total, totalPages, page } as ProductsResponse;
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
      queryClient.invalidateQueries({ queryKey: ['allProducts'] });
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
      queryClient.invalidateQueries({ queryKey: ['allProducts'] });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productApi.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['allProducts'] });
    },
  });
}
