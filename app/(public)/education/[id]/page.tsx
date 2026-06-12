import { notFound } from 'next/navigation'
import { cookies } from 'next/headers'
import type { Lang } from '@/lib/types'
import { getEducationById } from '@/lib/db/queries/education'
import { getDocumentById } from '@/lib/db/queries/documents'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import DownloadIcon from '@mui/icons-material/Download'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { LinkButton } from '@/components/ui/LinkButton'

export default async function EducationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const cookieStore = await cookies()
  const lang = (cookieStore.get('lang')?.value ?? 'fi') as Lang

  const education = getEducationById(Number(id))
  if (!education) notFound()

  const document = education.document_id ? getDocumentById(education.document_id) : null
  const endLabel = education.end_date
    ? education.end_date.slice(0, 4)
    : lang === 'fi' ? 'nykyinen' : 'present'

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <LinkButton
        href="/education"
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 3 }}
        variant="text"
      >
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

      {document && (
        <Button
          component="a"
          href={`/documents/${document.filename}`}
          download
          variant="contained"
          startIcon={<DownloadIcon />}
        >
          {lang === 'fi' ? document.label_fi : document.label_en}
        </Button>
      )}
    </Container>
  )
}
