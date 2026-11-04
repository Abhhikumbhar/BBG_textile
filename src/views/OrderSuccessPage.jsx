import React from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { siteSettings } from "@/lib/catalogService";
import {
  CheckCircle2,
  Printer,
  PackageCheck,
  MapPin,
  ArrowRight,
  ShoppingBag,
  Mail,
  RotateCcw,
  Truck,
} from "lucide-react";

export default function OrderSuccessPage() {
  const { orderNumber } = useParams();

  // Try retrieving stored order from localStorage
  let order = null;
  try {
    const raw = localStorage.getItem(`order_${orderNumber}`);
    if (raw) order = JSON.parse(raw);
  } catch (e) {
    console.error("Failed to read order", e);
  }

  const supportEmail = siteSettings?.email || "bbgtextilebharat1@gmail.com";

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFDFD]">
      <Header settings={siteSettings} />

      <main className="flex-1 py-12 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-md text-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-1 block">
              Order Registered
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Thank You for Your Order!
            </h1>
            <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
              Your order number is <strong className="text-gray-900 font-mono">#{orderNumber}</strong>. Our trade team in Sangli has received your order details.
            </p>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
              <Link
                to={`/track-order?order=${orderNumber}`}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Truck className="w-4 h-4 text-white" />
                <span>Track Live Order Status</span>
              </Link>

              <Link
                to="/products"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#1A365D] hover:bg-[#0F2444] text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4 text-white" />
                <span>Continue Shopping</span>
              </Link>

              <button
                onClick={() => window.print()}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Receipt</span>
              </button>
            </div>

            {/* Order Details */}
            {order && (
              <div className="text-left border-t border-gray-100 pt-6 space-y-4">
                <h3 className="font-serif text-base font-bold text-gray-900">
                  Order Summary
                </h3>

                <div className="bg-gray-50 p-4 rounded-2xl text-xs space-y-2 text-gray-600">
                  <div className="flex justify-between">
                    <span>Customer:</span>
                    <strong className="text-gray-900">{order.customerName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Phone:</span>
                    <strong className="text-gray-900">{order.customerPhone}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Address:</span>
                    <span className="text-right text-gray-900 font-medium">
                      {order.shippingAddress}, {order.city}, {order.state} - {order.postalCode}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-1 border-t border-gray-100">
                    <span>Payment:</span>
                    {order.paymentMethod === "ONLINE_RAZORPAY" ? (
                      <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Paid Online (Razorpay)
                      </span>
                    ) : (
                      <span className="text-amber-800 font-medium text-[11px]">
                        {order.paymentMethod === "BANK_TRANSFER" ? "Bank / RTGS" : "Paid Online (Razorpay)"}
                      </span>
                    )}
                  </div>
                  {order.paymentId && (
                    <div className="flex justify-between items-center text-[11px]">
                      <span>Payment Reference:</span>
                      <span className="font-mono text-gray-800 bg-gray-100 px-2 py-0.5 rounded">
                        {order.paymentId}
                      </span>
                    </div>
                  )}
                  {order.paymentStatus === "REFUNDED" && (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs space-y-1 mt-2">
                      <div className="font-bold text-rose-800 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-rose-600" />
                        <span>Order Cancelled & Refunded</span>
                      </div>
                      {order.refundId && (
                        <div className="text-[11px] text-rose-700">
                          Refund ID: <span className="font-mono font-bold">{order.refundId}</span>
                        </div>
                      )}
                      <div className="text-[10px] text-gray-500">
                        Amount will reflect in your original payment source (UPI/Card/Bank) within 5-7 working days.
                      </div>
                    </div>
                  )}
                </div>

                <div className="divide-y divide-gray-100">
                  {order.items?.map((it, idx) => (
                    <div key={idx} className="py-2.5 flex justify-between items-center text-xs">
                      <div>
                        <div className="font-bold text-gray-900">{it.name}</div>
                        <div className="text-gray-500">
                          Qty: {it.quantity} {it.color && `• Color: ${it.color}`}
                        </div>
                      </div>
                      <div className="font-bold text-gray-900">
                        ₹{(it.price * it.quantity).toLocaleString("en-IN")}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
                  <span className="font-bold text-gray-900 text-sm">Total Amount</span>
                  <span className="text-xl font-bold text-[#1A365D]">
                    ₹{order.total.toLocaleString("en-IN")}
                  </span>
                </div>

                {/* 7-Day Easy Return & Exchange Section */}
                <div className="mt-5 p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0 text-amber-800">
                    <RotateCcw className="w-4 h-4" />
                  </div>
                  <div className="flex-1 text-xs">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-bold text-amber-950">7-Day Return & Exchange Guarantee</span>
                      <Link to="/return-policy" className="text-amber-800 hover:text-amber-950 underline font-semibold text-[11px]">
                        Policy
                      </Link>
                    </div>
                    <p className="text-amber-900/80 leading-relaxed mb-2 text-[11px]">
                      If you receive a defective or mismatched piece, request an exchange or 100% refund within 7 days of delivery.
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      <a
                        href={`mailto:bbgtextilebharat1@gmail.com?subject=${encodeURIComponent(`Return / Exchange Request for Order #${orderNumber || ""}`)}&body=${encodeURIComponent(`Hello BBG Textile Team,\n\nI would like to request an exchange/return for my Order #${orderNumber || ""}.\n\nCustomer Phone:\nReason for Return:\n\nThank you!`)}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1A365D] hover:bg-[#0F2444] text-white rounded-lg font-bold text-[11px] shadow-sm transition-colors"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Email Return Request</span>
                      </a>
                      <Link
                        to="/return-policy"
                        className="text-stone-600 hover:text-stone-900 font-medium text-[11px] underline"
                      >
                        View Guidelines
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-gray-100">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 text-sm font-bold text-[#1A365D] hover:underline"
              >
                <span>Continue Browsing Products</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer settings={siteSettings} />
    </div>
  );
}
