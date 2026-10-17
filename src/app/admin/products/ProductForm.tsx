"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Upload,
  X,
  Plus,
  Trash2,
  Star,
  Check,
  AlertCircle,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { compressImage } from "@/lib/imageCompression";

interface Category {
  id: string;
  name: string;
}

interface ProductImage {
  id?: string;
  url: string;
  publicId?: string | null;
  altText?: string | null;
  displayOrder: number;
  isPrimary: boolean;
}

interface ProductVariant {
  id?: string;
  color?: string | null;
  size?: string | null;
  sku?: string | null;
  additionalPrice: number;
  stockQuantity: number;
}

interface ProductFormProps {
  initialData?: any;
  categories: Category[];
  isEdit?: boolean;
}

export default function ProductForm({
  initialData,
  categories,
  isEdit = false,
}: ProductFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    sku: initialData?.sku || "",
    description: initialData?.description || "",
    price: initialData?.price ?? 0,
    wholesalePrice: initialData?.wholesalePrice ?? "",
    categoryId: initialData?.categoryId || categories[0]?.id || "",
    stockQuantity: initialData?.stockQuantity ?? 100,
    stockStatus: initialData?.stockStatus || "IN_STOCK",
    isFeatured: initialData?.isFeatured ?? false,
    isNewArrival: initialData?.isNewArrival ?? false,
    isBestSeller: initialData?.isBestSeller ?? false,
    isEnquiryOnly: initialData?.isEnquiryOnly ?? false,
    isPurchasableOnline: initialData?.isPurchasableOnline ?? true,
    isActive: initialData?.isActive ?? true,
  });

  const [images, setImages] = useState<ProductImage[]>(
    initialData?.images || []
  );
  const [variants, setVariants] = useState<ProductVariant[]>(
    initialData?.variants || []
  );

  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manualImageUrl, setManualImageUrl] = useState("");

  const handleAddManualImage = () => {
    if (!manualImageUrl.trim()) return;
    const url = manualImageUrl.trim();
    setImages((prev) => [
      ...prev,
      {
        url,
        publicId: null,
        altText: formData.name || "Product Image",
        displayOrder: prev.length,
        isPrimary: prev.length === 0,
      },
    ]);
    setManualImageUrl("");
  };

  // Auto-slug generator from name if not editing
  const handleNameChange = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      name: val,
      slug: isEdit
        ? prev.slug
        : val
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, ""),
    }));
  };

  // Image Upload handler with automatic client-side compression
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError(null);

    try {
      const data = new FormData();
      for (let i = 0; i < files.length; i++) {
        const compressed = await compressImage(files[i], { maxWidth: 1600, quality: 0.82 });
        data.append("files", compressed);
      }

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: data,
      });

      const text = await res.text();
      let json: any = {};
      try {
        json = JSON.parse(text);
      } catch {
        throw new Error(
          res.status === 413
            ? "One or more images are too large. Please select smaller photos."
            : text.slice(0, 100) || "Failed to upload image"
        );
      }

      if (!res.ok) throw new Error(json.error || "Upload failed");

      const newUploadedImages: ProductImage[] = (json.images || []).map(
        (img: any, idx: number) => ({
          url: img.url,
          publicId: img.publicId,
          altText: formData.name,
          displayOrder: images.length + idx,
          isPrimary: images.length === 0 && idx === 0,
        })
      );

      setImages((prev) => [...prev, ...newUploadedImages]);
    } catch (err: any) {
      setError(err.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      const filtered = prev.filter((_, i) => i !== index);
      // Ensure at least one image is primary if available
      if (filtered.length > 0 && !filtered.some((img) => img.isPrimary)) {
        filtered[0].isPrimary = true;
      }
      return filtered;
    });
  };

  const setPrimaryImage = (index: number) => {
    setImages((prev) =>
      prev.map((img, i) => ({
        ...img,
        isPrimary: i === index,
      }))
    );
  };

  // Variant handlers
  const addVariant = () => {
    setVariants((prev) => [
      ...prev,
      {
        color: "",
        size: "1.60 Meter",
        sku: `${formData.sku}-${prev.length + 1}`,
        additionalPrice: 0,
        stockQuantity: 50,
      },
    ]);
  };

  const updateVariant = (index: number, field: string, value: any) => {
    setVariants((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [field]: value } : v))
    );
  };

  const removeVariant = (index: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      // Clean and sanitize images
      const validImages = images
        .filter(
          (img) =>
            img &&
            typeof img.url === "string" &&
            img.url.trim().length > 0
        )
        .map((img, idx) => ({
          ...img,
          url: img.url.trim(),
          displayOrder: idx,
          isPrimary:
            img.isPrimary ||
            (idx === 0 && !images.some((i) => i.isPrimary)),
        }));

      const payload = {
        ...formData,
        price: Number(formData.price),
        wholesalePrice:
          formData.wholesalePrice === "" ? null : Number(formData.wholesalePrice),
        stockQuantity: Number(formData.stockQuantity),
        images: validImages,
        variants: variants.map((v) => ({
          ...v,
          additionalPrice: Number(v.additionalPrice),
          stockQuantity: Number(v.stockQuantity),
        })),
      };

      const endpoint = isEdit
        ? `/api/admin/products/${initialData.id}`
        : "/api/admin/products";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      let json: any = {};
      try {
        json = JSON.parse(text);
      } catch {
        throw new Error(text.slice(0, 100) || "Failed to save product");
      }

      if (!res.ok) throw new Error(json.error || "Save failed");

      router.push("/admin/products");
    } catch (err: any) {
      setError(err.message || "Failed to save product");
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </Link>
        <span className="text-xs text-gray-400">
          {isEdit ? `Editing SKU: ${initialData?.sku}` : "Creating New Product"}
        </span>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm">
        <h1 className="font-serif text-2xl font-bold text-gray-900 mb-6">
          {isEdit ? "Update Product Details" : "Add New Textile Product"}
        </h1>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 1. Basic Information */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400">
              1. Basic Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Royal Oxford Pure Cotton Fabric"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#1A365D]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  SKU (Stock Keeping Unit) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.sku}
                  onChange={(e) =>
                    setFormData({ ...formData, sku: e.target.value.toUpperCase() })
                  }
                  placeholder="e.g. BBG-OXF-001"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-mono uppercase focus:ring-2 focus:ring-[#1A365D]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  URL Slug *
                </label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-mono text-gray-600 focus:ring-2 focus:ring-[#1A365D]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Category *
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) =>
                    setFormData({ ...formData, categoryId: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:ring-2 focus:ring-[#1A365D]"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Full Description & Fabric Specifications *
              </label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Mention weave count, yarn type (e.g. 60s combed cotton), width, GSM, wash instructions, and suitable applications..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#1A365D] resize-none"
              />
            </div>
          </div>

          {/* 2. Pricing & Stock */}
          <div className="space-y-4 pt-6 border-t border-gray-100">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400">
              2. Pricing & Inventory
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Price (₹ per meter) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: Number(e.target.value) })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Wholesale Price (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.wholesalePrice}
                  onChange={(e) =>
                    setFormData({ ...formData, wholesalePrice: e.target.value })
                  }
                  placeholder="Optional bulk rate"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Stock Quantity (Meters) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.stockQuantity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      stockQuantity: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Stock Status *
                </label>
                <select
                  value={formData.stockStatus}
                  onChange={(e) =>
                    setFormData({ ...formData, stockStatus: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm"
                >
                  <option value="IN_STOCK">In Stock</option>
                  <option value="LOW_STOCK">Low Stock</option>
                  <option value="OUT_OF_STOCK">Out of Stock</option>
                </select>
              </div>
            </div>
          </div>

          {/* 3. Product Flags & Configuration */}
          <div className="space-y-4 pt-6 border-t border-gray-100">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400">
              3. Visibility & Feature Badges
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <label className="flex items-center gap-2.5 p-3 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="rounded text-[#1A365D]"
                />
                <span className="text-xs font-semibold text-gray-800">
                  Active in Store
                </span>
              </label>

              <label className="flex items-center gap-2.5 p-3 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) =>
                    setFormData({ ...formData, isFeatured: e.target.checked })
                  }
                  className="rounded text-[#1A365D]"
                />
                <span className="text-xs font-semibold text-gray-800">
                  Featured on Home
                </span>
              </label>

              <label className="flex items-center gap-2.5 p-3 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={formData.isNewArrival}
                  onChange={(e) =>
                    setFormData({ ...formData, isNewArrival: e.target.checked })
                  }
                  className="rounded text-[#1A365D]"
                />
                <span className="text-xs font-semibold text-gray-800">
                  New Arrival
                </span>
              </label>

              <label className="flex items-center gap-2.5 p-3 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={formData.isBestSeller}
                  onChange={(e) =>
                    setFormData({ ...formData, isBestSeller: e.target.checked })
                  }
                  className="rounded text-[#1A365D]"
                />
                <span className="text-xs font-semibold text-gray-800">
                  Best Seller Badge
                </span>
              </label>

              <label className="flex items-center gap-2.5 p-3 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={formData.isPurchasableOnline}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      isPurchasableOnline: e.target.checked,
                    })
                  }
                  className="rounded text-[#1A365D]"
                />
                <span className="text-xs font-semibold text-gray-800">
                  Purchasable Online
                </span>
              </label>

              <label className="flex items-center gap-2.5 p-3 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={formData.isEnquiryOnly}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      isEnquiryOnly: e.target.checked,
                    })
                  }
                  className="rounded text-[#1A365D]"
                />
                <span className="text-xs font-semibold text-gray-800">
                  Wholesale Enquiry Only
                </span>
              </label>
            </div>
          </div>

          {/* 4. Product Images (Cloudinary & Local Uploader) */}
          <div className="space-y-4 pt-6 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  4. Product Photographs
                </h2>
                <p className="text-xs text-gray-500">
                  Upload actual fabric photographs. Click star to select primary preview.
                </p>
              </div>
              <label className="px-4 py-2 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-bold cursor-pointer transition-colors flex items-center gap-1.5 shadow-sm">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Photos</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>

            {uploading && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-blue-800 text-xs flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Uploading and optimizing image files...</span>
              </div>
            )}

            {/* Direct URL input bar for flexibility */}
            <div className="flex gap-2 items-center bg-gray-50/80 p-2.5 rounded-xl border border-gray-200/80">
              <input
                type="text"
                value={manualImageUrl}
                onChange={(e) => setManualImageUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddManualImage();
                  }
                }}
                placeholder="Or paste image URL (e.g. https://... or /uploads/...)"
                className="flex-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#1A365D]"
              />
              <button
                type="button"
                onClick={handleAddManualImage}
                disabled={!manualImageUrl.trim()}
                className="px-3.5 py-1.5 bg-gray-800 hover:bg-black disabled:opacity-40 text-white rounded-lg text-xs font-semibold transition-colors shrink-0"
              >
                Add Link
              </button>
            </div>

            {/* Images Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className={`relative aspect-[4/5] rounded-2xl overflow-hidden bg-gray-100 border-2 transition-all ${
                    img.isPrimary
                      ? "border-amber-500 ring-2 ring-amber-500/20"
                      : "border-gray-200"
                  }`}
                >
                  <Image
                    src={img.url}
                    alt={img.altText || `Product Image ${idx + 1}`}
                    fill
                    className="object-cover"
                  />

                  {/* Primary Star Indicator */}
                  <button
                    type="button"
                    onClick={() => setPrimaryImage(idx)}
                    className={`absolute top-2 left-2 p-1.5 rounded-lg shadow-sm transition-all ${
                      img.isPrimary
                        ? "bg-amber-500 text-white"
                        : "bg-white/80 text-gray-500 hover:text-amber-500 hover:bg-white"
                    }`}
                    title={img.isPrimary ? "Primary Image" : "Set as Primary"}
                  >
                    <Star className="w-3.5 h-3.5 fill-current" />
                  </button>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-2 right-2 p-1.5 bg-red-600/90 hover:bg-red-700 text-white rounded-lg shadow-sm transition-colors"
                    title="Delete Image"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>

                  {img.isPrimary && (
                    <span className="absolute bottom-2 left-2 right-2 py-0.5 text-[9px] font-bold text-center uppercase tracking-wider bg-amber-500 text-gray-950 rounded">
                      Primary Photo
                    </span>
                  )}
                </div>
              ))}

              {images.length === 0 && (
                <label className="border-2 border-dashed border-gray-300 rounded-2xl aspect-[4/5] flex flex-col items-center justify-center p-4 text-center cursor-pointer hover:border-gray-400 bg-gray-50 transition-colors">
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-xs font-semibold text-gray-700">
                    Click to Upload
                  </span>
                  <span className="text-[10px] text-gray-400 mt-0.5">
                    JPG, PNG, WebP up to 10MB
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* 5. Color & Size Variants */}
          <div className="space-y-4 pt-6 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  5. Available Shades & Cut Lengths
                </h2>
                <p className="text-xs text-gray-500">
                  Add color options, shirt lengths, suit lengths, or bulk rolls.
                </p>
              </div>
              <button
                type="button"
                onClick={addVariant}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Variant</span>
              </button>
            </div>

            <div className="space-y-3">
              {variants.map((v, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200"
                >
                  <input
                    type="text"
                    placeholder="Color (e.g. Sky Blue)"
                    value={v.color || ""}
                    onChange={(e) => updateVariant(idx, "color", e.target.value)}
                    className="w-full sm:w-1/4 px-3 py-1.5 rounded-lg border border-gray-200 text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Cut / Size (e.g. 1.60 Meter)"
                    value={v.size || ""}
                    onChange={(e) => updateVariant(idx, "size", e.target.value)}
                    className="w-full sm:w-1/4 px-3 py-1.5 rounded-lg border border-gray-200 text-xs"
                  />
                  <input
                    type="number"
                    placeholder="+Price (₹)"
                    value={v.additionalPrice}
                    onChange={(e) =>
                      updateVariant(idx, "additionalPrice", e.target.value)
                    }
                    className="w-full sm:w-1/5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs"
                  />
                  <input
                    type="number"
                    placeholder="Stock Qty"
                    value={v.stockQuantity}
                    onChange={(e) =>
                      updateVariant(idx, "stockQuantity", e.target.value)
                    }
                    className="w-full sm:w-1/5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => removeVariant(idx)}
                    className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg"
                    title="Remove variant"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {variants.length === 0 && (
                <p className="text-xs text-gray-400 italic">
                  No specific variants added. The product will be sold at the base price.
                </p>
              )}
            </div>
          </div>

          {/* Submit Actions */}
          <div className="pt-6 border-t border-gray-200 flex items-center justify-end gap-3">
            <Link
              href="/admin/products"
              className="px-6 py-3 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-semibold transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-3 bg-[#1A365D] hover:bg-[#2A4365] disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving to Database...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>{isEdit ? "Update Product" : "Save & Publish Product"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
