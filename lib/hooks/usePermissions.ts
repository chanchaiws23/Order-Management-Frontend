import { useAuthStore } from '@/lib/stores/authStore';
import { ROLE_HIERARCHY } from '@/lib/constants';
import { UserRole } from '@/types/auth';

export function usePermissions() {
  const user = useAuthStore((state) => state.user);

  const hasRole = (requiredRole: UserRole) => {
    if (!user) return false;
    return ROLE_HIERARCHY[user.role] >= ROLE_HIERARCHY[requiredRole];
  };

  const isCustomer = user?.role === 'CUSTOMER';
  const isStaff = hasRole('STAFF');
  const isManager = hasRole('MANAGER');
  const isAdmin = hasRole('ADMIN');
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  return {
    user,
    hasRole,
    isCustomer,
    isStaff,
    isManager,
    isAdmin,
    isSuperAdmin,
  };
}
