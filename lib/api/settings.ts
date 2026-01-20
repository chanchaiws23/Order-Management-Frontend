import apiClient from './client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// ==================== Types ====================

export interface StoreSettings {
  id?: string;
  storeName: string;
  storeEmail: string;
  storePhone: string;
  storeAddress: string;
  storeCurrency: string;
  storeDescription: string;
  logoUrl: string;
  timezone?: string;
  language?: string;
}

export interface ShippingMethod {
  id: string;
  name: string;
  price: number;
  estimatedDays: string;
  isActive: boolean;
}

export interface ShippingSettings {
  freeShippingThreshold: number;
  methods: ShippingMethod[];
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: 'credit_card' | 'paypal' | 'bank_transfer' | 'cod';
  isActive: boolean;
  config?: Record<string, string>;
}

export interface PaymentSettings {
  methods: PaymentMethod[];
  defaultMethod?: string;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  orderConfirmation: boolean;
  orderStatusUpdate: boolean;
  promotionalEmails: boolean;
  adminNewOrder: boolean;
  adminLowStock: boolean;
  lowStockThreshold: number;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  level: number;
  permissions: string[];
  isSystem: boolean;
  createdAt: string;
}

export interface Permission {
  key: string;
  label: string;
  description?: string;
  category: string;
}

// ==================== API ====================

export const settingsApi = {
  // Store Settings
  getStoreSettings: () =>
    apiClient.get<{ success: boolean; settings: StoreSettings }>('/api/settings/store'),

  updateStoreSettings: (data: Partial<StoreSettings>) =>
    apiClient.put<{ success: boolean; settings: StoreSettings }>('/api/settings/store', data),

  // Shipping Settings
  getShippingSettings: () =>
    apiClient.get<{ success: boolean; settings: ShippingSettings }>('/api/settings/shipping'),

  updateShippingSettings: (data: ShippingSettings) =>
    apiClient.put<{ success: boolean; settings: ShippingSettings }>('/api/settings/shipping', data),

  // Payment Settings
  getPaymentSettings: () =>
    apiClient.get<{ success: boolean; settings: PaymentSettings }>('/api/settings/payment'),

  updatePaymentSettings: (data: PaymentSettings) =>
    apiClient.put<{ success: boolean; settings: PaymentSettings }>('/api/settings/payment', data),

  // Notification Settings
  getNotificationSettings: () =>
    apiClient.get<{ success: boolean; settings: NotificationSettings }>(
      '/api/settings/notifications'
    ),

  updateNotificationSettings: (data: NotificationSettings) =>
    apiClient.put<{ success: boolean; settings: NotificationSettings }>(
      '/api/settings/notifications',
      data
    ),

  // Roles & Permissions
  getRoles: () => apiClient.get<{ success: boolean; roles: Role[] }>('/api/roles'),

  getRole: (id: string) => apiClient.get<{ success: boolean; role: Role }>(`/api/roles/${id}`),

  createRole: (data: Partial<Role>) =>
    apiClient.post<{ success: boolean; role: Role }>('/api/roles', data),

  updateRole: (id: string, data: Partial<Role>) =>
    apiClient.put<{ success: boolean; role: Role }>(`/api/roles/${id}`, data),

  deleteRole: (id: string) => apiClient.delete(`/api/roles/${id}`),

  getPermissions: () =>
    apiClient.get<{ success: boolean; permissions: Permission[] }>('/api/permissions'),
};

// ==================== Hooks ====================

// Store Settings
export function useStoreSettings() {
  return useQuery({
    queryKey: ['settings', 'store'],
    queryFn: async () => {
      try {
        const { data } = await settingsApi.getStoreSettings();
        const apiData = data as any;
        return apiData.settings || apiData.data?.settings || apiData.data || null;
      } catch {
        // Return default settings if API fails
        return {
          storeName: 'My Store',
          storeEmail: 'contact@mystore.com',
          storePhone: '+66 123 456 789',
          storeAddress: '123 Main Street, Bangkok, Thailand 10110',
          storeCurrency: 'THB',
          storeDescription: 'Your one-stop shop for quality products.',
          logoUrl: '',
        };
      }
    },
  });
}

export function useUpdateStoreSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: settingsApi.updateStoreSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings', 'store'] });
    },
  });
}

// Shipping Settings
export function useShippingSettings() {
  return useQuery({
    queryKey: ['settings', 'shipping'],
    queryFn: async () => {
      try {
        const { data } = await settingsApi.getShippingSettings();
        const apiData = data as any;
        return apiData.settings || apiData.data?.settings || apiData.data || null;
      } catch {
        return {
          freeShippingThreshold: 1000,
          methods: [
            { id: '1', name: 'Standard Shipping', price: 50, estimatedDays: '3-5', isActive: true },
            { id: '2', name: 'Express Shipping', price: 100, estimatedDays: '1-2', isActive: true },
          ],
        };
      }
    },
  });
}

export function useUpdateShippingSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: settingsApi.updateShippingSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings', 'shipping'] });
    },
  });
}

// Payment Settings
export function usePaymentSettings() {
  return useQuery({
    queryKey: ['settings', 'payment'],
    queryFn: async () => {
      try {
        const { data } = await settingsApi.getPaymentSettings();
        const apiData = data as any;
        return apiData.settings || apiData.data?.settings || apiData.data || null;
      } catch {
        return {
          methods: [
            { id: '1', name: 'Credit Card', type: 'credit_card', isActive: true },
            { id: '2', name: 'PayPal', type: 'paypal', isActive: true },
          ],
          defaultMethod: 'credit_card',
        };
      }
    },
  });
}

export function useUpdatePaymentSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: settingsApi.updatePaymentSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings', 'payment'] });
    },
  });
}

// Notification Settings
export function useNotificationSettings() {
  return useQuery({
    queryKey: ['settings', 'notifications'],
    queryFn: async () => {
      try {
        const { data } = await settingsApi.getNotificationSettings();
        const apiData = data as any;
        return apiData.settings || apiData.data?.settings || apiData.data || null;
      } catch {
        return {
          emailNotifications: true,
          orderConfirmation: true,
          orderStatusUpdate: true,
          promotionalEmails: false,
          adminNewOrder: true,
          adminLowStock: true,
          lowStockThreshold: 10,
        };
      }
    },
  });
}

export function useUpdateNotificationSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: settingsApi.updateNotificationSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings', 'notifications'] });
    },
  });
}

// Roles
export function useRoles() {
  return useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      try {
        const { data } = await settingsApi.getRoles();
        const apiData = data as any;
        return apiData.roles || apiData.data?.roles || apiData.data || [];
      } catch {
        // Return default roles if API fails
        return [
          {
            id: '1',
            name: 'SUPER_ADMIN',
            description: 'Full system access',
            level: 100,
            permissions: ['all'],
            isSystem: true,
          },
          {
            id: '2',
            name: 'ADMIN',
            description: 'Administrative access',
            level: 80,
            permissions: ['manage_orders', 'manage_products', 'manage_users'],
            isSystem: true,
          },
          {
            id: '3',
            name: 'MANAGER',
            description: 'Manager access',
            level: 60,
            permissions: ['manage_orders', 'view_reports'],
            isSystem: true,
          },
          {
            id: '4',
            name: 'STAFF',
            description: 'Staff access',
            level: 40,
            permissions: ['view_orders', 'update_order_status'],
            isSystem: true,
          },
          {
            id: '5',
            name: 'CUSTOMER',
            description: 'Customer access',
            level: 10,
            permissions: ['view_products', 'create_orders'],
            isSystem: true,
          },
        ];
      }
    },
  });
}

export function useRole(id: string) {
  return useQuery({
    queryKey: ['role', id],
    queryFn: async () => {
      const { data } = await settingsApi.getRole(id);
      const apiData = data as any;
      return apiData.role || apiData.data?.role || apiData.data || null;
    },
    enabled: !!id,
  });
}

export function useCreateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: settingsApi.createRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });
}

export function useUpdateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Role> }) =>
      settingsApi.updateRole(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });
}

export function useDeleteRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: settingsApi.deleteRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });
}

export function usePermissions() {
  return useQuery({
    queryKey: ['permissions'],
    queryFn: async () => {
      try {
        const { data } = await settingsApi.getPermissions();
        const apiData = data as any;
        return apiData.permissions || apiData.data?.permissions || apiData.data || [];
      } catch {
        return [
          { key: 'manage_orders', label: 'Manage Orders', category: 'Orders' },
          { key: 'view_orders', label: 'View Orders', category: 'Orders' },
          { key: 'update_order_status', label: 'Update Order Status', category: 'Orders' },
          { key: 'manage_products', label: 'Manage Products', category: 'Products' },
          { key: 'view_products', label: 'View Products', category: 'Products' },
          { key: 'manage_users', label: 'Manage Users', category: 'Users' },
          { key: 'manage_coupons', label: 'Manage Coupons', category: 'Coupons' },
          { key: 'view_reports', label: 'View Reports', category: 'Reports' },
          { key: 'create_orders', label: 'Create Orders', category: 'Orders' },
          { key: 'view_own_orders', label: 'View Own Orders', category: 'Orders' },
        ];
      }
    },
  });
}
