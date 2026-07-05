import { cookies } from "next/headers";
import type { Lang } from "@/lib/types";
import { getAllRecommendations } from "@/lib/db/queries/recommendations";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";

export const metadata = {
  title: "Suositukset — Virva Svala",
  description: "LinkedIn-suosituksia Virva Svalasta.",
};

export default async function RecommendationsPage() {
  const cookieStore = await cookies();
  const lang = (cookieStore.get("lang")?.value ?? "en") as Lang;
  const recommendations = await getAllRecommendations();

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
        {lang === "fi" ? "Suositukset" : "Recommendations"}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 5 }}>
        {lang === "fi"
          ? "LinkedIn-suosituksia entisiltä kollegoilta ja esimiehiltä."
          : "LinkedIn recommendations from former colleagues and managers."}
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {recommendations.map((rec) => (
          <Card key={rec.id} elevation={2}>
            <CardContent sx={{ p: 4 }}>
              <FormatQuoteIcon
                sx={{ color: "secondary.main", fontSize: 40, mb: 1, display: "block" }}
              />
              <Typography variant="body1" sx={{ whiteSpace: "pre-line", lineHeight: 1.8, mb: 3 }}>
                {rec.text}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  {rec.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {rec.role}
                  {rec.company ? ` · ${rec.company}` : ""}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block", mt: 0.5 }}
                >
                  {rec.relationship}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Container>
  );
}
