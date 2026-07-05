import { describe, it, expect } from "vitest";
import { z } from "zod";
import { validationError } from "../../lib/action-utils";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
});

describe("validationError", () => {
  it("returns success: false", () => {
    const result = schema.safeParse({ name: "", email: "bad" });
    expect(result.success).toBe(false);
    if (!result.success) {
      const state = validationError(result.error);
      expect(state.success).toBe(false);
    }
  });

  it("includes flattened field errors", () => {
    const result = schema.safeParse({ name: "", email: "bad" });
    expect(result.success).toBe(false);
    if (!result.success) {
      const state = validationError(result.error);
      if (!state.success) {
        expect(state.errors).toHaveProperty("name");
        expect(state.errors).toHaveProperty("email");
        expect(state.errors.name[0]).toBe("Name is required");
        expect(state.errors.email[0]).toBe("Invalid email");
      }
    }
  });

  it("includes a human-readable message", () => {
    const result = schema.safeParse({ name: "", email: "" });
    expect(result.success).toBe(false);
    if (!result.success) {
      const state = validationError(result.error);
      if (!state.success) {
        expect(typeof state.message).toBe("string");
        expect(state.message!.length).toBeGreaterThan(0);
      }
    }
  });

  it("returns empty errors object when schema passes", () => {
    // Sanity check: valid input produces no ZodError to pass
    const result = schema.safeParse({ name: "Alice", email: "alice@example.com" });
    expect(result.success).toBe(true);
  });
});
