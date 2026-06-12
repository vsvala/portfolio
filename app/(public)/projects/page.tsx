import { cookies } from 'next/headers'
import type { Lang } from '@/lib/types'
import { getAllProjects } from '@/lib/db/queries/projects'
import { ProjectCard } from '@/components/public/ProjectCard'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'

export const metadata = {
  title: 'Hackathon — Virva Svala',
  description: 'Creative coding ja demoscene -projektit.',
}

export default async function ProjectsPage() {
  const cookieStore = await cookies()
  const lang = (cookieStore.get('lang')?.value ?? 'fi') as Lang
  const projects = await getAllProjects()

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
        Hackathon
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
        Creative Coding &amp; Demoscene
      </Typography>
      <Grid container spacing={2}>
        {projects.map((p) => (
          <Grid key={p.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <ProjectCard project={p} lang={lang} />
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}
