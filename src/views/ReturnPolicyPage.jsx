import React from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { siteSettings } from "@/lib/catalogService";
import {
  RotateCcw,
  ShieldCheck,
  Truck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowLeft,
  Mail,
  Phone,
  Clock,
  Package,
} from "lucide-react";

export default function ReturnPolicyPage() {
  const email = siteSettings?.email || "bbgtextilebharat1@gmail.com";
  const address =
    siteSettings?.address ||
    "GROUND FLOOR, KHARE MALA, S.NO-204 PLOT NO 28, Kupwad MIDC Area, Madhavnagar, Sangli, Maharashtra - 416436";

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFDFD]">
      <Header settings={siteSettings} />

      <main className="flex-1 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </Link>
          </div>

          {/* Hero Banner */}
          <div className="bg-gradient-to-r from-[#1A365D] via-[#24477D] to-[#1A365D] text-white rounded-3xl p-8 sm:p-12 mb-10 shadow-lg relative overflow-hidden">
            <div className="relative z-10 max-w-2xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-300/30 mb-4">
                <RotateCcw className="w-3.5 h-3.5" />
                Customer Assurance Guarantee
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold mb-3 tracking-tight">
                7 Days Return & Refund Policy
              </h1>
              <p className="text-gray-200 text-sm sm:text-base leading-relaxed">
                At SBBG Bharat Textile, customer satisfaction and premium fabric quality are our highest priorities. We provide an easy 7-day return and exchange policy from the date of delivery.
              </p>
            </div>
            <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
          </div>

          {/* Key Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-sm font-bold text-gray-900 mb-1">
                  7-Day Return Window
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Request a return or replacement within 7 calendar days of parcel delivery.
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-sm font-bold text-gray-900 mb-1">
                  100% Secure Refund
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Direct refund to original payment source (UPI / Card / NetBanking) via Razorpay.
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1A365D] flex items-center justify-center shrink-0 border border-blue-200">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-sm font-bold text-gray-900 mb-1">
                  Free Exchange Support
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Fast replacement in case of incorrect shade, size discrepancy, or defective fabric.
                </p>
              </div>
            </div>
          </div>

          {/* Detailed Policy Content */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200/80 shadow-sm space-y-8 text-gray-700">
            {/* Section 1 */}
            <div className="space-y-3">
              <h2 className="font-serif text-lg font-bold text-gray-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#1A365D] text-white text-xs flex items-center justify-center font-sans">
                  1
                </span>
                <span>Return Eligibility & Conditions</span>
              </h2>
              <p className="text-xs sm:text-sm leading-relaxed text-gray-600 pl-8">
                To qualify for a 7-day return or exchange, items must satisfy the following conditions:
              </p>
              <ul className="pl-8 space-y-2 text-xs sm:text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>The return request must be raised within <strong>7 days</strong> of order delivery.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>The garments / fabrics must be <strong>unused, unwashed, and undamaged</strong>, with all original brand tags, labels, and packaging intact.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>For wholesale rolls, the full roll length must be preserved without individual cutting or tailoring alterings.</span>
                </li>
              </ul>
            </div>

            {/* Section 2 */}
            <div className="space-y-3 border-t border-gray-100 pt-6">
              <h2 className="font-serif text-lg font-bold text-gray-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#1A365D] text-white text-xs flex items-center justify-center font-sans">
                  2
                </span>
                <span>How to Initiate a Return</span>
              </h2>
              <p className="text-xs sm:text-sm leading-relaxed text-gray-600 pl-8">
                Returning an item is quick and hassle-free. Follow these simple steps:
              </p>
              <div className="pl-8 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-xs space-y-1">
                  <span className="font-bold text-[#1A365D]">Step 1: Contact Support</span>
                  <p className="text-gray-500">
                    Reach our Sangli trade coordinator via Email with your Order Number (#BBG-...).
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-xs space-y-1">
                  <span className="font-bold text-[#1A365D]">Step 2: Share Details</span>
                  <p className="text-gray-500">
                    Share a quick photograph of the parcel and the reason for return/exchange.
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-xs space-y-1">
                  <span className="font-bold text-[#1A365D]">Step 3: Dispatch & Refund</span>
                  <p className="text-gray-500">
                    Our team will arrange courier pickup or provide return transit instructions.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 3 */}
            <div className="space-y-3 border-t border-gray-100 pt-6">
              <h2 className="font-serif text-lg font-bold text-gray-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#1A365D] text-white text-xs flex items-center justify-center font-sans">
                  3
                </span>
                <span>Refund Processing & Timelines</span>
              </h2>
              <div className="pl-8 space-y-3 text-xs sm:text-sm text-gray-600">
                <p className="leading-relaxed">
                  Once your returned parcel is received at our Sangli mill works and completes basic quality verification:
                </p>
                <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl text-emerald-900 space-y-1.5 text-xs">
                  <div className="font-bold text-sm text-emerald-950 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>Automated Razorpay Payment Reversal</span>
                  </div>
                  <p>
                    Refunds are credited directly back to the original payment source (UPI, Google Pay, PhonePe, Debit/Credit Card, or NetBanking).
                  </p>
                  <p className="font-medium text-[11px] text-emerald-800">
                    • Standard reflection timeline: <strong>5 to 7 working days</strong> (as per banking standards).
                  </p>
                </div>
              </div>
            </div>

            {/* Section 4 */}
            <div className="space-y-3 border-t border-gray-100 pt-6">
              <h2 className="font-serif text-lg font-bold text-gray-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#1A365D] text-white text-xs flex items-center justify-center font-sans">
                  4
                </span>
                <span>Mill Facility & Return Dispatch Address</span>
              </h2>
              <div className="pl-8 text-xs sm:text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-1">
                <p className="font-bold text-gray-900">SBBG Bharat Textile Works:</p>
                <p>{address}</p>
                <p className="text-[11px] text-gray-500 pt-1">
                  Contact: {siteSettings?.phone || "+91 87673 22501"} | Email: {email}
                </p>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="pt-6 border-t border-gray-100 flex justify-center">
              <a
                href={`mailto:${email}?subject=${encodeURIComponent("7-Day Return Request — SBBG Bharat Textile")}&body=${encodeURIComponent("Hello SBBG Bharat Textile Support,\n\nI would like to request a 7-day return / exchange for my order.\n\nOrder Number: #\nCustomer Name:\nMobile Number:\nReason for Return:\n\nThank you!")}`}
                className="w-full sm:w-auto py-3.5 px-8 rounded-2xl bg-[#1A365D] hover:bg-[#0F2444] text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 text-center"
              >
                <Mail className="w-4 h-4 text-white" />
                <span>Initiate Return via Email Support Desk</span>
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer settings={siteSettings} />
    </div>
  );
}
