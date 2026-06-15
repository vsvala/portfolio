import { notFound } from 'next/navigation'
import { cookies } from 'next/headers'
import type { Lang } from '@/lib/types'
import { getWorkById } from '@/lib/db/queries/work'
import { getDocumentById } from '@/lib/db/queries/documents'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import DownloadIcon from '@mui/icons-material/Download'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { LinkButton } from '@/components/ui/LinkButton'
import { FeedbackForm } from '@/components/public/FeedbackForm'
import { ProtectedDownload } from '@/components/public/ProtectedDownload'
import { parseTechnologies } from '@/lib/utils'

export default async function WorkDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const cookieStore = await cookies()
  const lang = (cookieStore.get('lang')?.value ?? 'en') as Lang

  const work = await getWorkById(Number(id))
  if (!work) notFound()

  const certificate = work.certificate_document_id
    ? await getDocumentById(work.certificate_document_id)
    : null

  const technologies = parseTechnologies(work.technologies)
  const endLabel = work.end_date ?? (lang === 'fi' ? 'nykyinen' : 'present')

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <LinkButton
        href="/work"
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 3 }}
        variant="text"
      >
        {lang === 'fi' ? 'Takaisin' : 'Back'}
      </LinkButton>

      <Typography variant="h3" sx={{ fontWeight: 700 }}>
        {lang === 'fi' ? work.role_fi : work.role_en}
      </Typography>
      <Typography variant="h5" color="text.secondary" sx={{ mt: 1 }}>
        {lang === 'fi' ? work.company_name_fi : work.company_name_en}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5, mb: 3 }}>
        {work.start_date} – {endLabel}
      </Typography>

      <Divider sx={{ mb: 3 }} />

      <Typography variant="body1" sx={{ lineHeight: 1.9, whiteSpace: 'pre-line', mb: 4 }}>
        {lang === 'fi' ? work.description_fi : work.description_en}
      </Typography>

      {technologies.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, textTransform: 'uppercase', letterSpacing: 1 }}>
            {lang === 'fi' ? 'Teknologiat' : 'Technologies'}
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {technologies.map((tech) => (
              <Chip key={tech} label={tech} variant="outlined" />
            ))}
          </Box>
        </Box>
      )}

      {certificate && (
        certificate.is_protected ? (
          <ProtectedDownload
            filename={certificate.filename}
            labelFi={certificate.label_fi}
            labelEn={certificate.label_en}
            lang={lang}
          />
        ) : (
          <Button
            component="a"
            href={`/documents/${certificate.filename}`}
            download
            variant="contained"
            startIcon={<DownloadIcon />}
            sx={{ mt: 2 }}
          >
            {lang === 'fi' ? certificate.label_fi : certificate.label_en}
          </Button>
        )
      )}

      <FeedbackForm
        lang={lang}
        targetType="work"
        targetId={work.id}
        targetTitle={lang === 'fi' ? `${work.role_fi} — ${work.company_name_fi}` : `${work.role_en} — ${work.company_name_en}`}
      />
    </Container>
  )
}
