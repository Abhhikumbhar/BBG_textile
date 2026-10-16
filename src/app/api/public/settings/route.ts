import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [settings, banners, featuredProducts, categories] = await Promise.all([
      prisma.siteSettings.findUnique({
        where: { id: "default" },
      }),
      prisma.homeBanner.findMany({
        where: { isActive: true },
        orderBy: { displayOrder: "asc" },
      }),
      prisma.product.findMany({
        where: { isActive: true, isFeatured: true },
        take: 8,
        orderBy: { createdAt: "desc" },
        include: {
          category: { select: { id: true, name: true, slug: true } },
          images: { orderBy: { displayOrder: "asc" } },
        },
      }),
      prisma.category.findMany({
        where: { isActive: true },
        take: 6,
        orderBy: { displayOrder: "asc" },
        include: {
          _count: {
            select: { products: { where: { isActive: true } } },
          },
        },
      }),
    ]);

    return NextResponse.json({
      settings,
      banners,
      featuredProducts,
      categories,
    });
  } catch (error) {
    console.error("Public settings error:", error);
    return NextResponse.json(
      { error: "Failed to fetch site settings" },
      { status: 500 }
    );
  }
}
