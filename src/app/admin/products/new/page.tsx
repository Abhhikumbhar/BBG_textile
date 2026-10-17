import React from "react";
import ProductForm from "../ProductForm";
import { getCategories } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const categories = await getCategories();
  return <ProductForm categories={categories} isEdit={false} />;
}
