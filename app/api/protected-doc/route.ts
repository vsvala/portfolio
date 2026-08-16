import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { safeCompare } from "@/lib/auth";
import { checkRateLimit, resetRateLimit } from "@/lib/rate-limiter";

export async function POST(request: NextRequest) {
  let filename: string | undefined;
  let password: string | undefined;

  try {
    const body = await request.json();
    filename = body.filename;
    password = body.password;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!filename || !/^[\w\-. ]+\.(pdf|jpg|png)$/i.test(filename)) {
    return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
  }

  if (process.env.NODE_ENV === "production") {
    const { allowed } = checkRateLimit("protected-doc");
    if (!allowed) {
      return NextResponse.json(
        { error: "Liian monta yritystä. Odota 15 min / Too many attempts. Wait 15 min." },
        { status: 429 }
      );
    }
  }

  const expected = process.env.CERTIFICATE_PASSWORD;
  if (!expected || !safeCompare(password ?? "", expected)) {
    return NextResponse.json({ error: "Väärä salasana" }, { status: 401 });
  }

  if (process.env.NODE_ENV === "production") {
    resetRateLimit("protected-doc");
  }

  const filepath = join(process.cwd(), "private-documents", filename);
  if (!existsSync(filepath)) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  const buffer = await readFile(filepath);
  const ext = filename.split(".").pop()?.toLowerCase();
  const contentType = ext === "pdf" ? "application/pdf" : `image/${ext}`;

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
