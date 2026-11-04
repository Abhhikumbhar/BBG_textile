"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export interface CartItem {
  id: string; // unique item id = productId + variant info
  productId: string;
  name: string;
  sku: string;
  price: number;
  image?: string;
  color?: string;
  size?: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("bbg_cart");
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load cart from localStorage", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem("bbg_cart", JSON.stringify(items));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [items, isLoaded]);

  const addItem = (item: any, qty?: any, opts?: any) => {
    let productId = item.productId || item.id;
    let name = item.name;
    let sku = item.sku;
    let price = item.price || 349;
    let quantity = 1;
    let color = item.color || "Standard";
    let size = item.size || "Free Size";
    let image = item.image;

    if (typeof qty === "number") {
      quantity = qty;
      if (opts) {
        if (opts.color) color = opts.color;
        if (opts.size) size = opts.size;
        if (opts.image) image = opts.image;
      }
    } else if (typeof qty === "object") {
      if (qty.color) color = qty.color;
      if (qty.size) size = qty.size;
      if (qty.quantity) quantity = qty.quantity;
      if (qty.image) image = qty.image;
    } else if (item.quantity) {
      quantity = item.quantity;
    }

    if (!image || image.includes("unsplash")) {
      const s = (item.slug || item.sku || name || "").toLowerCase();
      if (s.includes("cycling") || s.includes("short") || s.includes("tight") || s.includes("cs")) {
        image = "/images/products/bbg-studio-hd-cs-black.jpg";
      } else if (s.includes("black")) {
        image = "/images/products/bbg-studio-hd-jet-black.jpg";
      } else if (s.includes("maroon")) {
        image = "/images/products/bbg-studio-hd-deep-maroon.jpg";
      } else if (s.includes("beige") || s.includes("cream")) {
        image = "/images/products/bbg-studio-hd-beige-cream.jpg";
      } else if (s.includes("royal") || s.includes("blue")) {
        image = "/images/products/bbg-studio-hd-royal-blue.jpg";
      } else if (item.images?.[0]?.url) {
        image = item.images[0].url;
      } else {
        image = "/images/products/bbg-studio-hd-crimson-red.jpg";
      }
    }

    const id = `${productId}_${color}_${size}`;
    const safeQty = Math.max(1, Math.min(5, quantity));
    setItems((prev) => {
      const existing = prev.find((i) => i.id === id);
      if (existing) {
        return prev.map((i) =>
          i.id === id ? { ...i, quantity: Math.min(5, i.quantity + safeQty) } : i
        );
      }
      return [
        ...prev,
        {
          id,
          productId,
          name,
          sku,
          price,
          image,
          color,
          size,
          quantity: safeQty,
        },
      ];
    });
    setIsOpen(true);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    const safeQty = Math.min(5, quantity);
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: safeQty } : i))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        isOpen,
        setIsOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
