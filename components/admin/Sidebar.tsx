'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  UserCog,
  Tag,
  Star,
  CreditCard,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePermissions } from '@/lib/hooks/usePermissions';

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard, requiredRole: 'STAFF' },
  { name: 'Products', href: '/admin/products', icon: Package, requiredRole: 'STAFF' },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingCart, requiredRole: 'STAFF' },
  { name: 'Customers', href: '/admin/customers', icon: Users, requiredRole: 'STAFF' },
  { name: 'Coupons', href: '/admin/coupons', icon: Tag, requiredRole: 'MANAGER' },
  { name: 'Reviews', href: '/admin/reviews', icon: Star, requiredRole: 'STAFF' },
  { name: 'Payments', href: '/admin/payments', icon: CreditCard, requiredRole: 'STAFF' },
  { name: 'Users', href: '/admin/users', icon: UserCog, requiredRole: 'ADMIN' },
  { name: 'Settings', href: '/admin/settings', icon: Settings, requiredRole: 'ADMIN' },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { hasRole } = usePermissions();

  return (
    <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
      <div className="flex min-h-0 flex-1 flex-col bg-gray-900">
        <div className="flex h-16 flex-shrink-0 items-center bg-gray-800 px-4">
          <Package className="h-8 w-8 text-white" />
          <span className="ml-2 text-xl font-bold text-white">Admin Panel</span>
        </div>
        <div className="flex flex-1 flex-col overflow-y-auto">
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => {
              if (!hasRole(item.requiredRole as any)) return null;

              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'group flex items-center rounded-md px-2 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  )}
                >
                  <item.icon
                    className={cn(
                      'mr-3 h-6 w-6 flex-shrink-0',
                      isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'
                    )}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
