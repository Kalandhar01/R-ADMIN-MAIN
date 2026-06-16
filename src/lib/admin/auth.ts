import "server-only";

import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { prisma as _prisma } from "@/lib/server/prisma";
const prisma = _prisma as any;
import { ADMIN_SESSION_COOKIE as SHARED_ADMIN_SESSION_COOKIE } from "@ractysh/auth";
import type { AdminSessionUser } from "@ractysh/types/admin";

export const ADMIN_SESSION_COOKIE = SHARED_ADMIN_SESSION_COOKIE;
const SESSION_TTL_SECONDS = 60 * 60 * 8;
const DEVELOPMENT_ADMIN_EMAIL = process.env.NODE_ENV === "development" ? "fawas" : undefined;
const DEVELOPMENT_ADMIN_PASSWORD = process.env.NODE_ENV === "development" ? "admin123" : undefined;

type AdminWithRoles = {
  id: string;
  email: string;
  name: string;
  active: boolean;
  imageUrl: string | null;
  passwordHash: string | null;
  googleId: string | null;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  roles: Array<{ name: string }>;
};

type SessionPayload = {
  adminId: string;
  email: string;
  roles: string[];
  exp: number;
};

export function adminSessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "strict" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS
  };
}

function sessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;
  if (!secret) throw new Error("ADMIN_SESSION_SECRET environment variable is not set");
  return secret;
}

function encodeBase64Url(value: string): string {
  return Buffer.from(value).toString("base64url");
}

function decodeBase64Url(value: string): string {
  return Buffer.from(value, "base64url").toString("utf8");
}

function signatureFor(payload: string): string {
  return createHmac("sha256", sessionSecret()).update(payload).digest("base64url");
}

function sessionUser(admin: AdminWithRoles): AdminSessionUser {
  return {
    id: admin.id,
    email: admin.email,
    name: admin.name,
    roles: (admin.roles || []).map((role) => role.name)
  };
}

export function hashAdminPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");

  return `scrypt$${salt}$${hash}`;
}

function verifyPassword(password: string, storedHash: string | null): boolean {
  if (!storedHash) return false;

  const [scheme, salt, expected] = storedHash.split("$");
  if (scheme !== "scrypt" || !salt || !expected) return false;

  const actual = scryptSync(password, salt, 64);
  const expectedBuffer = Buffer.from(expected, "hex");
  if (actual.length !== expectedBuffer.length) return false;

  return timingSafeEqual(actual, expectedBuffer);
}

export function createAdminSessionToken(admin: AdminSessionUser): string {
  const payload: SessionPayload = {
    adminId: admin.id,
    email: admin.email,
    roles: admin.roles,
    exp: Date.now() + SESSION_TTL_SECONDS * 1000
  };
  const encodedPayload = encodeBase64Url(JSON.stringify(payload));

  return `${encodedPayload}.${signatureFor(encodedPayload)}`;
}

function verifyAdminSessionToken(token: string | undefined): SessionPayload | null {
  if (!token) return null;

  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) return null;

  const actualSignature = signatureFor(encodedPayload);
  const actualBuffer = Buffer.from(actualSignature);
  const expectedBuffer = Buffer.from(signature);
  if (actualBuffer.length !== expectedBuffer.length || !timingSafeEqual(actualBuffer, expectedBuffer)) {
    return null;
  }

  try {
    const payload = JSON.parse(decodeBase64Url(encodedPayload)) as SessionPayload;
    if (!payload.adminId || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

async function getAdminById(adminId: string): Promise<AdminSessionUser | null> {
  const admin = (await prisma.admin.findUnique({
    where: { id: adminId },
    include: { roles: { select: { name: true } } }
  })) as AdminWithRoles | null;

  if (!admin?.active) return null;
  return sessionUser(admin);
}

async function ensureEnterpriseOwnerRole() {
  return prisma.role.upsert({
    where: { name: "Enterprise Owner" },
    update: {
      permissions: [
        "dashboard:read",
        "leads:write",
        "blogs:write",
        "newsletter:write",
        "services:write",
        "media:write",
        "careers:write",
        "settings:write",
        "audit:read"
      ]
    },
    create: {
      name: "Enterprise Owner",
      description: "Full access to the Ractysh enterprise command center.",
      permissions: [
        "dashboard:read",
        "leads:write",
        "blogs:write",
        "newsletter:write",
        "services:write",
        "media:write",
        "careers:write",
        "settings:write",
        "audit:read"
      ]
    }
  });
}

async function bootstrapDevelopmentAdmin(email: string, password: string): Promise<AdminWithRoles | null> {
  if (process.env.NODE_ENV !== "development") return null;
  if (email !== DEVELOPMENT_ADMIN_EMAIL || password !== DEVELOPMENT_ADMIN_PASSWORD) return null;

  const role = await ensureEnterpriseOwnerRole();

  return prisma.admin.upsert({
    where: { email },
    update: {
      name: "Ractysh Administrator",
      active: true,
      passwordHash: hashAdminPassword(password),
      roles: { connect: { id: role.id } }
    },
    create: {
      email,
      name: "Ractysh Administrator",
      active: true,
      passwordHash: hashAdminPassword(password),
      roles: { connect: { id: role.id } }
    },
    include: { roles: { select: { name: true } } }
  });
}

export async function getCurrentAdmin(): Promise<AdminSessionUser | null> {
  const cookieStore = await cookies();
  const payload = verifyAdminSessionToken(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);

  if (!payload) return null;
  return getAdminById(payload.adminId);
}

export async function getCurrentAdminFromRequest(request: NextRequest): Promise<AdminSessionUser | null> {
  const payload = verifyAdminSessionToken(request.cookies.get(ADMIN_SESSION_COOKIE)?.value);

  if (!payload) return null;
  return getAdminById(payload.adminId);
}

export async function signInWithCredentials(input: {
  email: string;
  password: string;
  ipAddress?: string | null;
  userAgent?: string | null;
}): Promise<AdminSessionUser | null> {
  const email = input.email.trim().toLowerCase();
  const password = input.password;
  let admin: AdminWithRoles | null = await prisma.admin.findUnique({
    where: { email },
    include: { roles: { select: { name: true } } }
  });

  if (!admin) {
    admin = await bootstrapDevelopmentAdmin(email, password);
  }

  const validPassword =
    Boolean(admin?.passwordHash && verifyPassword(password, admin.passwordHash)) ||
    (process.env.NODE_ENV === "development" && email === DEVELOPMENT_ADMIN_EMAIL && password === DEVELOPMENT_ADMIN_PASSWORD);

  if (!admin?.active || !validPassword) return null;

  const updated = await prisma.admin.update({
    where: { id: admin.id },
    data: { lastLoginAt: new Date() },
    include: { roles: { select: { name: true } } }
  });

  await prisma.auditLog.create({
    data: {
      adminId: updated.id,
      action: "login",
      entity: "Admin",
      entityId: updated.id,
      summary: "Admin signed in with email and password.",
      ipAddress: input.ipAddress || undefined,
      userAgent: input.userAgent || undefined
    }
  });

  return sessionUser(updated);
}

export async function signInWithGoogleProfile(input: {
  email: string;
  name?: string | null;
  picture?: string | null;
  googleId?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
}): Promise<AdminSessionUser | null> {
  const email = input.email.trim().toLowerCase();
  const admin = await prisma.admin.findUnique({
    where: { email },
    include: { roles: { select: { name: true } } }
  });

  if (!admin?.active) return null;

  const updated = await prisma.admin.update({
    where: { id: admin.id },
    data: {
      name: input.name || admin.name,
      imageUrl: input.picture || admin.imageUrl,
      googleId: input.googleId || admin.googleId,
      lastLoginAt: new Date()
    },
    include: { roles: { select: { name: true } } }
  });

  await prisma.auditLog.create({
    data: {
      adminId: updated.id,
      action: "login",
      entity: "Admin",
      entityId: updated.id,
      summary: "Admin signed in with Google.",
      ipAddress: input.ipAddress || undefined,
      userAgent: input.userAgent || undefined
    }
  });

  return sessionUser(updated);
}

export async function setAdminSession(admin: AdminSessionUser): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, createAdminSessionToken(admin), adminSessionCookieOptions());
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
}
