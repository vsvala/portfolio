"use client";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { Lang } from "@/lib/types";

interface NavItem {
  key: string;
  label: string;
}

interface Props {
  items: NavItem[];
  lang: Lang;
  children: React.ReactNode;
}

export function SidebarNav({ items, lang, children }: Props) {
  const [activeKey, setActiveKey] = useState<string>(items[0]?.key ?? "");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    items.forEach(({ key }) => {
      const el = document.getElementById(key);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveKey(key);
        },
        { rootMargin: "-10% 0px -70% 0px", threshold: 0 }
      );
      observer.observe(el);
      observers.push(observer);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [items]);

  return (
    <>
      {/* Mobile: horizontal scrollable pill nav */}
      {items.length > 1 && (
        <Box
          sx={{
            display: { xs: "flex", md: "none" },
            overflowX: "auto",
            gap: 1,
            mb: 3,
            pb: 0.5,
            "&::-webkit-scrollbar": { display: "none" },
            scrollbarWidth: "none",
          }}
        >
          {items.map(({ key, label }) => (
            <Box
              key={key}
              component="a"
              href={`#${key}`}
              sx={{
                flexShrink: 0,
                fontSize: "0.75rem",
                fontWeight: activeKey === key ? 700 : 500,
                color: activeKey === key ? "white" : "secondary.main",
                backgroundColor: activeKey === key ? "secondary.main" : "transparent",
                border: "1px solid",
                borderColor: "secondary.main",
                borderRadius: "20px",
                px: 1.5,
                py: 0.5,
                textDecoration: "none",
                whiteSpace: "nowrap",
                transition: "all 0.15s",
              }}
            >
              {label}
            </Box>
          ))}
        </Box>
      )}

      {/* Desktop: flex row — sidebar left, content right */}
      <Box sx={{ display: "flex", gap: 4, alignItems: "flex-start" }}>
        {items.length > 1 && (
          <Box
            sx={{
              display: { xs: "none", md: "block" },
              position: "sticky",
              top: "80px",
              minWidth: 160,
              borderRight: "2px solid rgba(233,69,96,0.3)",
              pr: 3,
              pt: 1,
            }}
          >
            <Typography
              variant="overline"
              sx={{ color: "text.disabled", letterSpacing: 2, display: "block", mb: 2 }}
            >
              {lang === "fi" ? "Sisältö" : "Contents"}
            </Typography>
            <Stack sx={{ gap: 0.5 }}>
              {items.map(({ key, label }) => (
                <Box
                  key={key}
                  component="a"
                  href={`#${key}`}
                  sx={{
                    color: "secondary.main",
                    textDecoration: "none",
                    fontSize: "0.9rem",
                    py: 0.5,
                    display: "block",
                    fontWeight: activeKey === key ? 700 : 400,
                    opacity: activeKey === key ? 1 : 0.75,
                    transition: "all 0.15s",
                    "&:hover": { opacity: 1 },
                  }}
                >
                  {label}
                </Box>
              ))}
            </Stack>
          </Box>
        )}

        <Box sx={{ flex: 1, minWidth: 0 }}>{children}</Box>
      </Box>
    </>
  );
}
