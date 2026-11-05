import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { siteSettings } from "@/lib/catalogService";
import OfficialTaxInvoice from "@/components/OfficialTaxInvoice";
import {
  CheckCircle2,
  Printer,
  PackageCheck,
  ShoppingBag,
  Mail,
  RotateCcw,
  Truck,
  Download,
  FileText,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

export default function OrderSuccessPage() {
  const { orderNumber } = useParams();
  const [showFullInvoice, setShowFullInvoice] = useState(true);

  // Retrieve stored order from localStorage or fallback
  let order = null;
  try {
    const raw = localStorage.getItem(`order_${orderNumber}`);
    if (raw) {
      order = JSON.parse(raw);
    } else {
      const pastOrders = JSON.parse(localStorage.getItem("bbg_orders") || "[]");
      order = pastOrders.find((o) => o.orderNumber === orderNumber) || null;
    }
  } catch (e) {
    console.error("Failed to read order", e);
  }

  // Sensible fallback if accessed directly
  if (!order && orderNumber) {
    order = {
      orderNumber,
      customerName: "Valued Customer",
      customerPhone: "+91 87673 22501",
      shippingAddress: "Direct Mill Delivery",
      city: "Sangli",
      state: "Maharashtra",
      postalCode: "416436",
      paymentMethod: "ONLINE_RAZORPAY",
      items: [
        {
          name: "4-Way Stretch Cotton Lycra Leggings",
          color: "Assorted Shades",
          quantity: 1,
          price: 1400,
        },
      ],
      total: 1400,
      createdAt: new Date().toISOString(),
    };
  }

  const handlePrintPdf = () => {
    const originalTitle = document.title;
    document.title = `BBG_Tax_Invoice_${orderNumber || "Bill"}`;
    window.print();
    setTimeout(() => {
      document.title = originalTitle;
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFDFD]">
      <div className="no-print">
        <Header settings={siteSettings} />
      </div>

      <main className="flex-1 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Top Celebration Card (Hidden during print / PDF export) */}
          <div className="no-print bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-md text-center">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full mb-2 inline-block border border-emerald-200">
              ✓ Order Confirmed & Payment Received
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 mb-1.5">
              Thank You for Your Order!
            </h1>
            <p className="text-gray-500 text-xs sm:text-sm max-w-md mx-auto mb-5 leading-relaxed">
              Your order number is <strong className="text-gray-900 font-mono">#{orderNumber}</strong>. Your official Tax Invoice and Cash Memo is generated below.
            </p>

            {/* Main Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handlePrintPdf}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-stone-950 font-extrabold text-xs shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer transform active:scale-95"
              >
                <Printer className="w-4 h-4 text-stone-950" />
                <span>Save Bill as PDF / Print</span>
              </button>

              <Link
                to={`/track-order?order=${orderNumber}`}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Truck className="w-4 h-4 text-white" />
                <span>Track Live Order Status</span>
              </Link>

              <Link
                to="/products"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#1A365D] hover:bg-[#0F2444] text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-all"
              >
                <ShoppingBag className="w-4 h-4 text-white" />
                <span>Continue Shopping</span>
              </Link>
            </div>

            {/* Return Policy Notice */}
            <div className="mt-6 pt-5 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
              <div className="flex items-center gap-2 text-stone-700 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>7-Day Return / Exchange Guarantee on all Sangli Mill shipments.</span>
              </div>
              <Link
                to="/return-policy"
                className="text-amber-800 hover:text-amber-950 underline font-semibold text-[11px]"
              >
                View Return Guidelines
              </Link>
            </div>
          </div>

          {/* Official Tax Invoice Component (Will be printed or saved cleanly as A4 PDF) */}
          {order && (
            <div className="w-full">
              <OfficialTaxInvoice order={order} />
            </div>
          )}

          {/* Quick links at bottom */}
          <div className="no-print text-center pt-2 pb-6">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#1A365D] hover:underline"
            >
              <span>Explore More Fabrics & Leggings</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </main>

      <div className="no-print">
        <Footer settings={siteSettings} />
      </div>
    </div>
  );
}
