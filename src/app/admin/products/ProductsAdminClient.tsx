"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  Search,
  SlidersHorizontal,
  Edit,
  Trash2,
  ExternalLink,
  AlertCircle,
  Loader2,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  wholesalePrice?: number | null;
  stockQuantity: number;
  stockStatus: string;
  isFeatured: boolean;
  isActive: boolean;
  category: { id: string; name: string };
  images: { url: string }[];
}

// Module-level client cache for instant 0ms tab switching
let cachedAdminProducts: Product[] | null = null;
let cachedAdminCategories: Category[] | null = null;

interface ProductsAdminClientProps {
  initialProducts?: Product[];
  initialCategories?: Category[];
}

export default function ProductsAdminClient({
  initialProducts = [],
  initialCategories = [],
}: ProductsAdminClientProps) {
  const [products, setProducts] = useState<Product[]>(() => {
    if (initialProducts && initialProducts.length > 0) return initialProducts;
    if (cachedAdminProducts && cachedAdminProducts.length > 0) return cachedAdminProducts;
    return [];
  });
  const [categories, setCategories] = useState<Category[]>(() => {
    if (initialCategories && initialCategories.length > 0) return initialCategories;
    if (cachedAdminCategories && cachedAdminCategories.length > 0) return cachedAdminCategories;
    return [];
  });
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: string; msg: string } | null>(
    null
  );

  const fetchProducts = async () => {
    try {
      const query = new URLSearchParams();
      if (search) query.set("search", search);
      if (selectedCategory) query.set("categoryId", selectedCategory);
      if (statusFilter) query.set("status", statusFilter);

      const [prodRes, catRes] = await Promise.all([
        fetch(`/api/admin/products?${query.toString()}`),
        fetch("/api/admin/categories"),
      ]);

      if (prodRes.status === 401 || catRes.status === 401) {
        window.location.href = "/admin/login";
        return;
      }

      const prodData = await prodRes.json();
      const catData = await catRes.json();

      const prodList = prodData.products || [];
      const catList = catData.categories || [];

      if (!search && !selectedCategory && !statusFilter && prodList.length > 0) {
        cachedAdminProducts = prodList;
        cachedAdminCategories = catList;
      }

      setProducts(prodList);
      if (catList.length > 0) setCategories(catList);
    } catch {
      // Keep displaying current products quietly
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search, selectedCategory, statusFilter]);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to delete");

      setNotification({
        type: "success",
        msg: json.message || "Product deleted successfully",
      });
      cachedAdminProducts = null;
      fetchProducts();
    } catch (err: any) {
      setNotification({ type: "error", msg: err.message || "Failed to delete" });
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
            Product Catalogue Management
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
            Manage your fabric inventory, wholesale rates, shades, and client photographs.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="px-5 py-2.5 bg-[#1A365D] hover:bg-[#2A4365] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Fabric</span>
        </Link>
      </div>

      {notification && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center justify-between ${
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

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products by title, SKU..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#1A365D]"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium"
        >
          <option value="">All Statuses</option>
          <option value="active">Active Only</option>
          <option value="inactive">Inactive Only</option>
          <option value="low_stock">Low Stock (≤10 mtrs)</option>
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {products.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-xs">
            No products found matching the criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4">Photo</th>
                  <th className="py-3 px-4">Product Name & SKU</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Retail / Wholesale Price</th>
                  <th className="py-3 px-4">Inventory</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    {/* Thumbnail */}
                    <td className="py-3 px-4">
                      <div className="relative w-12 h-14 rounded-lg bg-gray-100 overflow-hidden border border-gray-200">
                        <Image
                          src={
                            p.images[0]?.url ||
                            "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=200&q=80"
                          }
                          alt={p.name}
                          fill
                          sizes="48px"
                          unoptimized={
                            p.images[0]?.url
                              ? p.images[0].url.startsWith("data:")
                              : false
                          }
                          className="object-cover"
                        />
                      </div>
                    </td>

                    {/* Name & SKU */}
                    <td className="py-3 px-4">
                      <p className="font-semibold text-gray-900 line-clamp-1">
                        {p.name}
                      </p>
                      <p className="font-mono text-[10px] text-gray-400 mt-0.5">
                        {p.sku}
                      </p>
                      {p.isFeatured && (
                        <span className="inline-block mt-1 px-1.5 py-0.5 bg-amber-100 text-amber-800 text-[9px] font-bold rounded">
                          Featured
                        </span>
                      )}
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4 text-gray-600">
                      {p.category?.name || "Uncategorized"}
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4">
                      <p className="font-bold text-gray-900">₹{p.price}</p>
                      {p.wholesalePrice && (
                        <p className="text-[10px] text-emerald-700">
                          WS: ₹{p.wholesalePrice}
                        </p>
                      )}
                    </td>

                    {/* Inventory */}
                    <td className="py-3 px-4">
                      <p className="font-medium text-gray-900">
                        {p.stockQuantity} meters
                      </p>
                      <span
                        className={`text-[10px] font-semibold ${
                          p.stockQuantity <= 10
                            ? "text-red-600"
                            : "text-emerald-600"
                        }`}
                      >
                        {p.stockStatus}
                      </span>
                    </td>

                    {/* Active Status */}
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          p.isActive
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {p.isActive ? "ACTIVE" : "INACTIVE"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/products/${p.slug}`}
                          target="_blank"
                          className="p-1.5 text-gray-400 hover:text-gray-700"
                          title="View on Storefront"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>

                        <Link
                          href={`/admin/products/${p.id}/edit`}
                          className="p-1.5 text-blue-600 hover:text-blue-800"
                          title="Edit Product"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>

                        {confirmDeleteId === p.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleDelete(p.id)}
                              disabled={deletingId === p.id}
                              className="px-2 py-1 bg-red-600 text-white rounded text-[10px] font-bold hover:bg-red-700"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(null)}
                              className="px-1.5 py-1 text-gray-500 text-[10px]"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmDeleteId(p.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
