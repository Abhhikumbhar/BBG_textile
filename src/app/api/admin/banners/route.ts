import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminFromRequest, recordAuditLog } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const admin = await getAdminFromRequest(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const banners = await prisma.homeBanner.findMany({
      orderBy: { displayOrder: "asc" },
    });
    return NextResponse.json({ banners });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch banners" }, { status: 500 });
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

    return NextResponse.json({ success: true, banner }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create banner" }, { status: 500 });
  }
}
