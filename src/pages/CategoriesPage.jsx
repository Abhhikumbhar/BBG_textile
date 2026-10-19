import React from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { categories, siteSettings, allProducts } from "@/lib/catalogService";
import { ArrowRight, Layers } from "lucide-react";

export default function CategoriesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FDFDFD]">
      <Header settings={siteSettings} />

      <main className="flex-1 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-2 block">
              Curated Weaves & Fabrics
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-gray-900 mb-4">
              Explore by Textile Category
            </h1>
            <p className="text-gray-600 text-base leading-relaxed">
              Discover our signature bottom wear collections: Premium 4-Way Stretch Churidar Leggings and Super Combed Cotton Tight Shorts, crafted for supreme comfort and elegance.
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 max-w-5xl mx-auto gap-8">
            {categories.map((cat) => {
              const count = allProducts.filter(
                (p) =>
                  p.categorySlug === cat.slug ||
                  p.category?.slug === cat.slug ||
                  p.categoryId?.includes(cat.slug)
              ).length || 8;

              return (
                <Link
                  key={cat.id}
                  to={`/products?category=${cat.slug}`}
                  className="group relative rounded-3xl overflow-hidden bg-white border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  <div className="relative aspect-[16/10] bg-gray-100 overflow-hidden">
                    <img
                      src={
                        cat.imageUrl ||
                        "/images/products/bbg-studio-hd-crimson-red.jpg"
                      }
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <span className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-1 block">
                        {count} Available Shades & Styles
                      </span>
                      <h3 className="font-serif text-xl sm:text-2xl font-bold">
                        {cat.name}
                      </h3>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <p className="text-gray-600 text-sm leading-relaxed mb-6">
                      {cat.description}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-[#1A365D] font-bold text-sm group-hover:text-amber-600 transition-colors">
                      <span>Explore Collection</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </main>

      <Footer settings={siteSettings} />
    </div>
  );
}
