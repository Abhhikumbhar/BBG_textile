import { STATIC_PRODUCTS_CATALOG } from "./catalog";
import { fallbackCategories, fallbackSiteSettings } from "./catalogData";

// --- Products ---
export function getAllProducts() {
  try {
    const custom = localStorage.getItem("bbg_custom_products");
    if (custom) {
      return JSON.parse(custom);
    }
  } catch (e) {
    console.error("Failed to load products from storage", e);
  }
  return STATIC_PRODUCTS_CATALOG;
}

export function saveProduct(product) {
  const products = [...getAllProducts()];
  const existingIdx = products.findIndex((p) => p.id === product.id);

  if (existingIdx >= 0) {
    products[existingIdx] = { ...products[existingIdx], ...product };
  } else {
    products.unshift(product);
  }

  try {
    localStorage.setItem("bbg_custom_products", JSON.stringify(products));
  } catch (e) {
    console.error("Failed to save product", e);
  }
  return products;
}

export function deleteProduct(id) {
  const products = getAllProducts().filter((p) => p.id !== id);
  try {
    localStorage.setItem("bbg_custom_products", JSON.stringify(products));
  } catch (e) {
    console.error("Failed to delete product", e);
  }
  return products;
}

export const allProducts = getAllProducts();

export function getFeaturedProducts() {
  return getAllProducts().filter((p) => p.isFeatured);
}

export function getNewArrivalProducts() {
  return getAllProducts().filter((p) => p.isNewArrival);
}

export function getBestSellerProducts() {
  return getAllProducts().filter((p) => p.isBestSeller);
}

export function getProductBySlug(slug) {
  if (!slug) return null;
  const lower = slug.toLowerCase();
  return (
    getAllProducts().find(
      (p) => p.slug?.toLowerCase() === lower || p.id?.toLowerCase() === lower
    ) || null
  );
}

export function getRelatedProducts(currentId, limit = 4) {
  return getAllProducts().filter((p) => p.id !== currentId).slice(0, limit);
}

export function getProductsByCategory(categorySlug) {
  if (!categorySlug || categorySlug === "all") return getAllProducts();
  return getAllProducts().filter(
    (p) =>
      p.categorySlug === categorySlug ||
      p.category?.slug === categorySlug ||
      p.categoryId?.includes(categorySlug)
  );
}

// --- Categories ---
export function getCategories() {
  try {
    const custom = localStorage.getItem("bbg_custom_categories");
    if (custom) {
      return JSON.parse(custom);
    }
  } catch (e) {
    console.error("Failed to load categories from storage", e);
  }
  return fallbackCategories;
}

export function saveCategory(category) {
  const cats = [...getCategories()];
  const idx = cats.findIndex((c) => c.id === category.id);
  if (idx >= 0) {
    cats[idx] = { ...cats[idx], ...category };
  } else {
    cats.push(category);
  }
  try {
    localStorage.setItem("bbg_custom_categories", JSON.stringify(cats));
  } catch (e) {
    console.error("Failed to save category", e);
  }
  return cats;
}

export function deleteCategory(id) {
  const cats = getCategories().filter((c) => c.id !== id);
  try {
    localStorage.setItem("bbg_custom_categories", JSON.stringify(cats));
  } catch (e) {
    console.error("Failed to delete category", e);
  }
  return cats;
}

export const categories = getCategories();

// --- Site Settings ---
export function getSiteSettings() {
  try {
    const custom = localStorage.getItem("bbg_custom_settings");
    if (custom) {
      return JSON.parse(custom);
    }
  } catch (e) {
    console.error("Failed to load settings from storage", e);
  }
  return fallbackSiteSettings;
}

export function saveSiteSettings(settings) {
  try {
    localStorage.setItem("bbg_custom_settings", JSON.stringify(settings));
  } catch (e) {
    console.error("Failed to save settings", e);
  }
  return settings;
}

export const siteSettings = getSiteSettings();

// --- Orders ---
export function getOrders() {
  try {
    const orders = localStorage.getItem("bbg_orders");
    if (orders) {
      return JSON.parse(orders);
    }
  } catch (e) {
    console.error("Failed to load orders from storage", e);
  }
  return [];
}

export function updateOrderStatus(orderNumber, status) {
  const orders = getOrders().map((o) =>
    o.orderNumber === orderNumber ? { ...o, status } : o
  );
  try {
    localStorage.setItem("bbg_orders", JSON.stringify(orders));
    const single = localStorage.getItem(`order_${orderNumber}`);
    if (single) {
      const parsed = JSON.parse(single);
      parsed.status = status;
      localStorage.setItem(`order_${orderNumber}`, JSON.stringify(parsed));
    }
  } catch (e) {
    console.error("Failed to update order status", e);
  }
  return orders;
}

// --- Enquiries ---
export function getEnquiries() {
  try {
    const enquiries = localStorage.getItem("bbg_enquiries");
    if (enquiries) {
      return JSON.parse(enquiries);
    }
  } catch (e) {
    console.error("Failed to load enquiries", e);
  }
  return [];
}

export function addEnquiry(enquiry) {
  const list = [enquiry, ...getEnquiries()];
  try {
    localStorage.setItem("bbg_enquiries", JSON.stringify(list));
  } catch (e) {
    console.error("Failed to save enquiry", e);
  }
  return list;
}
