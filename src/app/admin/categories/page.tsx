import React from "react";
import CategoriesAdminClient from "./CategoriesAdminClient";
import { getCategories } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const initialCategories = await getCategories();
  return <CategoriesAdminClient initialCategories={initialCategories} />;
}
