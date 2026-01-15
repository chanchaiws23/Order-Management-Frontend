import apiClient from './client';
import { LoginRequest, RegisterRequest, AuthResponse, User } from '@/types/auth';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/lib/stores/authStore';

export const authApi = {
  register: (data: RegisterRequest) =>
    apiClient.post<AuthResponse>('/api/auth/register', data),

  login: (data: LoginRequest) =>
    apiClient.post<AuthResponse>('/api/auth/login', data),

  logout: () => apiClient.post('/api/auth/logout'),

  refreshToken: () => apiClient.post('/api/auth/refresh-token'),

  getProfile: () => apiClient.get<{ success: boolean; user: User }>('/api/auth/profile'),

  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    apiClient.post('/api/auth/change-password', data),
};

export function useLogin() {
  const { login } = useAuthStore();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (response) => {
      const apiData = response.data as any;
      
      // Handle different response structures
      let user, accessToken;
      
      if (apiData.user && apiData.tokens) {
        user = apiData.user;
        accessToken = apiData.tokens.accessToken;
      } else if (apiData.data) {
        user = apiData.data.user || apiData.data;
        accessToken = apiData.data.accessToken || apiData.data.tokens?.accessToken;
      } else {
        user = apiData;
        accessToken = apiData.accessToken;
      }
      
      if (user && accessToken) {
        login(user, accessToken);
      }
    },
  });
}

export function useRegister() {
  const { login } = useAuthStore();

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (response) => {
      const { user, tokens } = response.data;
      login(user, tokens.accessToken);
    },
  });
}

export function useLogout() {
  const { logout } = useAuthStore();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      logout();
    },
  });
}

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data } = await authApi.getProfile();
      return data.user;
    },
    enabled: useAuthStore.getState().isAuthenticated,
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: authApi.changePassword,
  });
}
