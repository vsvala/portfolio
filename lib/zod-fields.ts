import { z } from "zod";

export const technologiesField = z
  .string()
  .default("")
  .transform((s) => {
    s = s.trim();
    if (!s) return "[]";
    if (s.startsWith("[")) return s;
    return JSON.stringify(
      s
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    );
  });

export const nullableStringField = z.preprocess(
  (v) => (!v || v === "" ? null : v),
  z.string().nullable().optional().default(null)
);

export const nullableNumberField = z.preprocess(
  (v) => (!v || v === "" ? null : v),
  z.coerce.number().nullable().optional().default(null)
);

export const nullableUrlField = z.preprocess(
  (v) => (!v || v === "" ? null : v),
  z.string().url().nullable().optional().default(null)
);
