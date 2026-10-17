import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminFromRequest } from "@/lib/auth";
import { getCached, setCached } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const admin = await getAdminFromRequest(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cacheKey = "admin_dashboard_metrics";
  const cached = getCached<any>(cacheKey);
  if (cached) {
    return NextResponse.json(cached);
  }

  try {
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
    ] = await Promise.all([
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
        include: {
          items: true,
        },
      }),
      prisma.enquiry.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          product: {
            select: { name: true, sku: true },
          },
        },
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
        _sum: {
          total: true,
        },
        where: {
          status: { not: "CANCELLED" },
        },
      }),
    ]);

    const payload = {
      metrics: {
        totalProducts,
        activeProducts,
        lowStockProducts,
        totalCategories,
        totalOrders,
        pendingOrders,
        totalEnquiries,
        newEnquiries,
        totalRevenue: orderStats._sum.total || 0,
      },
      recentOrders,
      recentEnquiries,
      recentProducts,
    };

    setCached(cacheKey, payload, 30);

    return NextResponse.json(payload);
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard statistics" },
      { status: 500 }
    );
  }
}
