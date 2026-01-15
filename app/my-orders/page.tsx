'use client';

import Link from 'next/link';
import { Package, Clock, CheckCircle, XCircle, ChevronRight, Truck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { useOrders } from '@/lib/api/orders';
import { formatPrice, formatDateTime } from '@/lib/utils';

const statusConfig = {
  PENDING: { icon: Clock, color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
  PROCESSING: { icon: Clock, color: 'bg-blue-100 text-blue-800', label: 'Processing' },
  SHIPPED: { icon: Truck, color: 'bg-purple-100 text-purple-800', label: 'Shipped' },
  DELIVERED: { icon: CheckCircle, color: 'bg-green-100 text-green-800', label: 'Delivered' },
  CANCELLED: { icon: XCircle, color: 'bg-red-100 text-red-800', label: 'Cancelled' },
};

function OrdersContent() {
  const { data: orders, isLoading } = useOrders();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-100 animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <Package className="h-24 w-24 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">No orders yet</h2>
          <p className="text-muted-foreground">
            Your order history will appear here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      <div className="space-y-4">
        {orders.map((order: any) => {
          const status = statusConfig[order.status as keyof typeof statusConfig];
          const StatusIcon = status.icon;
          return (
            <Link key={order.id} href={`/my-orders/${order.id}`}>
              <Card className="hover:border-primary transition-colors cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Order #{order.id.slice(0, 8)}</CardTitle>
                    <Badge className={status.color}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {status.label}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Placed on {formatDateTime(order.createdAt)}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        {order.itemCount} items • {formatPrice(order.totalAmount)}
                      </p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {order.paymentMethod.replace('_', ' ')}
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <ProtectedRoute>
      <OrdersContent />
    </ProtectedRoute>
  );
}
