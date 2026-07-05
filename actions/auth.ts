"use server";
import { createSession, deleteSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { timingSafeEqual, createHash } from "crypto";
import { checkRateLimit, resetRateLimit } from "@/lib/rate-limiter";
import type { ActionState } from "@/lib/types";

function safeCompare(a: string, b: string): boolean {
  const hashA = createHash("sha256").update(a).digest();
  const hashB = createHash("sha256").update(b).digest();
  return timingSafeEqual(hashA, hashB);
}

export async function login(prevState: ActionState, formData: FormData): Promise<ActionState> {
  if (process.env.NODE_ENV === "production") {
    const { allowed } = checkRateLimit("login");
    if (!allowed) {
      return {
        success: false,
        errors: {},
        message: "Liian monta yritystä. Odota 15 min / Too many attempts. Wait 15 min.",
      };
    }
  }

  const password = formData.get("password") as string;
  if (!safeCompare(password, process.env.ADMIN_PASSWORD ?? "")) {
    return { success: false, errors: {}, message: "Väärä salasana / Wrong password" };
  }

  if (process.env.NODE_ENV === "production") {
    resetRateLimit("login");
  }
  await createSession();
  redirect("/admin");
}

export async function logout() {
  await deleteSession();
  redirect("/");
}
