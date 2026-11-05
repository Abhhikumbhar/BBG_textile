import React, { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import {
  getAllProducts,
  getCategories,
  saveProduct,
  deleteProduct,
} from "@/lib/catalogService";
import { syncProductsFromCloud, syncCategoriesFromCloud } from "@/lib/cloudSync";
import {
  Package,
  Plus,
  Minus,
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

export const AVAILABLE_SIZES = [
  "Free Size (28 - 34)",
  "Plus Size / XL-2XL (34 - 42)",
  "Free Size",
  "S (28)",
  "M (30)",
  "L (32)",
  "XL (34)",
  "2XL (36)",
  "3XL (38)",
  "4XL (40)",
  "Wholesale Pack (10 Pcs)",
  "Universal Stretch",
];

export const getProductSize = (p) => {
  if (p?.size) return p.size;
  if (p?.variants && p.variants.length > 0 && p.variants[0]?.size) {
    return p.variants[0].size;
  }
  return "Free Size (28 - 34)";
};

export default function AdminProducts() {
  const [products, setProducts] = useState(getAllProducts());
  const [categories, setCategories] = useState(getCategories());
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("");
  const [selectedSizeFilter, setSelectedSizeFilter] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = React.useRef(null);

  useEffect(() => {
    syncProductsFromCloud().then((cloudProds) => {
      if (cloudProds) setProducts(cloudProds);
    });
    syncCategoriesFromCloud().then((cloudCats) => {
      if (cloudCats) setCategories(cloudCats);
    });
  }, []);

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    sku: "",
    categoryId: "cat-churidar-leggings",
    size: "Free Size (28 - 34)",
    price: 349,
    wholesalePrice: 180,
    stockQuantity: 50,
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
      size: "Free Size (28 - 34)",
      price: 349,
      wholesalePrice: 180,
      stockQuantity: 50,
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
      size: getProductSize(p),
      price: p.price,
      wholesalePrice: p.wholesalePrice || 180,
      stockQuantity: typeof p.stockQuantity === "number" ? p.stockQuantity : 50,
      stockStatus: p.stockStatus || (p.stockQuantity <= 0 ? "OUT_OF_STOCK" : "IN_STOCK"),
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

    const selectedSize = formData.size || "Free Size (28 - 34)";
    const variants = editingProduct?.variants?.length
      ? editingProduct.variants.map((v) => ({ ...v, size: selectedSize }))
      : [
          {
            color: "Standard",
            size: selectedSize,
            additionalPrice: 0,
            stockQuantity: Number(formData.stockQuantity) || 50,
          },
        ];

    // Preserve full image gallery when saving or editing
    const existingImgs = editingProduct?.images || [];
    let finalImages = [];
    if (existingImgs.length > 0) {
      const isCustomNewImage = !existingImgs.some((img) => img.url === formData.imageUrl);
      if (isCustomNewImage) {
        finalImages = [
          {
            id: `img-${Date.now()}`,
            url: formData.imageUrl,
            isPrimary: true,
            displayOrder: 0,
          },
          ...existingImgs.map((img, i) => ({ ...img, isPrimary: false, displayOrder: i + 1 })),
        ];
      } else {
        const primary = existingImgs.find((img) => img.url === formData.imageUrl) || existingImgs[0];
        const rest = existingImgs.filter((img) => img !== primary);
        finalImages = [
          { ...primary, isPrimary: true, displayOrder: 0 },
          ...rest.map((img, i) => ({ ...img, isPrimary: false, displayOrder: i + 1 })),
        ];
      }
    } else {
      finalImages = [
        {
          id: `img-${Date.now()}`,
          url: formData.imageUrl,
          isPrimary: true,
          displayOrder: 0,
        },
      ];
    }

    const productPayload = {
      id: editingProduct?.id || `prod-${Date.now()}`,
      name: formData.name,
      slug,
      sku: formData.sku,
      size: selectedSize,
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
      images: finalImages,
      description: formData.description,
      variants,
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

  const handleQuickStockChange = (productId, delta) => {
    const list = [...products];
    const idx = list.findIndex((item) => item.id === productId);
    if (idx === -1) return;

    const currentQty = typeof list[idx].stockQuantity === "number" ? list[idx].stockQuantity : 50;
    const newQty = Math.max(0, currentQty + delta);
    const newStatus = newQty <= 0 ? "OUT_OF_STOCK" : "IN_STOCK";

    const updatedProduct = {
      ...list[idx],
      stockQuantity: newQty,
      stockStatus: newStatus,
    };

    const updatedList = saveProduct(updatedProduct);
    setProducts(updatedList);
  };

  const handleQuickSizeChange = (productId, newSize) => {
    const list = [...products];
    const idx = list.findIndex((item) => item.id === productId);
    if (idx === -1) return;

    const currentVariants =
      list[idx].variants && list[idx].variants.length > 0
        ? list[idx].variants.map((v) => ({ ...v, size: newSize }))
        : [
            {
              color: "Standard",
              size: newSize,
              additionalPrice: 0,
              stockQuantity: list[idx].stockQuantity || 50,
            },
          ];

    const updatedProduct = {
      ...list[idx],
      size: newSize,
      variants: currentVariants,
    };

    const updatedList = saveProduct(updatedProduct);
    setProducts(updatedList);
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
    const matchesSize =
      !selectedSizeFilter ||
      getProductSize(p).toLowerCase().includes(selectedSizeFilter.toLowerCase());
    return matchesSearch && matchesCat && matchesSize;
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

          <div className="flex items-center gap-2">
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

            <select
              value={selectedSizeFilter}
              onChange={(e) => setSelectedSizeFilter(e.target.value)}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 focus:outline-none"
            >
              <option value="">All Sizes</option>
              {AVAILABLE_SIZES.map((sz) => (
                <option key={sz} value={sz}>
                  {sz}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-500 uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">Item</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Size (आकार)</th>
                  <th className="py-3 px-4">Retail Price</th>
                  <th className="py-3 px-4">Wholesale Rate</th>
                  <th className="py-3 px-4">Stock (+ / -)</th>
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
                    <td className="py-3 px-4">
                      <div className="inline-block">
                        <select
                          value={getProductSize(p)}
                          onChange={(e) => handleQuickSizeChange(p.id, e.target.value)}
                          className="px-2.5 py-1.5 bg-gray-50 hover:bg-white border border-gray-300 rounded-xl text-xs font-semibold text-gray-800 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1A365D] transition-all shadow-2xs"
                          title="Change size"
                        >
                          {p.size && !AVAILABLE_SIZES.includes(p.size) && (
                            <option value={p.size}>{p.size}</option>
                          )}
                          {AVAILABLE_SIZES.map((sz) => (
                            <option key={sz} value={sz}>
                              {sz}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-bold text-gray-900">
                      ₹{p.price}
                    </td>
                    <td className="py-3 px-4 font-bold text-amber-700">
                      ₹{p.wholesalePrice || 180}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        {/* Quick Stock Controls [- count +] */}
                        <div className="inline-flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white shadow-xs">
                          <button
                            type="button"
                            onClick={() => handleQuickStockChange(p.id, -1)}
                            disabled={(p.stockQuantity ?? 50) <= 0}
                            className="w-7 h-7 flex items-center justify-center text-gray-700 hover:bg-gray-100 disabled:opacity-25 disabled:cursor-not-allowed font-bold transition-colors cursor-pointer"
                            title="Decrease stock (-1)"
                            aria-label="Decrease stock"
                          >
                            <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                          </button>

                          <span
                            className={`px-2.5 py-1 text-xs font-mono font-bold min-w-[2.2rem] text-center ${
                              (p.stockQuantity ?? 50) <= 0
                                ? "text-red-600 bg-red-50/60"
                                : (p.stockQuantity ?? 50) <= 10
                                ? "text-amber-700 bg-amber-50/70"
                                : "text-gray-900 bg-gray-50/60"
                            }`}
                            title={`Current stock: ${p.stockQuantity ?? 50}`}
                          >
                            {p.stockQuantity ?? 50}
                          </span>

                          <button
                            type="button"
                            onClick={() => handleQuickStockChange(p.id, +1)}
                            className="w-7 h-7 flex items-center justify-center text-gray-700 hover:bg-gray-100 font-bold transition-colors cursor-pointer"
                            title="Increase stock (+1)"
                            aria-label="Increase stock"
                          >
                            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                          </button>
                        </div>

                        {/* Status Badge */}
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            (p.stockQuantity ?? 50) <= 0 || p.stockStatus === "OUT_OF_STOCK"
                              ? "bg-red-100 text-red-800 border border-red-200"
                              : (p.stockQuantity ?? 50) <= 10
                              ? "bg-amber-100 text-amber-800 border border-amber-300"
                              : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                          }`}
                        >
                          {(p.stockQuantity ?? 50) <= 0 || p.stockStatus === "OUT_OF_STOCK"
                            ? "Out of Stock"
                            : (p.stockQuantity ?? 50) <= 10
                            ? "Limited Stock"
                            : "In Stock"}
                        </span>
                      </div>
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
                      Category *
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

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Size / आकार (Dropdown) *
                  </label>
                  <select
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-medium text-xs text-gray-800"
                  >
                    {formData.size && !AVAILABLE_SIZES.includes(formData.size) && (
                      <option value={formData.size}>{formData.size}</option>
                    )}
                    {AVAILABLE_SIZES.map((sz) => (
                      <option key={sz} value={sz}>
                        {sz}
                      </option>
                    ))}
                  </select>
                  <p className="text-[10px] text-gray-400 mt-1">उत्पादनाचा मुख्य आकार किंवा प्रकार निवडा</p>
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

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      Stock Quantity (Default: 5)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={formData.stockQuantity}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setFormData({
                          ...formData,
                          stockQuantity: val,
                          stockStatus: val <= 0 ? "OUT_OF_STOCK" : "IN_STOCK",
                        });
                      }}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold"
                    />
                    <p className="text-[10px] text-gray-400 mt-0.5">५ ऑर्डर झाल्यावर उत्पादन आपोआप क्लोज होईल</p>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      Stock Status
                    </label>
                    <select
                      value={formData.stockStatus}
                      onChange={(e) => setFormData({ ...formData, stockStatus: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold"
                    >
                      <option value="IN_STOCK">IN_STOCK (ऑर्डर सुरू)</option>
                      <option value="OUT_OF_STOCK">OUT_OF_STOCK (ऑर्डर बंद)</option>
                    </select>
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
