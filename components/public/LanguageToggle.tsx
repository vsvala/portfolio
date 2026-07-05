"use client";
import { useRouter } from "next/navigation";
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";

export function LanguageToggle({ currentLang }: { currentLang: "fi" | "en" }) {
  const router = useRouter();

  function setLang(lang: "fi" | "en") {
    document.cookie = `lang=${lang}; path=/; max-age=31536000`;
    router.refresh();
  }

  return (
    <ButtonGroup size="small">
      <Button
        onClick={() => setLang("fi")}
        variant={currentLang === "fi" ? "contained" : "outlined"}
        sx={{
          color: currentLang === "fi" ? "white" : "rgba(255,255,255,0.7)",
          borderColor: "rgba(255,255,255,0.4)",
          backgroundColor: currentLang === "fi" ? "rgba(255,255,255,0.2)" : "transparent",
          minWidth: 36,
        }}
      >
        FI
      </Button>
      <Button
        onClick={() => setLang("en")}
        variant={currentLang === "en" ? "contained" : "outlined"}
        sx={{
          color: currentLang === "en" ? "white" : "rgba(255,255,255,0.7)",
          borderColor: "rgba(255,255,255,0.4)",
          backgroundColor: currentLang === "en" ? "rgba(255,255,255,0.2)" : "transparent",
          minWidth: 36,
        }}
      >
        EN
      </Button>
    </ButtonGroup>
  );
}
