import React, { useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import {
  siteSettings,
  categories,
  allProducts,
} from "@/lib/catalogService";
import {
  Search,
  X,
  Sparkles,
  Crown,
  Flame,
  RotateCcw,
  SlidersHorizontal,
} from "lucide-react";

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const selectedCategory = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "newest";
  const featuredOnly = searchParams.get("featured") === "true";
  const newArrivalOnly = searchParams.get("newArrival") === "true";
  const bestSellerOnly = searchParams.get("bestSeller") === "true";

  const updateParam = (key, value) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) {
        next.set(key, value);
      } else {
        next.delete(key);
      }
      return next;
    });
  };

  const resetFilters = () => {
    setSearch("");
    setSearchParams({});
  };

  // Filter products
  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          (p.category?.name && p.category.name.toLowerCase().includes(q))
      );
    }

    if (selectedCategory) {
      if (selectedCategory === "cycling-shorts" || selectedCategory === "tight-shorts") {
        result = result.filter(
          (p) =>
            p.category?.slug === "cycling-shorts" ||
            p.categorySlug === "cycling-shorts" ||
            p.slug.includes("cycling") ||
            p.sku.includes("CS")
        );
      } else if (selectedCategory === "churidar-leggings") {
        result = result.filter(
          (p) =>
            p.category?.slug === "churidar-leggings" ||
            p.categorySlug === "churidar-leggings" ||
            p.slug.includes("churidar") ||
            p.sku.includes("LEG")
        );
      } else {
        result = result.filter(
          (p) => p.category?.slug === selectedCategory || p.categorySlug === selectedCategory
        );
      }
    }

    if (featuredOnly) result = result.filter((p) => p.isFeatured);
    if (newArrivalOnly) result = result.filter((p) => p.isNewArrival);
    if (bestSellerOnly) result = result.filter((p) => p.isBestSeller);

    if (sort === "price_asc") result.sort((a, b) => a.price - b.price);
    else if (sort === "price_desc") result.sort((a, b) => b.price - a.price);
    else if (sort === "popular")
      result.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));

    return result;
  }, [search, selectedCategory, sort, featuredOnly, newArrivalOnly, bestSellerOnly]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFDFD]">
      <Header settings={siteSettings} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 w-full">
        {/* Page Title & Breadcrumbs */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Women's Bottom Wear Collection
          </h1>
          <p className="text-gray-500 text-sm max-w-2xl">
            Explore our complete collection: Premium 4-Way Stretch Churidar Leggings (Full Length Pants) and Cotton Lycra Tight Shorts manufactured with super-combed yarns in Sangli.
          </p>
        </div>

        {/* Search, Filter & Sort Bar */}
        <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-gray-200/80 shadow-xs mb-8 space-y-3.5 sm:space-y-4">
          {/* Row 1: Search Box & Sort Dropdown */}
          <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-4 items-stretch sm:items-center justify-between">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by fabric name, color, or SKU..."
                className="w-full pl-10 pr-9 py-2.5 bg-gray-50/90 border border-gray-200/90 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1A365D] focus:bg-white transition-all placeholder:text-gray-400"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
                  title="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-gray-400 hidden sm:inline" />
              <select
                value={sort}
                onChange={(e) => updateParam("sort", e.target.value)}
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1A365D]"
              >
                <option value="newest">Sort by: Newest First</option>
                <option value="popular">Sort by: Most Popular</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Row 2: Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => updateParam("category", "")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${
                !selectedCategory
                  ? "bg-[#1A365D] text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              All Bottom Wear ({allProducts.length})
            </button>
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.slug;
              return (
                <button
                  key={cat.id}
                  onClick={() => updateParam("category", isSelected ? "" : cat.slug)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${
                    isSelected
                      ? "bg-[#1A365D] text-white shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>

          {/* Row 3: Quick Filter Chips (Best Seller, New Arrival, Featured) */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100 text-xs">
            <button
              onClick={() =>
                updateParam("bestSeller", bestSellerOnly ? "" : "true")
              }
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition-colors ${
                bestSellerOnly
                  ? "bg-amber-100 text-amber-900 border border-amber-300"
                  : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-600" />
              <span>Best Sellers</span>
            </button>

            <button
              onClick={() =>
                updateParam("newArrival", newArrivalOnly ? "" : "true")
              }
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition-colors ${
                newArrivalOnly
                  ? "bg-blue-100 text-blue-900 border border-blue-300"
                  : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>New Arrivals</span>
            </button>

            <button
              onClick={() =>
                updateParam("featured", featuredOnly ? "" : "true")
              }
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition-colors ${
                featuredOnly
                  ? "bg-purple-100 text-purple-900 border border-purple-300"
                  : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"
              }`}
            >
              <Crown className="w-3.5 h-3.5 text-purple-600" />
              <span>Featured</span>
            </button>

            {(search || selectedCategory || featuredOnly || newArrivalOnly || bestSellerOnly) && (
              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-gray-500 hover:text-red-600 text-xs transition-colors ml-auto"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset All</span>
              </button>
            )}
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 p-8 shadow-sm max-w-lg mx-auto">
            <h3 className="font-serif text-lg font-bold text-gray-800 mb-2">
              No products found
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              We couldn't find any products matching your selected filters. Try clearing your search or category filters.
            </p>
            <button
              onClick={resetFilters}
              className="px-5 py-2.5 bg-[#1A365D] hover:bg-[#2A4365] text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-2"
            >
              <span>View All Products</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                whatsappNumber={siteSettings?.whatsappNumber}
              />
            ))}
          </div>
        )}
      </main>

      <Footer settings={siteSettings} />
    </div>
  );
}
