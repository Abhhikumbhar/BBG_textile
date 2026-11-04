import React, { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(undefined);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
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

  const addItem = (itemOrProduct, qtyOrOptions, maybeOptions) => {
    // Normalise whether called as addItem(itemObj) or addItem(product, quantity, options)
    let productId = itemOrProduct.productId || itemOrProduct.id;
    let name = itemOrProduct.name;
    let sku = itemOrProduct.sku;
    let price = itemOrProduct.price || 349;
    let quantity = 1;
    let color = itemOrProduct.color || "Standard";
    let size = itemOrProduct.size || "Free Size";
    let image = itemOrProduct.image;

    if (typeof qtyOrOptions === "number") {
      quantity = qtyOrOptions;
      if (maybeOptions) {
        if (maybeOptions.color) color = maybeOptions.color;
        if (maybeOptions.size) size = maybeOptions.size;
        if (maybeOptions.image) image = maybeOptions.image;
      }
    } else if (typeof qtyOrOptions === "object") {
      if (qtyOrOptions.color) color = qtyOrOptions.color;
      if (qtyOrOptions.size) size = qtyOrOptions.size;
      if (qtyOrOptions.quantity) quantity = qtyOrOptions.quantity;
      if (qtyOrOptions.image) image = qtyOrOptions.image;
    } else if (itemOrProduct.quantity) {
      quantity = itemOrProduct.quantity;
    }

    // Ensure authentic BBG garment image is never undefined or man-with-shirt-tie
    if (!image || image.includes("unsplash")) {
      const s = (itemOrProduct.slug || itemOrProduct.sku || name || "").toLowerCase();
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
      } else if (itemOrProduct.images?.[0]?.url) {
        image = itemOrProduct.images[0].url;
      } else {
        image = "/images/products/bbg-studio-hd-crimson-red.jpg";
      }
    }

    const id = `${productId}-${color}-${size}`;
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

  const removeItem = (id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id, quantity) => {
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

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

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
