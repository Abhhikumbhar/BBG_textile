import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { getAdminFromRequest, recordAuditLog } from "@/lib/auth";
import { categorySchema, formatZodError } from "@/lib/validations";
import { invalidateDataCache, getCached, setCached } from "@/lib/data";
import { fallbackCategories } from "@/lib/catalogData";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const admin = await getAdminFromRequest(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cacheKey = "admin_categories";
  const cached = getCached<any[]>(cacheKey);
  if (cached) {
    return NextResponse.json({ categories: cached });
  }

  try {
    let timer: NodeJS.Timeout;
    const timeout = new Promise<any[]>((resolve) => {
      timer = setTimeout(() => resolve(fallbackCategories as any), 1000);
    });

    const dbPromise = prisma.category.findMany({
      orderBy: { displayOrder: "asc" },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    const categories = await Promise.race([dbPromise, timeout]).finally(() =>
      clearTimeout(timer)
    );

    if (categories && categories.length > 0) {
      setCached(cacheKey, categories, 180);
    }

    return NextResponse.json({ categories: categories || fallbackCategories });
  } catch (error) {
    console.error("Fetch categories error:", error);
    return NextResponse.json({ categories: fallbackCategories });
  }
}

export async function POST(req: NextRequest) {
  const admin = await getAdminFromRequest(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const result = categorySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: formatZodError(result.error) },
        { status: 400 }
      );
    }

    const { name, slug, description, imageUrl, displayOrder, isActive } = result.data;

    const existing = await prisma.category.findFirst({
      where: {
        OR: [{ name: { equals: name, mode: "insensitive" } }, { slug }],
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "A category with this name or slug already exists" },
        { status: 400 }
      );
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug: slug.toLowerCase().trim(),
        description,
        imageUrl,
        displayOrder,
        isActive,
      },
    });

    await recordAuditLog({
      action: "CATEGORY_CREATED",
      details: `Created category "${category.name}"`,
      adminUserId: admin.id,
    });

    invalidateDataCache();

    try {
      revalidatePath("/categories");
      revalidatePath("/products");
      revalidatePath("/");
    } catch (e) {
      console.warn("Revalidation error:", e);
    }

    return NextResponse.json({ success: true, category }, { status: 201 });
  } catch (error) {
    console.error("Create category error:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}
