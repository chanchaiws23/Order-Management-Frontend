import apiClient from './client';
import { Order, CreateOrderRequest } from '@/types/models';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const orderApi = {
  createOrder: (data: CreateOrderRequest) =>
    apiClient.post<{ success: boolean; order: Order }>('/api/orders', data),

  getOrders: (params?: { status?: string; page?: number; limit?: number }) =>
    apiClient.get<{ success: boolean; orders: Order[] }>('/api/orders', { params }),

  getOrder: (id: string) =>
    apiClient.get<{ success: boolean; order: Order }>(`/api/orders/${id}`),

  updateOrderStatus: (id: string, status: string) =>
    apiClient.patch(`/api/orders/${id}/status`, { status }),

  cancelOrder: (id: string) =>
    apiClient.patch(`/api/orders/${id}/cancel`),
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
      return data.orders;
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
