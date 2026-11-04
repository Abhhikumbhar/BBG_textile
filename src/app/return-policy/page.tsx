import React from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSiteSettings } from "@/lib/data";
import {
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Package,
  ArrowLeft,
  Mail,
  Phone,
} from "lucide-react";

export const metadata = {
  title: "7 Days Return & Refund Policy | SBBG Bharat Textile",
  description:
    "Learn about our 7-day hassle-free return, replacement, and automated Razorpay refund policy for all textile fabrics and garments.",
};

export default async function ReturnPolicyPage() {
  const settings = await getSiteSettings();
  const email = settings?.email || "bbgtextilebharat1@gmail.com";
  const address =
    settings?.address ||
    "GROUND FLOOR, KHARE MALA, S.NO-204 PLOT NO 28, Kupwad MIDC Area, Madhavnagar, Sangli, Maharashtra - 416436";

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFDFD]">
      <Header settings={settings} />

      <main className="flex-1 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </Link>
          </div>

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
          </div>

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

          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200/80 shadow-sm space-y-8 text-gray-700">
            <div className="space-y-3">
              <h2 className="font-serif text-lg font-bold text-gray-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#1A365D] text-white text-xs flex items-center justify-center font-sans">
                  1
                </span>
                <span>Return Eligibility & Conditions</span>
              </h2>
              <ul className="pl-8 space-y-2 text-xs sm:text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>The return request must be raised within <strong>7 days</strong> of delivery.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>The garments / fabrics must be <strong>unused, unwashed, and undamaged</strong>, with all tags intact.</span>
                </li>
              </ul>
            </div>

            <div className="space-y-3 border-t border-gray-100 pt-6">
              <h2 className="font-serif text-lg font-bold text-gray-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#1A365D] text-white text-xs flex items-center justify-center font-sans">
                  2
                </span>
                <span>Refund Processing & Timelines</span>
              </h2>
              <div className="pl-8 text-xs sm:text-sm text-gray-600 space-y-2">
                <p>
                  Upon receipt and inspection at our Sangli works, refunds are processed via Razorpay back to your original payment method in <strong>5 to 7 working days</strong>.
                </p>
              </div>
            </div>

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

      <Footer settings={settings} />
    </div>
  );
}
