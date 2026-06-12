import { cookies } from 'next/headers'
import type { Lang } from '@/lib/types'
import { HeroSection } from '@/components/public/HeroSection'
import { SkillsSection } from '@/components/public/SkillsSection'
import { WorkCard } from '@/components/public/WorkCard'
import { ProjectCard } from '@/components/public/ProjectCard'
import { EducationCard } from '@/components/public/EducationCard'
import { getAllWork } from '@/lib/db/queries/work'
import { getAllProjects } from '@/lib/db/queries/projects'
import { getAllEducation } from '@/lib/db/queries/education'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { LinkButton } from '@/components/ui/LinkButton'
import { CertificationsSection } from '@/components/public/CertificationsSection'

export default async function HomePage() {
  const cookieStore = await cookies()
  const lang = (cookieStore.get('lang')?.value ?? 'fi') as Lang

  const work = getAllWork().slice(0, 3)
  const projects = getAllProjects().slice(0, 3)
  const education = getAllEducation().slice(0, 3)

  return (
    <>
      <HeroSection lang={lang} />
      <SkillsSection lang={lang} />

      {/* Work preview */}
      <Box sx={{ py: 6 }}>
        <Container maxWidth="md">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {lang === 'fi' ? 'Työkokemus' : 'Experience'}
            </Typography>
            <LinkButton href="/work" variant="outlined" size="small">
              {lang === 'fi' ? 'Kaikki' : 'See all'}
            </LinkButton>
          </Box>
          <Grid container spacing={2}>
            {work.map((w) => (
              <Grid key={w.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <WorkCard work={w} lang={lang} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Education preview */}
      <Box sx={{ py: 6, backgroundColor: 'grey.50' }}>
        <Container maxWidth="md">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {lang === 'fi' ? 'Koulutus' : 'Education'}
            </Typography>
            <LinkButton href="/education" variant="outlined" size="small">
              {lang === 'fi' ? 'Kaikki' : 'See all'}
            </LinkButton>
          </Box>
          <Grid container spacing={2}>
            {education.map((e) => (
              <Grid key={e.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <EducationCard education={e} lang={lang} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Projects / Hackathon preview */}
      <Box sx={{ py: 6 }}>
        <Container maxWidth="md">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                Hackathon
              </Typography>
              <Typography variant="subtitle2" color="text.secondary">
                Creative Coding &amp; Demoscene
              </Typography>
            </Box>
            <LinkButton href="/projects" variant="outlined" size="small" sx={{ mt: 0.5 }}>
              {lang === 'fi' ? 'Kaikki' : 'See all'}
            </LinkButton>
          </Box>
          <Grid container spacing={2}>
            {projects.map((p) => (
              <Grid key={p.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <ProjectCard project={p} lang={lang} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      {/* Certifications */}
      <Box sx={{ py: 6, backgroundColor: 'grey.50' }}>
        <Container maxWidth="md">
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
            {lang === 'fi' ? 'Sertifikaatit' : 'Certifications'}
          </Typography>
          <CertificationsSection lang={lang} />
        </Container>
      </Box>
    </>
  )
}
