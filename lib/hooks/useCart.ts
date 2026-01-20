import { useCallback, useMemo } from 'react';
import { useCartStore } from '@/lib/stores/cartStore';
import { Product } from '@/types/models';

export function useCart() {
  const items = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);

  const addToCart = useCallback(
    (product: Product, quantity: number = 1) => {
      addItem(product, quantity);
    },
    [addItem]
  );

  const removeFromCart = useCallback(
    (productId: string) => {
      removeItem(productId);
    },
    [removeItem]
  );

  const updateItemQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(productId);
      } else {
        updateQuantity(productId, quantity);
      }
    },
    [removeItem, updateQuantity]
  );

  const totalItems = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items]
  );

  const totalPrice = useMemo(
    () => items.reduce((total, item) => total + item.product.price * item.quantity, 0),
    [items]
  );

  return {
    items,
    addToCart,
    removeFromCart,
    updateItemQuantity,
    clearCart,
    totalItems,
    totalPrice,
  };
}
