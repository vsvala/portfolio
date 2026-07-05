import { defineConfig, devices } from "@playwright/test";
import fs from "fs";

try {
  for (const line of fs.readFileSync(".env.local", "utf-8").split("\n")) {
    const eq = line.indexOf("=");
    if (eq > 0 && !line.startsWith("#")) {
      const key = line.slice(0, eq).trim();
      const val = line
        .slice(eq + 1)
        .trim()
        .replace(/^["']|["']$/g, "");
      process.env[key] ??= val;
    }
  }
} catch {
  /* .env.local not found */
}

export default defineConfig({
  testDir: "./tests/e2e",
  outputDir: "test-results",
  reporter: "list",
  workers: 2,
  globalSetup: "./tests/e2e/global-setup.ts",
  use: {
    baseURL: "http://localhost:3001",
    trace: "on-first-retry",
  },
  expect: {
    timeout: 10000,
  },
  webServer: {
    command: "npm run dev -- -p 3001",
    url: "http://localhost:3001/api/health",
    reuseExistingServer: false,
    timeout: 60000,
    env: {
      TURSO_URL: "file:./test.db",
      TURSO_AUTH_TOKEN: "",
      SESSION_SECRET: process.env.SESSION_SECRET ?? "",
      ADMIN_PASSWORD: process.env.ADMIN_PASSWORD ?? "",
    },
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
