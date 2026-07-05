"use client";
import Image from "next/image";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import type { Lang } from "@/lib/types";
import { certifications } from "@/lib/static-content";

interface Achievement {
  text_fi: string;
  text_en: string;
  year: string;
}

const achievements: Achievement[] = [];

export function CertificationsSection({ lang }: { lang: Lang }) {
  return (
    <Box>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mb: 4 }}>
        {certifications.map((cert) => (
          <Card key={cert.title_en} sx={{ flex: "1 1 300px", maxWidth: 480 }}>
            <CardActionArea
              component="a"
              href={cert.credentialUrl ?? cert.imageUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Box sx={{ position: "relative", width: "100%", height: 220 }}>
                <Image
                  src={cert.imageUrl}
                  alt={lang === "fi" ? cert.title_fi : cert.title_en}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 600px) 100vw, 480px"
                />
              </Box>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {lang === "fi" ? cert.title_fi : cert.title_en}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  {lang === "fi" ? cert.issuer_fi : cert.issuer_en} · {cert.year}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                  {lang === "fi" ? cert.description_fi : cert.description_en}
                </Typography>
                <Stack direction="row" sx={{ flexWrap: "wrap", gap: 0.5 }}>
                  {cert.technologies.map((tech) => (
                    <Chip key={tech} label={tech} size="small" variant="outlined" />
                  ))}
                </Stack>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>

      {achievements.length > 0 && (
        <>
          <Divider sx={{ mb: 3 }} />
          <Stack sx={{ gap: 2 }}>
            {achievements.map((a) => (
              <Box
                key={a.year + a.text_en}
                sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}
              >
                <EmojiEventsIcon sx={{ color: "secondary.main", mt: 0.3, flexShrink: 0 }} />
                <Box>
                  <Typography variant="body1">{lang === "fi" ? a.text_fi : a.text_en}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {a.year}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Stack>
        </>
      )}
    </Box>
  );
}
