import { NextRequest, NextResponse } from "next/server";
import { getAdminFromRequest } from "@/lib/auth";
import { getAdminAuditLogs } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const admin = await getAdminFromRequest(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const logs = await getAdminAuditLogs(50);
    return NextResponse.json({ logs });
  } catch (error) {
    return NextResponse.json({ logs: [] });
  }
}

