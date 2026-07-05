import { cookies } from "next/headers";
import type { Lang } from "@/lib/types";
import { getAllWork } from "@/lib/db/queries/work";
import { WorkCard } from "@/components/public/WorkCard";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

export const metadata = {
  title: "Työkokemus — Virva Svala",
  description: "Virva Svalan työkokemus ohjelmistosuunnittelijana ja opettajana.",
};

export default async function WorkPage() {
  const cookieStore = await cookies();
  const lang = (cookieStore.get("lang")?.value ?? "en") as Lang;
  const work = await getAllWork();

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h3" sx={{ fontWeight: 700, mb: 4 }}>
        {lang === "fi" ? "Työkokemus" : "Work Experience"}
      </Typography>
      <Grid container spacing={2}>
        {work.map((w) => (
          <Grid key={w.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <WorkCard work={w} lang={lang} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
