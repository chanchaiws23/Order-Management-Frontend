import { useAuthStore } from '@/lib/stores/authStore';
import { ROLE_HIERARCHY } from '@/lib/constants';
import { UserRole } from '@/types/auth';

// Normalize role to uppercase format for comparison
function normalizeRole(role: string | undefined): UserRole {
  if (!role) return 'CUSTOMER';
  return role.toUpperCase().replace(/-/g, '_') as UserRole;
}

export function usePermissions() {
  const user = useAuthStore((state) => state.user);
  
  // Get normalized role
  const userRole = normalizeRole(user?.role);

  const hasRole = (requiredRole: UserRole) => {
    if (!user) return false;
    const normalizedUserRole = normalizeRole(user.role);
    const userLevel = ROLE_HIERARCHY[normalizedUserRole] || 0;
    const requiredLevel = ROLE_HIERARCHY[requiredRole] || 0;
    return userLevel >= requiredLevel;
  };

  const isCustomer = userRole === 'CUSTOMER';
  const isStaff = hasRole('STAFF');
  const isManager = hasRole('MANAGER');
  const isAdmin = hasRole('ADMIN');
  const isSuperAdmin = userRole === 'SUPER_ADMIN';

  return {
    user,
    userRole,
    hasRole,
    isCustomer,
    isStaff,
    isManager,
    isAdmin,
    isSuperAdmin,
  };
}
