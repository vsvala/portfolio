import { requireAdmin } from "@/lib/auth";
import { getAllEducation } from "@/lib/db/queries/education";
import { deleteEducationAction } from "@/actions/education";
import { DeleteButton } from "@/components/admin/DeleteButton";
import Container from "@mui/material/Container";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Box from "@mui/material/Box";
import { LinkButton } from "@/components/ui/LinkButton";
import { AdminPageHeader, AdminEmptyTableRow } from "@/components/admin/AdminTableHelpers";

export default async function AdminEducationPage() {
  await requireAdmin();
  const education = await getAllEducation();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <AdminPageHeader
        title="Koulutukset"
        action={
          <LinkButton href="/admin/education/new" variant="contained">
            + Lisää uusi
          </LinkButton>
        }
      />
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Tutkinto</TableCell>
            <TableCell>Oppilaitos</TableCell>
            <TableCell>Aika</TableCell>
            <TableCell>Järjestys</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {education.map((e) => (
            <TableRow key={e.id}>
              <TableCell>{e.degree_fi}</TableCell>
              <TableCell>{e.institution_fi}</TableCell>
              <TableCell>
                {e.start_date} – {e.end_date ?? "nykyinen"}
              </TableCell>
              <TableCell>{e.sort_order}</TableCell>
              <TableCell>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <LinkButton href={`/admin/education/${e.id}`} size="small" variant="outlined">
                    Muokkaa
                  </LinkButton>
                  <DeleteButton action={deleteEducationAction.bind(null, e.id)} />
                </Box>
              </TableCell>
            </TableRow>
          ))}
          {education.length === 0 && (
            <AdminEmptyTableRow colSpan={5} message="Ei koulutuksia. Lisaa ensimmainen!" />
          )}
        </TableBody>
      </Table>
    </Container>
  );
}
