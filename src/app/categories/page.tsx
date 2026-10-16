import React from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSiteSettings, getCategories } from "@/lib/data";
import { ArrowRight, Layers } from "lucide-react";

export const revalidate = 60;

export const metadata = {
  title: "Product Categories | BBG Textile Sangli",
  description:
    "Explore textile categories including Cotton Shirting, Premium Suiting, Pure Linen Blends, Ethnic Jacquards, and Uniform Textiles.",
};

export default async function CategoriesPage() {
  const [settings, categories] = await Promise.all([
    getSiteSettings(),
    getCategories(),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFDFD]">
      <Header settings={settings || undefined} />
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
          <div className="grid grid-cols-1 sm:grid-cols-2 max-w-5xl mx-auto gap-8">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className="group relative rounded-3xl overflow-hidden bg-white border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                <div className="relative aspect-[16/11] bg-gray-100 overflow-hidden">
                  <Image
                    src={
                      cat.imageUrl ||
                      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80"
                    }
                    alt={cat.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-5 right-5">
                    <span className="px-2.5 py-1 text-[11px] font-bold bg-amber-500 text-gray-950 rounded-md inline-block mb-1.5 shadow-sm">
                      {cat._count.products} Products Available
                    </span>
                    <h2 className="font-serif text-2xl font-bold text-white leading-tight">
                      {cat.name}
                    </h2>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed mb-6">
                    {cat.description ||
                      "Finest yarns engineered with durability, high tensile strength, and color brilliance."}
                  </p>

                  <div className="flex items-center justify-between text-xs font-bold text-[#1A365D] group-hover:text-[#2A4365] pt-4 border-t border-gray-100">
                    <span>Explore Products in this Category</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer settings={settings || undefined} />
    </div>
  );
}
