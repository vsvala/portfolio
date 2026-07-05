import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getSkillById } from "@/lib/db/queries/skills";
import { updateSkillAction } from "@/actions/skills";
import { SkillForm } from "@/components/admin/SkillForm";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { LinkButton } from "@/components/ui/LinkButton";

export default async function AdminSkillEditPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const skill = await getSkillById(Number(id));
  if (!skill) notFound();

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <LinkButton href="/admin/skills" startIcon={<ArrowBackIcon />} sx={{ mb: 2 }} variant="text">
        Takaisin
      </LinkButton>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        Muokkaa taitoa
      </Typography>
      <SkillForm action={updateSkillAction.bind(null, skill.id)} defaultValues={skill} />
    </Container>
  );
}
