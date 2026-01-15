'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, ShoppingCart, Users, DollarSign, Loader2 } from 'lucide-react';
import { useDashboardStats, useRecentOrders } from '@/lib/api/admin';
import { formatPrice, formatDateTime } from '@/lib/utils';

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: recentOrders, isLoading: ordersLoading } = useRecentOrders(5);

  const statCards = [
    {
      title: 'Total Revenue',
      value: stats ? formatPrice(stats.totalRevenue) : '฿0',
      change: stats ? `${stats.revenueChange >= 0 ? '+' : ''}${stats.revenueChange}% from last month` : 'Loading...',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Orders',
      value: stats?.totalOrders?.toLocaleString() || '0',
      change: stats ? `${stats.ordersChange >= 0 ? '+' : ''}${stats.ordersChange} from last month` : 'Loading...',
      icon: ShoppingCart,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Products',
      value: stats?.totalProducts?.toLocaleString() || '0',
      change: stats ? `${stats.productsChange >= 0 ? '+' : ''}${stats.productsChange} from last month` : 'Loading...',
      icon: Package,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Customers',
      value: stats?.totalCustomers?.toLocaleString() || '0',
      change: stats ? `${stats.customersChange >= 0 ? '+' : ''}${stats.customersChange} from last month` : 'Loading...',
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your store performance</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsLoading ? (
          <div className="col-span-4 flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          statCards.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.change}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {ordersLoading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : recentOrders && recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                    <div>
                      <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                      <p className="text-sm text-muted-foreground">{order.customerName}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatPrice(order.totalAmount)}</p>
                      <p className="text-xs text-muted-foreground">{formatDateTime(order.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No recent orders
              </p>
            )}
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pending Orders</span>
                <span className="font-medium">{stats?.totalOrders || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Active Products</span>
                <span className="font-medium">{stats?.totalProducts || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Customers</span>
                <span className="font-medium">{stats?.totalCustomers || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
