import React, { useState } from "react";
import AdminLayout from "./AdminLayout";
import {
  getAllProducts,
  getCategories,
  saveProduct,
  deleteProduct,
} from "@/lib/catalogService";
import {
  Package,
  Plus,
  Search,
  Trash2,
  Edit2,
  Check,
  X,
  ExternalLink,
  SlidersHorizontal,
  Upload,
  Loader2,
} from "lucide-react";

export default function AdminProducts() {
  const [products, setProducts] = useState(getAllProducts());
  const categories = getCategories();
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = React.useRef(null);

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    sku: "",
    categoryId: "cat-churidar-leggings",
    price: 349,
    wholesalePrice: 180,
    stockQuantity: 100,
    stockStatus: "IN_STOCK",
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: false,
    imageUrl: "/images/products/bbg-studio-hd-crimson-red.jpg",
    description: "Premium 4-way stretch super-combed cotton lycra with bio-washed softness.",
  });

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      slug: "",
      sku: `BBG-${Math.floor(100 + Math.random() * 900)}`,
      categoryId: categories[0]?.slug || "churidar-leggings",
      price: 349,
      wholesalePrice: 180,
      stockQuantity: 100,
      stockStatus: "IN_STOCK",
      isFeatured: true,
      isNewArrival: false,
      isBestSeller: false,
      imageUrl: "/images/products/bbg-studio-hd-crimson-red.jpg",
      description: "Premium 4-way stretch super-combed cotton lycra with bio-washed softness.",
    });
    setShowModal(true);
  };

  const handleOpenEdit = (p) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      slug: p.slug,
      sku: p.sku,
      categoryId: p.categorySlug || p.category?.slug || "churidar-leggings",
      price: p.price,
      wholesalePrice: p.wholesalePrice || 180,
      stockQuantity: p.stockQuantity || 100,
      stockStatus: p.stockStatus || "IN_STOCK",
      isFeatured: !!p.isFeatured,
      isNewArrival: !!p.isNewArrival,
      isBestSeller: !!p.isBestSeller,
      imageUrl: p.images?.[0]?.url || "/images/products/bbg-studio-hd-crimson-red.jpg",
      description: p.description || "",
    });
    setShowModal(true);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }

    setUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const maxDimension = 800;
        let width = img.width;
        let height = img.height;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        const compressed =
          canvas.toDataURL("image/webp", 0.82) || canvas.toDataURL("image/jpeg", 0.82);
        setFormData((prev) => ({ ...prev, imageUrl: compressed }));
        setUploading(false);
      };
      img.onerror = () => {
        alert("Failed to load image preview.");
        setUploading(false);
      };
      img.src = event.target.result;
    };
    reader.onerror = () => {
      alert("Failed to read image file.");
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const slug =
      formData.slug ||
      formData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const productPayload = {
      id: editingProduct?.id || `prod-${Date.now()}`,
      name: formData.name,
      slug,
      sku: formData.sku,
      price: Number(formData.price),
      wholesalePrice: Number(formData.wholesalePrice),
      stockQuantity: Number(formData.stockQuantity),
      stockStatus: formData.stockStatus,
      isFeatured: formData.isFeatured,
      isNewArrival: formData.isNewArrival,
      isBestSeller: formData.isBestSeller,
      categorySlug: formData.categoryId,
      category: {
        id: formData.categoryId,
        name: categories.find((c) => c.slug === formData.categoryId)?.name || "Bottom Wear",
        slug: formData.categoryId,
      },
      images: [
        {
          id: `img-${Date.now()}`,
          url: formData.imageUrl,
          isPrimary: true,
          displayOrder: 0,
        },
      ],
      description: formData.description,
      variants: editingProduct?.variants || [
        { color: "Standard", size: "Free Size", additionalPrice: 0, stockQuantity: 100 },
      ],
      createdAt: editingProduct?.createdAt || new Date().toISOString(),
    };

    const updated = saveProduct(productPayload);
    setProducts(updated);
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to remove this product?")) {
      const updated = deleteProduct(id);
      setProducts(updated);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCat =
      !selectedCat ||
      p.categorySlug === selectedCat ||
      p.category?.slug === selectedCat;
    return matchesSearch && matchesCat;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
              Product Management
            </h1>
            <p className="text-gray-500 text-xs sm:text-sm">
              Manage your cotton lycra leggings, shorts, and fabric catalog
            </p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1A365D] hover:bg-[#0F2444] text-white rounded-xl text-xs font-bold shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by product name or SKU..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#1A365D]"
            />
          </div>

          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 focus:outline-none"
          >
            <option value="">All Categories ({products.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-500 uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">Item</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Retail Price</th>
                  <th className="py-3 px-4">Wholesale Rate</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images?.[0]?.url || "/images/products/bbg-studio-hd-cs-white.jpg"}
                          alt={p.name}
                          className="w-12 h-12 rounded-xl object-cover bg-gray-100 shrink-0 border border-gray-200"
                        />
                        <div>
                          <div className="font-bold text-gray-900 line-clamp-1">
                            {p.name}
                          </div>
                          <div className="text-[11px] text-gray-400 font-mono">
                            SKU: {p.sku}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600 font-medium">
                      {p.category?.name || p.categorySlug || "Bottom Wear"}
                    </td>
                    <td className="py-3 px-4 font-bold text-gray-900">
                      ₹{p.price}
                    </td>
                    <td className="py-3 px-4 font-bold text-amber-700">
                      ₹{p.wholesalePrice || 180}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {p.stockStatus || "IN_STOCK"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-1.5 text-gray-500 hover:text-[#1A365D] hover:bg-gray-100 rounded-lg transition-colors"
                        title="Edit Product"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal for Add / Edit */}
        {showModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="font-serif text-lg font-bold text-gray-900">
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      SKU Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      value={formData.categoryId}
                      onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.slug}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      Retail Price (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      Wholesale Rate (₹)
                    </label>
                    <input
                      type="number"
                      value={formData.wholesalePrice}
                      onChange={(e) => setFormData({ ...formData, wholesalePrice: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Product Photograph
                  </label>

                  {/* Live Thumbnail Preview */}
                  {formData.imageUrl && (
                    <div className="relative w-full h-28 mb-2 rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center group">
                      <img
                        src={formData.imageUrl}
                        alt="Product Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, imageUrl: "" }))}
                        className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-red-600 text-white rounded-full transition-colors shadow-xs"
                        title="Remove image"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Upload Button from Device / Mobile Gallery */}
                  <div className="space-y-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="product-photo-file-input"
                    />

                    <label
                      htmlFor="product-photo-file-input"
                      className={`w-full py-2.5 px-3 rounded-xl border-2 border-dashed border-amber-500/40 hover:border-amber-600 bg-amber-50/60 hover:bg-amber-100/70 text-amber-900 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all ${
                        uploading ? "opacity-60 pointer-events-none" : ""
                      }`}
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-amber-700" />
                          <span>Optimizing photo...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 text-amber-700" />
                          <span>Upload Photo from Device / Gallery</span>
                        </>
                      )}
                    </label>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] uppercase font-bold text-gray-400 shrink-0">or Paste URL:</span>
                      <input
                        type="text"
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                        placeholder="https://... or /images/..."
                        className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg font-mono text-[11px]"
                      />
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1">
                    Uploaded photos are automatically optimized for instant high-speed loading.
                  </p>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Short Description
                  </label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
                  />
                </div>

                <div className="flex items-center gap-4 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer font-medium">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    />
                    <span>Featured</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-medium">
                    <input
                      type="checkbox"
                      checked={formData.isBestSeller}
                      onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                    />
                    <span>Best Seller</span>
                  </label>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#1A365D] hover:bg-[#0F2444] text-white rounded-xl font-bold shadow-sm"
                  >
                    {editingProduct ? "Update Product" : "Create Product"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
