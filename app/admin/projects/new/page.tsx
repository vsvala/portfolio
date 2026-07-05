import { requireAdmin } from "@/lib/auth";
import { createProjectAction } from "@/actions/projects";
import { ProjectForm } from "@/components/admin/ProjectForm";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { LinkButton } from "@/components/ui/LinkButton";

export default async function AdminProjectNewPage() {
  await requireAdmin();

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <LinkButton
        href="/admin/projects"
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 2 }}
        variant="text"
      >
        Takaisin
      </LinkButton>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        Lisää projekti
      </Typography>
      <ProjectForm action={createProjectAction} />
    </Container>
  );
}
