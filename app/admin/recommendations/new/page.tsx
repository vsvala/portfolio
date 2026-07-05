import { requireAdmin } from "@/lib/auth";
import { createRecommendationAction } from "@/actions/recommendations";
import { RecommendationForm } from "@/components/admin/RecommendationForm";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { LinkButton } from "@/components/ui/LinkButton";

export default async function AdminRecommendationNewPage() {
  await requireAdmin();

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <LinkButton
        href="/admin/recommendations"
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 2 }}
        variant="text"
      >
        Takaisin
      </LinkButton>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        Lisää suositus
      </Typography>
      <RecommendationForm action={createRecommendationAction} />
    </Container>
  );
}
