import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { z } from "zod";
import { cookies } from "next/headers";
import type { SessionPayload } from "./types";

const SessionPayloadSchema = z.object({
  role: z.literal("admin"),
  exp: z.number(),
  iat: z.number(),
});

const secretKey = process.env.SESSION_SECRET;
if (!secretKey || secretKey.length < 32) {
  throw new Error("SESSION_SECRET must be set to a string of 32+ characters");
}
const encodedKey = new TextEncoder().encode(secretKey);

export async function encrypt(payload: Omit<SessionPayload, "iat" | "exp">) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

export async function decrypt(token: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(token, encodedKey, {
      algorithms: ["HS256"],
    });
    return SessionPayloadSchema.parse(payload) as SessionPayload;
  } catch {
    return null;
  }
}

export async function createSession() {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const token = await encrypt({ role: "admin" });
  const cookieStore = await cookies();
  cookieStore.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}

export async function getSessionToken() {
  const cookieStore = await cookies();
  return cookieStore.get("session")?.value;
}
