import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { getAdminFromRequest, recordAuditLog } from "@/lib/auth";
import { productSchema, formatZodError } from "@/lib/validations";
import { invalidateDataCache, getCached, setCached } from "@/lib/data";
import { fallbackProducts } from "@/lib/catalogData";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const admin = await getAdminFromRequest(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const categoryId = searchParams.get("categoryId") || "";
  const status = searchParams.get("status") || "";

  const cacheKey = `admin_products_${search}_${categoryId}_${status}`;
  const cached = getCached<any[]>(cacheKey);
  if (cached) {
    return NextResponse.json({ products: cached });
  }

  const where: any = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { sku: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  if (categoryId) {
    where.categoryId = categoryId;
  }

  if (status === "active") where.isActive = true;
  if (status === "inactive") where.isActive = false;
  if (status === "low_stock") {
    where.OR = [{ stockStatus: "LOW_STOCK" }, { stockQuantity: { lte: 10 } }];
  }

  try {
    let timer: NodeJS.Timeout;
    const timeout = new Promise<any[]>((resolve) => {
      timer = setTimeout(() => resolve(fallbackProducts as any), 2500);
    });

    const dbPromise = prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
        images: {
          orderBy: { displayOrder: "asc" },
        },
        variants: true,
      },
    });

    const products = await Promise.race([dbPromise, timeout]).finally(() =>
      clearTimeout(timer)
    );

    if (products && products.length > 0) {
      setCached(cacheKey, products, 45);
    }

    return NextResponse.json({ products: products || fallbackProducts });
  } catch (error) {
    console.error("Fetch products error:", error);
    return NextResponse.json({ products: fallbackProducts });
  }
}

export async function POST(req: NextRequest) {
  const admin = await getAdminFromRequest(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const result = productSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: formatZodError(result.error) },
        { status: 400 }
      );
    }

    const data = result.data;

    // Check slug uniqueness
    let slug = data.slug.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const existingSlug = await prisma.product.findUnique({ where: { slug } });
    if (existingSlug) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    // Check SKU uniqueness
    const existingSku = await prisma.product.findUnique({ where: { sku: data.sku } });
    if (existingSku) {
      return NextResponse.json(
        { error: `SKU '${data.sku}' already exists` },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        sku: data.sku,
        price: data.price,
        wholesalePrice: data.wholesalePrice,
        isEnquiryOnly: data.isEnquiryOnly,
        isPurchasableOnline: data.isPurchasableOnline,
        stockQuantity: data.stockQuantity,
        stockStatus: data.stockStatus,
        isFeatured: data.isFeatured,
        isNewArrival: data.isNewArrival,
        isBestSeller: data.isBestSeller,
        isActive: data.isActive,
        categoryId: data.categoryId,
        images: {
          create: data.images.map((img, idx) => ({
            url: img.url,
            publicId: img.publicId,
            altText: img.altText || data.name,
            displayOrder: img.displayOrder ?? idx,
            isPrimary: img.isPrimary ?? idx === 0,
          })),
        },
        variants: {
          create: data.variants.map((v) => ({
            color: v.color,
            size: v.size,
            sku: v.sku,
            additionalPrice: v.additionalPrice,
            stockQuantity: v.stockQuantity,
          })),
        },
      },
      include: {
        category: true,
        images: true,
        variants: true,
      },
    });

    await recordAuditLog({
      action: "PRODUCT_CREATED",
      details: `Created product "${product.name}" (SKU: ${product.sku})`,
      adminUserId: admin.id,
    });

    invalidateDataCache();

    try {
      revalidatePath("/products");
      revalidatePath(`/products/${product.slug}`);
      revalidatePath("/categories");
      revalidatePath("/");
    } catch (e) {
      console.error("Revalidate path error:", e);
    }

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
