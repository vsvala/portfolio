import { describe, it, expect, beforeAll } from "vitest";

// Set required env vars before importing session module
beforeAll(() => {
  process.env.SESSION_SECRET = "test-secret-key-that-is-long-enough-32chars";
  process.env.TURSO_URL = "file:./test.db";
});

// Dynamic imports so env vars are set before module-level code runs
const getSession = () => import("../../lib/session");

describe("session encrypt/decrypt", () => {
  it("encrypts and decrypts a payload round-trip", async () => {
    const { encrypt, decrypt } = await getSession();
    const token = await encrypt({ role: "admin" });
    expect(typeof token).toBe("string");
    expect(token.length).toBeGreaterThan(0);

    const payload = await decrypt(token);
    expect(payload).not.toBeNull();
    expect(payload?.role).toBe("admin");
  });

  it("returns null for an invalid token", async () => {
    const { decrypt } = await getSession();
    const result = await decrypt("not.a.valid.jwt");
    expect(result).toBeNull();
  });

  it("returns null for a tampered token", async () => {
    const { encrypt, decrypt } = await getSession();
    const token = await encrypt({ role: "admin" });
    const tampered = token.slice(0, -5) + "XXXXX";
    const result = await decrypt(tampered);
    expect(result).toBeNull();
  });

  it("returns null for an empty string", async () => {
    const { decrypt } = await getSession();
    const result = await decrypt("");
    expect(result).toBeNull();
  });
});
