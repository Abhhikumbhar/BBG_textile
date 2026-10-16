import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { getAdminFromRequest, recordAuditLog } from "@/lib/auth";
import { siteSettingsSchema, formatZodError } from "@/lib/validations";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const admin = await getAdminFromRequest(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    let settings = await prisma.siteSettings.findUnique({
      where: { id: "default" },
    });

    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {
          id: "default",
          businessName: "BBG TEXTILE",
          address:
            "GROUND FLOOR, KHARE MALA, S.NO-204 PLOT NO 28, Kupwad MIDC Area, Madhavnagar, Sangli, Maharashtra - 416436, OLD KUPWAD ROAD, SANGLI - 416416",
          city: "Sangli",
          state: "Maharashtra",
          pincode: "416416",
          phone: "+91 87673 22501",
          whatsappNumber: "918767322501",
          email: "bbgtextilebharat1@gmail.com",
          aboutStory: "Premier textile manufacturer in Sangli.",
        },
      });
    }

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
