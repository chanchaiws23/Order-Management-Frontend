import apiClient from './client';
import { useQuery } from '@tanstack/react-query';
import { Order, Product, Customer } from '@/types/models';

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  revenueChange: number;
  ordersChange: number;
  productsChange: number;
  customersChange: number;
}

export interface AdminOrdersResponse {
  success: boolean;
  orders: Order[];
  total: number;
  page: number;
  limit: number;
}

export interface AdminCustomersResponse {
  success: boolean;
  customers: Customer[];
  total: number;
  page: number;
  limit: number;
}

export const adminApi = {
  getDashboardStats: () =>
    apiClient.get<{ success: boolean; stats: DashboardStats }>('/api/admin/dashboard/stats'),

  getRecentOrders: (limit: number = 5) =>
    apiClient.get<{ success: boolean; orders: Order[] }>('/api/admin/orders/recent', {
      params: { limit },
    }),

  getAllOrders: (params?: { status?: string; page?: number; limit?: number; search?: string }) =>
    apiClient.get<AdminOrdersResponse>('/api/admin/orders', { params }),

  getAllProducts: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
  }) =>
    apiClient.get<{ success: boolean; products: Product[]; total: number }>('/api/admin/products', {
      params,
    }),

  getAllCustomers: (params?: { page?: number; limit?: number; search?: string }) =>
    apiClient.get<AdminCustomersResponse>('/api/admin/customers', { params }),
};

export function useDashboardStats() {
  return useQuery({
    queryKey: ['admin', 'dashboard', 'stats'],
    queryFn: async () => {
      try {
        const { data } = await adminApi.getDashboardStats();
        return data.stats;
      } catch {
        // Return mock data if API fails
        return {
          totalRevenue: 0,
          totalOrders: 0,
          totalProducts: 0,
          totalCustomers: 0,
          revenueChange: 0,
          ordersChange: 0,
          productsChange: 0,
          customersChange: 0,
        };
      }
    },
  });
}

export function useRecentOrders(limit: number = 5) {
  return useQuery({
    queryKey: ['admin', 'orders', 'recent', limit],
    queryFn: async () => {
      try {
        const { data } = await adminApi.getRecentOrders(limit);
        return data.orders;
      } catch {
        return [];
      }
    },
  });
}

export function useAdminOrders(params?: {
  status?: string;
  page?: number;
  limit?: number;
  search?: string;
}) {
  return useQuery({
    queryKey: ['admin', 'orders', params],
    queryFn: async () => {
      try {
        const { data } = await adminApi.getAllOrders(params);
        return { orders: data.orders, total: data.total };
      } catch {
        return { orders: [], total: 0 };
      }
    },
  });
}

export function useAdminProducts(params?: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
}) {
  return useQuery({
    queryKey: ['admin', 'products', params],
    queryFn: async () => {
      try {
        const { data } = await adminApi.getAllProducts(params);
        return { products: data.products, total: data.total };
      } catch {
        return { products: [], total: 0 };
      }
    },
  });
}

export function useAdminCustomers(params?: { page?: number; limit?: number; search?: string }) {
  return useQuery({
    queryKey: ['admin', 'customers', params],
    queryFn: async () => {
      try {
        const { data } = await adminApi.getAllCustomers(params);
        return { customers: data.customers, total: data.total };
      } catch {
        return { customers: [], total: 0 };
      }
    },
  });
}
