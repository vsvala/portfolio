import { describe, it, expect } from "vitest";
import { parseTechnologies } from "@/lib/utils";

describe("parseTechnologies", () => {
  it("parses a valid JSON array", () => {
    expect(parseTechnologies('["React","TypeScript","Node.js"]')).toEqual([
      "React",
      "TypeScript",
      "Node.js",
    ]);
  });

  it("returns [] for empty string", () => {
    expect(parseTechnologies("")).toEqual([]);
  });

  it('returns [] for "[]"', () => {
    expect(parseTechnologies("[]")).toEqual([]);
  });

  it("returns [] for invalid JSON", () => {
    expect(parseTechnologies("React, TypeScript")).toEqual([]);
  });

  it("returns [] for a plain word", () => {
    expect(parseTechnologies("React")).toEqual([]);
  });

  it("returns [] for malformed JSON", () => {
    expect(parseTechnologies("[React, TypeScript]")).toEqual([]);
  });
});
