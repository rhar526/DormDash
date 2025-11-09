import { createContext, useContext, useState, ReactNode } from 'react';

export interface FoodItem {
  id: string;
  name: string;
  diningHall: string;
  tags: string[];
  description: string;
}

interface CartContextType {
  cart: FoodItem[];
  addToCart: (item: FoodItem) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  orderInfo: OrderInfo | null;
  setOrderInfo: (info: OrderInfo | null) => void;
}

export interface OrderInfo {
  location: string;
  phoneNumber: string;
  orderId?: string;
  estimatedTime?: string;
  dasherAccepted?: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<FoodItem[]>([]);
  const [orderInfo, setOrderInfo] = useState<OrderInfo | null>(null);

  const addToCart = (item: FoodItem) => {
    setCart(prev => [...prev, item]);
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => {
      const index = prev.findIndex(item => item.id === itemId);
      if (index > -1) {
        return [...prev.slice(0, index), ...prev.slice(index + 1)];
      }
      return prev;
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, orderInfo, setOrderInfo }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
