import React from "react";
import { Link } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import {
  getAllProducts,
  getCategories,
  getOrders,
  getEnquiries,
  getSiteSettings,
} from "@/lib/catalogService";
import {
  Package,
  Layers,
  ShoppingBag,
  MessageSquare,
  TrendingUp,
  ArrowRight,
  Plus,
  CheckCircle2,
  AlertCircle,
  Eye,
  Sliders,
} from "lucide-react";

export default function AdminDashboard() {
  const products = getAllProducts();
  const categories = getCategories();
  const orders = getOrders();
  const enquiries = getEnquiries();
  const settings = getSiteSettings();

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const pendingOrders = orders.filter((o) => o.status === "PENDING" || !o.status).length;

  const metrics = [
    {
      label: "Total Products",
      value: products.length,
      subtext: "In active catalog",
      icon: Package,
      color: "from-blue-600 to-indigo-600",
      link: "/admin/products",
    },
    {
      label: "Categories",
      value: categories.length,
      subtext: "Bottom wear & fabrics",
      icon: Layers,
      color: "from-amber-500 to-amber-700",
      link: "/admin/categories",
    },
    {
      label: "Orders Registered",
      value: orders.length,
      subtext: `${pendingOrders} pending confirmation`,
      icon: ShoppingBag,
      color: "from-emerald-600 to-teal-700",
      link: "/admin/orders",
    },
    {
      label: "Total Sales",
      value: `₹${totalRevenue.toLocaleString("en-IN")}`,
      subtext: "Wholesale & retail volume",
      icon: TrendingUp,
      color: "from-purple-600 to-purple-800",
      link: "/admin/orders",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Top Welcome */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
              Welcome, Administrator
            </h1>
            <p className="text-gray-500 text-xs sm:text-sm">
              Live management overview for {settings?.businessName || "SBBG BHARAT TEXTILE"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/admin/products"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1A365D] hover:bg-[#0F2444] text-white text-xs font-bold shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </Link>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {metrics.map((m) => {
            const Icon = m.icon;
            return (
              <Link
                key={m.label}
                to={m.link}
                className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {m.label}
                  </span>
                  <div
                    className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${m.color} text-white flex items-center justify-center shadow-xs`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                    {m.value}
                  </div>
                  <div className="text-xs text-gray-400 font-medium">
                    {m.subtext}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Quick Actions Bar */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs">
          <h2 className="font-serif text-base font-bold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Link
              to="/admin/products"
              className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/60 hover:bg-blue-100/60 transition-all flex flex-col items-center text-center gap-2"
            >
              <Package className="w-6 h-6 text-[#1A365D]" />
              <span className="text-xs font-bold text-gray-900">Manage Products</span>
            </Link>

            <Link
              to="/admin/categories"
              className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/60 hover:bg-amber-100/60 transition-all flex flex-col items-center text-center gap-2"
            >
              <Layers className="w-6 h-6 text-amber-700" />
              <span className="text-xs font-bold text-gray-900">Categories</span>
            </Link>

            <Link
              to="/admin/orders"
              className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/60 hover:bg-emerald-100/60 transition-all flex flex-col items-center text-center gap-2"
            >
              <ShoppingBag className="w-6 h-6 text-emerald-700" />
              <span className="text-xs font-bold text-gray-900">View Orders</span>
            </Link>

            <Link
              to="/admin/settings"
              className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200/60 hover:bg-purple-100/60 transition-all flex flex-col items-center text-center gap-2"
            >
              <Sliders className="w-6 h-6 text-purple-700" />
              <span className="text-xs font-bold text-gray-900">Store Settings</span>
            </Link>
          </div>
        </div>

        {/* Split Grid: Recent Orders & Recent Products */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs">
            <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
              <h3 className="font-serif text-base font-bold text-gray-900">
                Recent Orders ({orders.length})
              </h3>
              <Link
                to="/admin/orders"
                className="text-xs font-bold text-[#1A365D] hover:underline"
              >
                View All
              </Link>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-12 text-gray-400 text-xs">
                No orders registered yet. New customer orders will show here.
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {orders.slice(0, 5).map((o) => (
                  <div key={o.orderNumber} className="py-3 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-xs text-gray-900">
                        #{o.orderNumber}
                      </div>
                      <div className="text-[11px] text-gray-500">
                        {o.customerName} • {o.customerPhone}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-xs text-[#1A365D]">
                        ₹{(o.total || 0).toLocaleString("en-IN")}
                      </div>
                      <span className="inline-block px-2 py-0.5 text-[9px] font-bold rounded bg-amber-100 text-amber-800">
                        {o.status || "PENDING"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top Products */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs">
            <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
              <h3 className="font-serif text-base font-bold text-gray-900">
                Active Catalog Items ({products.length})
              </h3>
              <Link
                to="/admin/products"
                className="text-xs font-bold text-[#1A365D] hover:underline"
              >
                Manage
              </Link>
            </div>

            <div className="divide-y divide-gray-100">
              {products.slice(0, 5).map((p) => (
                <div key={p.id} className="py-3 flex items-center gap-3">
                  <img
                    src={p.images?.[0]?.url || "/images/products/bbg-studio-hd-cs-white.jpg"}
                    alt={p.name}
                    className="w-10 h-10 rounded-lg object-cover bg-gray-100 shrink-0 border border-gray-200"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-gray-900 truncate">
                      {p.name}
                    </h4>
                    <p className="text-[11px] text-gray-400 font-mono">
                      SKU: {p.sku}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs font-bold text-[#1A365D]">
                      ₹{p.price}
                    </div>
                    <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                      In Stock
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
