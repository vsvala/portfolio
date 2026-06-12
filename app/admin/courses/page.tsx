import { requireAdmin } from '@/lib/auth'
import { getAllCourses } from '@/lib/db/queries/courses'
import { deleteCourseAction } from '@/actions/courses'
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

export default async function AdminCoursesPage() {
  await requireAdmin()
  const courses = await getAllCourses()

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>Kurssit</Typography>
        <LinkButton href="/admin/courses/new" variant="contained">+ Lisää uusi</LinkButton>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Kurssi</TableCell>
            <TableCell>Oppilaitos</TableCell>
            <TableCell>Kategoria</TableCell>
            <TableCell>Vuosi</TableCell>
            <TableCell>op</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {courses.map((c) => (
            <TableRow key={c.id}>
              <TableCell>{c.name_fi}</TableCell>
              <TableCell>{c.institution_fi}</TableCell>
              <TableCell>{c.category}</TableCell>
              <TableCell>{c.year ?? '–'}</TableCell>
              <TableCell>{c.credits ?? '–'}</TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <LinkButton href={`/admin/courses/${c.id}`} size="small" variant="outlined">Muokkaa</LinkButton>
                  <DeleteButton action={deleteCourseAction.bind(null, c.id)} />
                </Box>
              </TableCell>
            </TableRow>
          ))}
          {courses.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} sx={{ textAlign: 'center', color: 'text.secondary' }}>
                Ei kursseja. Lisää ensimmäinen!
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Container>
  )
}
