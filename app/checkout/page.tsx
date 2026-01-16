'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, CreditCard, Wallet, Loader2, CheckCircle, Tag, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/lib/hooks/useCart';
import { useAuthStore } from '@/lib/stores/authStore';
import { useCreateOrder } from '@/lib/api/orders';
import { useValidateCoupon } from '@/lib/api/coupons';
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';
import { CreateOrderRequest, OrderItem, Coupon } from '@/types/models';

const checkoutSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  shippingAddress: z.object({
    addressLine1: z.string().min(1, 'Address is required'),
    addressLine2: z.string().optional(),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State/Province is required'),
    postalCode: z.string().min(5, 'Postal code is required'),
    country: z.string().min(1, 'Country is required'),
  }),
  billingAddress: z.object({
    addressLine1: z.string().min(1, 'Address is required'),
    addressLine2: z.string().optional(),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State/Province is required'),
    postalCode: z.string().min(5, 'Postal code is required'),
    country: z.string().min(1, 'Country is required'),
  }),
  sameAsShipping: z.boolean().default(true),
  paymentMethod: z.enum(['credit_card', 'paypal']),
  notes: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [discount, setDiscount] = useState(0);
  const { items, totalPrice, totalItems, clearCart } = useCart();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const createOrder = useCreateOrder();
  const validateCoupon = useValidateCoupon();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      shippingAddress: {
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'Thailand',
      },
      billingAddress: {
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'Thailand',
      },
      sameAsShipping: true,
      paymentMethod: 'credit_card',
      notes: '',
    },
  });

  const shippingAddress = watch('shippingAddress');
  const paymentMethod = watch('paymentMethod');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && user) {
      setValue('firstName', user.firstName || '');
      setValue('lastName', user.lastName || '');
      setValue('email', user.email || '');
    }
  }, [mounted, user, setValue]);

  useEffect(() => {
    if (sameAsShipping) {
      setValue('billingAddress', shippingAddress);
    }
  }, [sameAsShipping, shippingAddress, setValue]);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push('/login?redirect=/checkout');
    }
  }, [mounted, isAuthenticated, router]);

  useEffect(() => {
    if (mounted && items.length === 0) {
      router.push('/cart');
    }
  }, [mounted, items.length, router]);

  const formatAddress = (address: CheckoutFormData['shippingAddress']) => {
    const parts = [
      address.addressLine1,
      address.addressLine2,
      address.city,
      address.state,
      address.postalCode,
      address.country,
    ].filter(Boolean);
    return parts.join(', ');
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }

    try {
      const result = await validateCoupon.mutateAsync({
        code: couponCode.trim(),
        orderTotal: totalPrice,
      });
      
      const coupon = result.coupon;
      let calculatedDiscount = result.discount;
      
      // Calculate discount from coupon if not already calculated
      if (calculatedDiscount === 0 && coupon) {
        if (coupon.discountType === 'PERCENTAGE' || coupon.type === 'PERCENTAGE') {
          const discountValue = coupon.discountValue || coupon.value || 0;
          calculatedDiscount = (totalPrice * discountValue) / 100;
          const maxDiscount = coupon.maxDiscount || coupon.maxDiscountAmount;
          if (maxDiscount && calculatedDiscount > maxDiscount) {
            calculatedDiscount = maxDiscount;
          }
        } else {
          calculatedDiscount = coupon.discountValue || coupon.value || 0;
        }
      }
      
      setAppliedCoupon(coupon);
      setDiscount(calculatedDiscount);
      toast.success(`Coupon applied! You save ${formatPrice(calculatedDiscount)}`);
    } catch (error: any) {
      const message = error.message || error.response?.data?.message || 'Invalid coupon code';
      toast.error(message);
      setAppliedCoupon(null);
      setDiscount(0);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscount(0);
    setCouponCode('');
    toast.info('Coupon removed');
  };

  const onSubmit = async (data: CheckoutFormData) => {
    if (!user) {
      toast.error('Please login to continue');
      return;
    }

    const orderItems: OrderItem[] = items.map((item) => ({
      productId: item.product.id,
      productName: item.product.name,
      unitPrice: item.product.price,
      quantity: item.quantity,
    }));

    const orderData: CreateOrderRequest = {
      customerId: user.id,
      customerEmail: data.email,
      customerName: `${data.firstName} ${data.lastName}`,
      items: orderItems,
      currency: 'THB',
      paymentMethod: data.paymentMethod,
      shippingAddress: formatAddress(data.shippingAddress),
      billingAddress: sameAsShipping
        ? formatAddress(data.shippingAddress)
        : formatAddress(data.billingAddress),
      notes: data.notes,
      ...(appliedCoupon && { couponCode: appliedCoupon.code, discount }),
    };

    try {
      const response = await createOrder.mutateAsync(orderData);
      clearCart();
      toast.success('Order placed successfully!');
      router.push(`/my-orders/${response.data.order.id}`);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to place order');
    }
  };

  if (!mounted) {
    return null;
  }

  if (items.length === 0) {
    return null;
  }

  const shippingCost = totalPrice >= 1000 ? 0 : 50;
  const grandTotal = totalPrice + shippingCost - discount;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/cart" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Cart
        </Link>
        <h1 className="text-3xl font-bold mt-4">Checkout</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      {...register('firstName')}
                      placeholder="John"
                    />
                    {errors.firstName && (
                      <p className="text-sm text-red-500">{errors.firstName.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      {...register('lastName')}
                      placeholder="Doe"
                    />
                    {errors.lastName && (
                      <p className="text-sm text-red-500">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register('email')}
                      placeholder="john@example.com"
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500">{errors.email.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      {...register('phone')}
                      placeholder="0812345678"
                    />
                    {errors.phone && (
                      <p className="text-sm text-red-500">{errors.phone.message}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="shippingAddress.addressLine1">Address Line 1 *</Label>
                  <Input
                    id="shippingAddress.addressLine1"
                    {...register('shippingAddress.addressLine1')}
                    placeholder="123 Main Street"
                  />
                  {errors.shippingAddress?.addressLine1 && (
                    <p className="text-sm text-red-500">{errors.shippingAddress.addressLine1.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shippingAddress.addressLine2">Address Line 2</Label>
                  <Input
                    id="shippingAddress.addressLine2"
                    {...register('shippingAddress.addressLine2')}
                    placeholder="Apartment, suite, etc. (optional)"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="shippingAddress.city">City *</Label>
                    <Input
                      id="shippingAddress.city"
                      {...register('shippingAddress.city')}
                      placeholder="Bangkok"
                    />
                    {errors.shippingAddress?.city && (
                      <p className="text-sm text-red-500">{errors.shippingAddress.city.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shippingAddress.state">State/Province *</Label>
                    <Input
                      id="shippingAddress.state"
                      {...register('shippingAddress.state')}
                      placeholder="Bangkok"
                    />
                    {errors.shippingAddress?.state && (
                      <p className="text-sm text-red-500">{errors.shippingAddress.state.message}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="shippingAddress.postalCode">Postal Code *</Label>
                    <Input
                      id="shippingAddress.postalCode"
                      {...register('shippingAddress.postalCode')}
                      placeholder="10110"
                    />
                    {errors.shippingAddress?.postalCode && (
                      <p className="text-sm text-red-500">{errors.shippingAddress.postalCode.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shippingAddress.country">Country *</Label>
                    <Input
                      id="shippingAddress.country"
                      {...register('shippingAddress.country')}
                      placeholder="Thailand"
                    />
                    {errors.shippingAddress?.country && (
                      <p className="text-sm text-red-500">{errors.shippingAddress.country.message}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Billing Address */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Billing Address</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sameAsShipping"
                      checked={sameAsShipping}
                      onCheckedChange={(checked) => setSameAsShipping(checked as boolean)}
                    />
                    <Label htmlFor="sameAsShipping" className="text-sm font-normal">
                      Same as shipping address
                    </Label>
                  </div>
                </div>
              </CardHeader>
              {!sameAsShipping && (
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="billingAddress.addressLine1">Address Line 1 *</Label>
                    <Input
                      id="billingAddress.addressLine1"
                      {...register('billingAddress.addressLine1')}
                      placeholder="123 Main Street"
                    />
                    {errors.billingAddress?.addressLine1 && (
                      <p className="text-sm text-red-500">{errors.billingAddress.addressLine1.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="billingAddress.addressLine2">Address Line 2</Label>
                    <Input
                      id="billingAddress.addressLine2"
                      {...register('billingAddress.addressLine2')}
                      placeholder="Apartment, suite, etc. (optional)"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="billingAddress.city">City *</Label>
                      <Input
                        id="billingAddress.city"
                        {...register('billingAddress.city')}
                        placeholder="Bangkok"
                      />
                      {errors.billingAddress?.city && (
                        <p className="text-sm text-red-500">{errors.billingAddress.city.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="billingAddress.state">State/Province *</Label>
                      <Input
                        id="billingAddress.state"
                        {...register('billingAddress.state')}
                        placeholder="Bangkok"
                      />
                      {errors.billingAddress?.state && (
                        <p className="text-sm text-red-500">{errors.billingAddress.state.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="billingAddress.postalCode">Postal Code *</Label>
                      <Input
                        id="billingAddress.postalCode"
                        {...register('billingAddress.postalCode')}
                        placeholder="10110"
                      />
                      {errors.billingAddress?.postalCode && (
                        <p className="text-sm text-red-500">{errors.billingAddress.postalCode.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="billingAddress.country">Country *</Label>
                      <Input
                        id="billingAddress.country"
                        {...register('billingAddress.country')}
                        placeholder="Thailand"
                      />
                      {errors.billingAddress?.country && (
                        <p className="text-sm text-red-500">{errors.billingAddress.country.message}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={(value) => setValue('paymentMethod', value as 'credit_card' | 'paypal')}
                  className="space-y-4"
                >
                  <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors">
                    <RadioGroupItem value="credit_card" id="credit_card" />
                    <Label htmlFor="credit_card" className="flex items-center gap-3 cursor-pointer flex-1">
                      <CreditCard className="h-5 w-5" />
                      <div>
                        <p className="font-medium">Credit / Debit Card</p>
                        <p className="text-sm text-muted-foreground">Pay with Visa, Mastercard, or JCB</p>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors">
                    <RadioGroupItem value="paypal" id="paypal" />
                    <Label htmlFor="paypal" className="flex items-center gap-3 cursor-pointer flex-1">
                      <Wallet className="h-5 w-5" />
                      <div>
                        <p className="font-medium">PayPal</p>
                        <p className="text-sm text-muted-foreground">Pay with your PayPal account</p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Order Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Order Notes (Optional)</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  {...register('notes')}
                  placeholder="Add any special instructions for your order..."
                  rows={3}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Items */}
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex gap-3">
                      <div className="relative h-16 w-16 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
                        <Image
                          src={item.product.imageUrl || '/placeholder-product.jpg'}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-xs text-white flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatPrice(item.product.price)} × {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-medium">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Coupon Code */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Coupon Code</Label>
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-md p-3">
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-green-600" />
                        <div>
                          <p className="text-sm font-medium text-green-700">{appliedCoupon.code}</p>
                          <p className="text-xs text-green-600">-{formatPrice(discount)}</p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoveCoupon}
                        className="h-8 w-8 p-0 text-green-600 hover:text-red-500"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleApplyCoupon}
                        disabled={validateCoupon.isPending}
                      >
                        {validateCoupon.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          'Apply'
                        )}
                      </Button>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal ({totalItems} items)</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount</span>
                      <span>-{formatPrice(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>
                      {shippingCost === 0 ? (
                        <span className="text-green-600">Free</span>
                      ) : (
                        formatPrice(shippingCost)
                      )}
                    </span>
                  </div>
                  {totalPrice < 1000 && (
                    <p className="text-xs text-muted-foreground">
                      Add {formatPrice(1000 - totalPrice)} more for free shipping
                    </p>
                  )}
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{formatPrice(grandTotal)}</span>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isSubmitting || createOrder.isPending}
                >
                  {isSubmitting || createOrder.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Place Order
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  By placing your order, you agree to our Terms of Service and Privacy Policy
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
