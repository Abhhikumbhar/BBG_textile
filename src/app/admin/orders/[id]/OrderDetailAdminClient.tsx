"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Printer,
  Clock,
  ShieldCheck,
  Check,
  AlertCircle,
  Loader2,
} from "lucide-react";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";

interface OrderDetailAdminProps {
  order: any;
}

export default function OrderDetailAdminClient({
  order: initialOrder,
}: OrderDetailAdminProps) {
  const [order, setOrder] = useState(initialOrder);
  const [newStatus, setNewStatus] = useState(order.status);
  const [comment, setComment] = useState("");
  const [updating, setUpdating] = useState(false);
  const [notification, setNotification] = useState<{
    type: string;
    msg: string;
  } | null>(null);

  const handleStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setNotification(null);

    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, comment }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to update order");

      setOrder(json.order);
      setComment("");
      setNotification({
        type: "success",
        msg: `Order status updated to ${newStatus}`,
      });
    } catch (err: any) {
      setNotification({
        type: "error",
        msg: err.message || "Failed to update",
      });
    } finally {
      setUpdating(false);
    }
  };

  const cleanPhone = order.customerPhone.replace(/[^0-9]/g, "");

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between print:hidden">
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Orders</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 border border-gray-200 hover:bg-gray-50 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors bg-white shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Invoice</span>
          </button>

          <a
            href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
              `Hello ${order.customerName}, this is BBG Textile regarding your order #${order.orderNumber}. Your order status is currently: ${order.status}.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <WhatsAppIcon className="w-3.5 h-3.5" />
            <span>WhatsApp Customer</span>
          </a>
        </div>
      </div>

      {notification && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center justify-between print:hidden ${
            notification.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          <span>{notification.msg}</span>
          <button
            onClick={() => setNotification(null)}
            className="text-gray-400 hover:text-gray-600 font-bold ml-2"
          >
            &times;
          </button>
        </div>
      )}

      {/* Main Order Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm print:border-none print:shadow-none space-y-8">
        {/* Header with Order # and Status */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-gray-100">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Order Details
            </span>
            <h1 className="font-serif text-2xl font-bold text-gray-900 mt-0.5">
              Order #{order.orderNumber}
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Received on {new Date(order.createdAt).toLocaleString("en-IN")}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-amber-100 text-amber-800">
              {order.status}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-blue-100 text-blue-800">
              {order.paymentMethod}
            </span>
          </div>
        </div>

        {/* Customer & Shipping Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
            <h3 className="font-bold text-gray-900 uppercase tracking-wider mb-2">
              Customer Information
            </h3>
            <p className="font-semibold text-sm text-gray-900">
              {order.customerName}
            </p>
            <p className="text-gray-600 mt-1">Phone: {order.customerPhone}</p>
            {order.customerEmail && (
              <p className="text-gray-600">Email: {order.customerEmail}</p>
            )}
            {order.notes && (
              <div className="mt-2 pt-2 border-t border-gray-200 text-gray-700 italic">
                &ldquo;Note: {order.notes}&rdquo;
              </div>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
            <h3 className="font-bold text-gray-900 uppercase tracking-wider mb-2">
              Dispatch Destination
            </h3>
            <p className="text-gray-800 leading-relaxed">
              {order.shippingAddress}
              <br />
              {order.city}, {order.state} - {order.postalCode}
            </p>
          </div>
        </div>

        {/* Ordered Fabric Items */}
        <div>
          <h3 className="font-serif text-base font-bold text-gray-900 mb-3">
            Fabric Items In This Order
          </h3>
          <div className="border border-gray-200 rounded-2xl overflow-hidden divide-y divide-gray-200">
            <div className="bg-gray-50 px-4 py-2.5 text-xs font-bold text-gray-600 grid grid-cols-12">
              <span className="col-span-6">Fabric / SKU</span>
              <span className="col-span-2 text-center">Quantity</span>
              <span className="col-span-2 text-right">Rate</span>
              <span className="col-span-2 text-right">Line Total</span>
            </div>

            {order.items.map((item: any) => (
              <div
                key={item.id}
                className="px-4 py-3 text-xs text-gray-800 grid grid-cols-12 items-center"
              >
                <div className="col-span-6 flex items-center gap-3">
                  {item.productImage && (
                    <div className="relative w-10 h-12 rounded bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                      <Image
                        src={item.productImage}
                        alt={item.productName}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-900">
                      {item.productName}
                    </p>
                    <p className="text-[10px] text-gray-400 font-mono">
                      {item.productSku}
                      {item.color ? ` • Shade: ${item.color}` : ""}
                      {item.size ? ` • Cut: ${item.size}` : ""}
                    </p>
                  </div>
                </div>

                <span className="col-span-2 text-center font-bold">
                  {item.quantity} meters
                </span>
                <span className="col-span-2 text-right">₹{item.price}</span>
                <span className="col-span-2 text-right font-bold text-gray-900">
                  ₹{item.total.toLocaleString("en-IN")}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 flex justify-end">
            <div className="w-64 space-y-1.5 text-xs text-right">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span>₹{order.subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Transport / Shipping:</span>
                <span>{order.shippingFee === 0 ? "Free" : `₹${order.shippingFee}`}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-gray-900 pt-2 border-t border-gray-200">
                <span>Grand Total:</span>
                <span className="text-[#1A365D]">
                  ₹{order.total.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Status Update Form (Hidden in Print) */}
        <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200 print:hidden space-y-4">
          <h3 className="font-serif text-sm font-bold text-gray-900">
            Update Order Status & Dispatch Log
          </h3>

          <form onSubmit={handleStatusUpdate} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Change Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-semibold"
                >
                  <option value="PENDING">Pending (New)</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="PROCESSING">Processing (Cutting/Packing)</option>
                  <option value="SHIPPED">Shipped (In Transport)</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Status Change Comment / Transport LR Details
                </label>
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="e.g. Dispatched via Sangli Transport, LR #88921"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={updating}
              className="px-5 py-2.5 bg-[#1A365D] hover:bg-[#2A4365] text-white rounded-xl text-xs font-bold disabled:opacity-50 flex items-center gap-1.5 transition-colors"
            >
              {updating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Updating Database...</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Update Order Status</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Status History Timeline */}
        {order.statusHistory?.length > 0 && (
          <div className="print:hidden space-y-3">
            <h3 className="font-serif text-sm font-bold text-gray-900">
              Audit & Status History
            </h3>
            <div className="space-y-2">
              {order.statusHistory.map((h: any) => (
                <div
                  key={h.id}
                  className="p-3 bg-white rounded-xl border border-gray-200 text-xs flex justify-between items-center"
                >
                  <div>
                    <span className="font-bold text-[#1A365D] uppercase mr-2">
                      {h.status}
                    </span>
                    <span className="text-gray-600">{h.comment}</span>
                    {h.changedBy && (
                      <span className="text-gray-400 text-[10px] ml-2">
                        (by {h.changedBy})
                      </span>
                    )}
                  </div>
                  <span className="text-gray-400 text-[10px]">
                    {new Date(h.createdAt).toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
