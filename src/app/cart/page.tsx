"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";

export default function CartPage() {
  const { items, subtotal, removeItem, updateQuantity, clearCart } = useCart();

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFDFD]">
      <Header />

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
                Explore our fine combed cottons, suitings, and linens from Sangli.
              </p>
              <Link
                href="/products"
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
                      <Image
                        src={
                          item.image ||
                          "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=400&q=80"
                        }
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-serif font-bold text-base text-gray-900">
                        {item.name}
                      </h3>
                      <p className="font-mono text-xs text-gray-400 mt-0.5">
                        SKU: {item.sku}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                        {item.color && <span>Shade: {item.color}</span>}
                        {item.size && <span>Length: {item.size}</span>}
                      </div>
                    </div>

                    <div className="flex items-center gap-6 mt-3 sm:mt-0">
                      <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-3 py-1.5 text-gray-600 hover:bg-gray-100"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-4 py-1.5 text-xs font-bold text-gray-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-3 py-1.5 text-gray-600 hover:bg-gray-100"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-right w-24">
                        <span className="font-bold text-sm text-gray-900 block">
                          ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          ₹{item.price}/m
                        </span>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-red-600 p-2"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}

                <div className="pt-4 flex justify-between items-center">
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-gray-600 hover:text-black"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Continue Shopping</span>
                  </Link>

                  <button
                    onClick={clearCart}
                    className="text-xs text-red-600 hover:underline"
                  >
                    Clear Entire Cart
                  </button>
                </div>
              </div>

              {/* Order Summary (4 cols) */}
              <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
                <h2 className="font-serif text-lg font-bold text-gray-900 pb-3 border-b border-gray-100">
                  Cart Summary
                </h2>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-bold text-gray-900 text-sm">
                      ₹{subtotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Transporter Delivery</span>
                    <span className="font-bold text-emerald-700">Free / Included</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-gray-900 pt-3 border-t border-gray-200">
                    <span>Total Amount</span>
                    <span className="text-lg text-[#1A365D]">
                      ₹{subtotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="w-full py-4 bg-[#1A365D] hover:bg-[#2A4365] text-white rounded-xl text-center text-xs font-bold shadow-md transition-colors block mt-6"
                >
                  Proceed to Checkout &rarr;
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
