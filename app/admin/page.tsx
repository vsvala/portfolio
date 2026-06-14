import { requireAdmin } from '@/lib/auth'
import { getAllWork } from '@/lib/db/queries/work'
import { getAllProjects } from '@/lib/db/queries/projects'
import { getAllEducation } from '@/lib/db/queries/education'
import { getAllDocuments } from '@/lib/db/queries/documents'
import { getAllRecommendations } from '@/lib/db/queries/recommendations'
import { getAllSkills } from '@/lib/db/queries/skills'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import { LinkButton } from '@/components/ui/LinkButton'

export default async function AdminDashboard() {
  await requireAdmin()

  const workCount = (await getAllWork()).length
  const projectCount = (await getAllProjects()).length
  const educationCount = (await getAllEducation()).length
  const documentCount = (await getAllDocuments()).length
  const recCount = (await getAllRecommendations()).length
  const skillCount = (await getAllSkills()).length

  const stats = [
    { label: 'Työkokemukset', count: workCount, href: '/admin/work', addHref: '/admin/work/new' },
    { label: 'Projektit', count: projectCount, href: '/admin/projects', addHref: '/admin/projects/new' },
    { label: 'Koulutukset', count: educationCount, href: '/admin/education', addHref: '/admin/education/new' },
    { label: 'Suositukset', count: recCount, href: '/admin/recommendations', addHref: '/admin/recommendations/new' },
    { label: 'Taidot', count: skillCount, href: '/admin/skills', addHref: '/admin/skills/new' },
    { label: 'Dokumentit', count: documentCount, href: '/admin/work', addHref: null },
  ]

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
        Dashboard
      </Typography>
      <Grid container spacing={2}>
        {stats.map((s) => (
          <Grid key={s.label} size={{ xs: 12, sm: 6 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h3" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {s.count}
              </Typography>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>{s.label}</Typography>
              <LinkButton href={s.href} size="small" variant="outlined" sx={{ mr: 1 }}>
                Hallitse
              </LinkButton>
              {s.addHref && (
                <LinkButton href={s.addHref} size="small" variant="contained">
                  + Lisää
                </LinkButton>
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}
