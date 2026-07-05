import { requireAdmin } from "@/lib/auth";
import { createWorkAction } from "@/actions/work";
import { WorkForm } from "@/components/admin/WorkForm";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { LinkButton } from "@/components/ui/LinkButton";

export default async function AdminWorkNewPage() {
  await requireAdmin();

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <LinkButton href="/admin/work" startIcon={<ArrowBackIcon />} sx={{ mb: 2 }} variant="text">
        Takaisin
      </LinkButton>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        Lisää työkokemus
      </Typography>
      <WorkForm action={createWorkAction} />
    </Container>
  );
}
