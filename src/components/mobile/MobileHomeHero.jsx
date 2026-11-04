import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronRight, Star } from "lucide-react";
import MobileProductCard from "./MobileProductCard";

export default function MobileHomeHero({
  categories = [],
  featuredProducts = [],
  newArrivals = [],
  bestSellers = [],
}) {
  return (
    <div className="bg-[#FAF8F5] pb-28 text-stone-900">
      {/* 1. EDITORIAL HERO BANNER - High-contrast & Bold Typography */}
      <section className="px-4 pt-2 pb-5">
        <div className="relative w-full rounded-3xl overflow-hidden bg-[#EFEAE2] min-h-[380px] flex flex-col justify-end p-6 shadow-sm border border-stone-200/60">
          {/* Background Model Image with warm lighting */}
          <div className="absolute inset-0 z-0">
            <img
              src="/images/products/featured-crimson-red-studio.jpg"
              alt="BBG Fashion Wear"
              className="w-full h-full object-cover object-[70%_top]"
            />
            {/* Crisp Gradient Overlay ensuring left-aligned text is 100% bold and readable */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#FAF8F5] via-[#FAF8F5]/75 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8F5]/90 via-transparent to-transparent" />
          </div>

          {/* Bold Typography Content */}
          <div className="relative z-10 max-w-[220px]">
            <span className="inline-block font-serif italic text-stone-900 font-bold text-sm tracking-wide mb-1">
              Discover
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-extrabold tracking-tight text-stone-950 leading-[1.05] mb-2.5">
              Your <br />
              <span className="font-black">Style</span>
            </h1>
            <p className="text-xs text-stone-900 font-semibold mb-5 leading-relaxed">
              Modern pieces & 4-way stretch comfort for every moment.
            </p>

            {/* Pill Action Buttons */}
            <div className="flex flex-col gap-2.5">
              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-stone-950 hover:bg-stone-800 text-white text-xs font-bold tracking-wider uppercase active:scale-95 transition-all shadow-md"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </Link>
              <Link
                to="/products?newArrival=true"
                className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-white text-stone-950 text-xs font-bold tracking-wider uppercase border-2 border-stone-300 hover:bg-stone-50 active:scale-95 transition-all shadow-xs"
              >
                <span>New Arrivals</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORIES SECTION - Horizontal Circular Avatars with Bold Labels */}
      <section className="py-4">
        <div className="px-5 flex items-center justify-between mb-3.5">
          <h2 className="text-base font-extrabold tracking-tight text-stone-950">
            Categories
          </h2>
          <Link
            to="/categories"
            className="text-xs font-bold text-stone-600 hover:text-stone-950 transition-colors"
          >
            View all
          </Link>
        </div>

        {/* Circular Category Avatars Row */}
        <div className="flex items-start gap-4 px-4 overflow-x-auto scrollbar-none pb-1">
          {/* All Collection icon */}
          <Link
            to="/products"
            className="flex flex-col items-center gap-1.5 shrink-0 group text-center"
          >
            <div className="w-16 h-16 rounded-full bg-[#EFEAE2] border-2 border-stone-300/80 p-0.5 flex items-center justify-center group-active:scale-95 transition-transform shadow-xs">
              <div className="w-full h-full rounded-full bg-white overflow-hidden p-1.5 flex items-center justify-center">
                <img
                  src="/images/logo/bbg-logo-icon.png"
                  alt="All Products"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <span className="text-xs font-bold text-stone-900 max-w-[70px] truncate">
              All
            </span>
          </Link>

          {/* Actual Categories */}
          {categories.map((cat, idx) => {
            const catImg =
              cat.imageUrl ||
              (idx === 0
                ? "/images/products/bbg-studio-hd-crimson-red.jpg"
                : "/images/products/bbg-studio-hd-cs-black.jpg");

            const shortLabel =
              cat.name.toLowerCase().includes("churidar") || cat.name.toLowerCase().includes("legging")
                ? "Churidar"
                : cat.name.toLowerCase().includes("tight") || cat.name.toLowerCase().includes("short") || cat.name.toLowerCase().includes("cycling")
                ? "Shorts"
                : cat.name.replace(/Women's /i, "");

            return (
              <Link
                key={cat.id}
                to={`/products?category=${encodeURIComponent(cat.slug)}`}
                className="flex flex-col items-center gap-1.5 shrink-0 group text-center"
              >
                <div className="w-16 h-16 rounded-full bg-[#EFEAE2] border-2 border-stone-300/80 p-0.5 flex items-center justify-center group-active:scale-95 transition-transform shadow-xs">
                  <div className="w-full h-full rounded-full overflow-hidden">
                    <img
                      src={catImg}
                      alt={cat.name}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                </div>
                <span className="text-xs font-bold text-stone-900 max-w-[75px] truncate">
                  {shortLabel}
                </span>
              </Link>
            );
          })}

          {/* Additional Quick Filter Avatars for rich app feel */}
          <Link
            to="/products?newArrival=true"
            className="flex flex-col items-center gap-1.5 shrink-0 group text-center"
          >
            <div className="w-16 h-16 rounded-full bg-[#EFEAE2] border-2 border-stone-300/80 p-0.5 flex items-center justify-center group-active:scale-95 transition-transform shadow-xs">
              <div className="w-full h-full rounded-full overflow-hidden">
                <img
                  src="/images/products/bbg-studio-hd-deep-maroon.jpg"
                  alt="New Arrivals"
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>
            <span className="text-xs font-bold text-stone-900 max-w-[70px] truncate">
              New
            </span>
          </Link>

          <Link
            to="/products?bestSeller=true"
            className="flex flex-col items-center gap-1.5 shrink-0 group text-center"
          >
            <div className="w-16 h-16 rounded-full bg-[#EFEAE2] border-2 border-stone-300/80 p-0.5 flex items-center justify-center group-active:scale-95 transition-transform shadow-xs">
              <div className="w-full h-full rounded-full overflow-hidden">
                <img
                  src="/images/products/bbg-studio-hd-jet-black.jpg"
                  alt="Best Sellers"
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>
            <span className="text-xs font-bold text-stone-900 max-w-[70px] truncate">
              Popular
            </span>
          </Link>
        </div>
      </section>

      {/* 3. BEST SELLERS SECTION - Horizontal cards strip with Indian Rupee (₹) */}
      <section className="py-4">
        <div className="px-5 flex items-center justify-between mb-3.5">
          <h2 className="text-base font-extrabold tracking-tight text-stone-950">
            Best Sellers
          </h2>
          <Link
            to="/products?bestSeller=true"
            className="text-xs font-bold text-stone-600 hover:text-stone-950 transition-colors"
          >
            View all
          </Link>
        </div>

        {/* Horizontal Card Swiper */}
        <div className="flex gap-3 px-4 overflow-x-auto scrollbar-none pb-2">
          {(bestSellers.length > 0 ? bestSellers : featuredProducts).slice(0, 6).map((item) => (
            <div key={item.id} className="w-[155px] shrink-0">
              <MobileProductCard product={item} />
            </div>
          ))}
        </div>
      </section>

      {/* 4. RECENT COLLECTION - 2-Column Grid */}
      <section className="px-4 py-4">
        <div className="flex items-center justify-between mb-3.5">
          <h2 className="text-base font-extrabold tracking-tight text-stone-950">
            New Collection
          </h2>
          <Link
            to="/products"
            className="text-xs font-bold text-stone-600 hover:text-stone-950 transition-colors"
          >
            Explore all
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {(newArrivals.length > 0 ? newArrivals : featuredProducts).slice(0, 6).map((item) => (
            <MobileProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>
    </div>
  );
}
