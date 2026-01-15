'use client';

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Package, Clock, CheckCircle, XCircle, Truck, CreditCard, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { useOrder } from '@/lib/api/orders';
import { formatPrice, formatDateTime } from '@/lib/utils';

const statusConfig = {
  PENDING: { icon: Clock, color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
  PROCESSING: { icon: Clock, color: 'bg-blue-100 text-blue-800', label: 'Processing' },
  SHIPPED: { icon: Truck, color: 'bg-purple-100 text-purple-800', label: 'Shipped' },
  DELIVERED: { icon: CheckCircle, color: 'bg-green-100 text-green-800', label: 'Delivered' },
  CANCELLED: { icon: XCircle, color: 'bg-red-100 text-red-800', label: 'Cancelled' },
};

function OrderDetailContent({ orderId }: { orderId: string }) {
  const { data: order, isLoading, error } = useOrder(orderId);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-4">
          <div className="h-8 w-48 bg-gray-100 animate-pulse rounded" />
          <div className="h-64 bg-gray-100 animate-pulse rounded-lg" />
          <div className="h-48 bg-gray-100 animate-pulse rounded-lg" />
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <Package className="h-24 w-24 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Order not found</h2>
          <p className="text-muted-foreground mb-6">
            The order you&apos;re looking for doesn&apos;t exist or you don&apos;t have permission to view it.
          </p>
          <Link href="/my-orders">
            <Button>Back to My Orders</Button>
          </Link>
        </div>
      </div>
    );
  }

  const status = statusConfig[order.status];
  const StatusIcon = status.icon;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/my-orders" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to My Orders
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Order #{order.id.slice(0, 8)}</h1>
          <p className="text-muted-foreground">
            Placed on {formatDateTime(order.createdAt)}
          </p>
        </div>
        <Badge className={`${status.color} px-4 py-2 text-sm`}>
          <StatusIcon className="h-4 w-4 mr-2" />
          {status.label}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b last:border-0">
                    <div className="flex-1">
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatPrice(item.unitPrice)} × {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold">
                      {formatPrice(item.unitPrice * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(order.totalAmount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{formatPrice(order.totalAmount)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Details Sidebar */}
        <div className="space-y-6">
          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <MapPin className="h-4 w-4" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{order.customerName}</p>
              <p className="text-sm text-muted-foreground whitespace-pre-line">
                {order.shippingAddress}
              </p>
            </CardContent>
          </Card>

          {/* Payment Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <CreditCard className="h-4 w-4" />
                Payment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Method</span>
                <span className="capitalize">{order.paymentMethod.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Currency</span>
                <span>{order.currency}</span>
              </div>
              {order.paymentTransactionId && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Transaction ID</span>
                  <span className="font-mono text-xs">{order.paymentTransactionId.slice(0, 12)}...</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Order Notes */}
          {order.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Order Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{order.notes}</p>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          {order.status === 'PENDING' && (
            <Button variant="destructive" className="w-full">
              Cancel Order
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  return (
    <ProtectedRoute>
      <OrderDetailContent orderId={id} />
    </ProtectedRoute>
  );
}
