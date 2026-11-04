"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import {
  ShieldCheck,
  ShoppingBag,
  ArrowLeft,
  Truck,
  CreditCard,
  AlertCircle,
  Loader2,
  Trash2,
} from "lucide-react";
import { loadRazorpayScript, RAZORPAY_KEY_ID } from "@/lib/razorpay";

export default function CheckoutClient() {
  const router = useRouter();
  const { items, subtotal, clearCart, removeItem, updateQuantity } = useCart();

  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    alternatePhone: "",
    customerEmail: "",
    shippingAddress: "",
    city: "Sangli",
    state: "Maharashtra",
    postalCode: "416416",
    paymentMethod: "ONLINE_RAZORPAY" as "ONLINE_RAZORPAY" | "COD" | "BANK_TRANSFER",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      setError("Your cart is empty. Please add items before checking out.");
      return;
    }

    const cleanPhone = formData.customerPhone.replace(/\D/g, "");
    if (cleanPhone.length !== 10) {
      setError("Please enter a valid 10-digit primary mobile number before proceeding.");
      return;
    }

    const cleanAlt = (formData.alternatePhone || "").replace(/\D/g, "");
    if (cleanAlt.length !== 10) {
      setError("Please enter a valid 10-digit alternate mobile number before proceeding.");
      return;
    }

    if (!formData.customerEmail || !formData.customerEmail.includes("@") || !formData.customerEmail.includes(".")) {
      setError("Please enter a valid email address (e.g. name@company.com) before proceeding.");
      return;
    }

    setLoading(true);
    setError(null);

    // Online Razorpay Checkout
    if (formData.paymentMethod === "ONLINE_RAZORPAY") {
      try {
        const loaded = await loadRazorpayScript();
        if (!loaded || !(window as any).Razorpay) {
          throw new Error("Razorpay payment gateway failed to load. Please try again.");
        }

        const options = {
          key: RAZORPAY_KEY_ID,
          amount: Math.round(subtotal * 100),
          currency: "INR",
          name: "BBG Textile",
          description: "Online Fabric Order Checkout",
          image: "/icon.png",
          prefill: {
            name: formData.customerName,
            email: formData.customerEmail || "",
            contact: formData.customerPhone,
          },
          theme: {
            color: "#1A365D",
          },
          handler: async function (response: any) {
            try {
              const payload = {
                ...formData,
                paymentMethod: "ONLINE_RAZORPAY",
                paymentId: response.razorpay_payment_id,
                items: items.map((i) => ({
                  productId: i.productId,
                  color: i.color,
                  size: i.size,
                  quantity: i.quantity,
                })),
              };

              const res = await fetch("/api/public/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
              });

              const data = await res.json();
              if (!res.ok) throw new Error(data.error || "Failed to record order");

              clearCart();
              router.push(`/order-success/${data.orderNumber}`);
            } catch (err: any) {
              setError(err.message || "Failed to complete order after payment.");
              setLoading(false);
            }
          },
          modal: {
            ondismiss: function () {
              setLoading(false);
            },
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on("payment.failed", function (response: any) {
          setError(`Payment failed: ${response.error?.description || "Transaction declined"}`);
          setLoading(false);
        });
        rzp.open();
        return;
      } catch (err: any) {
        setError(err.message || "Failed to start online payment.");
        setLoading(false);
        return;
      }
    }

    try {
      const payload = {
        ...formData,
        items: items.map((i) => ({
          productId: i.productId,
          color: i.color,
          size: i.size,
          quantity: i.quantity,
        })),
      };

      const res = await fetch("/api/public/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to process order");
      }

      clearCart();
      router.push(`/order-success/${data.orderNumber}`);
    } catch (err: any) {
      setError(err.message || "Failed to place order. Please try again.");
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-gray-900 mb-2">
          Your cart is currently empty
        </h2>
        <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
          Explore our range of premium shirting, suiting, linens, and uniform fabrics.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#1A365D] hover:bg-[#2A4365] text-white rounded-xl font-bold text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse Products</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="mb-8">
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 mb-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </Link>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900">
          Order Checkout & Dispatch
        </h1>
      </div>

      {error && (
        <div className="mb-8 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Unable to place order</p>
            <p className="text-xs mt-0.5">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* LEFT: Customer & Delivery Details (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Contact Details */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm">
              <h2 className="font-serif text-xl font-bold text-gray-900 mb-4">
                1. Customer Contact Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    Full Name / Business Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={(e) =>
                      setFormData({ ...formData, customerName: e.target.value })
                    }
                    placeholder="e.g. Anand Kulkarni / Anand Apparels"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A365D] text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                      Mobile Number (10 Digits) *
                    </label>
                    <input
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      pattern="[0-9]{10}"
                      required
                      value={formData.customerPhone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          customerPhone: e.target.value.replace(/\D/g, "").slice(0, 10),
                        })
                      }
                      placeholder="10-digit mobile number"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A365D] text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                      Alternate Mobile Number (10 Digits) *
                    </label>
                    <input
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      pattern="[0-9]{10}"
                      required
                      value={formData.alternatePhone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          alternatePhone: e.target.value.replace(/\D/g, "").slice(0, 10),
                        })
                      }
                      placeholder="10-digit alternate number"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A365D] text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.customerEmail}
                    onChange={(e) =>
                      setFormData({ ...formData, customerEmail: e.target.value })
                    }
                    placeholder="e.g. anand@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A365D] text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm">
              <h2 className="font-serif text-xl font-bold text-gray-900 mb-4">
                2. Shipping & Delivery Address
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    Complete Street Address *
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={formData.shippingAddress}
                    onChange={(e) =>
                      setFormData({ ...formData, shippingAddress: e.target.value })
                    }
                    placeholder="House/Shop no., Building, Street, Landmark"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A365D] text-sm resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A365D] text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                      State *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.state}
                      onChange={(e) =>
                        setFormData({ ...formData, state: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A365D] text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.postalCode}
                      onChange={(e) =>
                        setFormData({ ...formData, postalCode: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A365D] text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    Order Instructions / Transport Preference
                  </label>
                  <input
                    type="text"
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    placeholder="e.g. Sangli Transport Company dispatch preferred"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A365D] text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm">
              <h2 className="font-serif text-xl font-bold text-gray-900 mb-4">
                3. Payment & Confirmation Option
              </h2>
              <div className="space-y-3">
                <label
                  className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                    formData.paymentMethod === "ONLINE_RAZORPAY"
                      ? "border-[#1A365D] bg-blue-50/50 ring-1 ring-[#1A365D]"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="ONLINE_RAZORPAY"
                    checked={formData.paymentMethod === "ONLINE_RAZORPAY"}
                    onChange={() =>
                      setFormData({ ...formData, paymentMethod: "ONLINE_RAZORPAY" })
                    }
                    className="mt-1 text-[#1A365D] focus:ring-[#1A365D]"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-gray-900">
                        Pay Online (Razorpay Gateway)
                      </span>
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-[#1A365D] text-white rounded">
                        Instant
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Pay securely with UPI (GPay, PhonePe, Paytm), Credit/Debit Card, or NetBanking.
                    </p>
                  </div>
                </label>

                <label
                  className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                    formData.paymentMethod === "BANK_TRANSFER"
                      ? "border-[#1A365D] bg-blue-50/50 ring-1 ring-[#1A365D]"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="BANK_TRANSFER"
                    checked={formData.paymentMethod === "BANK_TRANSFER"}
                    onChange={() =>
                      setFormData({ ...formData, paymentMethod: "BANK_TRANSFER" })
                    }
                    className="mt-1 text-[#1A365D] focus:ring-[#1A365D]"
                  />
                  <div>
                    <span className="font-semibold text-sm text-gray-900">
                      Direct Mill Bank Transfer (NEFT / RTGS / IMPS)
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      Official BBG Textile bank details will be provided on the order confirmation screen.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* RIGHT: Order Summary Card (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm sticky top-24">
              <h2 className="font-serif text-xl font-bold text-gray-900 mb-4 pb-3 border-b border-gray-100">
                Order Summary ({items.reduce((s, i) => s + i.quantity, 0)} items)
              </h2>

              {/* Items List */}
              <div className="divide-y divide-gray-100 max-h-72 overflow-y-auto mb-6 pr-1">
                {items.map((item) => (
                  <div key={item.id} className="py-3 flex gap-3">
                    <div className="relative w-14 h-16 rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                      <Image
                        src={
                          item.image ||
                          "/images/products/bbg-studio-hd-crimson-red.jpg"
                        }
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="text-xs font-semibold text-gray-900 leading-tight">
                            {item.name}
                          </h4>
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="text-gray-400 hover:text-red-600 transition-colors ml-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="text-[11px] text-gray-500 mt-0.5">
                          {item.color && <span>{item.color}</span>}
                          {item.size && <span> • {item.size}</span>}
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-500">Qty: {item.quantity}</span>
                        <span className="font-bold text-gray-900">
                          ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-2 pt-4 border-t border-gray-100 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Transport / Delivery</span>
                  <span className="font-semibold text-emerald-700">
                    Free / Included
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-gray-900 pt-3 border-t border-gray-200">
                  <span>Total Amount</span>
                  <span className="text-xl text-[#1A365D]">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Place Order CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 py-4 bg-[#1A365D] hover:bg-[#2A4365] disabled:opacity-50 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing Order...</span>
                  </>
                ) : (
                  <>
                    {formData.paymentMethod === "ONLINE_RAZORPAY" ? (
                      <>
                        <CreditCard className="w-5 h-5 text-amber-400" />
                        <span>Pay Online & Place Order</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-5 h-5 text-amber-400" />
                        <span>Confirm & Place Order</span>
                      </>
                    )}
                  </>
                )}
              </button>

              <div className="mt-4 text-center text-xs text-gray-500">
                <span>By confirming, your order will be recorded in our mill system.</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
