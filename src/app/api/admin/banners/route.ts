import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { getAdminFromRequest, recordAuditLog } from "@/lib/auth";
import { getCached, setCached, invalidateDataCache } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const admin = await getAdminFromRequest(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cacheKey = "admin_banners_all";
  const cached = getCached<any[]>(cacheKey);
  if (cached) {
    return NextResponse.json({ banners: cached });
  }

  try {
    let timer: NodeJS.Timeout;
    const timeout = new Promise<any[]>((resolve) => {
      timer = setTimeout(() => resolve([]), 1000);
    });

    const dbQuery = prisma.homeBanner.findMany({
      orderBy: { displayOrder: "asc" },
    });

    const banners = await Promise.race([dbQuery, timeout]).finally(() => clearTimeout(timer));
    setCached(cacheKey, banners, 60);

    return NextResponse.json({ banners });
  } catch (error) {
    return NextResponse.json({ banners: [] });
  }
}

export async function POST(req: NextRequest) {
  const admin = await getAdminFromRequest(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, subtitle, linkUrl, buttonText, imageUrl, displayOrder, isActive } = body;

    if (!title || !imageUrl) {
      return NextResponse.json({ error: "Title and Image are required" }, { status: 400 });
    }

    const banner = await prisma.homeBanner.create({
      data: {
        title,
        subtitle,
        linkUrl,
        buttonText: buttonText || "Explore Collection",
        imageUrl,
        displayOrder: Number(displayOrder) || 0,
        isActive: isActive !== false,
      },
    });

    await recordAuditLog({
      action: "BANNER_CREATED",
      details: `Created home banner "${banner.title}"`,
      adminUserId: admin.id,
    });

    invalidateDataCache();

    try {
      revalidatePath("/");
    } catch (e) {
      console.error("Revalidate path error:", e);
    }

    return NextResponse.json({ success: true, banner }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create banner" }, { status: 500 });
  }
}
