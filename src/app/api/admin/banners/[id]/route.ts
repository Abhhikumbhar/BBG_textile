import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { getAdminFromRequest, recordAuditLog } from "@/lib/auth";

export const dynamic = "force-dynamic";

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
    const { title, subtitle, linkUrl, buttonText, imageUrl, displayOrder, isActive } = body;

    const banner = await prisma.homeBanner.update({
      where: { id },
      data: {
        ...(title ? { title } : {}),
        subtitle,
        linkUrl,
        buttonText,
        ...(imageUrl ? { imageUrl } : {}),
        displayOrder: Number(displayOrder) || 0,
        isActive: Boolean(isActive),
      },
    });

    await recordAuditLog({
      action: "BANNER_UPDATED",
      details: `Updated home banner "${banner.title}"`,
      adminUserId: admin.id,
    });

    try {
      revalidatePath("/");
    } catch (e) {
      console.error("Revalidate path error:", e);
    }

    return NextResponse.json({ success: true, banner });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update banner" }, { status: 500 });
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
    await prisma.homeBanner.delete({ where: { id } });

    await recordAuditLog({
      action: "BANNER_DELETED",
      details: `Deleted home banner ID ${id}`,
      adminUserId: admin.id,
    });

    try {
      revalidatePath("/");
    } catch (e) {
      console.error("Revalidate path error:", e);
    }

    return NextResponse.json({ success: true, message: "Banner deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete banner" }, { status: 500 });
  }
}
