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
  Sparkles,
  Crown,
  Flame,
  RotateCcw,
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

  const [search, setSearch] = useState(searchParams?.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams?.get("category") || "");
  const [sort, setSort] = useState(searchParams?.get("sort") || "newest");
  const [featuredOnly, setFeaturedOnly] = useState(searchParams?.get("featured") === "true");
  const [newArrivalOnly, setNewArrivalOnly] = useState(searchParams?.get("newArrival") === "true");
  const [bestSellerOnly, setBestSellerOnly] = useState(searchParams?.get("bestSeller") === "true");
  const [page, setPage] = useState(parseInt(searchParams?.get("page") || "1"));

  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [pagination, setPagination] = useState(initialPagination);
  const [liveCategories, setLiveCategories] = useState<Category[]>(categories);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const masterList = React.useRef<Product[]>(initialProducts);
  if (initialProducts.length > masterList.current.length) {
    masterList.current = initialProducts;
  }

  // Seamless background sync on mount: keeps catalog and categories live with Supabase
  useEffect(() => {
    // 1. Sync categories
    fetch("/api/public/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.categories && Array.isArray(data.categories) && data.categories.length > 0) {
          setLiveCategories(data.categories);
        }
      })
      .catch(() => {});

    // 2. Sync full catalog in background
    fetch("/api/public/products?limit=100")
      .then((res) => res.json())
      .then((data) => {
        if (data.products && Array.isArray(data.products) && data.products.length > 0) {
          masterList.current = data.products;
          const filtered = filterLocally(
            data.products,
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
        }
      })
      .catch(() => {});
  }, []);

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

      // If category is selected but has 0 local products, query server directly in case new items were added
      if (filtered.length === 0 && selectedCategory) {
        fetch(`/api/public/products?category=${encodeURIComponent(selectedCategory)}&limit=24`)
          .then((res) => res.json())
          .then((data) => {
            if (data.products && Array.isArray(data.products) && data.products.length > 0) {
              const existingIds = new Set(masterList.current.map((p) => p.id));
              const fresh = data.products.filter((p: Product) => !existingIds.has(p.id));
              masterList.current = [...masterList.current, ...fresh];
              setProducts(data.products.slice(0, 12));
              setPagination(data.pagination || { page: 1, limit: 12, total: data.products.length, totalPages: 1 });
            }
          })
          .catch(() => {});
      }
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
      <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-gray-200/80 shadow-xs mb-8 space-y-3.5 sm:space-y-4">
        {/* Row 1: Search Box & Sort Dropdown */}
        <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-4 items-stretch sm:items-center justify-between">
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

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-semibold text-gray-500 hidden sm:inline">
              Sort:
            </span>
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(1);
              }}
              className="w-full sm:w-auto px-3.5 py-2.5 bg-gray-50/90 border border-gray-200/90 rounded-xl text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1A365D] cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </div>

        {/* Divider with Structured Filter Boxes */}
        <div className="border-t border-gray-100 pt-3 sm:pt-3.5 space-y-3 sm:space-y-3.5">
          {/* Section 1: Categories in Proper Boxes */}
          <div>
            <div className="flex items-center justify-between mb-2 px-0.5">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Select Category
              </span>
              {selectedCategory && (
                <button
                  onClick={() => {
                    setSelectedCategory("");
                    setPage(1);
                  }}
                  className="text-[11px] text-[#1A365D] font-bold hover:underline"
                >
                  Show All
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
              <button
                onClick={() => {
                  setSelectedCategory("");
                  setPage(1);
                }}
                className={`py-2 px-2 sm:py-2.5 sm:px-3 rounded-xl border text-center transition-all duration-200 flex flex-col items-center justify-center min-h-[46px] sm:min-h-[50px] touch-manipulation ${
                  !selectedCategory
                    ? "bg-[#1A365D] text-white border-[#1A365D] shadow-sm font-semibold"
                    : "bg-gray-50/90 hover:bg-gray-100 text-gray-700 border-gray-200/90 font-medium active:scale-[0.98]"
                }`}
              >
                <span className="text-[11px] sm:text-xs font-semibold leading-tight">
                  <span className="sm:hidden">All Items</span>
                  <span className="hidden sm:inline">All Collections</span>
                </span>
              </button>

              {liveCategories.map((cat) => {
                const isSelected = selectedCategory === cat.slug;
                const cleanShortName = cat.name.replace(/^Women's\s+/i, "");
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(isSelected ? "" : cat.slug);
                      setPage(1);
                    }}
                    className={`py-2 px-2 sm:py-2.5 sm:px-3 rounded-xl border text-center transition-all duration-200 flex flex-col items-center justify-center min-h-[46px] sm:min-h-[50px] touch-manipulation ${
                      isSelected
                        ? "bg-[#1A365D] text-white border-[#1A365D] shadow-sm font-semibold"
                        : "bg-gray-50/90 hover:bg-gray-100 text-gray-700 border-gray-200/90 font-medium active:scale-[0.98]"
                    }`}
                  >
                    <span className="text-[11px] sm:text-xs font-semibold leading-tight">
                      <span className="sm:hidden">{cleanShortName}</span>
                      <span className="hidden sm:inline">{cat.name}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Quick Highlight Filter Tags in Proper Boxes */}
          <div>
            <div className="flex items-center justify-between mb-2 px-0.5">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Filter By Highlights
              </span>
              {(featuredOnly || newArrivalOnly || bestSellerOnly) && (
                <button
                  onClick={() => {
                    setFeaturedOnly(false);
                    setNewArrivalOnly(false);
                    setBestSellerOnly(false);
                    setPage(1);
                  }}
                  className="text-[11px] text-gray-500 hover:text-gray-800 font-semibold flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => {
                  setFeaturedOnly(!featuredOnly);
                  setPage(1);
                }}
                className={`py-2 px-1.5 sm:py-2 sm:px-3 rounded-xl border text-center transition-all duration-200 flex items-center justify-center gap-1.5 min-h-[40px] sm:min-h-[44px] touch-manipulation ${
                  featuredOnly
                    ? "bg-amber-500 text-slate-950 border-amber-500 shadow-sm font-bold"
                    : "bg-gray-50/90 hover:bg-gray-100 text-gray-700 border-gray-200/90 font-medium active:scale-[0.98]"
                }`}
              >
                <Sparkles
                  className={`w-3.5 h-3.5 shrink-0 ${
                    featuredOnly ? "text-slate-950" : "text-amber-500"
                  }`}
                />
                <span className="text-[11px] sm:text-xs leading-tight font-semibold">
                  Featured
                </span>
              </button>

              <button
                onClick={() => {
                  setNewArrivalOnly(!newArrivalOnly);
                  setPage(1);
                }}
                className={`py-2 px-1.5 sm:py-2 sm:px-3 rounded-xl border text-center transition-all duration-200 flex items-center justify-center gap-1.5 min-h-[40px] sm:min-h-[44px] touch-manipulation ${
                  newArrivalOnly
                    ? "bg-[#1A365D] text-white border-[#1A365D] shadow-sm font-bold"
                    : "bg-gray-50/90 hover:bg-gray-100 text-gray-700 border-gray-200/90 font-medium active:scale-[0.98]"
                }`}
              >
                <Crown
                  className={`w-3.5 h-3.5 shrink-0 ${
                    newArrivalOnly ? "text-amber-300" : "text-amber-500"
                  }`}
                />
                <span className="text-[11px] sm:text-xs leading-tight font-semibold">
                  New Arrivals
                </span>
              </button>

              <button
                onClick={() => {
                  setBestSellerOnly(!bestSellerOnly);
                  setPage(1);
                }}
                className={`py-2 px-1.5 sm:py-2 sm:px-3 rounded-xl border text-center transition-all duration-200 flex items-center justify-center gap-1.5 min-h-[40px] sm:min-h-[44px] touch-manipulation ${
                  bestSellerOnly
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-sm font-bold"
                    : "bg-gray-50/90 hover:bg-gray-100 text-gray-700 border-gray-200/90 font-medium active:scale-[0.98]"
                }`}
              >
                <Flame
                  className={`w-3.5 h-3.5 shrink-0 ${
                    bestSellerOnly ? "text-white" : "text-rose-500"
                  }`}
                />
                <span className="text-[11px] sm:text-xs leading-tight font-semibold">
                  Best Sellers
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid / Status */}
      {loading && products.length === 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-2xs animate-pulse"
            >
              <div className="aspect-[7/6] bg-slate-200/80 w-full" />
              <div className="p-3 sm:p-4 space-y-2.5">
                <div className="h-3 bg-slate-200 rounded w-2/3" />
                <div className="h-4 bg-slate-200 rounded w-4/5" />
                <div className="h-3 bg-slate-200 rounded w-1/3" />
                <div className="pt-2 flex justify-between items-center gap-2">
                  <div className="h-4 bg-slate-200 rounded w-1/4" />
                  <div className="h-7 sm:h-8 bg-slate-200 rounded-xl w-1/3" />
                </div>
              </div>
            </div>
          ))}
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
