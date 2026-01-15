'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/authStore';
import { usePermissions } from '@/lib/hooks/usePermissions';
import { UserRole } from '@/types/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  requiredRole,
  redirectTo = '/login',
}: ProtectedRouteProps) {
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { hasRole } = usePermissions();

  // Wait for hydration before checking auth
  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    // Only check auth after hydration is complete
    if (!hydrated) return;

    console.log('[ProtectedRoute] hydrated:', hydrated);
    console.log('[ProtectedRoute] isAuthenticated:', isAuthenticated);
    console.log('[ProtectedRoute] requiredRole:', requiredRole);
    console.log('[ProtectedRoute] hasRole result:', requiredRole ? hasRole(requiredRole) : 'no role required');

    if (!isAuthenticated) {
      console.log('[ProtectedRoute] Not authenticated, redirecting to:', redirectTo);
      router.push(redirectTo);
      return;
    }

    if (requiredRole && !hasRole(requiredRole)) {
      console.log('[ProtectedRoute] Missing required role, redirecting to /unauthorized');
      router.push('/unauthorized');
    }
  }, [hydrated, isAuthenticated, requiredRole, hasRole, router, redirectTo]);

  // Show nothing while hydrating or if not authenticated
  if (!hydrated) {
    return null;
  }

  if (!isAuthenticated || (requiredRole && !hasRole(requiredRole))) {
    return null;
  }

  return <>{children}</>;
}
