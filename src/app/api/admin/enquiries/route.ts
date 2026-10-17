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

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";

  const where: any = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { phone: { contains: search } },
      { email: { contains: search, mode: "insensitive" } },
      { message: { contains: search, mode: "insensitive" } },
    ];
  }

  if (status && status !== "ALL") {
    where.status = status;
  }

  const isDefaultQuery = !search && (!status || status === "ALL");
  const cacheKey = "admin_enquiries_default";

  if (isDefaultQuery) {
    const cached = getCached<any[]>(cacheKey);
    if (cached) {
      return NextResponse.json(
        { enquiries: cached },
        { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" } }
      );
    }
  }

  try {
    let timer: NodeJS.Timeout;
    const timeout = new Promise<any[]>((resolve) => {
      timer = setTimeout(() => resolve([]), 1000);
    });

    const dbQuery = prisma.enquiry.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        product: {
          select: { id: true, name: true, sku: true, slug: true },
        },
      },
    });

    const enquiries = await Promise.race([dbQuery, timeout]).finally(() => clearTimeout(timer));

    if (isDefaultQuery && enquiries && enquiries.length > 0) {
      setCached(cacheKey, enquiries, 60);
    }

    return NextResponse.json(
      { enquiries },
      { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" } }
    );
  } catch (error) {
    console.error("Fetch enquiries error:", error);
    return NextResponse.json({ enquiries: [] });
  }
}

