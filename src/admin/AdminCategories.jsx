import React, { useState } from "react";
import AdminLayout from "./AdminLayout";
import {
  getCategories,
  saveCategory,
  deleteCategory,
  getAllProducts,
} from "@/lib/catalogService";
import { Layers, Plus, Trash2, Edit2, X, Upload, Loader2, Image as ImageIcon } from "lucide-react";

export default function AdminCategories() {
  const [categoriesList, setCategoriesList] = useState(getCategories());
  const products = getAllProducts();
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = React.useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file (JPG, PNG, WEBP).");
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
        setImageUrl(compressed);
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


  const handleOpenAdd = () => {
    setEditingCategory(null);
    setName("");
    setSlug("");
    setDescription("");
    setImageUrl("/images/products/bbg-studio-hd-crimson-red.jpg");
    setShowModal(true);
  };

  const handleOpenEdit = (c) => {
    setEditingCategory(c);
    setName(c.name);
    setSlug(c.slug);
    setDescription(c.description || "");
    setImageUrl(c.imageUrl || "");
    setShowModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const finalSlug =
      slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const payload = {
      id: editingCategory?.id || `cat-${Date.now()}`,
      name,
      slug: finalSlug,
      description,
      imageUrl,
      displayOrder: editingCategory?.displayOrder || categoriesList.length + 1,
    };

    const updated = saveCategory(payload);
    setCategoriesList(updated);
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      const updated = deleteCategory(id);
      setCategoriesList(updated);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
              Category Management
            </h1>
            <p className="text-gray-500 text-xs sm:text-sm">
              Manage textile & garment categories for customer filtering
            </p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1A365D] hover:bg-[#0F2444] text-white rounded-xl text-xs font-bold shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoriesList.map((cat) => {
            const count = products.filter(
              (p) =>
                p.categorySlug === cat.slug ||
                p.category?.slug === cat.slug ||
                p.categoryId?.includes(cat.slug)
            ).length;

            return (
              <div
                key={cat.id}
                className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[16/9] bg-gray-100 overflow-hidden">
                    <img
                      src={cat.imageUrl || "/images/products/bbg-studio-hd-crimson-red.jpg"}
                      alt={cat.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] text-white font-bold">
                      <span>{count} Products</span>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="font-serif text-base font-bold text-gray-900 mb-1">
                      {cat.name}
                    </h3>
                    <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed">
                      {cat.description || "Premium mill bottom wear category"}
                    </p>
                    <div className="text-[11px] font-mono text-gray-400 mt-2">
                      Slug: {cat.slug}
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleOpenEdit(cat)}
                    className="p-1.5 text-gray-600 hover:text-[#1A365D] rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="font-serif text-lg font-bold text-gray-900">
                  {editingCategory ? "Edit Category" : "Add New Category"}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Slug
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="e.g. churidar-leggings"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Category Photo / Banner
                  </label>

                  {/* Live Thumbnail Preview */}
                  {imageUrl && (
                    <div className="relative w-full h-28 mb-2 rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center group">
                      <img
                        src={imageUrl}
                        alt="Category Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setImageUrl("")}
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
                      id="category-photo-file-input"
                    />

                    <label
                      htmlFor="category-photo-file-input"
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
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
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
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#1A365D] text-white rounded-xl font-bold shadow-sm"
                  >
                    Save Category
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
