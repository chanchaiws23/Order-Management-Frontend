import apiClient from './client';
import { Customer } from '@/types/models';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const customerApi = {
  getCustomers: (params?: { page?: number; limit?: number; search?: string }) =>
    apiClient.get<{ success: boolean; customers: Customer[] }>('/api/customers', { params }),

  searchCustomers: (query: string) =>
    apiClient.get<{ success: boolean; customers: Customer[] }>('/api/customers/search', {
      params: { q: query },
    }),

  getCustomer: (id: string) =>
    apiClient.get<{ success: boolean; customer: Customer }>(`/api/customers/${id}`),

  updateCustomer: (id: string, data: Partial<Customer>) =>
    apiClient.put<{ success: boolean; customer: Customer }>(`/api/customers/${id}`, data),

  deleteCustomer: (id: string) => apiClient.delete(`/api/customers/${id}`),
};

export function useCustomers(params?: { page?: number; limit?: number; search?: string }) {
  return useQuery({
    queryKey: ['customers', params],
    queryFn: async () => {
      try {
        const { data } = await customerApi.getCustomers(params);
        const apiData = data as any;

        if (apiData.customers && Array.isArray(apiData.customers)) {
          return apiData.customers;
        }
        if (apiData.data?.customers && Array.isArray(apiData.data.customers)) {
          return apiData.data.customers;
        }
        if (apiData.data && Array.isArray(apiData.data)) {
          return apiData.data;
        }
        if (Array.isArray(apiData)) {
          return apiData;
        }

        return [];
      } catch (error) {
        console.error('[useCustomers] Error:', error);
        return [];
      }
    },
  });
}

export function useCustomer(id: string) {
  return useQuery({
    queryKey: ['customer', id],
    queryFn: async () => {
      const { data } = await customerApi.getCustomer(id);
      const apiData = data as any;
      return apiData.customer || apiData.data?.customer || apiData.data || apiData;
    },
    enabled: !!id,
  });
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Customer> }) =>
      customerApi.updateCustomer(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: customerApi.deleteCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
}
