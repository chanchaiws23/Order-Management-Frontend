import { useCartStore } from '@/lib/stores/cartStore';
import { Product } from '@/types/models';

export function useCart() {
  const items = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  const getTotalItems = useCartStore((state) => state.getTotalItems);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);

  const addToCart = (product: Product, quantity: number = 1) => {
    addItem(product, quantity);
  };

  const removeFromCart = (productId: string) => {
    removeItem(productId);
  };

  const updateItemQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
    } else {
      updateQuantity(productId, quantity);
    }
  };

  return {
    items,
    addToCart,
    removeFromCart,
    updateItemQuantity,
    clearCart,
    totalItems: getTotalItems(),
    totalPrice: getTotalPrice(),
  };
}
