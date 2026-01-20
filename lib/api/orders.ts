import apiClient from './client';
import { Order, CreateOrderRequest } from '@/types/models';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const orderApi = {
  createOrder: (data: CreateOrderRequest) =>
    apiClient.post<{ success: boolean; order: Order }>('/api/orders', data),

  getOrders: (params?: { status?: string; page?: number; limit?: number }) =>
    apiClient.get<{ success: boolean; orders: Order[] }>('/api/orders', { params }),

  getOrder: (id: string) => apiClient.get<{ success: boolean; order: Order }>(`/api/orders/${id}`),

  updateOrderStatus: (id: string, status: string) =>
    apiClient.patch(`/api/orders/${id}/status`, { status }),

  cancelOrder: (id: string) => apiClient.patch(`/api/orders/${id}/cancel`),
};

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: orderApi.createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

export function useOrders(params?: { status?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: ['orders', params],
    queryFn: async () => {
      const { data } = await orderApi.getOrders(params);
      const apiData = data as any;

      // Handle different response structures
      if (apiData.orders && Array.isArray(apiData.orders)) {
        return apiData.orders;
      }
      if (apiData.data?.orders && Array.isArray(apiData.data.orders)) {
        return apiData.data.orders;
      }
      if (apiData.data && Array.isArray(apiData.data)) {
        return apiData.data;
      }
      if (Array.isArray(apiData)) {
        return apiData;
      }

      return [];
    },
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ['order', id],
    queryFn: async () => {
      const { data } = await orderApi.getOrder(id);
      return data.order;
    },
    enabled: !!id,
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      orderApi.updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}
