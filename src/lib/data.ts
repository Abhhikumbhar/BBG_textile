import prisma from "./prisma";
import {
  fallbackProducts,
  fallbackCategories,
  fallbackSiteSettings,
  CatalogProduct,
} from "./catalogData";

// Global In-Memory Cache for ultra-fast, zero-latency website loading
const cacheMap = new Map<string, { data: any; expiry: number }>();

export function getCached<T>(key: string): T | null {
  const item = cacheMap.get(key);
  if (!item) return null;
  if (Date.now() > item.expiry) {
    cacheMap.delete(key);
    return null;
  }
  return item.data as T;
}

export function setCached<T>(key: string, data: T, ttlSeconds = 60): void {
  cacheMap.set(key, { data, expiry: Date.now() + ttlSeconds * 1000 });
}

export function invalidateDataCache(): void {
  cacheMap.clear();
}

async function fastDb<T>(promise: Promise<T>, fallback: T, timeoutMs = 2500): Promise<T> {
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
  const cacheKey = "site_settings";
  const cached = getCached<any>(cacheKey);
  if (cached) return cached;

  const data = await fastDb<any>(
    prisma.siteSettings.findUnique({
      where: { id: "default" },
    }),
    fallbackSiteSettings,
    2500
  );
  if (data) setCached(cacheKey, data, 120);
  return data;
}

export async function getHomeBanners() {
  const cacheKey = "home_banners";
  const cached = getCached<any[]>(cacheKey);
  if (cached) return cached;

  const data = await fastDb(
    prisma.homeBanner.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: "asc" },
    }),
    [],
    2500
  );
  if (data) setCached(cacheKey, data, 120);
  return data;
}

export async function getFeaturedProducts() {
  const cacheKey = "featured_products";
  const cached = getCached<any[]>(cacheKey);
  if (cached) return cached;

  // Query products across ANY category marked featured or top priority
  const dbProducts = await fastDb(
    prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          { isFeatured: true },
          { category: { slug: "churidar-leggings" } },
        ],
      },
      take: 8,
      orderBy: [
        { isFeatured: "desc" },
        { createdAt: "desc" },
      ],
      include: {
        category: { select: { id: true, name: true, slug: true } },
        images: { orderBy: { displayOrder: "asc" } },
        variants: true,
      },
    }),
    null,
    2500
  );
  if (dbProducts && dbProducts.length > 0) {
    setCached(cacheKey, dbProducts, 60);
    return dbProducts;
  }

  const staticFeatured = fallbackProducts
    .filter((p) => p.isFeatured || p.categorySlug === "churidar-leggings" || p.category?.slug === "churidar-leggings")
    .slice(0, 8);
  return staticFeatured;
}

export async function getNewArrivalProducts() {
  const cacheKey = "new_arrival_products";
  const cached = getCached<any[]>(cacheKey);
  if (cached) return cached;

  // Query products across ANY category marked new arrival
  const dbProducts = await fastDb(
    prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          { isNewArrival: true },
          { category: { slug: { in: ["cycling-shorts", "tight-shorts"] } } },
        ],
      },
      take: 8,
      orderBy: [
        { isNewArrival: "desc" },
        { createdAt: "desc" },
      ],
      include: {
        category: { select: { id: true, name: true, slug: true } },
        images: { orderBy: { displayOrder: "asc" } },
        variants: true,
      },
    }),
    null,
    2500
  );
  if (dbProducts && dbProducts.length > 0) {
    setCached(cacheKey, dbProducts, 60);
    return dbProducts;
  }

  const staticNewArrivals = fallbackProducts
    .filter((p) => p.isNewArrival || p.categorySlug === "cycling-shorts" || p.categorySlug === "tight-shorts" || p.category?.slug === "cycling-shorts")
    .slice(0, 8);
  return staticNewArrivals;
}

export async function getCategories(): Promise<any[]> {
  const cacheKey = "site_categories";
  const cached = getCached<any[]>(cacheKey);
  if (cached) return cached;

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
    2500
  );
  if (dbCategories && dbCategories.length > 0) {
    setCached(cacheKey, dbCategories, 60);
    return dbCategories;
  }
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
  const cacheKey = `products_${JSON.stringify(options)}`;
  const cached = getCached<any>(cacheKey);
  if (cached) return cached;

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
      2500
    );

    if (dbData && dbData[1] && dbData[1].length > 0) {
      const [total, products] = dbData;
      const res = {
        products,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
      setCached(cacheKey, res, 45);
      return res;
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
  const cacheKey = `product_${slug}`;
  const cached = getCached<any>(cacheKey);
  if (cached) return cached;

  const product = await fastDb(
    prisma.product.findFirst({
      where: {
        OR: [{ slug }, { id: slug }],
        isActive: true,
      },
      include: {
        category: true,
        images: { orderBy: { displayOrder: "asc" } },
        variants: true,
      },
    }),
    null,
    2500
  );
  if (product) {
    setCached(cacheKey, product, 60);
    return product;
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

export const fallbackDashboardData = {
  metrics: {
    totalProducts: fallbackProducts.length,
    activeProducts: fallbackProducts.length,
    lowStockProducts: 0,
    totalCategories: fallbackCategories.length,
    totalOrders: 0,
    pendingOrders: 0,
    totalEnquiries: 0,
    newEnquiries: 0,
    totalRevenue: 0,
  },
  recentOrders: [] as any[],
  recentEnquiries: [] as any[],
  recentProducts: fallbackProducts.slice(0, 5) as any[],
};

export async function getAdminDashboardData() {
  const cacheKey = "admin_dashboard_metrics";
  const cached = getCached<any>(cacheKey);
  if (cached) return cached;

  try {
    let timer: NodeJS.Timeout;
    const timeout = new Promise<any>((resolve) => {
      timer = setTimeout(() => resolve(null), 1200);
    });

    const dbQuery = Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { isActive: true } }),
      prisma.product.count({
        where: {
          OR: [{ stockStatus: "LOW_STOCK" }, { stockQuantity: { lte: 10 } }],
        },
      }),
      prisma.category.count(),
      prisma.order.count(),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.enquiry.count(),
      prisma.enquiry.count({ where: { status: "NEW" } }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { items: true },
      }),
      prisma.enquiry.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { product: { select: { name: true, sku: true } } },
      }),
      prisma.product.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          category: { select: { name: true } },
          images: { take: 1, orderBy: { displayOrder: "asc" } },
        },
      }),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { status: { not: "CANCELLED" } },
      }),
    ]);

    const result = await Promise.race([dbQuery, timeout]).finally(() =>
      clearTimeout(timer)
    );

    if (result) {
      const [
        totalProducts,
        activeProducts,
        lowStockProducts,
        totalCategories,
        totalOrders,
        pendingOrders,
        totalEnquiries,
        newEnquiries,
        recentOrders,
        recentEnquiries,
        recentProducts,
        orderStats,
      ] = result;

      const payload = {
        metrics: {
          totalProducts: totalProducts ?? fallbackProducts.length,
          activeProducts: activeProducts ?? fallbackProducts.length,
          lowStockProducts: lowStockProducts ?? 0,
          totalCategories: totalCategories ?? fallbackCategories.length,
          totalOrders: totalOrders ?? 0,
          pendingOrders: pendingOrders ?? 0,
          totalEnquiries: totalEnquiries ?? 0,
          newEnquiries: newEnquiries ?? 0,
          totalRevenue: orderStats?._sum?.total || 0,
        },
        recentOrders: recentOrders || [],
        recentEnquiries: recentEnquiries || [],
        recentProducts: recentProducts && recentProducts.length > 0 ? recentProducts : fallbackProducts.slice(0, 5),
      };

      setCached(cacheKey, payload, 60);
      return payload;
    }
  } catch (err) {
    console.error("Dashboard data fetch error:", err);
  }

  return fallbackDashboardData;
}

export async function getAdminOrders(limit = 50) {
  const cacheKey = `admin_orders_${limit}`;
  const cached = getCached<any[]>(cacheKey);
  if (cached) return cached;

  const orders = await fastDb(
    prisma.order.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        items: true,
        _count: { select: { items: true } },
      },
    }),
    [],
    1200
  );

  if (orders && orders.length > 0) {
    setCached(cacheKey, orders, 60);
  }
  return orders || [];
}

export async function getAdminEnquiries(limit = 50) {
  const cacheKey = `admin_enquiries_${limit}`;
  const cached = getCached<any[]>(cacheKey);
  if (cached) return cached;

  const enquiries = await fastDb(
    prisma.enquiry.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        product: { select: { id: true, name: true, sku: true, slug: true } },
      },
    }),
    [],
    1200
  );

  if (enquiries && enquiries.length > 0) {
    setCached(cacheKey, enquiries, 60);
  }
  return enquiries || [];
}

export async function getAdminAuditLogs(limit = 50) {
  const cacheKey = `admin_audit_logs_${limit}`;
  const cached = getCached<any[]>(cacheKey);
  if (cached) return cached;

  const logs = await fastDb(
    prisma.auditLog.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        adminUser: { select: { name: true, email: true, role: true } },
      },
    }),
    [],
    1200
  );

  if (logs && logs.length > 0) {
    setCached(cacheKey, logs, 60);
  }
  return logs || [];
}

