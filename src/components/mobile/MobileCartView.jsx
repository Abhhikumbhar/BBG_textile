import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function MobileCartView() {
  const navigate = useNavigate();
  const { items, subtotal, removeItem, updateQuantity, clearCart } = useCart();

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

  return (
    <div className="bg-[#FAF8F5] min-h-screen pb-32 text-stone-900">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md px-4 py-3.5 flex items-center justify-between border-b border-stone-200/60">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full flex items-center justify-center text-stone-900 hover:bg-stone-200/60 active:scale-95 transition-transform"
            aria-label="Back"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.2]" />
          </button>
          <h1 className="font-serif text-lg font-extrabold text-stone-950 tracking-tight">
            Shopping Bag ({items.reduce((s, i) => s + i.quantity, 0)})
          </h1>
        </div>

        {items.length > 0 && (
          <button
            type="button"
            onClick={clearCart}
            className="text-xs font-bold text-stone-500 hover:text-rose-600 transition-colors"
          >
            Clear
          </button>
        )}
      </header>

      <main className="p-4">
        {items.length === 0 ? (
          <div className="text-center py-20 px-6 rounded-3xl bg-white border border-stone-200/70 shadow-xs max-w-sm mx-auto">
            <div className="w-16 h-16 rounded-full bg-[#EFEAE2] flex items-center justify-center mx-auto mb-4 text-stone-700">
              <ShoppingBag className="w-8 h-8 stroke-[1.8]" />
            </div>
            <h2 className="font-serif text-lg font-bold text-stone-950 mb-1">
              Your bag is empty
            </h2>
            <p className="text-xs font-medium text-stone-600 mb-6">
              Explore our premium churidar leggings and cotton lycra tight shorts.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-stone-950 text-white text-xs font-bold tracking-wider uppercase shadow-md active:scale-95 transition-all"
            >
              <span>Explore Products</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="space-y-3.5">
            {/* Items */}
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-3.5 border border-stone-200/80 shadow-xs flex gap-3.5 items-center"
              >
                {/* Image */}
                <div className="w-20 h-24 rounded-2xl bg-stone-100 overflow-hidden shrink-0 border border-stone-200/60">
                  <img
                    src={resolveCartImage(item)}
                    alt={item.name}
                    className="w-full h-full object-cover object-top"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-serif text-xs font-bold text-stone-950 truncate leading-snug">
                      {item.name}
                    </h3>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-stone-400 hover:text-rose-600 p-1"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-[11px] font-semibold text-stone-600 mt-0.5">
                    {item.color && <span>{item.color}</span>}
                    {item.size && <span> • {item.size}</span>}
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center bg-[#EFEAE2] rounded-full px-2 py-0.5 border border-stone-300/60">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center text-stone-800 font-bold active:scale-75"
                      >
                        <Minus className="w-3 h-3 stroke-[2.5]" />
                      </button>
                      <span className="px-2 text-xs font-bold text-stone-950">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= 5}
                        className="w-6 h-6 flex items-center justify-center text-stone-800 font-bold active:scale-75 disabled:opacity-30 disabled:cursor-not-allowed"
                        title={item.quantity >= 5 ? "Maximum 5 items per order" : "Add one"}
                      >
                        <Plus className="w-3 h-3 stroke-[2.5]" />
                      </button>
                    </div>

                    <span className="font-sans text-sm font-black text-stone-950 tracking-tight">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Bill Summary */}
            <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs space-y-2.5 mt-4">
              <div className="flex justify-between text-xs font-semibold text-stone-600">
                <span>Subtotal</span>
                <span className="text-stone-900 font-bold">₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-xs font-semibold text-stone-600">
                <span>Shipping</span>
                <span className="text-emerald-700 font-bold">Calculated at Checkout</span>
              </div>
              <div className="pt-2 border-t border-stone-200 flex justify-between items-center">
                <span className="text-sm font-extrabold text-stone-950">Total Amount</span>
                <span className="font-sans text-xl font-black text-stone-950 tracking-tight">
                  ₹{subtotal.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Sticky Bottom Checkout Action */}
      {items.length > 0 && (
        <div className="fixed bottom-0 inset-x-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md px-4 py-3 border-t border-stone-200/80 shadow-lg">
          <div className="max-w-md mx-auto flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold text-stone-600 uppercase tracking-wider block">
                Total
              </span>
              <span className="font-sans text-lg font-black text-stone-950 tracking-tight">
                ₹{subtotal.toLocaleString("en-IN")}
              </span>
            </div>

            <Link
              to="/checkout"
              className="flex-1 py-3 px-6 rounded-full bg-stone-950 hover:bg-stone-800 text-white font-bold text-xs tracking-wider uppercase text-center shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span>Checkout</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
