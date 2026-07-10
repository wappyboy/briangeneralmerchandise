import "server-only";

import { createHmac, pbkdf2Sync, randomBytes, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import type { AdminRole } from "@/types/admin";

const sessionCookieName = "bgm_admin_session";
const sessionMaxAgeSeconds = 60 * 60 * 8;

type SessionPayload = {
  sub: string;
  email: string;
  role: AdminRole;
  exp: number;
};

function getSessionSecret() {
  const secret = process.env.SESSION_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error("SESSION_SECRET must be set to at least 32 characters.");
  }

  return secret;
}

function base64Url(value: string | Buffer) {
  return Buffer.from(value)
    .toString("base64")
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

function sign(value: string) {
  return base64Url(createHmac("sha256", getSessionSecret()).update(value).digest());
}

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = pbkdf2Sync(password, salt, 120000, 32, "sha256").toString("hex");
  return `pbkdf2_sha256$120000$${salt}$${hash}`;
}

function verifyPassword(password: string, storedHash: string) {
  const [scheme, iterations, salt, hash] = storedHash.split("$");

  if (scheme !== "pbkdf2_sha256" || !iterations || !salt || !hash) {
    return false;
  }

  const computed = pbkdf2Sync(password, salt, Number(iterations), 32, "sha256");
  const expected = Buffer.from(hash, "hex");

  return expected.length === computed.length && timingSafeEqual(expected, computed);
}

export function createSessionToken(payload: Omit<SessionPayload, "exp">) {
  const session: SessionPayload = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + sessionMaxAgeSeconds,
  };
  const body = base64Url(JSON.stringify(session));
  return `${body}.${sign(body)}`;
}

export function verifySessionToken(token?: string): SessionPayload | null {
  if (!token) {
    return null;
  }

  const [body, signature] = token.split(".");
  if (!body || !signature || sign(body) !== signature) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as SessionPayload;
    return payload.exp > Math.floor(Date.now() / 1000) ? payload : null;
  } catch {
    return null;
  }
}

export async function getSession() {
  const cookieStore = await cookies();
  return verifySessionToken(cookieStore.get(sessionCookieName)?.value);
}

export async function requireAdmin() {
  const session = await getSession();

  if (!session) {
    redirect("/admin/login");
  }

  return session;
}

export async function assertAdmin() {
  const session = await getSession();

  if (!session) {
    throw new Error("Unauthorized.");
  }

  return session;
}

export async function loginAdmin(email: string, password: string) {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

  if (!adminEmail || !adminPasswordHash) {
    throw new Error("Admin credentials are not configured. Set ADMIN_EMAIL and ADMIN_PASSWORD_HASH.");
  }

  if (email.toLowerCase() !== adminEmail.toLowerCase()) {
    throw new Error("Invalid admin credentials.");
  }

  if (!verifyPassword(password, adminPasswordHash)) {
    throw new Error("Invalid admin credentials.");
  }

  const token = createSessionToken({
    sub: "admin",
    email: adminEmail,
    role: (process.env.ADMIN_ROLE as AdminRole) || "owner",
  });

  const cookieStore = await cookies();
  cookieStore.set(sessionCookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: sessionMaxAgeSeconds,
  });
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete(sessionCookieName);
}
