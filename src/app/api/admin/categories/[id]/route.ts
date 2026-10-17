import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { getAdminFromRequest, recordAuditLog } from "@/lib/auth";
import { categorySchema, formatZodError } from "@/lib/validations";
import { invalidateDataCache } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getAdminFromRequest(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json({ category });
  } catch (error) {
    console.error("Fetch category error:", error);
    return NextResponse.json(
      { error: "Failed to fetch category" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getAdminFromRequest(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

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

    // Check conflict
    const conflict = await prisma.category.findFirst({
      where: {
        OR: [{ name: { equals: name, mode: "insensitive" } }, { slug }],
        id: { not: id },
      },
    });

    if (conflict) {
      return NextResponse.json(
        { error: "Another category with this name or slug already exists" },
        { status: 400 }
      );
    }

    const updated = await prisma.category.update({
      where: { id },
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
      action: "CATEGORY_UPDATED",
      details: `Updated category "${updated.name}"`,
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

    return NextResponse.json({ success: true, category: updated });
  } catch (error) {
    console.error("Update category error:", error);
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getAdminFromRequest(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    // Safety check: Prevent accidental deletion when products depend on category
    if (category._count.products > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete category "${category.name}" because ${category._count.products} product(s) are linked to it. Please reassign or delete the products first, or deactivate the category.`,
        },
        { status: 400 }
      );
    }

    await prisma.category.delete({ where: { id } });

    await recordAuditLog({
      action: "CATEGORY_DELETED",
      details: `Deleted category "${category.name}"`,
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

    return NextResponse.json({ success: true, message: "Category deleted" });
  } catch (error) {
    console.error("Delete category error:", error);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}
