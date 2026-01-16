import apiClient from './client';
import { User, UserRole } from '@/types/auth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface CreateUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export interface UpdateUserRequest {
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: UserRole;
}

export const userApi = {
  // GET /api/users - ดึงรายชื่อ users ทั้งหมด (มี pagination)
  getUsers: (params?: { page?: number; limit?: number; search?: string; role?: string }) =>
    apiClient.get<{ success: boolean; users: User[]; total?: number }>('/api/users', { params }),

  // GET /api/users/search - ค้นหา users ตามเงื่อนไข
  searchUsers: (params: { query?: string; role?: string; isActive?: boolean }) =>
    apiClient.get<{ success: boolean; users: User[] }>('/api/users/search', { params }),

  // GET /api/users/stats - สถิติ users
  getUserStats: () =>
    apiClient.get<{ success: boolean; stats: { total: number; byRole: Record<string, number>; active: number; inactive: number } }>('/api/users/stats'),

  // GET /api/users/:id - ดูข้อมูล user คนใดคนหนึ่ง
  getUser: (id: string) =>
    apiClient.get<{ success: boolean; user: User }>(`/api/users/${id}`),

  // POST /api/users - สร้าง user ใหม่
  createUser: (data: CreateUserRequest) =>
    apiClient.post<{ success: boolean; user: User }>('/api/users', data),

  // PUT /api/users/:id - แก้ไขข้อมูล user
  updateUser: (id: string, data: UpdateUserRequest) =>
    apiClient.put<{ success: boolean; user: User }>(`/api/users/${id}`, data),

  // DELETE /api/users/:id - ลบ user
  deleteUser: (id: string) =>
    apiClient.delete(`/api/users/${id}`),
};

export function useUsers(params?: { page?: number; limit?: number; search?: string; role?: string }) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: async () => {
      try {
        const { data } = await userApi.getUsers(params);
        const apiData = data as any;
        
        if (apiData.users && Array.isArray(apiData.users)) {
          return apiData.users;
        }
        if (apiData.data?.users && Array.isArray(apiData.data.users)) {
          return apiData.data.users;
        }
        if (apiData.data && Array.isArray(apiData.data)) {
          return apiData.data;
        }
        if (Array.isArray(apiData)) {
          return apiData;
        }
        
        console.log('[useUsers] Unexpected response:', apiData);
        return [];
      } catch (error) {
        console.error('[useUsers] Error:', error);
        return [];
      }
    },
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: async () => {
      const { data } = await userApi.getUser(id);
      const apiData = data as any;
      return apiData.user || apiData.data?.user || apiData.data || apiData;
    },
    enabled: !!id,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserRequest }) =>
      userApi.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useUserStats() {
  return useQuery({
    queryKey: ['users', 'stats'],
    queryFn: async () => {
      const { data } = await userApi.getUserStats();
      const apiData = data as any;
      return apiData.stats || apiData.data?.stats || apiData.data || apiData;
    },
  });
}

export function useSearchUsers(params: { query?: string; role?: string; isActive?: boolean }) {
  return useQuery({
    queryKey: ['users', 'search', params],
    queryFn: async () => {
      const { data } = await userApi.searchUsers(params);
      const apiData = data as any;
      return apiData.users || apiData.data?.users || apiData.data || [];
    },
    enabled: !!(params.query || params.role),
  });
}
