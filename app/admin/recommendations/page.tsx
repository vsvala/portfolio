import { requireAdmin } from "@/lib/auth";
import { getAllRecommendations } from "@/lib/db/queries/recommendations";
import { deleteRecommendationAction } from "@/actions/recommendations";
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

export default async function AdminRecommendationsPage() {
  await requireAdmin();
  const recs = await getAllRecommendations();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <AdminPageHeader
        title="Suositukset"
        action={
          <LinkButton href="/admin/recommendations/new" variant="contained">
            + Lisää uusi
          </LinkButton>
        }
      />
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nimi</TableCell>
            <TableCell>Rooli</TableCell>
            <TableCell>Yritys</TableCell>
            <TableCell>Päivämäärä</TableCell>
            <TableCell>Järjestys</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {recs.map((r) => (
            <TableRow key={r.id}>
              <TableCell>{r.name}</TableCell>
              <TableCell>{r.role}</TableCell>
              <TableCell>{r.company}</TableCell>
              <TableCell>{r.rec_date}</TableCell>
              <TableCell>{r.sort_order}</TableCell>
              <TableCell>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <LinkButton
                    href={`/admin/recommendations/${r.id}`}
                    size="small"
                    variant="outlined"
                  >
                    Muokkaa
                  </LinkButton>
                  <DeleteButton action={deleteRecommendationAction.bind(null, r.id)} />
                </Box>
              </TableCell>
            </TableRow>
          ))}
          {recs.length === 0 && <AdminEmptyTableRow colSpan={6} message="Ei suosituksia." />}
        </TableBody>
      </Table>
    </Container>
  );
}
