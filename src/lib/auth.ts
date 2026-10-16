import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import prisma from "./prisma";

const JWT_SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || "super-secret-jwt-key-bbg-textile-sangli-2026-production"
);

export const AUTH_COOKIE_NAME = "bbg_admin_token";

export interface AdminPayload {
  id: string;
  email: string;
  name: string;
  role: "OWNER" | "ADMIN" | "STAFF";
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function signAdminToken(payload: AdminPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function verifyAdminToken(token: string): Promise<AdminPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as AdminPayload;
  } catch {
    return null;
  }
}

export async function getCurrentAdmin(): Promise<AdminPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    if (!token) return null;

    const payload = await verifyAdminToken(token);
    if (!payload) return null;

    // Verify user exists and is still active in database
    const user = await prisma.adminUser.findUnique({
      where: { id: payload.id },
      select: { id: true, email: true, name: true, role: true, isActive: true },
    });

    if (!user || !user.isActive) return null;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  } catch {
    return null;
  }
}

export async function getAdminFromRequest(req: NextRequest): Promise<AdminPayload | null> {
  try {
    const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
    if (!token) return null;

    const payload = await verifyAdminToken(token);
    if (!payload || !payload.id) return null;

    return {
      id: payload.id,
      email: payload.email,
      name: payload.name,
      role: payload.role,
    };
  } catch {
    return null;
  }
}

export async function recordAuditLog(params: {
  action: string;
  details?: string;
  adminUserId?: string;
  ipAddress?: string;
}) {
  try {
    await prisma.auditLog.create({
      data: {
        action: params.action,
        details: params.details,
        adminUserId: params.adminUserId,
        ipAddress: params.ipAddress,
      },
    });
  } catch (error) {
    console.error("Failed to record audit log:", error);
  }
}
