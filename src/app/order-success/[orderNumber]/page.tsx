import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSiteSettings } from "@/lib/data";
import {
  CheckCircle2,
  Printer,
  PackageCheck,
  MapPin,
  Clock,
  ArrowRight,
  Phone,
} from "lucide-react";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";

interface Props {
  params: Promise<{ orderNumber: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { orderNumber } = await params;
  return {
    title: `Order Confirmed #${orderNumber} | BBG Textile`,
  };
}

export default async function OrderSuccessPage({ params }: Props) {
  const { orderNumber } = await params;
  const settings = await getSiteSettings();

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: {
      items: true,
      statusHistory: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!order) {
    notFound();
  }

  const cleanWhatsApp = (settings?.whatsappNumber || "918767322501").replace(
    /[^0-9]/g,
    ""
  );

  const whatsappMessage = encodeURIComponent(
    `Hello BBG Textile,\n\nI have placed order *#${order.orderNumber}* on your website for ₹${order.total.toLocaleString(
      "en-IN"
    )}.\n\nCustomer: ${order.customerName}\nPhone: ${order.customerPhone}\nDelivery City: ${order.city}\n\nPlease confirm dispatch schedule.`
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFDFD]">
      <Header settings={settings || undefined} />

      <main className="flex-1 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Success Banner */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-200 shadow-md text-center mb-8">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full mb-2 inline-block">
              Order Confirmed & Logged
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Thank You for Your Order!
            </h1>
            <p className="text-gray-500 text-sm max-w-lg mx-auto mb-4">
              Your order has been recorded in our mill management system. Our dispatch desk will prepare your fabrics.
            </p>
            <div className="inline-block bg-gray-50 border border-gray-200 px-4 py-2 rounded-xl font-mono text-sm font-bold text-[#1A365D]">
              Order ID: #{order.orderNumber}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
              <a
                href={`https://wa.me/${cleanWhatsApp}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                <WhatsAppIcon className="w-4 h-4" />
                <span>Confirm on WhatsApp Now</span>
              </a>

              <PrintButton />
            </div>
          </div>

          {/* Order Details Receipt Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm print:shadow-none print:border-none space-y-6">
            <div className="flex justify-between items-start pb-6 border-b border-gray-200">
              <div>
                <h2 className="font-serif text-xl font-bold text-gray-900">
                  {settings?.businessName || "BBG TEXTILE EXPORTER"}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Sangli, Maharashtra | Registered Works
                </p>
              </div>
              <div className="text-right">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                  Status: {order.status}
                </span>
                <p className="text-xs text-gray-400 mt-1">
                  Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { dateStyle: "long" })}
                </p>
              </div>
            </div>

            {/* Delivery & Customer Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Customer Information
                </h3>
                <p className="font-semibold text-gray-900">{order.customerName}</p>
                <p className="text-gray-600 text-xs mt-0.5">{order.customerPhone}</p>
                {order.customerEmail && (
                  <p className="text-gray-600 text-xs">{order.customerEmail}</p>
                )}
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Shipping Destination
                </h3>
                <p className="text-gray-700 text-xs leading-relaxed">
                  {order.shippingAddress}
                  <br />
                  {order.city}, {order.state} - {order.postalCode}
                </p>
              </div>
            </div>

            {/* Items Table */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                Fabric Items Ordered
              </h3>
              <div className="border border-gray-200 rounded-2xl overflow-hidden divide-y divide-gray-200">
                <div className="bg-gray-50 px-4 py-2.5 text-xs font-bold text-gray-500 grid grid-cols-12">
                  <span className="col-span-6">Fabric / SKU</span>
                  <span className="col-span-2 text-center">Qty</span>
                  <span className="col-span-2 text-right">Unit Price</span>
                  <span className="col-span-2 text-right">Total</span>
                </div>
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="px-4 py-3 text-xs text-gray-800 grid grid-cols-12 items-center"
                  >
                    <div className="col-span-6">
                      <p className="font-semibold text-gray-900">{item.productName}</p>
                      <p className="text-[11px] text-gray-500">
                        SKU: {item.productSku}
                        {item.color ? ` | Color: ${item.color}` : ""}
                        {item.size ? ` | Length: ${item.size}` : ""}
                      </p>
                    </div>
                    <span className="col-span-2 text-center font-medium">
                      {item.quantity}
                    </span>
                    <span className="col-span-2 text-right font-medium">
                      ₹{item.price.toLocaleString("en-IN")}
                    </span>
                    <span className="col-span-2 text-right font-bold text-gray-900">
                      ₹{item.total.toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals Breakdown */}
            <div className="pt-4 border-t border-gray-200 flex justify-end">
              <div className="w-full sm:w-64 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600 text-xs">
                  <span>Subtotal</span>
                  <span>₹{order.subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-gray-600 text-xs">
                  <span>Shipping Fee</span>
                  <span>{order.shippingFee === 0 ? "Free" : `₹${order.shippingFee}`}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-200">
                  <span>Total Amount</span>
                  <span className="text-[#1A365D]">
                    ₹{order.total.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900 space-y-1">
              <p className="font-bold">Next Steps for Dispatch:</p>
              <p>
                1. Our order coordinator will verify roll lengths and shade batch.
              </p>
              <p>
                2. If chosen WhatsApp COD or Bank Transfer, you will receive payment receipt and transporter parcel bilti copy on WhatsApp.
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#1A365D] hover:underline"
            >
              <span>Continue Exploring More Fabrics</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      <Footer settings={settings || undefined} />
    </div>
  );
}

function PrintButton() {
  "use client";
  return (
    <button
      onClick={() => window.print()}
      className="px-6 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors print:hidden"
    >
      <Printer className="w-4 h-4" />
      <span>Print Invoice / Receipt</span>
    </button>
  );
}
