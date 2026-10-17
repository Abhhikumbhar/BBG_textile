"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  ShoppingBag,
  ExternalLink,
  Eye,
  Loader2,
  Calendar,
} from "lucide-react";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  city: string;
  state: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  total: number;
  createdAt: string;
  _count: { items: number };
}

interface OrdersAdminClientProps {
  initialOrders?: Order[];
}

export default function OrdersAdminClient({ initialOrders = [] }: OrdersAdminClientProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      const query = new URLSearchParams();
      if (search) query.set("search", search);
      if (statusFilter !== "ALL") query.set("status", statusFilter);

      const res = await fetch(`/api/admin/orders?${query.toString()}`);
      const data = await res.json();
      if (data?.orders) {
        setOrders(data.orders);
      }
    } catch {
      console.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [search, statusFilter]);


  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-amber-100 text-amber-800";
      case "CONFIRMED":
        return "bg-blue-100 text-blue-800";
      case "PROCESSING":
        return "bg-purple-100 text-purple-800";
      case "SHIPPED":
        return "bg-indigo-100 text-indigo-800";
      case "DELIVERED":
        return "bg-emerald-100 text-emerald-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
          Order Management & Dispatch
        </h1>
        <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
          View customer orders, update tracking statuses, and print transport invoices.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Order #, Customer Name, Phone..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#1A365D]"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium"
        >
          <option value="ALL">All Order Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="PROCESSING">Processing</option>
          <option value="SHIPPED">Shipped</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {loading && orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-6 h-6 text-[#1A365D] animate-spin mb-2" />
            <p className="text-gray-400 text-xs">Querying orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-xs">
            No orders found matching criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer Details</th>
                  <th className="py-3 px-4">Delivery City</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((ord) => {
                  const cleanPhone = ord.customerPhone.replace(/[^0-9]/g, "");
                  return (
                    <tr key={ord.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 font-mono font-bold text-gray-900">
                        #{ord.orderNumber}
                      </td>

                      <td className="py-3 px-4">
                        <p className="font-semibold text-gray-900">
                          {ord.customerName}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-gray-500 font-mono text-[11px]">
                            {ord.customerPhone}
                          </span>
                          <a
                            href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                              `Hello ${ord.customerName}, this is BBG Textile regarding your order #${ord.orderNumber}.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-600 hover:text-emerald-800"
                            title="Chat with Customer on WhatsApp"
                          >
                            <WhatsAppIcon className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-gray-600">
                        {ord.city}, {ord.state}
                      </td>

                      <td className="py-3 px-4 text-gray-500">
                        {new Date(ord.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      <td className="py-3 px-4 font-bold text-gray-900">
                        ₹{ord.total.toLocaleString("en-IN")}
                        <span className="block text-[10px] text-gray-400 font-normal">
                          {ord.paymentMethod}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getStatusBadge(
                            ord.status
                          )}`}
                        >
                          {ord.status}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <Link
                          href={`/admin/orders/${ord.id}`}
                          className="px-3 py-1.5 bg-[#1A365D] hover:bg-[#2A4365] text-white rounded-lg text-[11px] font-semibold inline-flex items-center gap-1 transition-colors"
                        >
                          <Eye className="w-3 h-3" />
                          <span>View & Update</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
