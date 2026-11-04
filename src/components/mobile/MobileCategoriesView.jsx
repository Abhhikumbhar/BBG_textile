import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function MobileCategoriesView({ categories = [], allProducts = [] }) {
  const navigate = useNavigate();
  const { totalItems, setIsOpen } = useCart();

  return (
    <div className="bg-[#FAF8F5] min-h-screen pb-28 text-stone-900">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md px-4 py-3.5 flex items-center justify-between border-b border-stone-200/60">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full flex items-center justify-center text-stone-900 hover:bg-stone-200/60 active:scale-95 transition-transform"
            aria-label="Back"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.2]" />
          </button>
          <h1 className="font-serif text-lg font-extrabold text-stone-950 tracking-tight">
            Categories
          </h1>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="w-10 h-10 rounded-full flex items-center justify-center text-stone-900 hover:bg-stone-200/60 active:scale-95 transition-transform relative"
          aria-label="Cart"
        >
          <ShoppingBag className="w-5 h-5 stroke-[2]" />
          {totalItems > 0 && (
            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-stone-900 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </button>
      </header>

      {/* Categories Content List */}
      <main className="p-4 space-y-4">
        {/* All Products shortcut card */}
        <Link
          to="/products"
          className="block relative rounded-3xl overflow-hidden bg-[#EFEAE2] border border-stone-200/80 p-5 shadow-xs active:scale-[0.99] transition-transform"
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-extrabold text-stone-700 uppercase tracking-wider block mb-1">
                Complete Catalog
              </span>
              <h2 className="font-serif text-xl font-extrabold text-stone-950 mb-1">
                All Collections
              </h2>
              <p className="text-xs font-semibold text-stone-800">
                Explore all colors, fabrics, and bottom wear styles
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-stone-950 text-white flex items-center justify-center shrink-0">
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
        </Link>

        {/* Dynamic Categories */}
        {categories.map((cat, idx) => {
          const count = allProducts.filter(
            (p) =>
              p.categorySlug === cat.slug ||
              p.category?.slug === cat.slug ||
              p.categoryId?.includes(cat.slug)
          ).length || 8;

          const catImg =
            cat.imageUrl ||
            (idx === 0
              ? "/images/products/bbg-studio-hd-crimson-red.jpg"
              : "/images/products/bbg-studio-hd-cs-black.jpg");

          return (
            <Link
              key={cat.id}
              to={`/products?category=${cat.slug}`}
              className="block rounded-3xl overflow-hidden bg-white border border-stone-200/80 shadow-xs active:scale-[0.99] transition-transform"
            >
              {/* Category Image */}
              <div className="relative aspect-16/9 bg-stone-100 overflow-hidden">
                <img
                  src={catImg}
                  alt={cat.name}
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest block">
                    {count} Shades Available
                  </span>
                  <h3 className="font-serif text-xl font-extrabold text-white leading-tight">
                    {cat.name}
                  </h3>
                </div>
              </div>

              {/* Description and Action */}
              <div className="p-4 flex items-center justify-between bg-[#FAF8F5]">
                <p className="text-xs font-medium text-stone-700 line-clamp-1 pr-3">
                  {cat.description}
                </p>
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-stone-950 text-white text-xs font-bold shrink-0">
                  <span>View</span>
                  <ArrowRight className="w-3 h-3 stroke-[2.5]" />
                </span>
              </div>
            </Link>
          );
        })}
      </main>
    </div>
  );
}
