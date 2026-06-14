import { notFound } from 'next/navigation'
import { cookies } from 'next/headers'
import type { Lang } from '@/lib/types'
import { getEducationById } from '@/lib/db/queries/education'
import { getDocumentById } from '@/lib/db/queries/documents'
import { getCoursesByEducationId } from '@/lib/db/queries/courses'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import Link from '@mui/material/Link'
import Stack from '@mui/material/Stack'
import DownloadIcon from '@mui/icons-material/Download'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { LinkButton } from '@/components/ui/LinkButton'
import { FeedbackForm } from '@/components/public/FeedbackForm'

const categoryLabels: Record<string, { fi: string; en: string }> = {
  web_dev:        { fi: 'Web-kehitys', en: 'Web Development' },
  programming:    { fi: 'Ohjelmointi', en: 'Programming' },
  sw_engineering: { fi: 'Ohjelmistotuotanto & arkkitehtuuri', en: 'Software Engineering & Architecture' },
  databases:      { fi: 'Tietokannat', en: 'Databases' },
  design:         { fi: 'Suunnittelu & UX', en: 'Design & UX' },
  ai_data:        { fi: 'Tekoäly & data', en: 'AI & Data' },
  systems:        { fi: 'Järjestelmät & verkot', en: 'Systems & Networks' },
  math:           { fi: 'Matematiikka', en: 'Mathematics' },
  other:          { fi: 'Muut', en: 'Other' },
}

const categoryOrder = ['web_dev', 'programming', 'sw_engineering', 'databases', 'design', 'ai_data', 'systems', 'math', 'other']

export default async function EducationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const cookieStore = await cookies()
  const lang = (cookieStore.get('lang')?.value ?? 'en') as Lang

  const education = await getEducationById(Number(id))
  if (!education) notFound()

  const [document, courses] = await Promise.all([
    education.document_id ? getDocumentById(education.document_id) : Promise.resolve(null),
    getCoursesByEducationId(education.id),
  ])

  const endLabel = education.end_date
    ? education.end_date.slice(0, 4)
    : lang === 'fi' ? 'nykyinen' : 'present'

  const grouped = courses.reduce<Record<string, typeof courses>>((acc, c) => {
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
      <LinkButton href="/education" startIcon={<ArrowBackIcon />} sx={{ mb: 3 }} variant="text">
        {lang === 'fi' ? 'Takaisin' : 'Back'}
      </LinkButton>

      <Typography variant="h3" sx={{ fontWeight: 700 }}>
        {lang === 'fi' ? education.degree_fi : education.degree_en}
      </Typography>
      <Typography variant="h5" color="text.secondary" sx={{ mt: 1 }}>
        {lang === 'fi' ? education.institution_fi : education.institution_en}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5, mb: 3 }}>
        {education.start_date.slice(0, 4)} – {endLabel}
      </Typography>

      <Divider sx={{ mb: 3 }} />

      <Typography variant="body1" sx={{ lineHeight: 1.9, whiteSpace: 'pre-line', mb: 4 }}>
        {lang === 'fi' ? education.description_fi : education.description_en}
      </Typography>

      {/* Courses linked to this education */}
      {courses.length > 0 && (
        <Box sx={{ display: 'flex', gap: 4, alignItems: 'flex-start', mb: 4 }}>

          {/* Left sidebar nav */}
          {sortedCategories.length > 1 && (
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
                {sortedCategories.map((cat) => (
                  <Box
                    key={cat}
                    component="a"
                    href={`#${cat}`}
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
                    {categoryLabels[cat]?.[lang] ?? cat}
                  </Box>
                ))}
              </Stack>
            </Box>
          )}

          {/* Main content */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
              {lang === 'fi' ? 'Pääopinnot' : 'Main courses'}
            </Typography>

            {sortedCategories.map((cat) => (
              <Box key={cat} id={cat} sx={{ mb: 4, scrollMarginTop: '80px' }}>
                <Typography
                  variant="overline"
                  sx={{ color: '#e94560', letterSpacing: 2, fontWeight: 700, display: 'block', mb: 1.5 }}
                >
                  {categoryLabels[cat]?.[lang] ?? cat}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {grouped[cat].map((c) => (
                    <Box
                      key={c.id}
                      sx={{
                        p: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 2,
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2, flexWrap: 'wrap' }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {lang === 'fi' ? c.name_fi : c.name_en}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          {c.credits && <Chip label={`${c.credits} op`} size="small" sx={{ backgroundColor: 'rgba(26,26,46,0.07)' }} />}
                        </Box>
                      </Box>
                      {(c.description_fi || c.description_en) && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, lineHeight: 1.6 }}>
                          {lang === 'fi' ? c.description_fi : c.description_en}
                        </Typography>
                      )}
                      {c.url && (
                        <Link href={c.url} target="_blank" rel="noopener noreferrer" variant="body2"
                          sx={{ mt: 0.5, display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                          {lang === 'fi' ? 'Kurssisivu' : 'Course page'}
                          <OpenInNewIcon sx={{ fontSize: 13 }} />
                        </Link>
                      )}
                    </Box>
                  ))}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {document && (
        <Button component="a" href={`/documents/${document.filename}`} download variant="contained" startIcon={<DownloadIcon />} sx={{ mb: 4 }}>
          {lang === 'fi' ? document.label_fi : document.label_en}
        </Button>
      )}

      <FeedbackForm
        lang={lang}
        targetType="education"
        targetId={education.id}
        targetTitle={lang === 'fi' ? `${education.degree_fi} — ${education.institution_fi}` : `${education.degree_en} — ${education.institution_en}`}
      />
    </Container>
  )
}
