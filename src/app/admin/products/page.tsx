import React from "react";
import ProductsAdminClient from "./ProductsAdminClient";
import { getProducts, getCategories } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const [productsData, initialCategories] = await Promise.all([
    getProducts({ limit: 50 }),
    getCategories(),
  ]);

  return (
    <ProductsAdminClient
      initialProducts={productsData?.products || []}
      initialCategories={initialCategories || []}
    />
  );
}
