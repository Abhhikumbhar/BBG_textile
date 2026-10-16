import prisma from "./prisma";
import {
  fallbackProducts,
  fallbackCategories,
  fallbackSiteSettings,
  CatalogProduct,
} from "./catalogData";

async function fastDb<T>(promise: Promise<T>, fallback: T, timeoutMs = 500): Promise<T> {
  let timer: NodeJS.Timeout;
  const timeout = new Promise<T>((resolve) => {
    timer = setTimeout(() => resolve(fallback), timeoutMs);
  });
  return Promise.race([
    promise
      .then((res) => (res !== null && res !== undefined ? res : fallback))
      .catch(() => fallback),
    timeout,
  ]).finally(() => clearTimeout(timer));
}

export async function getSiteSettings(): Promise<any> {
  return fastDb<any>(
    prisma.siteSettings.findUnique({
      where: { id: "default" },
    }),
    fallbackSiteSettings,
    500
  );
}

export async function getHomeBanners() {
  return fastDb(
    prisma.homeBanner.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: "asc" },
    }),
    [],
    500
  );
}

export async function getFeaturedProducts() {
  const staticFeatured = fallbackProducts
    .filter((p) => p.categorySlug === "churidar-leggings" || p.category?.slug === "churidar-leggings")
    .slice(0, 8);

  const dbProducts = await fastDb(
    prisma.product.findMany({
      where: {
        isActive: true,
        category: { slug: "churidar-leggings" },
      },
      take: 8,
      orderBy: { createdAt: "desc" },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        images: { orderBy: { displayOrder: "asc" } },
        variants: true,
      },
    }),
    null,
    600
  );
  if (dbProducts && dbProducts.length > 0) return dbProducts;
  return staticFeatured;
}

export async function getNewArrivalProducts() {
  const staticNewArrivals = fallbackProducts
    .filter((p) => p.categorySlug === "cycling-shorts" || p.categorySlug === "tight-shorts" || p.category?.slug === "cycling-shorts")
    .slice(0, 8);

  const dbProducts = await fastDb(
    prisma.product.findMany({
      where: {
        isActive: true,
        category: { slug: { in: ["cycling-shorts", "tight-shorts"] } },
      },
      take: 8,
      orderBy: { createdAt: "desc" },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        images: { orderBy: { displayOrder: "asc" } },
        variants: true,
      },
    }),
    null,
    600
  );
  if (dbProducts && dbProducts.length > 0) return dbProducts;
  return staticNewArrivals;
}

export async function getCategories(): Promise<any[]> {
  const dbCategories = await fastDb<any>(
    prisma.category.findMany({
      where: {
        isActive: true,
      },
      orderBy: { displayOrder: "asc" },
      include: {
        _count: {
          select: { products: { where: { isActive: true } } },
        },
      },
    }),
    null,
    500
  );
  if (dbCategories && dbCategories.length > 0) return dbCategories;
  return fallbackCategories;
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

    const dbData = await fastDb(
      Promise.all([
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
      ]),
      null,
      700
    );

    if (dbData && dbData[1] && dbData[1].length > 0) {
      const [total, products] = dbData;
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
    // fast fallback
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
  const product = await fastDb(
    prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        images: { orderBy: { displayOrder: "asc" } },
        variants: true,
      },
    }),
    null,
    500
  );
  if (product) return product;

  return (
    fallbackProducts.find(
      (p) =>
        p.slug === slug ||
        p.slug.replace("cycling-shorts", "tight-shorts") === slug ||
        p.slug.replace("tight-shorts", "cycling-shorts") === slug
    ) || null
  );
}
