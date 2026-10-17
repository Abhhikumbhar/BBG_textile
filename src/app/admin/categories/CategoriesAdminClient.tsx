"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Plus,
  Edit,
  Trash2,
  X,
  Upload,
  Check,
  AlertCircle,
  Loader2,
  Layers,
} from "lucide-react";
import { compressImage } from "@/lib/imageCompression";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  displayOrder: number;
  isActive: boolean;
  _count?: { products: number };
}

// Module-level client cache for instant 0ms tab switching
let cachedClientCategories: Category[] | null = null;

interface CategoriesAdminClientProps {
  initialCategories?: Category[];
}

export default function CategoriesAdminClient({
  initialCategories = [],
}: CategoriesAdminClientProps) {
  const [categories, setCategories] = useState<Category[]>(() => {
    if (initialCategories && initialCategories.length > 0) return initialCategories;
    if (cachedClientCategories && cachedClientCategories.length > 0) return cachedClientCategories;
    return [];
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    imageUrl: "",
    displayOrder: 0,
    isActive: true,
  });

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: string; msg: string } | null>(
    null
  );

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/admin/categories");
      if (res.status === 401) {
        window.location.href = "/admin/login";
        return;
      }
      const data = await res.json();
      const list = data.categories || [];
      if (list.length > 0) {
        cachedClientCategories = list;
        setCategories(list);
      }
    } catch {
      // Keep displaying current categories quietly
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormData({
      name: "",
      slug: "",
      description: "",
      imageUrl: "",
      displayOrder: categories.length + 1,
      isActive: true,
    });
    setError(null);
    setModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || "",
      imageUrl: cat.imageUrl || "",
      displayOrder: cat.displayOrder,
      isActive: cat.isActive,
    });
    setError(null);
    setModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      name: val,
      slug: editingCategory
        ? prev.slug
        : val
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, ""),
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      // High-efficiency compression for category banners/thumbnails (max 800px, WebP ~40KB)
      const optimizedFile = await compressImage(file, { maxWidth: 800, maxHeight: 800, quality: 0.8 });

      const data = new FormData();
      data.append("file", optimizedFile);
      const res = await fetch("/api/admin/upload", { method: "POST", body: data });
      
      const text = await res.text();
      let json: any = {};
      try {
        json = JSON.parse(text);
      } catch {
        throw new Error(
          res.status === 413
            ? "Image size is too large. Please select a smaller photo."
            : text.slice(0, 100) || "Failed to upload image"
        );
      }

      if (!res.ok) throw new Error(json.error || "Upload failed");
      setFormData((prev) => ({ ...prev, imageUrl: json.url }));
    } catch (err: any) {
      setError(err.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const endpoint = editingCategory
        ? `/api/admin/categories/${editingCategory.id}`
        : "/api/admin/categories";
      const method = editingCategory ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const text = await res.text();
      let json: any = {};
      try {
        json = JSON.parse(text);
      } catch {
        throw new Error(text.slice(0, 100) || "Failed to save category");
      }

      if (!res.ok) throw new Error(json.error || "Failed to save category");

      setNotification({
        type: "success",
        msg: `Category "${formData.name}" saved successfully`,
      });
      setModalOpen(false);
      cachedClientCategories = null;
      fetchCategories();
    } catch (err: any) {
      setError(err.message || "Failed to save category");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (cat: Category) => {
    if (
      !confirm(
        `Are you sure you want to delete category "${cat.name}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/categories/${cat.id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to delete");

      setNotification({ type: "success", msg: "Category deleted" });
      cachedClientCategories = null;
      fetchCategories();
    } catch (err: any) {
      setNotification({
        type: "error",
        msg: err.message || "Failed to delete category",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
            Category Management
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
            Organize products into distinct textile collections and manage homepage listings.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 bg-[#1A365D] hover:bg-[#2A4365] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
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

      {/* Categories Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {categories.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-xs">
            No categories found. Click &quot;Add New Category&quot; to create one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4">Image</th>
                  <th className="py-3 px-4">Category Name</th>
                  <th className="py-3 px-4">Slug</th>
                  <th className="py-3 px-4">Order</th>
                  <th className="py-3 px-4">Products Linked</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="relative w-12 h-10 rounded-lg bg-gray-100 overflow-hidden border border-gray-200">
                        {cat.imageUrl ? (
                          <Image
                            src={cat.imageUrl}
                            alt={cat.name}
                            fill
                            sizes="48px"
                            unoptimized={cat.imageUrl.startsWith("data:")}
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Layers className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <p className="font-semibold text-gray-900">{cat.name}</p>
                      {cat.description && (
                        <p className="text-[11px] text-gray-400 line-clamp-1">
                          {cat.description}
                        </p>
                      )}
                    </td>

                    <td className="py-3 px-4 font-mono text-gray-500">
                      {cat.slug}
                    </td>

                    <td className="py-3 px-4 font-medium text-gray-700">
                      {cat.displayOrder}
                    </td>

                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-700 font-bold rounded">
                        {cat._count?.products ?? 0} fabrics
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          cat.isActive
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {cat.isActive ? "ACTIVE" : "INACTIVE"}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(cat)}
                          className="p-1.5 text-blue-600 hover:text-blue-800"
                          title="Edit Category"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(cat)}
                          className="p-1.5 text-gray-400 hover:text-red-600"
                          title="Delete Category"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-serif text-xl font-bold text-gray-900">
                {editingCategory ? "Edit Category" : "Create New Category"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Cotton Shirting"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#1A365D]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Category Slug *
                </label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-mono text-gray-600 focus:ring-2 focus:ring-[#1A365D]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Brief description of this fabric type..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs resize-none focus:ring-2 focus:ring-[#1A365D]"
                />
              </div>

              {/* Image Upload & URL input */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Category Photograph / Cover
                </label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  {formData.imageUrl && (
                    <div className="relative w-16 h-12 rounded-lg overflow-hidden border border-gray-200 shrink-0 bg-gray-50">
                      <Image
                        src={formData.imageUrl}
                        alt="Preview"
                        fill
                        sizes="64px"
                        unoptimized={formData.imageUrl.startsWith("data:")}
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 w-full flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Paste image URL (or upload below)"
                      value={formData.imageUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, imageUrl: e.target.value.trim() })
                      }
                      className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#1A365D]"
                    />
                    <label className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold cursor-pointer transition-colors flex items-center gap-1.5 shrink-0">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploading ? "Compressing..." : "Upload"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
                <p className="text-[10px] text-gray-400 mt-1">
                  Photos are automatically compressed to lightweight WebP (&lt;50KB) for instant loading.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        displayOrder: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) =>
                        setFormData({ ...formData, isActive: e.target.checked })
                      }
                      className="rounded text-[#1A365D]"
                    />
                    <span className="text-xs font-semibold text-gray-700">
                      Active
                    </span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 hover:bg-gray-50 rounded-xl text-xs font-semibold text-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-[#1A365D] hover:bg-[#2A4365] text-white rounded-xl text-xs font-bold disabled:opacity-50 flex items-center gap-1.5"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Save Category</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
