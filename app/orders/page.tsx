'use client';

import { Package, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { useOrders } from '@/lib/api/orders';
import { formatPrice, formatDateTime } from '@/lib/utils';

const statusIcons = {
  PENDING: <Clock className="h-5 w-5 text-yellow-500" />,
  PROCESSING: <Clock className="h-5 w-5 text-blue-500" />,
  SHIPPED: <Package className="h-5 w-5 text-purple-500" />,
  DELIVERED: <CheckCircle className="h-5 w-5 text-green-500" />,
  CANCELLED: <XCircle className="h-5 w-5 text-red-500" />,
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
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Order #{order.id.slice(0, 8)}</CardTitle>
                <div className="flex items-center gap-2">
                  {statusIcons[order.status]}
                  <span className="font-medium">{order.status}</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Placed on {formatDateTime(order.createdAt)}
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Items</span>
                  <span className="font-medium">{order.itemCount} items</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total</span>
                  <span className="font-bold">{formatPrice(order.totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Method</span>
                  <span className="font-medium capitalize">{order.paymentMethod.replace('_', ' ')}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
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
