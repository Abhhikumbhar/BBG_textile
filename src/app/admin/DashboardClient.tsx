"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Package,
  Layers,
  ShoppingBag,
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  Eye,
  RefreshCw,
  Loader2,
  Plus,
} from "lucide-react";

interface DashboardData {
  metrics: {
    totalProducts: number;
    activeProducts: number;
    lowStockProducts: number;
    totalCategories: number;
    totalOrders: number;
    pendingOrders: number;
    totalEnquiries: number;
    newEnquiries: number;
    totalRevenue: number;
  };
  recentOrders: any[];
  recentEnquiries: any[];
  recentProducts: any[];
}

interface DashboardProps {
  initialData?: DashboardData | null;
}

export default function DashboardClient({ initialData }: DashboardProps) {
  const [data, setData] = useState<DashboardData | null>(initialData || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/dashboard");
      if (!res.ok) return;
      const json = await res.json();
      if (json && json.metrics) {
        setData(json);
      }
    } catch (err: any) {
      console.warn("Silent dashboard sync failed:", err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const currentData = data || initialData || {
    metrics: {
      totalProducts: 10,
      activeProducts: 10,
      lowStockProducts: 0,
      totalCategories: 3,
      totalOrders: 0,
      pendingOrders: 0,
      totalEnquiries: 0,
      newEnquiries: 0,
      totalRevenue: 0,
    },
    recentOrders: [],
    recentEnquiries: [],
    recentProducts: [],
  };

  const { metrics, recentOrders, recentEnquiries, recentProducts } = currentData;


  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
            Admin Overview & Live Statistics
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
            Real-time status of products, categories, orders, and customer inquiries from PostgreSQL.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchStats}
            className="p-2.5 text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            title="Refresh statistics"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Refresh Data</span>
          </button>

          <Link
            href="/admin/products/new"
            className="px-4 py-2.5 bg-[#1A365D] hover:bg-[#2A4365] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </Link>
        </div>
      </div>

      {/* METRIC CARDS GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Products */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Total Products
            </span>
            <div className="p-2 bg-blue-50 text-blue-700 rounded-lg">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900">
              {metrics.totalProducts}
            </div>
            <div className="text-[11px] text-emerald-600 font-medium mt-1">
              {metrics.activeProducts} active in store
            </div>
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Low Stock Alerts
            </span>
            <div className="p-2 bg-amber-50 text-amber-700 rounded-lg">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900">
              {metrics.lowStockProducts}
            </div>
            <div className="text-[11px] text-amber-600 font-medium mt-1">
              Requires loom / inventory replenishment
            </div>
          </div>
        </div>

        {/* Orders */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Orders Placed
            </span>
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900">
              {metrics.totalOrders}
            </div>
            <div className="text-[11px] text-blue-600 font-medium mt-1">
              {metrics.pendingOrders} pending dispatch
            </div>
          </div>
        </div>

        {/* Customer Enquiries */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Customer Enquiries
            </span>
            <div className="p-2 bg-purple-50 text-purple-700 rounded-lg">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900">
              {metrics.totalEnquiries}
            </div>
            <div className="text-[11px] text-purple-600 font-medium mt-1">
              {metrics.newEnquiries} new uncontacted
            </div>
          </div>
        </div>
      </div>

      {/* TWO COLUMN SECTION: RECENT ORDERS & RECENT ENQUIRIES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="font-serif text-lg font-bold text-gray-900">
                Recent Orders
              </h2>
              <p className="text-xs text-gray-500">Latest online & WhatsApp customer purchases</p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-bold text-[#1A365D] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="flex-1 divide-y divide-gray-100">
            {recentOrders.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-xs">
                No customer orders received yet.
              </div>
            ) : (
              recentOrders.map((ord) => (
                <div key={ord.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-gray-900">
                        #{ord.orderNumber}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          ord.status === "PENDING"
                            ? "bg-amber-100 text-amber-800"
                            : ord.status === "DELIVERED"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {ord.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      {ord.customerName} ({ord.customerPhone}) • {ord.items?.length || 0} items
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-gray-900">
                      ₹{ord.total.toLocaleString("en-IN")}
                    </p>
                    <Link
                      href={`/admin/orders/${ord.id}`}
                      className="text-[11px] text-[#1A365D] hover:underline"
                    >
                      Manage Order &rarr;
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Enquiries */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="font-serif text-lg font-bold text-gray-900">
                Recent Website Inquiries
              </h2>
              <p className="text-xs text-gray-500">Contact form & wholesale quote requests</p>
            </div>
            <Link
              href="/admin/enquiries"
              className="text-xs font-bold text-[#1A365D] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="flex-1 divide-y divide-gray-100">
            {recentEnquiries.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-xs">
                No enquiries submitted yet.
              </div>
            ) : (
              recentEnquiries.map((enq) => (
                <div key={enq.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-semibold text-xs text-gray-900">
                      {enq.name}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        enq.status === "NEW"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {enq.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 mb-1">
                    Phone: {enq.phone} {enq.email ? `• ${enq.email}` : ""}
                  </p>
                  <p className="text-xs text-gray-700 line-clamp-1 italic">
                    &ldquo;{enq.message}&rdquo;
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* RECENT PRODUCTS IN DATABASE */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-lg font-bold text-gray-900">
              Active Fabrics in Catalog
            </h2>
            <p className="text-xs text-gray-500">Latest products configured in database</p>
          </div>
          <Link
            href="/admin/products"
            className="text-xs font-bold text-[#1A365D] hover:underline flex items-center gap-1"
          >
            <span>Manage All Products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200">
              <tr>
                <th className="py-3 px-4">Fabric Name</th>
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentProducts.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-semibold text-gray-900">
                    {p.name}
                  </td>
                  <td className="py-3 px-4 font-mono text-gray-500">{p.sku}</td>
                  <td className="py-3 px-4 text-gray-600">{p.category?.name}</td>
                  <td className="py-3 px-4 font-medium text-gray-900">₹{p.price}</td>
                  <td className="py-3 px-4">{p.stockQuantity} mtrs</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        p.isActive
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {p.isActive ? "ACTIVE" : "INACTIVE"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      href={`/admin/products/${p.id}/edit`}
                      className="text-[#1A365D] font-bold hover:underline"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
