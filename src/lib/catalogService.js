import { STATIC_PRODUCTS_CATALOG } from "./catalog";
import { fallbackCategories, fallbackSiteSettings } from "./catalogData";

export const siteSettings = fallbackSiteSettings;
export const categories = fallbackCategories;
export const allProducts = STATIC_PRODUCTS_CATALOG;

export function getFeaturedProducts() {
  return allProducts.filter((p) => p.isFeatured);
}

export function getNewArrivalProducts() {
  return allProducts.filter((p) => p.isNewArrival);
}

export function getBestSellerProducts() {
  return allProducts.filter((p) => p.isBestSeller);
}

export function getProductBySlug(slug) {
  if (!slug) return null;
  const lower = slug.toLowerCase();
  return (
    allProducts.find(
      (p) => p.slug?.toLowerCase() === lower || p.id?.toLowerCase() === lower
    ) || null
  );
}

export function getRelatedProducts(currentId, limit = 4) {
  return allProducts.filter((p) => p.id !== currentId).slice(0, limit);
}

export function getProductsByCategory(categorySlug) {
  if (!categorySlug || categorySlug === "all") return allProducts;
  return allProducts.filter(
    (p) =>
      p.categorySlug === categorySlug ||
      p.category?.slug === categorySlug ||
      p.categoryId?.includes(categorySlug)
  );
}
