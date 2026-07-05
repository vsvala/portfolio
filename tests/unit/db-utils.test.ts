import { describe, it, expect } from "vitest";
import { toArgs } from "@/lib/db/utils";

describe("toArgs", () => {
  it("passes through defined values as-is", () => {
    expect(toArgs({ name: "test", count: 5 })).toEqual({ name: "test", count: 5 });
  });

  it("converts undefined values to null", () => {
    expect(toArgs({ name: "test", end_date: undefined })).toEqual({ name: "test", end_date: null });
  });

  it("keeps explicit null values as null", () => {
    expect(toArgs({ name: "test", end_date: null })).toEqual({ name: "test", end_date: null });
  });

  it("appends id when provided", () => {
    expect(toArgs({ name: "test" }, 42)).toEqual({ name: "test", id: 42 });
  });

  it("does not include id when not provided", () => {
    const result = toArgs({ name: "test" });
    expect("id" in result).toBe(false);
  });

  it("handles empty data object with id", () => {
    expect(toArgs({}, 7)).toEqual({ id: 7 });
  });

  it("converts multiple undefined fields to null", () => {
    expect(toArgs({ a: undefined, b: undefined, c: "keep" })).toEqual({
      a: null,
      b: null,
      c: "keep",
    });
  });
});
