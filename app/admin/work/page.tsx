import { requireAdmin } from '@/lib/auth'
import { getAllWork } from '@/lib/db/queries/work'
import { deleteWorkAction } from '@/actions/work'
import { DeleteButton } from '@/components/admin/DeleteButton'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Box from '@mui/material/Box'
import { LinkButton } from '@/components/ui/LinkButton'

export default async function AdminWorkPage() {
  await requireAdmin()
  const work = await getAllWork()

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>Työkokemukset</Typography>
        <LinkButton href="/admin/work/new" variant="contained">+ Lisää uusi</LinkButton>
      </Box>
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
              <TableCell>{w.start_date} – {w.end_date ?? 'nykyinen'}</TableCell>
              <TableCell>{w.sort_order}</TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <LinkButton href={`/admin/work/${w.id}`} size="small" variant="outlined">Muokkaa</LinkButton>
                  <DeleteButton action={deleteWorkAction.bind(null, w.id)} />
                </Box>
              </TableCell>
            </TableRow>
          ))}
          {work.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} sx={{ textAlign: 'center', color: 'text.secondary' }}>
                Ei työkokemuksia. Lisää ensimmäinen!
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Container>
  )
}
