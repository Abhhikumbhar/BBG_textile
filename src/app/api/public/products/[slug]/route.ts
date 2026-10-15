import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCatalogProductBySlug, getCatalogRelatedProducts } from "@/lib/catalog";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    let product: any = null;
    let relatedProducts: any[] = [];

    try {
      product = await prisma.product.findFirst({
        where: {
          OR: [{ slug }, { id: slug }],
          isActive: true,
        },
        include: {
          category: true,
          images: {
            orderBy: { displayOrder: "asc" },
          },
          variants: {
            orderBy: { createdAt: "asc" },
          },
        },
      });

      if (product) {
        relatedProducts = await prisma.product.findMany({
          where: {
            categoryId: product.categoryId,
            id: { not: product.id },
            isActive: true,
          },
          take: 4,
          orderBy: { createdAt: "desc" },
          include: {
            category: { select: { name: true, slug: true } },
            images: { take: 1, orderBy: { displayOrder: "asc" } },
          },
        });
      }
    } catch (dbErr) {
      console.warn("DB offline in API route, falling back to static catalog:", dbErr);
    }

    if (!product) {
      product = getCatalogProductBySlug(slug);
      if (product) {
        relatedProducts = getCatalogRelatedProducts(product.id, 4);
      }
    }

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ product, relatedProducts });
  } catch (error) {
    console.error("Public product detail error:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
