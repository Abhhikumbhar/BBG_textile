import React, { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductsClient from "./ProductsClient";
import { getSiteSettings, getCategories, getProducts } from "@/lib/data";
import { Loader2 } from "lucide-react";

export const revalidate = 60;

export const metadata = {
  title: "All Fabrics & Products | BBG Textile Sangli",
  description:
    "Browse our comprehensive textile collection including pure cotton shirtings, poly-viscose suitings, linens, and uniform fabrics.",
};

export default async function ProductsPage() {
  const [settings, categories, initialData] = await Promise.all([
    getSiteSettings(),
    getCategories(),
    getProducts({ page: 1, limit: 12 }),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFDFD]">
      <Header settings={settings || undefined} />
      <main className="flex-1">
        <Suspense
          fallback={
            <div className="flex flex-col items-center justify-center py-32">
              <Loader2 className="w-8 h-8 text-[#1A365D] animate-spin mb-3" />
              <p className="text-gray-500 text-sm">Loading textile catalog...</p>
            </div>
          }
        >
          <ProductsClient
            categories={categories}
            initialProducts={initialData.products}
            initialPagination={initialData.pagination}
            whatsappNumber={settings?.whatsappNumber}
          />
        </Suspense>
      </main>
      <Footer settings={settings || undefined} />
    </div>
  );
}
