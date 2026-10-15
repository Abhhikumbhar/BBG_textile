import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, getAdminFromRequest, recordAuditLog } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const admin = await getAdminFromRequest(req);
  if (admin) {
    await recordAuditLog({
      action: "ADMIN_LOGOUT",
      details: `Admin ${admin.email} logged out`,
      adminUserId: admin.id,
      ipAddress: req.headers.get("x-forwarded-for") || "local",
    });
  }

  const response = NextResponse.json({ success: true, message: "Logged out" });
  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
  return response;
}
