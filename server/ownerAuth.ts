import { timingSafeEqual } from "node:crypto";
import { parse } from "cookie";
import { jwtVerify, SignJWT } from "jose";

export const OWNER_DASHBOARD_EMAIL = "madonapaules@gmail.com";
export const OWNER_SESSION_COOKIE = "portfolio_owner_session";
const OWNER_SESSION_SECONDS = 60 * 60 * 8;

function signingKey() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is required for owner sessions");
  return new TextEncoder().encode(secret);
}

export function validateOwnerCredentials(email: string, password: string) {
  const expectedPassword = process.env.OWNER_DASHBOARD_PASSWORD ?? "";
  const normalizedEmail = email.trim().toLowerCase();
  if (!expectedPassword || normalizedEmail !== OWNER_DASHBOARD_EMAIL) return false;

  const provided = Buffer.from(password);
  const expected = Buffer.from(expectedPassword);
  return provided.length === expected.length && timingSafeEqual(provided, expected);
}

export async function createOwnerSession(email: string) {
  return new SignJWT({ role: "owner", email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${OWNER_SESSION_SECONDS}s`)
    .sign(signingKey());
}

export async function hasOwnerSession(cookieHeader: string | undefined) {
  const token = parse(cookieHeader ?? "")[OWNER_SESSION_COOKIE];
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, signingKey());
    return payload.role === "owner" && payload.email === OWNER_DASHBOARD_EMAIL;
  } catch {
    return false;
  }
}

export const ownerSessionMaxAge = OWNER_SESSION_SECONDS * 1000;
