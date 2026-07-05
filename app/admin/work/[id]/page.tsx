import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getWorkById } from "@/lib/db/queries/work";
import { updateWorkAction } from "@/actions/work";
import { WorkForm } from "@/components/admin/WorkForm";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { LinkButton } from "@/components/ui/LinkButton";

export default async function AdminWorkEditPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const work = await getWorkById(Number(id));
  if (!work) notFound();

  const boundAction = updateWorkAction.bind(null, work.id);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <LinkButton href="/admin/work" startIcon={<ArrowBackIcon />} sx={{ mb: 2 }} variant="text">
        Takaisin
      </LinkButton>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        Muokkaa työkokemusta
      </Typography>
      <WorkForm action={boundAction} defaultValues={work} />
    </Container>
  );
}
