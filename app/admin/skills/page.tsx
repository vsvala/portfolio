import { requireAdmin } from "@/lib/auth";
import { getAllSkills } from "@/lib/db/queries/skills";
import { deleteSkillAction } from "@/actions/skills";
import { DeleteButton } from "@/components/admin/DeleteButton";
import Container from "@mui/material/Container";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { LinkButton } from "@/components/ui/LinkButton";
import { SKILL_CATEGORY_LABELS } from "@/lib/constants/categories";
import { AdminPageHeader } from "@/components/admin/AdminTableHelpers";

export default async function AdminSkillsPage() {
  await requireAdmin();
  const skills = await getAllSkills();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <AdminPageHeader
        title="Taidot / Skills"
        action={
          <LinkButton href="/admin/skills/new" variant="contained">
            + Lisää uusi
          </LinkButton>
        }
      />
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Taito</TableCell>
            <TableCell>Kategoria</TableCell>
            <TableCell>Järjestys</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {skills.map((s) => (
            <TableRow key={s.id}>
              <TableCell>{s.name}</TableCell>
              <TableCell>
                <Chip
                  label={
                    SKILL_CATEGORY_LABELS[s.category as keyof typeof SKILL_CATEGORY_LABELS]?.en ??
                    s.category
                  }
                  size="small"
                />
              </TableCell>
              <TableCell>{s.sort_order}</TableCell>
              <TableCell>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <LinkButton href={`/admin/skills/${s.id}`} size="small" variant="outlined">
                    Muokkaa
                  </LinkButton>
                  <DeleteButton action={deleteSkillAction.bind(null, s.id)} />
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
}
