import apiClient from './client';
import { Coupon } from '@/types/models';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const couponApi = {
  getCoupons: (params?: { page?: number; limit?: number }) =>
    apiClient.get<{ success: boolean; coupons: Coupon[] }>('/api/coupons', { params }),

  getActiveCoupons: () =>
    apiClient.get<{ success: boolean; coupons: Coupon[] }>('/api/coupons/active'),

  getCoupon: (id: string) =>
    apiClient.get<{ success: boolean; coupon: Coupon }>(`/api/coupons/${id}`),

  validateCoupon: (code: string, orderTotal: number) =>
    apiClient.post<{ success: boolean; coupon: Coupon; discount: number }>('/api/coupons/validate', {
      code,
      orderTotal,
    }),

  getCouponByCode: (code: string) =>
    apiClient.get<{ success: boolean; coupon: Coupon }>(`/api/coupons/code/${code}`),

  createCoupon: (data: Partial<Coupon>) =>
    apiClient.post<{ success: boolean; coupon: Coupon }>('/api/coupons', data),

  updateCoupon: (id: string, data: Partial<Coupon>) =>
    apiClient.put<{ success: boolean; coupon: Coupon }>(`/api/coupons/${id}`, data),

  deleteCoupon: (id: string) =>
    apiClient.delete(`/api/coupons/${id}`),

  toggleCoupon: (id: string) =>
    apiClient.patch(`/api/coupons/${id}/toggle`),
};

export function useCoupons(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: ['coupons', params],
    queryFn: async () => {
      try {
        const { data } = await couponApi.getCoupons(params);
        const apiData = data as any;
        
        if (apiData.coupons && Array.isArray(apiData.coupons)) {
          return apiData.coupons;
        }
        if (apiData.data?.coupons && Array.isArray(apiData.data.coupons)) {
          return apiData.data.coupons;
        }
        if (apiData.data && Array.isArray(apiData.data)) {
          return apiData.data;
        }
        if (Array.isArray(apiData)) {
          return apiData;
        }
        
        return [];
      } catch (error) {
        console.error('[useCoupons] Error:', error);
        return [];
      }
    },
  });
}

export function useCoupon(id: string) {
  return useQuery({
    queryKey: ['coupon', id],
    queryFn: async () => {
      const { data } = await couponApi.getCoupon(id);
      const apiData = data as any;
      return apiData.coupon || apiData.data?.coupon || apiData.data || apiData;
    },
    enabled: !!id,
  });
}

export function useCreateCoupon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: couponApi.createCoupon,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
    },
  });
}

export function useUpdateCoupon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Coupon> }) =>
      couponApi.updateCoupon(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
    },
  });
}

export function useDeleteCoupon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: couponApi.deleteCoupon,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
    },
  });
}

export function useToggleCoupon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: couponApi.toggleCoupon,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
    },
  });
}

export function useValidateCoupon() {
  return useMutation({
    mutationFn: async ({ code, orderTotal }: { code: string; orderTotal: number }) => {
      // First validate the coupon
      const { data } = await couponApi.validateCoupon(code, orderTotal);
      const apiData = data as any;
      
      // Check if coupon is valid
      const isValid = apiData.valid ?? apiData.data?.valid ?? true;
      if (!isValid) {
        const message = apiData.message || apiData.data?.message || 'Invalid coupon code';
        throw new Error(message);
      }
      
      // Try to get coupon from validate response
      let coupon = apiData.coupon || apiData.data?.coupon;
      let discount = apiData.discount || apiData.data?.discount || 0;
      
      // If no coupon data, fetch by code
      if (!coupon || discount === 0 || discount === null) {
        try {
          const couponResponse = await couponApi.getCouponByCode(code);
          const couponData = couponResponse.data as any;
          coupon = couponData.coupon || couponData.data?.coupon || couponData.data || couponData;
        } catch {
          // Silently fail if getCouponByCode fails
        }
      }
      
      // Calculate discount from coupon data if still 0 or null
      if ((discount === 0 || discount === null) && coupon) {
        const discountType = coupon.discountType || coupon.type;
        const discountValue = coupon.discountValue || coupon.value || coupon.discount || 0;
        
        if (discountType === 'PERCENTAGE') {
          discount = (orderTotal * discountValue) / 100;
          const maxDiscount = coupon.maxDiscount || coupon.maxDiscountAmount;
          if (maxDiscount && discount > maxDiscount) {
            discount = maxDiscount;
          }
        } else {
          // FIXED_AMOUNT or FIXED
          discount = discountValue;
        }
      }
      
      return { coupon, discount: discount || 0 };
    },
  });
}
