"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2,
  PackageOpen,
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  wholesalePrice?: number | null;
  isEnquiryOnly: boolean;
  isPurchasableOnline: boolean;
  stockQuantity: number;
  stockStatus: string;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  category?: { name: string; slug: string };
  images?: { url: string; altText?: string | null }[];
  variants?: { color?: string | null; size?: string | null }[];
}

export default function ProductsClient({
  categories,
  initialProducts = [],
  initialPagination = { page: 1, limit: 12, total: 0, totalPages: 1 },
  whatsappNumber,
}: {
  categories: Category[];
  initialProducts?: Product[];
  initialPagination?: { page: number; limit: number; total: number; totalPages: number };
  whatsappNumber?: string;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");
  const [featuredOnly, setFeaturedOnly] = useState(searchParams.get("featured") === "true");
  const [newArrivalOnly, setNewArrivalOnly] = useState(searchParams.get("newArrival") === "true");
  const [bestSellerOnly, setBestSellerOnly] = useState(searchParams.get("bestSeller") === "true");
  const [page, setPage] = useState(parseInt(searchParams.get("page") || "1"));

  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [pagination, setPagination] = useState(initialPagination);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const masterList = React.useRef<Product[]>(initialProducts);
  if (initialProducts.length > masterList.current.length) {
    masterList.current = initialProducts;
  }

  // Instant in-memory filter helper
  const filterLocally = (
    master: Product[],
    sTerm: string,
    cat: string,
    srt: string,
    feat: boolean,
    newArr: boolean,
    best: boolean
  ) => {
    let result = [...master];
    if (sTerm.trim()) {
      const q = sTerm.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          (p.category?.name && p.category.name.toLowerCase().includes(q))
      );
    }
    if (cat) {
      if (cat === "womens-bottom-wear") {
        result = result.filter(
          (p) =>
            p.category?.slug === "womens-bottom-wear" ||
            p.category?.slug === "cycling-shorts" ||
            p.category?.slug === "churidar-leggings" ||
            p.category?.slug === "tight-shorts"
        );
      } else if (cat === "cycling-shorts" || cat === "tight-shorts") {
        result = result.filter(
          (p) =>
            p.category?.slug === "cycling-shorts" ||
            p.category?.slug === "tight-shorts" ||
            p.slug.includes("cycling") ||
            p.sku.includes("CS")
        );
      } else if (cat === "churidar-leggings") {
        result = result.filter(
          (p) =>
            p.category?.slug === "churidar-leggings" ||
            p.slug.includes("churidar") ||
            p.sku.includes("LEG")
        );
      } else {
        result = result.filter((p) => p.category?.slug === cat);
      }
    }
    if (feat) result = result.filter((p) => p.isFeatured);
    if (newArr) result = result.filter((p) => p.isNewArrival);
    if (best) result = result.filter((p) => p.isBestSeller);

    if (srt === "price_asc") result.sort((a, b) => a.price - b.price);
    else if (srt === "price_desc") result.sort((a, b) => b.price - a.price);
    else if (srt === "popular") result.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));

    return result;
  };

  // Instant filter execution on state change (0ms latency)
  useEffect(() => {
    if (masterList.current.length > 0) {
      const filtered = filterLocally(
        masterList.current,
        search,
        selectedCategory,
        sort,
        featuredOnly,
        newArrivalOnly,
        bestSellerOnly
      );
      setProducts(filtered.slice((page - 1) * 12, page * 12));
      setPagination({
        page,
        limit: 12,
        total: filtered.length,
        totalPages: Math.ceil(filtered.length / 12) || 1,
      });
      setLoading(false);
      return;
    }

    // Fallback: only if master list is completely empty
    let ignore = false;
    setLoading(true);
    setError(null);

    const query = new URLSearchParams();
    if (search.trim()) query.set("search", search.trim());
    if (selectedCategory) query.set("category", selectedCategory);
    if (sort) query.set("sort", sort);
    if (featuredOnly) query.set("featured", "true");
    if (newArrivalOnly) query.set("newArrival", "true");
    if (bestSellerOnly) query.set("bestSeller", "true");
    query.set("page", page.toString());
    query.set("limit", "12");

    fetch(`/api/public/products?${query.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load products");
        return res.json();
      })
      .then((data) => {
        if (!ignore) {
          setProducts(data.products || []);
          setPagination(data.pagination || { page: 1, limit: 12, total: 0, totalPages: 1 });
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(err.message || "An error occurred");
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [search, selectedCategory, sort, featuredOnly, newArrivalOnly, bestSellerOnly, page]);

  const resetFilters = () => {
    setSearch("");
    setSelectedCategory("");
    setSort("newest");
    setFeaturedOnly(false);
    setNewArrivalOnly(false);
    setBestSellerOnly(false);
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
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
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-sm mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by fabric name, weave, or SKU (e.g., Oxford, BBG-OXF-001)..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1A365D] focus:bg-white transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-semibold text-gray-500 hidden sm:inline">
              Sort by:
            </span>
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(1);
              }}
              className="px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1A365D]"
            >
              <option value="newest">Newest First</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </div>

        {/* Category Pills & Quick Filters */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100">
          <button
            onClick={() => {
              setSelectedCategory("");
              setPage(1);
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              !selectedCategory
                ? "bg-[#1A365D] text-white"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
          >
            All Collections
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.slug === selectedCategory ? "" : cat.slug);
                setPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                selectedCategory === cat.slug
                  ? "bg-[#1A365D] text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              {cat.name}
            </button>
          ))}

          {/* Tag filters */}
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => {
                setFeaturedOnly(!featuredOnly);
                setPage(1);
              }}
              className={`px-3 py-1 rounded-full text-xs font-medium border ${
                featuredOnly
                  ? "bg-amber-100 border-amber-300 text-amber-900 font-semibold"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              Featured
            </button>
            <button
              onClick={() => {
                setNewArrivalOnly(!newArrivalOnly);
                setPage(1);
              }}
              className={`px-3 py-1 rounded-full text-xs font-medium border ${
                newArrivalOnly
                  ? "bg-blue-100 border-blue-300 text-blue-900 font-semibold"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              New Arrivals
            </button>
            <button
              onClick={() => {
                setBestSellerOnly(!bestSellerOnly);
                setPage(1);
              }}
              className={`px-3 py-1 rounded-full text-xs font-medium border ${
                bestSellerOnly
                  ? "bg-emerald-100 border-emerald-300 text-emerald-900 font-semibold"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              Best Sellers
            </button>
          </div>
        </div>
      </div>

      {/* Products Grid / Status */}
      {loading && products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24">
          <Loader2 className="w-8 h-8 text-[#1A365D] animate-spin mb-3" />
          <p className="text-gray-500 text-sm">Loading authentic textiles...</p>
        </div>
      ) : error ? (
        <div className="text-center py-16 bg-red-50 rounded-2xl border border-red-200 p-8">
          <p className="text-red-700 font-medium mb-3">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-700 text-white rounded-lg text-xs font-semibold"
          >
            Retry Loading
          </button>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-200 px-4">
          <PackageOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="font-serif text-lg font-bold text-gray-800 mb-1">
            No matching fabrics found
          </h3>
          <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
            We couldn't find any products matching your active filters or search keyword.
          </p>
          <button
            onClick={resetFilters}
            className="px-5 py-2.5 bg-[#1A365D] hover:bg-[#2A4365] text-white rounded-xl text-xs font-semibold transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center text-xs text-gray-500 mb-4 px-1">
            <span>
              Showing {products.length} of {pagination.total} products
            </span>
            {selectedCategory && (
              <span className="font-medium text-[#1A365D]">
                Filtered by category
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                whatsappNumber={whatsappNumber}
              />
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-12 flex justify-center items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={pagination.page <= 1}
                className="p-2 border border-gray-200 rounded-lg text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-10 h-10 rounded-lg text-sm font-semibold transition-colors ${
                    pagination.page === p
                      ? "bg-[#1A365D] text-white"
                      : "border border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {p}
                </button>
              ))}

              <button
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={pagination.page >= pagination.totalPages}
                className="p-2 border border-gray-200 rounded-lg text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
