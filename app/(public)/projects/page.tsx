import { cookies } from 'next/headers'
import type { Lang } from '@/lib/types'
import { getAllProjects } from '@/lib/db/queries/projects'
import { ProjectCard } from '@/components/public/ProjectCard'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import MuiLink from '@mui/material/Link'

export const metadata = {
  title: 'Projektit — Virva Svala',
  description: 'Omat sivuprojektit, opiskeluprojektit ja hackathon-demot.',
}

const categories = [
  { key: 'personal',   labelFi: 'Omat projektit',          labelEn: 'Personal Projects' },
  { key: 'university', labelFi: 'Opiskeluprojektit',        labelEn: 'University Projects' },
  { key: 'hackathon',  labelFi: 'Hackathon & Creative Coding', labelEn: 'Hackathon & Creative Coding' },
]

export default async function ProjectsPage() {
  const cookieStore = await cookies()
  const lang = (cookieStore.get('lang')?.value ?? 'fi') as Lang
  const projects = await getAllProjects()

  const grouped = Object.fromEntries(
    categories.map((c) => [c.key, projects.filter((p) => p.category === c.key)])
  )

  const activeCategories = categories.filter((c) => grouped[c.key].length > 0)

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
        {lang === 'fi' ? 'Projektit' : 'Projects'}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        {lang === 'fi'
          ? 'Omia sivuprojekteja, opiskeluprojekteja ja hackathon-demoja.'
          : 'Personal side projects, university coursework projects and hackathon demos.'}
      </Typography>

      {/* Anchor navigation */}
      {activeCategories.length > 1 && (
        <Stack direction="row" sx={{ gap: 2, mb: 6, flexWrap: 'wrap' }}>
          {activeCategories.map((cat) => (
            <MuiLink
              key={cat.key}
              href={`#${cat.key}`}
              underline="none"
              sx={{
                fontSize: '0.8rem',
                fontWeight: 600,
                letterSpacing: 1,
                textTransform: 'uppercase',
                color: 'text.secondary',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: '20px',
                px: 2,
                py: 0.5,
                '&:hover': { borderColor: 'secondary.main', color: 'secondary.main' },
                transition: 'all 0.15s',
              }}
            >
              {lang === 'fi' ? cat.labelFi : cat.labelEn}
            </MuiLink>
          ))}
        </Stack>
      )}

      {activeCategories.length === 0 && (
        <Typography color="text.secondary">
          {lang === 'fi' ? 'Ei projekteja vielä.' : 'No projects yet.'}
        </Typography>
      )}

      {activeCategories.map((cat) => (
        <Box key={cat.key} id={cat.key} sx={{ mb: 7, scrollMarginTop: '80px' }}>
          <Typography
            variant="overline"
            sx={{ color: '#e94560', letterSpacing: 2, fontWeight: 700, display: 'block', mb: 3 }}
          >
            {lang === 'fi' ? cat.labelFi : cat.labelEn}
          </Typography>
          <Grid container spacing={3}>
            {grouped[cat.key].map((p) => (
              <Grid key={p.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <ProjectCard project={p} lang={lang} />
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}
    </Container>
  )
}
