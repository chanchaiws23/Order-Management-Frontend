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
  getUsers: (params?: { page?: number; limit?: number; search?: string; role?: string }) =>
    apiClient.get<{ success: boolean; users: User[] }>('/api/users', { params }),

  getUser: (id: string) =>
    apiClient.get<{ success: boolean; user: User }>(`/api/users/${id}`),

  createUser: (data: CreateUserRequest) =>
    apiClient.post<{ success: boolean; user: User }>('/api/users', data),

  updateUser: (id: string, data: UpdateUserRequest) =>
    apiClient.put<{ success: boolean; user: User }>(`/api/users/${id}`, data),

  deleteUser: (id: string) =>
    apiClient.delete(`/api/users/${id}`),

  updateUserRole: (id: string, role: UserRole) =>
    apiClient.patch(`/api/users/${id}/role`, { role }),
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

export function useUpdateUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: UserRole }) =>
      userApi.updateUserRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
