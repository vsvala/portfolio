import { cookies } from 'next/headers'
import type { Lang, Course } from '@/lib/types'
import { getAllCourses } from '@/lib/db/queries/courses'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Link from '@mui/material/Link'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'

export const metadata = {
  title: 'Opinnot — Virva Svala',
  description: 'Suoritetut kurssit ja opinnot.',
}

const categoryLabels: Record<string, { fi: string; en: string }> = {
  programming: { fi: 'Ohjelmointi', en: 'Programming' },
  math: { fi: 'Matematiikka & tilastot', en: 'Mathematics & Statistics' },
  ai_data: { fi: 'Tekoäly & data', en: 'AI & Data' },
  systems: { fi: 'Järjestelmät & verkot', en: 'Systems & Networks' },
  design: { fi: 'Suunnittelu & UX', en: 'Design & UX' },
  other: { fi: 'Muut', en: 'Other' },
}

const categoryOrder = ['programming', 'math', 'ai_data', 'systems', 'design', 'other']

export default async function CoursesPage() {
  const cookieStore = await cookies()
  const lang = (cookieStore.get('lang')?.value ?? 'en') as Lang

  const courses = await getAllCourses()

  const grouped = courses.reduce<Record<string, Course[]>>((acc, c) => {
    const key = c.category || 'other'
    if (!acc[key]) acc[key] = []
    acc[key].push(c)
    return acc
  }, {})

  const sortedCategories = [
    ...categoryOrder.filter((k) => grouped[k]?.length),
    ...Object.keys(grouped).filter((k) => !categoryOrder.includes(k)),
  ]

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
        {lang === 'fi' ? 'Opinnot' : 'Coursework'}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 5 }}>
        {lang === 'fi'
          ? 'Yliopistokursseja ja muita suoritettuja opintoja.'
          : 'University courses and other completed studies.'}
      </Typography>

      {courses.length === 0 && (
        <Typography color="text.secondary">
          {lang === 'fi' ? 'Ei kursseja vielä.' : 'No courses yet.'}
        </Typography>
      )}

      {sortedCategories.map((cat) => (
        <Box key={cat} sx={{ mb: 5 }}>
          <Typography
            variant="overline"
            sx={{ color: '#e94560', letterSpacing: 2, fontWeight: 700, display: 'block', mb: 2 }}
          >
            {categoryLabels[cat]?.[lang] ?? cat}
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {grouped[cat].map((c) => (
              <Box
                key={c.id}
                sx={{
                  p: 2.5,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  '&:hover': { borderColor: 'secondary.main' },
                  transition: 'border-color 0.15s',
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2, flexWrap: 'wrap' }}>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {lang === 'fi' ? c.name_fi : c.name_en}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {lang === 'fi' ? c.institution_fi : c.institution_en}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                    {c.year && (
                      <Chip label={c.year} size="small" variant="outlined" />
                    )}
                    {c.credits && (
                      <Chip label={`${c.credits} op`} size="small" sx={{ backgroundColor: 'rgba(26,26,46,0.07)' }} />
                    )}
                    {c.grade && (
                      <Chip label={c.grade} size="small" sx={{ backgroundColor: 'rgba(233,69,96,0.12)', color: '#e94560', fontWeight: 700 }} />
                    )}
                  </Box>
                </Box>

                {(c.description_fi || c.description_en) && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1, lineHeight: 1.6 }}>
                    {lang === 'fi' ? c.description_fi : c.description_en}
                  </Typography>
                )}

                {c.url && (
                  <Link href={c.url} target="_blank" rel="noopener noreferrer" variant="body2"
                    sx={{ mt: 1, display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                    {lang === 'fi' ? 'Kurssisivu' : 'Course page'}
                    <OpenInNewIcon sx={{ fontSize: 14 }} />
                  </Link>
                )}
              </Box>
            ))}
          </Box>
        </Box>
      ))}
    </Container>
  )
}
