import { renderHook, act } from '@testing-library/react';
import { useCartStore } from '@/lib/stores/cartStore';
import { Product } from '@/types/models';

describe('CartStore', () => {
  const mockProduct: Product = {
    id: '1',
    name: 'Test Product',
    slug: 'test-product',
    description: 'Test description',
    price: 100,
    stockQuantity: 10,
    sku: 'TEST-001',
    categoryId: 'cat-1',
    categoryName: 'Test Category',
    imageUrl: 'https://example.com/image.jpg',
    isFeatured: false,
    isActive: true,
    averageRating: 4.5,
    reviewCount: 10,
    createdAt: new Date().toISOString(),
  };

  beforeEach(() => {
    // Reset cart before each test
    act(() => {
      useCartStore.getState().clearCart();
    });
  });

  it('should initialize with empty cart', () => {
    const { result } = renderHook(() => useCartStore());
    
    expect(result.current.items).toEqual([]);
    expect(result.current.getTotalItems()).toBe(0);
    expect(result.current.getTotalPrice()).toBe(0);
  });

  it('should add item to cart', () => {
    const { result } = renderHook(() => useCartStore());
    
    act(() => {
      result.current.addItem(mockProduct, 2);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].product).toEqual(mockProduct);
    expect(result.current.items[0].quantity).toBe(2);
  });

  it('should increase quantity when adding existing item', () => {
    const { result } = renderHook(() => useCartStore());
    
    act(() => {
      result.current.addItem(mockProduct, 1);
      result.current.addItem(mockProduct, 2);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(3);
  });

  it('should remove item from cart', () => {
    const { result } = renderHook(() => useCartStore());
    
    act(() => {
      result.current.addItem(mockProduct);
      result.current.removeItem(mockProduct.id);
    });

    expect(result.current.items).toHaveLength(0);
  });

  it('should update item quantity', () => {
    const { result } = renderHook(() => useCartStore());
    
    act(() => {
      result.current.addItem(mockProduct, 1);
      result.current.updateQuantity(mockProduct.id, 5);
    });

    expect(result.current.items[0].quantity).toBe(5);
  });

  it('should calculate total items correctly', () => {
    const { result } = renderHook(() => useCartStore());
    
    act(() => {
      result.current.addItem(mockProduct, 3);
      result.current.addItem({ ...mockProduct, id: '2' }, 2);
    });

    expect(result.current.getTotalItems()).toBe(5);
  });

  it('should calculate total price correctly', () => {
    const { result } = renderHook(() => useCartStore());
    
    act(() => {
      result.current.addItem(mockProduct, 2); // 100 * 2 = 200
    });

    expect(result.current.getTotalPrice()).toBe(200);
  });

  it('should clear cart', () => {
    const { result } = renderHook(() => useCartStore());
    
    act(() => {
      result.current.addItem(mockProduct);
      result.current.clearCart();
    });

    expect(result.current.items).toEqual([]);
  });
});
