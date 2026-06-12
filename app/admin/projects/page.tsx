import { requireAdmin } from '@/lib/auth'
import { getAllProjects } from '@/lib/db/queries/projects'
import { deleteProjectAction } from '@/actions/projects'
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

export default async function AdminProjectsPage() {
  await requireAdmin()
  const projects = await getAllProjects()

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>Projektit</Typography>
        <LinkButton href="/admin/projects/new" variant="contained">+ Lisää uusi</LinkButton>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Otsikko</TableCell>
            <TableCell>URL</TableCell>
            <TableCell>Järjestys</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {projects.map((p) => (
            <TableRow key={p.id}>
              <TableCell>{p.title_fi}</TableCell>
              <TableCell>{p.url ?? '–'}</TableCell>
              <TableCell>{p.sort_order}</TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <LinkButton href={`/admin/projects/${p.id}`} size="small" variant="outlined">Muokkaa</LinkButton>
                  <DeleteButton action={deleteProjectAction.bind(null, p.id)} />
                </Box>
              </TableCell>
            </TableRow>
          ))}
          {projects.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} sx={{ textAlign: 'center', color: 'text.secondary' }}>
                Ei projekteja. Lisää ensimmäinen!
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Container>
  )
}
