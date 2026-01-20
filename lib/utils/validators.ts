import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain uppercase letter')
    .regex(/[a-z]/, 'Must contain lowercase letter')
    .regex(/[0-9]/, 'Must contain number')
    .regex(/[^A-Za-z0-9]/, 'Must contain special character'),
  firstName: z.string().min(2, 'First name required'),
  lastName: z.string().min(2, 'Last name required'),
});

export const productSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().min(10, 'Description required'),
  price: z.number().positive('Price must be positive'),
  stockQuantity: z.number().int().nonnegative('Stock must be non-negative'),
  categoryId: z.string().uuid('Invalid category'),
  sku: z.string().min(1, 'SKU required'),
  imageUrl: z.string().url('Invalid image URL'),
});

export const orderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().uuid(),
        productName: z.string(),
        unitPrice: z.number().positive(),
        quantity: z.number().int().positive(),
      })
    )
    .min(1, 'At least one item required'),
  shippingAddress: z.string().min(10, 'Shipping address required'),
  billingAddress: z.string().min(10, 'Billing address required'),
  paymentMethod: z.enum(['credit_card', 'paypal']),
});

export const reviewSchema = z.object({
  productId: z.string().uuid(),
  orderId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  title: z.string().min(5, 'Title must be at least 5 characters'),
  comment: z.string().min(10, 'Comment must be at least 10 characters'),
});

export const couponSchema = z.object({
  code: z.string().min(3, 'Code must be at least 3 characters').toUpperCase(),
  discountType: z.enum(['PERCENTAGE', 'FIXED_AMOUNT']),
  discountValue: z.number().positive('Discount value must be positive'),
  minPurchaseAmount: z.number().nonnegative().optional(),
  maxDiscountAmount: z.number().positive().optional(),
  validFrom: z.string(),
  validUntil: z.string(),
  usageLimit: z.number().int().positive().optional(),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(8, 'Current password required'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain uppercase letter')
      .regex(/[a-z]/, 'Must contain lowercase letter')
      .regex(/[0-9]/, 'Must contain number')
      .regex(/[^A-Za-z0-9]/, 'Must contain special character'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ProductFormData = z.infer<typeof productSchema>;
export type OrderFormData = z.infer<typeof orderSchema>;
export type ReviewFormData = z.infer<typeof reviewSchema>;
export type CouponFormData = z.infer<typeof couponSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
