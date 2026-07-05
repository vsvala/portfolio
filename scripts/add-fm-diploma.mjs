import { createClient } from "@libsql/client";
import { readFileSync, statSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const envContent = readFileSync(resolve(__dirname, "..", ".env.local"), "utf-8");
const env = {};
for (const line of envContent.split("\n")) {
  const t = line.trim();
  if (!t || t.startsWith("#")) continue;
  const eq = t.indexOf("=");
  if (eq === -1) continue;
  env[t.slice(0, eq).trim()] = t.slice(eq + 1).trim();
}

const db = createClient({ url: env.TURSO_URL, authToken: env.TURSO_AUTH_TOKEN });

const filename = "tutkintotodistus-fm-tietojenkasittely-virva-svala.jpg";
const stats = statSync(resolve(__dirname, "..", "private-documents", filename));

const ins = await db.execute({
  sql: `INSERT INTO pdf_documents (filename, label_fi, label_en, document_type, file_size, is_protected)
        VALUES (?, ?, ?, ?, ?, 1)`,
  args: [filename, "Tutkintotodistus", "Diploma", "study_certificate", stats.size],
});
const docId = Number(ins.lastInsertRowid);
console.log("Inserted doc id:", docId);

await db.execute({ sql: "UPDATE education SET document_id = ? WHERE id = 1", args: [docId] });
console.log("Linked to education 1 (M.Sc. Computer Science)");

await db.close();
