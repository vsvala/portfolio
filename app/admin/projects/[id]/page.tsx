import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getProjectById } from "@/lib/db/queries/projects";
import { updateProjectAction } from "@/actions/projects";
import { ProjectForm } from "@/components/admin/ProjectForm";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { LinkButton } from "@/components/ui/LinkButton";

export default async function AdminProjectEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const project = await getProjectById(Number(id));
  if (!project) notFound();

  const boundAction = updateProjectAction.bind(null, project.id);

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
        Muokkaa projektia
      </Typography>
      <ProjectForm action={boundAction} defaultValues={project} />
    </Container>
  );
}
