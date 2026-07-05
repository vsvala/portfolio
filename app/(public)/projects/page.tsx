import { cookies } from "next/headers";
import type { Lang } from "@/lib/types";
import { getAllProjects } from "@/lib/db/queries/projects";
import { ProjectCard } from "@/components/public/ProjectCard";
import { SidebarNav } from "@/components/public/SidebarNav";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { PROJECT_CATEGORIES } from "@/lib/constants/categories";

export const metadata = {
  title: "Projektit — Virva Svala",
  description: "Omat sivuprojektit, opiskeluprojektit ja hackathon-demot.",
};

const categories = PROJECT_CATEGORIES;

export default async function ProjectsPage() {
  const cookieStore = await cookies();
  const lang = (cookieStore.get("lang")?.value ?? "en") as Lang;
  const projects = await getAllProjects();

  const grouped = Object.fromEntries(
    categories.map((c) => [c.value, projects.filter((p) => p.category === c.value)])
  );

  const activeCategories = categories.filter((c) => grouped[c.value].length > 0);

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
        {lang === "fi" ? "Valitut projektit" : "Selected Projects"}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        {lang === "fi"
          ? "Omia sivuprojekteja, opiskeluprojekteja ja hackathon-demoja."
          : "Personal side projects, university coursework projects and hackathon demos."}
      </Typography>

      {activeCategories.length === 0 && (
        <Typography color="text.secondary">
          {lang === "fi" ? "Ei projekteja vielä." : "No projects yet."}
        </Typography>
      )}

      <SidebarNav
        items={activeCategories.map((cat) => ({
          key: cat.value,
          label: lang === "fi" ? cat.labelFi : cat.labelEn,
        }))}
        lang={lang}
      >
        {activeCategories.map((cat) => (
          <Box key={cat.value} id={cat.value} sx={{ mb: 7, scrollMarginTop: "80px" }}>
            <Typography
              variant="overline"
              sx={{
                color: "secondary.main",
                letterSpacing: 2,
                fontWeight: 700,
                display: "block",
                mb: 3,
              }}
            >
              {lang === "fi" ? cat.labelFi : cat.labelEn}
            </Typography>
            <Grid container spacing={3}>
              {grouped[cat.value].map((p) => (
                <Grid key={p.id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <ProjectCard project={p} lang={lang} />
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}
      </SidebarNav>
    </Container>
  );
}
