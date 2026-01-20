import apiClient from './client';
import { Payment } from '@/types/models';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface PaymentFilters {
  status?: string;
  method?: string;
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
}

export const paymentApi = {
  getPayments: (params?: PaymentFilters) =>
    apiClient.get<{ success: boolean; payments: Payment[]; total: number }>('/api/payments', {
      params,
    }),

  getPayment: (id: string) =>
    apiClient.get<{ success: boolean; payment: Payment }>(`/api/payments/${id}`),

  getOrderPayment: (orderId: string) =>
    apiClient.get<{ success: boolean; payment: Payment }>(`/api/orders/${orderId}/payment`),

  requestRefund: (paymentId: string, reason?: string) =>
    apiClient.post<{ success: boolean; payment: Payment }>(`/api/payments/${paymentId}/refund`, {
      reason,
    }),

  getPaymentStats: () =>
    apiClient.get<{
      success: boolean;
      stats: {
        totalAmount: number;
        successCount: number;
        failedCount: number;
        refundedCount: number;
        pendingCount: number;
      };
    }>('/api/payments/stats'),
};

export function usePayments(params?: PaymentFilters) {
  return useQuery({
    queryKey: ['payments', params],
    queryFn: async () => {
      try {
        const { data } = await paymentApi.getPayments(params);
        const apiData = data as any;

        const payments = apiData.payments || apiData.data?.payments || apiData.data || [];
        const total = apiData.total || apiData.data?.total || payments.length;

        return { payments, total };
      } catch {
        return { payments: [], total: 0 };
      }
    },
  });
}

export function usePayment(id: string) {
  return useQuery({
    queryKey: ['payment', id],
    queryFn: async () => {
      const { data } = await paymentApi.getPayment(id);
      const apiData = data as any;
      return apiData.payment || apiData.data?.payment || apiData.data || apiData;
    },
    enabled: !!id,
  });
}

export function useOrderPayment(orderId: string) {
  return useQuery({
    queryKey: ['payment', 'order', orderId],
    queryFn: async () => {
      const { data } = await paymentApi.getOrderPayment(orderId);
      const apiData = data as any;
      return apiData.payment || apiData.data?.payment || apiData.data || null;
    },
    enabled: !!orderId,
  });
}

export function useRequestRefund() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ paymentId, reason }: { paymentId: string; reason?: string }) =>
      paymentApi.requestRefund(paymentId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

export function usePaymentStats() {
  return useQuery({
    queryKey: ['payments', 'stats'],
    queryFn: async () => {
      try {
        const { data } = await paymentApi.getPaymentStats();
        const apiData = data as any;
        return (
          apiData.stats ||
          apiData.data?.stats ||
          apiData.data || {
            totalAmount: 0,
            successCount: 0,
            failedCount: 0,
            refundedCount: 0,
            pendingCount: 0,
          }
        );
      } catch {
        return {
          totalAmount: 0,
          successCount: 0,
          failedCount: 0,
          refundedCount: 0,
          pendingCount: 0,
        };
      }
    },
  });
}
