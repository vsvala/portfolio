import { cookies } from 'next/headers'
import type { Lang } from '@/lib/types'
import { getAllEducation } from '@/lib/db/queries/education'
import { EducationCard } from '@/components/public/EducationCard'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'

export const metadata = {
  title: 'Koulutus — Virva Svala',
  description: 'Virva Svalan koulutus ja tutkinnot.',
}

export default async function EducationPage() {
  const cookieStore = await cookies()
  const lang = (cookieStore.get('lang')?.value ?? 'en') as Lang
  const education = await getAllEducation()

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h3" sx={{ fontWeight: 700, mb: 4 }}>
        {lang === 'fi' ? 'Koulutus' : 'Education'}
      </Typography>
      <Grid container spacing={2}>
        {education.map((e) => (
          <Grid key={e.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <EducationCard education={e} lang={lang} />
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}
