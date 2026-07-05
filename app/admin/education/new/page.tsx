import { requireAdmin } from "@/lib/auth";
import { createEducationAction } from "@/actions/education";
import { EducationForm } from "@/components/admin/EducationForm";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { LinkButton } from "@/components/ui/LinkButton";

export default async function AdminEducationNewPage() {
  await requireAdmin();

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <LinkButton
        href="/admin/education"
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 2 }}
        variant="text"
      >
        Takaisin
      </LinkButton>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        Lisää koulutus
      </Typography>
      <EducationForm action={createEducationAction} />
    </Container>
  );
}
