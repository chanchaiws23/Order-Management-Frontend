export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  stockQuantity: number;
  sku: string;
  categoryId: string;
  categoryName: string;
  imageUrl: string;
  images?: string[];
  isFeatured: boolean;
  isActive: boolean;
  tags?: string[];
  averageRating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  parentId?: string;
  isActive: boolean;
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerEmail: string;
  customerName: string;
  items: OrderItem[];
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  totalAmount: number;
  itemCount: number;
  currency: string;
  paymentMethod: 'credit_card' | 'paypal';
  paymentTransactionId?: string;
  shippingAddress: string;
  billingAddress: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateOrderRequest {
  customerId: string;
  customerEmail: string;
  customerName: string;
  items: OrderItem[];
  currency: string;
  paymentMethod: 'credit_card' | 'paypal';
  shippingAddress: string;
  billingAddress: string;
  notes?: string;
}

export interface Customer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  createdAt: string;
  addresses?: Address[];
}

export interface Address {
  id: string;
  customerId: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
  discountValue: number;
  minPurchaseAmount?: number;
  maxDiscountAmount?: number;
  validFrom: string;
  validUntil: string;
  usageLimit?: number;
  usageCount: number;
  isActive: boolean;
  createdAt: string;
}

export interface Review {
  id: string;
  productId: string;
  customerId: string;
  customerName: string;
  orderId: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  helpfulCount: number;
  createdAt: string;
  updatedAt?: string;
}

export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  method: 'credit_card' | 'paypal';
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';
  transactionId: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
