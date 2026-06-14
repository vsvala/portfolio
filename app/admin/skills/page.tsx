import { requireAdmin } from '@/lib/auth'
import { getAllSkills } from '@/lib/db/queries/skills'
import { deleteSkillAction } from '@/actions/skills'
import { DeleteButton } from '@/components/admin/DeleteButton'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import { LinkButton } from '@/components/ui/LinkButton'

const categoryLabels: Record<string, string> = {
  frontend: 'Frontend', backend: 'Backend', databases: 'Databases',
  tools: 'Tools', methods: 'Methods',
}

export default async function AdminSkillsPage() {
  await requireAdmin()
  const skills = await getAllSkills()

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>Taidot / Skills</Typography>
        <LinkButton href="/admin/skills/new" variant="contained">+ Lisää uusi</LinkButton>
      </Box>
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
              <TableCell><Chip label={categoryLabels[s.category] ?? s.category} size="small" /></TableCell>
              <TableCell>{s.sort_order}</TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <LinkButton href={`/admin/skills/${s.id}`} size="small" variant="outlined">Muokkaa</LinkButton>
                  <DeleteButton action={deleteSkillAction.bind(null, s.id)} />
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  )
}
