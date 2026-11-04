import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronLeft,
  ShoppingBag,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import MobileProductCard from "./MobileProductCard";

export default function MobileCatalogView({
  products = [],
  categories = [],
  currentCategory = "",
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const { totalItems, setIsOpen } = useCart();

  const selectedCategory = searchParams.get("category") || "";
  const isNewArrival = searchParams.get("newArrival") === "true";
  const isBestSeller = searchParams.get("bestSeller") === "true";

  const handleCategorySelect = (slug) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (slug === "all") {
        next.delete("category");
        next.delete("newArrival");
        next.delete("bestSeller");
      } else if (slug === "newArrival") {
        next.delete("category");
        next.set("newArrival", "true");
        next.delete("bestSeller");
      } else if (slug === "bestSeller") {
        next.delete("category");
        next.delete("newArrival");
        next.set("bestSeller", "true");
      } else {
        next.set("category", slug);
        next.delete("newArrival");
        next.delete("bestSeller");
      }
      return next;
    });
  };

  // Determine current active display title
  let displayTitle = "All Products";
  if (selectedCategory) {
    const found = categories.find((c) => c.slug === selectedCategory);
    if (found) {
      displayTitle = found.name.replace(/Women's /i, "");
    } else {
      displayTitle = selectedCategory.replace(/-/g, " ");
    }
  } else if (isNewArrival) {
    displayTitle = "New Arrivals";
  } else if (isBestSeller) {
    displayTitle = "Best Sellers";
  }

  return (
    <div className="bg-[#FAF8F5] min-h-screen pb-24 text-stone-900">
      {/* 1. TOP HEADER - Exact match with Screen 3 in reference photo */}
      <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md px-4 py-3 border-b border-stone-200/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="w-9 h-9 rounded-full flex items-center justify-center text-stone-900 hover:bg-stone-200/60 active:scale-95 transition-transform"
              aria-label="Back to Home"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2.2]" />
            </Link>
            <h1 className="font-serif text-lg font-bold text-stone-900 capitalize tracking-tight">
              {displayTitle}
            </h1>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setShowSearch(!showSearch)}
              className="w-9 h-9 rounded-full flex items-center justify-center text-stone-900 hover:bg-stone-200/60 active:scale-95 transition-transform"
              aria-label="Search Products"
            >
              <Search className="w-4.5 h-4.5 stroke-[2]" />
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="w-9 h-9 rounded-full flex items-center justify-center text-stone-900 hover:bg-stone-200/60 active:scale-95 transition-transform relative"
              aria-label="Cart"
            >
              <ShoppingBag className="w-4.5 h-4.5 stroke-[2]" />
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-stone-900 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Expandable Search Input */}
        {showSearch && (
          <div className="pt-2.5 pb-1">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-stone-400 absolute left-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearchParams((prev) => {
                    const next = new URLSearchParams(prev);
                    if (e.target.value.trim()) {
                      next.set("search", e.target.value);
                    } else {
                      next.delete("search");
                    }
                    return next;
                  });
                }}
                placeholder="Search by color, fabric, category..."
                className="w-full pl-9 pr-8 py-2 text-xs rounded-full bg-stone-100 border border-stone-200 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-400"
                autoFocus
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSearchParams((prev) => {
                      const next = new URLSearchParams(prev);
                      next.delete("search");
                      return next;
                    });
                  }}
                  className="absolute right-3 text-stone-400 hover:text-stone-700"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* 2. PILL FILTER TABS - Exact match with Screen 3 in reference photo */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pt-2.5 pb-1 -mx-4 px-4">
          {/* "All" Pill */}
          <button
            type="button"
            onClick={() => handleCategorySelect("all")}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
              !selectedCategory && !isNewArrival && !isBestSeller
                ? "bg-stone-950 text-white shadow-xs"
                : "bg-stone-200/70 text-stone-700 hover:bg-stone-300/60"
            }`}
          >
            All
          </button>

          {/* Dynamic Categories from Website */}
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            const shortLabel =
              cat.name.toLowerCase().includes("churidar") || cat.name.toLowerCase().includes("legging")
                ? "Churidar"
                : cat.name.toLowerCase().includes("tight") || cat.name.toLowerCase().includes("short") || cat.name.toLowerCase().includes("cycling")
                ? "Tight Shorts"
                : cat.name.replace(/Women's /i, "");

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategorySelect(cat.slug)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                  isSelected
                    ? "bg-stone-950 text-white shadow-xs"
                    : "bg-stone-200/70 text-stone-700 hover:bg-stone-300/60"
                }`}
              >
                {shortLabel}
              </button>
            );
          })}

          {/* New Arrivals pill */}
          <button
            type="button"
            onClick={() => handleCategorySelect("newArrival")}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
              isNewArrival
                ? "bg-stone-950 text-white shadow-xs"
                : "bg-stone-200/70 text-stone-700 hover:bg-stone-300/60"
            }`}
          >
            New
          </button>

          {/* Best Sellers pill */}
          <button
            type="button"
            onClick={() => handleCategorySelect("bestSeller")}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
              isBestSeller
                ? "bg-stone-950 text-white shadow-xs"
                : "bg-stone-200/70 text-stone-700 hover:bg-stone-300/60"
            }`}
          >
            Popular
          </button>
        </div>
      </header>

      {/* 3. 2-COLUMN PRODUCT GRID - Exact match with Screen 3 in reference photo */}
      <main className="px-4 py-4">
        {products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-sm text-stone-500 font-medium mb-3">
              No products found in this category.
            </p>
            <button
              onClick={() => handleCategorySelect("all")}
              className="px-5 py-2 rounded-full bg-stone-900 text-white text-xs font-medium"
            >
              View All Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3.5">
            {products.map((prod) => (
              <MobileProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
