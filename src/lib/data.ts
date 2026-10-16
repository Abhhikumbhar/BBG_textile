import prisma from "./prisma";
import {
  fallbackProducts,
  fallbackCategories,
  fallbackSiteSettings,
  CatalogProduct,
} from "./catalogData";

export async function getSiteSettings() {
  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: "default" },
    });
    return settings || fallbackSiteSettings;
  } catch (error) {
    console.warn("Using fallback settings due to DB error:", error);
    return fallbackSiteSettings;
  }
}

export async function getHomeBanners() {
  try {
    const banners = await prisma.homeBanner.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: "asc" },
    });
    return banners;
  } catch (error) {
    console.warn("Failed to fetch banners:", error);
    return [];
  }
}

export async function getFeaturedProducts() {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      take: 8,
      orderBy: { createdAt: "desc" },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        images: { orderBy: { displayOrder: "asc" } },
        variants: true,
      },
    });
    if (products && products.length > 0) return products;
    return fallbackProducts.filter((p) => p.isFeatured).slice(0, 8);
  } catch (error) {
    console.warn("Using fallback featured products due to DB error");
    return fallbackProducts.filter((p) => p.isFeatured).slice(0, 8);
  }
}

export async function getNewArrivalProducts() {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true, isNewArrival: true },
      take: 8,
      orderBy: { createdAt: "desc" },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        images: { orderBy: { displayOrder: "asc" } },
        variants: true,
      },
    });
    if (products && products.length > 0) return products;
    return fallbackProducts.filter((p) => p.isNewArrival).slice(0, 8);
  } catch (error) {
    console.warn("Using fallback new arrivals due to DB error");
    return fallbackProducts.filter((p) => p.isNewArrival).slice(0, 8);
  }
}

export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      where: {
        isActive: true,
      },
      orderBy: { displayOrder: "asc" },
      include: {
        _count: {
          select: { products: { where: { isActive: true } } },
        },
      },
    });
    if (categories && categories.length > 0) return categories;
    return fallbackCategories;
  } catch (error) {
    console.warn("Using fallback categories due to DB error");
    return fallbackCategories;
  }
}

export interface GetProductsOptions {
  search?: string;
  category?: string;
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  newArrival?: boolean;
  bestSeller?: boolean;
  page?: number;
  limit?: number;
}

export async function getProducts(options: GetProductsOptions = {}) {
  const page = Math.max(1, options.page || 1);
  const limit = Math.min(50, Math.max(1, options.limit || 12));

  try {
    const where: any = { isActive: true };

    if (options.search) {
      where.OR = [
        { name: { contains: options.search, mode: "insensitive" } },
        { sku: { contains: options.search, mode: "insensitive" } },
        { description: { contains: options.search, mode: "insensitive" } },
      ];
    }

    if (options.category) {
      if (options.category === "womens-bottom-wear") {
        where.category = {
          slug: { in: ["churidar-leggings", "cycling-shorts", "tight-shorts", "womens-bottom-wear"] },
        };
      } else if (options.category === "tight-shorts" || options.category === "cycling-shorts") {
        where.category = {
          slug: { in: ["tight-shorts", "cycling-shorts"] },
        };
      } else {
        where.category = {
          OR: [{ slug: options.category }, { id: options.category }],
        };
      }
    }

    if (options.minPrice !== undefined || options.maxPrice !== undefined) {
      where.price = {};
      if (options.minPrice !== undefined) where.price.gte = options.minPrice;
      if (options.maxPrice !== undefined) where.price.lte = options.maxPrice;
    }

    if (options.featured) where.isFeatured = true;
    if (options.newArrival) where.isNewArrival = true;
    if (options.bestSeller) where.isBestSeller = true;

    let orderBy: any = { createdAt: "desc" };
    if (options.sort === "price_asc") orderBy = { price: "asc" };
    if (options.sort === "price_desc") orderBy = { price: "desc" };
    if (options.sort === "popular") orderBy = { isBestSeller: "desc" };

    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          images: { orderBy: { displayOrder: "asc" } },
          variants: true,
        },
      }),
    ]);

    if (products && products.length > 0) {
      return {
        products,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    }
  } catch (error) {
    console.warn("DB query failed in getProducts, using fallback catalog:", error);
  }

  // High-performance fallback filtering
  let filtered = [...fallbackProducts];

  if (options.search) {
    const s = options.search.toLowerCase().trim();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(s) ||
        p.sku.toLowerCase().includes(s) ||
        p.description.toLowerCase().includes(s)
    );
  }

  if (options.category) {
    if (options.category === "womens-bottom-wear") {
      filtered = filtered.filter(
        (p) =>
          p.categorySlug === "churidar-leggings" ||
          p.categorySlug === "cycling-shorts" ||
          p.categorySlug === "tight-shorts" ||
          p.categorySlug === "womens-bottom-wear" ||
          p.category?.slug === "churidar-leggings" ||
          p.category?.slug === "cycling-shorts" ||
          p.category?.slug === "tight-shorts" ||
          p.category?.slug === "womens-bottom-wear"
      );
    } else if (options.category === "tight-shorts" || options.category === "cycling-shorts") {
      filtered = filtered.filter(
        (p) =>
          p.categorySlug === "cycling-shorts" ||
          p.categorySlug === "tight-shorts" ||
          p.category?.slug === "cycling-shorts" ||
          p.category?.slug === "tight-shorts" ||
          p.category?.id === options.category
      );
    } else {
      filtered = filtered.filter(
        (p) =>
          p.categorySlug === options.category ||
          p.category?.slug === options.category ||
          p.category?.id === options.category
      );
    }
  }

  if (options.minPrice !== undefined) {
    filtered = filtered.filter((p) => p.price >= (options.minPrice as number));
  }
  if (options.maxPrice !== undefined) {
    filtered = filtered.filter((p) => p.price <= (options.maxPrice as number));
  }

  if (options.featured) filtered = filtered.filter((p) => p.isFeatured);
  if (options.newArrival) filtered = filtered.filter((p) => p.isNewArrival);
  if (options.bestSeller) filtered = filtered.filter((p) => p.isBestSeller);

  if (options.sort === "price_asc") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (options.sort === "price_desc") {
    filtered.sort((a, b) => b.price - a.price);
  } else if (options.sort === "popular") {
    filtered.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
  }

  const total = filtered.length;
  const paginated = filtered.slice((page - 1) * limit, page * limit);

  return {
    products: paginated,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
}

export async function getProductBySlug(slug: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        images: { orderBy: { displayOrder: "asc" } },
        variants: true,
      },
    });
    if (product) return product;
  } catch (error) {
    console.warn("DB query failed in getProductBySlug, using fallback:", error);
  }

  return (
    fallbackProducts.find(
      (p) =>
        p.slug === slug ||
        p.slug.replace("cycling-shorts", "tight-shorts") === slug ||
        p.slug.replace("tight-shorts", "cycling-shorts") === slug
    ) || null
  );
}
