import { vi } from "vitest";

// server-only throws when imported outside React Server Components.
// In unit tests we run in plain Node — mock it to a no-op.
vi.mock("server-only", () => ({}));

// next/headers is only available in the Next.js runtime.
vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));
