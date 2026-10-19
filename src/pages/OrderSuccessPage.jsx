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
} from "lucide-react";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";

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

  const cleanWhatsApp = (siteSettings?.whatsappNumber || "918767322501").replace(/[^0-9]/g, "");

  const whatsappMessage = encodeURIComponent(
    `Hello SBBG Bharat Textile,\n\nI have placed order *#${orderNumber}* on your website for ₹${(order?.total || 0).toLocaleString("en-IN")}.\n\nCustomer: ${order?.customerName || "Customer"}\nPhone: ${order?.customerPhone || ""}\nCity: ${order?.city || "Sangli"}\n\nPlease confirm dispatch schedule.`
  );

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
              <a
                href={`https://wa.me/${cleanWhatsApp}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2"
              >
                <WhatsAppIcon className="w-4 h-4 text-white" />
                <span>Confirm on WhatsApp</span>
              </a>

              <button
                onClick={() => window.print()}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs flex items-center justify-center gap-2"
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
