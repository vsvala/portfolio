import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import LinearProgress from "@mui/material/LinearProgress";
import type { Lang } from "@/lib/types";
import { getAllSkills } from "@/lib/db/queries/skills";
import { SKILL_CATEGORY_LABELS, SKILL_CATEGORY_KEYS } from "@/lib/constants/categories";

const languages = [
  {
    fi: "Suomi",
    en: "Finnish",
    levelFi: "Äidinkieli",
    levelEn: "Native",
    pct: 100,
  },
  {
    fi: "Englanti",
    en: "English",
    levelFi: "Sujuva",
    levelEn: "Fluent",
    pct: 85,
  },
  { fi: "Ruotsi", en: "Swedish", levelFi: "Hyvä", levelEn: "Good", pct: 60 },
  {
    fi: "Ranska",
    en: "French",
    levelFi: "Perusteet",
    levelEn: "Basic",
    pct: 30,
  },
];

const exchangeStudies = [
  {
    place: "Kyproksen Suomi-koulu",
    placeEn: "Cyprus Finnish School",
    detail: "Opetusharjoittelu",
    detailEn: "Teaching practice",
    period: "Syksy 2001",
  },
  {
    place: "Malmö University, School of Education",
    placeEn: "Malmö University, School of Education",
    detail: "",
    detailEn: "",
    period: "Kevät 2000",
  },
  {
    place: "Haagse Hogeschool, Haagi, Hollanti",
    placeEn: "Haagse Hogeschool, The Hague, Netherlands",
    detail: "",
    detailEn: "",
    period: "Syksy 1999",
  },
];

export async function SkillsSection({ lang }: { lang: Lang }) {
  const allSkills = await getAllSkills();

  const grouped = SKILL_CATEGORY_KEYS.reduce<Record<string, string[]>>((acc, cat) => {
    acc[cat] = allSkills.filter((s) => s.category === cat).map((s) => s.name);
    return acc;
  }, {});

  const activeCategories = SKILL_CATEGORY_KEYS.filter((cat) => grouped[cat].length > 0);

  return (
    <Box sx={{ py: 6, backgroundColor: "background.default" }}>
      <Container maxWidth="md">
        <Typography variant="h4" sx={{ fontWeight: 700 }} gutterBottom>
          {lang === "fi" ? "Osaaminen" : "Skills"}
        </Typography>

        <Stack sx={{ gap: 3, mb: 5 }}>
          {activeCategories.map((cat) => (
            <Box key={cat}>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{ mb: 1, textTransform: "uppercase", letterSpacing: 1 }}
              >
                {SKILL_CATEGORY_LABELS[cat]?.[lang] ?? cat}
              </Typography>
              <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1 }}>
                {grouped[cat].map((skill) => (
                  <Chip
                    key={skill}
                    label={skill}
                    sx={{
                      backgroundColor: "primary.main",
                      color: "white",
                      fontWeight: 500,
                    }}
                  />
                ))}
              </Stack>
            </Box>
          ))}
        </Stack>

        <Box
          sx={{
            borderLeft: "3px solid rgba(233,69,96,0.4)",
            pl: 2,
            mb: 5,
            color: "text.secondary",
          }}
        >
          <Typography variant="body2">
            {lang === "fi"
              ? "Lisäksi yliopistokursseilta kokemusta: Ruby on Rails, R sekä Java Spring Boot."
              : "Additional university coursework in: Ruby on Rails, R, and Java Spring Boot."}
          </Typography>
        </Box>

        <Typography variant="h5" sx={{ fontWeight: 600 }} gutterBottom>
          {lang === "fi" ? "Kielitaito" : "Languages"}
        </Typography>
        <Stack sx={{ gap: 2, mb: 4, maxWidth: 400 }}>
          {languages.map((l) => (
            <Box key={l.fi}>
              <Stack direction="row" sx={{ justifyContent: "space-between", mb: 0.5 }}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {lang === "fi" ? l.fi : l.en}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {lang === "fi" ? l.levelFi : l.levelEn}
                </Typography>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={l.pct}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: "rgba(26,26,46,0.12)",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: "secondary.main",
                    borderRadius: 4,
                  },
                }}
              />
            </Box>
          ))}
        </Stack>

        <Typography variant="h5" sx={{ fontWeight: 600 }} gutterBottom>
          {lang === "fi" ? "Vaihto-opiskelu" : "Exchange Studies"}
        </Typography>
        <Stack sx={{ gap: 1 }}>
          {exchangeStudies.map((e) => (
            <Stack
              key={e.period}
              direction="row"
              sx={{ justifyContent: "space-between", maxWidth: 520, gap: 2 }}
            >
              <Typography variant="body1">
                {lang === "fi" ? e.place : e.placeEn}
                {e.detail && (
                  <Typography component="span" variant="body2" color="text.secondary">
                    {" — "}
                    {lang === "fi" ? e.detail : e.detailEn}
                  </Typography>
                )}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "nowrap" }}>
                {e.period}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Container>
    </Box>
  );
}
