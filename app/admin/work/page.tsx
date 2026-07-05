import { requireAdmin } from "@/lib/auth";
import { getAllWork } from "@/lib/db/queries/work";
import { deleteWorkAction } from "@/actions/work";
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

export default async function AdminWorkPage() {
  await requireAdmin();
  const work = await getAllWork();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <AdminPageHeader
        title="Työkokemukset"
        action={
          <LinkButton href="/admin/work/new" variant="contained">
            + Lisää uusi
          </LinkButton>
        }
      />
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Rooli</TableCell>
            <TableCell>Yritys</TableCell>
            <TableCell>Aika</TableCell>
            <TableCell>Järjestys</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {work.map((w) => (
            <TableRow key={w.id}>
              <TableCell>{w.role_fi}</TableCell>
              <TableCell>{w.company_name_fi}</TableCell>
              <TableCell>
                {w.start_date} – {w.end_date ?? "nykyinen"}
              </TableCell>
              <TableCell>{w.sort_order}</TableCell>
              <TableCell>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <LinkButton href={`/admin/work/${w.id}`} size="small" variant="outlined">
                    Muokkaa
                  </LinkButton>
                  <DeleteButton action={deleteWorkAction.bind(null, w.id)} />
                </Box>
              </TableCell>
            </TableRow>
          ))}
          {work.length === 0 && (
            <AdminEmptyTableRow colSpan={5} message="Ei tyokokemuksia. Lisaa ensimmainen!" />
          )}
        </TableBody>
      </Table>
    </Container>
  );
}
