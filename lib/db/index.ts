import "server-only";
import { createClient } from "@libsql/client";

const url = process.env.TURSO_URL;
if (!url) throw new Error("TURSO_URL environment variable is required");

const db = createClient({
  url,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export default db;
