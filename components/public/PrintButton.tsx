"use client";
import Button from "@mui/material/Button";
import PrintIcon from "@mui/icons-material/Print";
import type { Lang } from "@/lib/types";

export function PrintButton({ lang }: { lang: Lang }) {
  return (
    <Button
      variant="outlined"
      startIcon={<PrintIcon />}
      onClick={() => window.print()}
      size="small"
    >
      {lang === "fi" ? "Tulosta / Tallenna PDF" : "Print / Save PDF"}
    </Button>
  );
}
