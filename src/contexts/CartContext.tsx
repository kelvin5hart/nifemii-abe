"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Product } from "@/lib/firebase-types";

export interface CartItem {
  productId: string;
  productName: string;
  sku?: string; // Product SKU/code
  price: number;
  salePrice?: number;
  image: string;
  size: string;
  quantity: number;
  maxStock: number; // Track available stock for this size
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addToCart: (product: Product, size: string, quantity?: number) => void;
  removeFromCart: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "nifemii-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Error loading cart:", e);
      }
    }
    setIsInitialized(true);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, isInitialized]);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = items.reduce((sum, item) => {
    const price = item.salePrice || item.price;
    return sum + price * item.quantity;
  }, 0);

  const addToCart = (product: Product, size: string, quantity = 1) => {
    const maxStock = product.sizes[size] || 0;

    if (maxStock <= 0) {
      return; // Don't add if out of stock
    }

    setItems((currentItems) => {
      const existingItemIndex = currentItems.findIndex(
        (item) => item.productId === product.id && item.size === size
      );

      if (existingItemIndex > -1) {
        // Update quantity of existing item, but don't exceed stock
        const updatedItems = [...currentItems];
        const newQuantity = Math.min(
          updatedItems[existingItemIndex].quantity + quantity,
          maxStock
        );
        updatedItems[existingItemIndex].quantity = newQuantity;
        updatedItems[existingItemIndex].maxStock = maxStock; // Update stock in case it changed
        return updatedItems;
      } else {
        // Add new item with quantity limited to stock
        return [
          ...currentItems,
          {
            productId: product.id,
            productName: product.name,
            sku: product.sku,
            price: product.price,
            salePrice: product.salePrice,
            image: product.images[0] || "/images/placeholder.jpg",
            size,
            quantity: Math.min(quantity, maxStock),
            maxStock,
          },
        ];
      }
    });

    // Open cart drawer when adding item
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string, size: string) => {
    setItems((currentItems) =>
      currentItems.filter(
        (item) => !(item.productId === productId && item.size === size)
      )
    );
  };

  const updateQuantity = (productId: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) => {
        if (item.productId === productId && item.size === size) {
          // Don't allow quantity to exceed max stock
          const limitedQuantity = Math.min(quantity, item.maxStock);
          return { ...item, quantity: limitedQuantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
