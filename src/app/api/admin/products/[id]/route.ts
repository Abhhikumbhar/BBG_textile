import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { getAdminFromRequest, recordAuditLog } from "@/lib/auth";
import { productSchema, formatZodError } from "@/lib/validations";

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
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: { orderBy: { displayOrder: "asc" } },
        variants: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error("Fetch product error:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
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
    const result = productSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: formatZodError(result.error) },
        { status: 400 }
      );
    }

    const data = result.data;

    // Check SKU conflict with other products
    const skuConflict = await prisma.product.findFirst({
      where: {
        sku: data.sku,
        id: { not: id },
      },
    });

    if (skuConflict) {
      return NextResponse.json(
        { error: `SKU '${data.sku}' is already used by another product` },
        { status: 400 }
      );
    }

    // Check slug conflict
    const slugConflict = await prisma.product.findFirst({
      where: {
        slug: data.slug,
        id: { not: id },
      },
    });

    let slug = data.slug;
    if (slugConflict) {
      slug = `${data.slug}-${Date.now().toString().slice(-4)}`;
    }

    // Update in transaction: replace images & variants, update product fields
    const updated = await prisma.$transaction(async (tx) => {
      // Delete old images and variants
      await tx.productImage.deleteMany({ where: { productId: id } });
      await tx.productVariant.deleteMany({ where: { productId: id } });

      return tx.product.update({
        where: { id },
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
    });

    await recordAuditLog({
      action: "PRODUCT_UPDATED",
      details: `Updated product "${updated.name}" (SKU: ${updated.sku})`,
      adminUserId: admin.id,
    });

    try {
      revalidatePath("/products");
      revalidatePath(`/products/${updated.slug}`);
      revalidatePath("/categories");
      revalidatePath("/");
    } catch (e) {
      console.error("Revalidate path error:", e);
    }

    return NextResponse.json({ success: true, product: updated });
  } catch (error) {
    console.error("Update product error:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
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
    const product = await prisma.product.findUnique({
      where: { id },
      include: { orderItems: true },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // If order items exist, instead of deleting, deactivate or archive
    if (product.orderItems.length > 0) {
      await prisma.product.update({
        where: { id },
        data: { isActive: false },
      });

      try {
        revalidatePath("/products");
        revalidatePath(`/products/${product.slug}`);
        revalidatePath("/categories");
        revalidatePath("/");
      } catch (e) {
        console.error("Revalidate path error:", e);
      }

      return NextResponse.json({
        success: true,
        message: "Product has associated orders, so it was deactivated instead of deleted.",
      });
    }

    await prisma.product.delete({ where: { id } });

    await recordAuditLog({
      action: "PRODUCT_DELETED",
      details: `Deleted product "${product.name}" (SKU: ${product.sku})`,
      adminUserId: admin.id,
    });

    try {
      revalidatePath("/products");
      revalidatePath(`/products/${product.slug}`);
      revalidatePath("/categories");
      revalidatePath("/");
    } catch (e) {
      console.error("Revalidate path error:", e);
    }

    return NextResponse.json({ success: true, message: "Product deleted" });
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
