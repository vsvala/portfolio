import { cookies } from 'next/headers'
import type { Lang } from '@/lib/types'
import { getAllProjects } from '@/lib/db/queries/projects'
import { ProjectCard } from '@/components/public/ProjectCard'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'

export const metadata = {
  title: 'Projektit — Virva Svala',
  description: 'Omat sivuprojektit, opiskeluprojektit ja hackathon-demot.',
}

const categories = [
  { key: 'personal',        labelFi: 'Omat projektit',              labelEn: 'Personal Projects' },
  { key: 'university_solo', labelFi: 'Opiskeluprojektit — yksin',   labelEn: 'University Projects — Solo' },
  { key: 'university_group',labelFi: 'Opiskeluprojektit — ryhmä',   labelEn: 'University Projects — Group Work' },
  { key: 'hackathon',       labelFi: 'Hackathon & Creative Coding',  labelEn: 'Hackathon & Creative Coding' },
]

export default async function ProjectsPage() {
  const cookieStore = await cookies()
  const lang = (cookieStore.get('lang')?.value ?? 'en') as Lang
  const projects = await getAllProjects()

  const grouped = Object.fromEntries(
    categories.map((c) => [c.key, projects.filter((p) => p.category === c.key)])
  )

  const activeCategories = categories.filter((c) => grouped[c.key].length > 0)

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
        {lang === 'fi' ? 'Valitut projektit' : 'Selected Projects'}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        {lang === 'fi'
          ? 'Omia sivuprojekteja, opiskeluprojekteja ja hackathon-demoja.'
          : 'Personal side projects, university coursework projects and hackathon demos.'}
      </Typography>

      {activeCategories.length === 0 && (
        <Typography color="text.secondary">
          {lang === 'fi' ? 'Ei projekteja vielä.' : 'No projects yet.'}
        </Typography>
      )}

      <Box sx={{ display: 'flex', gap: 4, alignItems: 'flex-start' }}>

        {/* Left sidebar nav */}
        {activeCategories.length > 1 && (
          <Box sx={{
            display: { xs: 'none', md: 'block' },
            position: 'sticky',
            top: '80px',
            minWidth: 160,
            borderRight: '2px solid rgba(233,69,96,0.3)',
            pr: 3,
            pt: 1,
          }}>
            <Typography variant="overline" sx={{ color: 'text.disabled', letterSpacing: 2, display: 'block', mb: 2 }}>
              {lang === 'fi' ? 'Sisältö' : 'Contents'}
            </Typography>
            <Stack sx={{ gap: 0.5 }}>
              {activeCategories.map((cat) => (
                <Box
                  key={cat.key}
                  component="a"
                  href={`#${cat.key}`}
                  sx={{
                    color: 'secondary.main',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    py: 0.5,
                    display: 'block',
                    transition: 'color 0.15s',
                    '&:hover': { opacity: 0.7 },
                  }}
                >
                  {lang === 'fi' ? cat.labelFi : cat.labelEn}
                </Box>
              ))}
            </Stack>
          </Box>
        )}

        {/* Main content */}
        <Box sx={{ flex: 1 }}>
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
        </Box>

      </Box>
    </Container>
  )
}
