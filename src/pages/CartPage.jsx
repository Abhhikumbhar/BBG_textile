import React from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { siteSettings } from "@/lib/catalogService";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export default function CartPage() {
  const { items, subtotal, removeItem, updateQuantity, clearCart } = useCart();

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFDFD]">
      <Header settings={siteSettings} />

      <main className="flex-1 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
            Your Fabric Cart ({items.reduce((s, i) => s + i.quantity, 0)} items)
          </h1>

          {items.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-200 p-8 shadow-sm max-w-2xl mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h2 className="font-serif text-xl font-bold text-gray-800 mb-2">
                Your cart is empty
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                Explore our fine churidar leggings and cotton lycra tight shorts from Sangli.
              </p>
              <Link
                to="/products"
                className="px-6 py-3 bg-[#1A365D] hover:bg-[#2A4365] text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-2"
              >
                <span>Browse Products</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* Items List (8 cols) */}
              <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm divide-y divide-gray-100">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="py-5 flex flex-col sm:flex-row items-start sm:items-center gap-4"
                  >
                    <div className="relative w-20 h-24 rounded-xl bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                      <img
                        src={item.image || "/images/products/bbg-studio-hd-cs-white.jpg"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-serif text-base font-bold text-gray-900 mb-1">
                        {item.name}
                      </h3>
                      <div className="text-xs text-gray-500 flex flex-wrap gap-x-3 gap-y-1 mb-2">
                        {item.color && <span>Color: <strong>{item.color}</strong></span>}
                        {item.size && <span>Size: <strong>{item.size}</strong></span>}
                        <span>SKU: {item.sku}</span>
                      </div>
                      <div className="text-sm font-bold text-[#1A365D]">
                        ₹{item.price.toLocaleString("en-IN")} per item
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-4 self-end sm:self-center">
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2.5 py-1 text-gray-600 hover:bg-gray-100"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 py-1 text-xs font-bold text-gray-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2.5 py-1 text-gray-600 hover:bg-gray-100"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-right min-w-[80px]">
                        <div className="text-base font-bold text-gray-900">
                          ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                        </div>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}

                <div className="pt-4 flex justify-between items-center">
                  <button
                    onClick={clearCart}
                    className="text-xs font-medium text-gray-400 hover:text-red-600 transition-colors"
                  >
                    Clear All Items
                  </button>
                  <Link
                    to="/products"
                    className="text-xs font-bold text-[#1A365D] hover:underline"
                  >
                    + Add More Products
                  </Link>
                </div>
              </div>

              {/* Order Summary (4 cols) */}
              <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
                <h2 className="font-serif text-xl font-bold text-gray-900 border-b border-gray-100 pb-4">
                  Order Summary
                </h2>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-bold text-gray-900">
                      ₹{subtotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Estimated Shipping</span>
                    <span className="text-emerald-600 font-medium">Calculated at Checkout</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Applicable GST</span>
                    <span className="text-gray-500 font-medium">Included in rate</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-base font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-[#1A365D]">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>

                <Link
                  to="/checkout"
                  className="w-full py-4 bg-[#1A365D] hover:bg-[#0F2444] text-white rounded-2xl text-center text-sm font-bold shadow-md flex items-center justify-center gap-2 transition-all mt-6"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="pt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Verified Mill Wholesale Protection</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer settings={siteSettings} />
    </div>
  );
}
