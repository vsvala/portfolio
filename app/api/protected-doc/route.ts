import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

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

  const expected = process.env.CERTIFICATE_PASSWORD;
  if (!expected || password !== expected) {
    return NextResponse.json({ error: "Väärä salasana" }, { status: 401 });
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
