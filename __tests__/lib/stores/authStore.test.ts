import { renderHook, act } from '@testing-library/react';
import { useAuthStore } from '@/lib/stores/authStore';
import { User } from '@/types/auth';

describe('AuthStore', () => {
  beforeEach(() => {
    // Reset store before each test
    act(() => {
      useAuthStore.getState().logout();
    });
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useAuthStore());
    
    expect(result.current.user).toBeNull();
    expect(result.current.accessToken).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should login user', () => {
    const { result } = renderHook(() => useAuthStore());
    
    const mockUser: User = {
      id: '1',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      role: 'CUSTOMER',
    };
    const mockToken = 'mock-token-123';

    act(() => {
      result.current.login(mockUser, mockToken);
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.accessToken).toBe(mockToken);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('should logout user', () => {
    const { result } = renderHook(() => useAuthStore());
    
    const mockUser: User = {
      id: '1',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      role: 'CUSTOMER',
    };

    act(() => {
      result.current.login(mockUser, 'token');
      result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.accessToken).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should update user', () => {
    const { result } = renderHook(() => useAuthStore());
    
    const mockUser: User = {
      id: '1',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      role: 'CUSTOMER',
    };

    act(() => {
      result.current.login(mockUser, 'token');
    });

    const updatedUser: User = {
      ...mockUser,
      firstName: 'Updated',
    };

    act(() => {
      result.current.updateUser(updatedUser);
    });

    expect(result.current.user?.firstName).toBe('Updated');
  });

  it('should set access token', () => {
    const { result } = renderHook(() => useAuthStore());
    
    act(() => {
      result.current.setAccessToken('new-token');
    });

    expect(result.current.accessToken).toBe('new-token');
  });
});
