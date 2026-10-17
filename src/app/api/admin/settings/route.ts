import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { getAdminFromRequest, recordAuditLog } from "@/lib/auth";
import { siteSettingsSchema, formatZodError } from "@/lib/validations";
import { getSiteSettings, invalidateDataCache } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const admin = await getAdminFromRequest(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const settings = await getSiteSettings();
    return NextResponse.json({ settings });
  } catch (error) {
    console.error("Fetch settings error:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const admin = await getAdminFromRequest(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const result = siteSettingsSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: formatZodError(result.error) },
        { status: 400 }
      );
    }

    const updated = await prisma.siteSettings.upsert({
      where: { id: "default" },
      update: result.data,
      create: {
        id: "default",
        ...result.data,
      },
    });

    await recordAuditLog({
      action: "SETTINGS_UPDATED",
      details: "Updated website content and site settings",
      adminUserId: admin.id,
    });

    invalidateDataCache();

    try {
      revalidatePath("/");
      revalidatePath("/products");
      revalidatePath("/categories");
    } catch (e) {
      console.error("Revalidate path error:", e);
    }

    return NextResponse.json({ success: true, settings: updated });
  } catch (error) {
    console.error("Update settings error:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
