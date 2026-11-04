import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, subtotal, totalItems } =
    useCart();

  const resolveCartImage = (item) => {
    if (item.image && !item.image.includes("unsplash")) {
      return item.image;
    }
    const s = (item.slug || item.sku || item.name || "").toLowerCase();
    if (s.includes("cycling") || s.includes("short") || s.includes("tight") || s.includes("cs")) {
      return "/images/products/bbg-studio-hd-cs-black.jpg";
    }
    if (s.includes("black")) {
      return "/images/products/bbg-studio-hd-jet-black.jpg";
    }
    if (s.includes("maroon")) {
      return "/images/products/bbg-studio-hd-deep-maroon.jpg";
    }
    if (s.includes("beige") || s.includes("cream")) {
      return "/images/products/bbg-studio-hd-beige-cream.jpg";
    }
    if (s.includes("royal") || s.includes("blue")) {
      return "/images/products/bbg-studio-hd-royal-blue.jpg";
    }
    return "/images/products/bbg-studio-hd-crimson-red.jpg";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={() => setIsOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF8F5] shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 bg-[#FAF8F5] border-b border-stone-200/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-stone-950 stroke-[2.2]" />
              <h2 className="font-serif text-lg font-extrabold text-stone-950">
                Shopping Bag ({totalItems})
              </h2>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 text-stone-600 hover:text-stone-950 rounded-full hover:bg-stone-200/60 transition-colors"
            >
              <X className="w-5 h-5 stroke-[2.2]" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-stone-200/60">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-[#EFEAE2] flex items-center justify-center mb-4 text-stone-700">
                  <ShoppingBag className="w-8 h-8 stroke-[1.8]" />
                </div>
                <h3 className="font-serif text-lg font-bold text-stone-900 mb-1">
                  Your bag is empty
                </h3>
                <p className="text-stone-600 text-xs max-w-xs mb-6 font-medium">
                  Explore our premium churidar leggings and cotton tight shorts collections.
                </p>
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-3 bg-stone-950 hover:bg-stone-800 text-white rounded-full text-xs font-bold tracking-wider uppercase transition-colors shadow-md"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="py-4 flex gap-4">
                  {/* Thumbnail */}
                  <div className="relative w-20 h-24 rounded-2xl bg-stone-200/60 overflow-hidden shrink-0 border border-stone-200">
                    <img
                      src={resolveCartImage(item)}
                      alt={item.name}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-serif text-sm font-bold text-stone-950 leading-tight">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-stone-400 hover:text-rose-600 transition-colors ml-2"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="text-xs text-stone-600 font-medium mt-1 flex flex-wrap gap-x-2">
                        {item.color && <span>Shade: {item.color}</span>}
                        {item.size && <span>Size: {item.size}</span>}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Controller */}
                      <div className="flex items-center bg-[#EFEAE2] rounded-full px-2 py-0.5 border border-stone-300/60">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center text-stone-800 hover:text-stone-950 font-bold"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3 stroke-[2.5]" />
                        </button>
                        <span className="px-2 text-xs font-bold text-stone-950">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center text-stone-800 hover:text-stone-950 font-bold"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3 stroke-[2.5]" />
                        </button>
                      </div>

                      {/* Line Price */}
                      <div className="text-right">
                        <span className="text-sm font-extrabold text-stone-950 font-sans tracking-tight">
                          ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout */}
          {items.length > 0 && (
            <div className="p-6 bg-[#FAF8F5] border-t border-stone-200/80">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">Subtotal</span>
                <span className="text-xl font-black text-stone-950 font-sans tracking-tight">
                  ₹{subtotal.toLocaleString("en-IN")}
                </span>
              </div>
              <p className="text-[11px] text-stone-600 mb-4 font-medium">
                Wholesale dispatch and delivery calculated at checkout.
              </p>

              <div className="flex flex-col gap-2.5">
                <Link
                  to="/checkout"
                  onClick={() => setIsOpen(false)}
                  className="w-full py-3.5 bg-stone-950 hover:bg-stone-800 text-white rounded-full text-center text-xs font-bold tracking-wider uppercase shadow-md flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </Link>

                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full py-2 text-xs font-semibold text-stone-600 hover:text-stone-950 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
