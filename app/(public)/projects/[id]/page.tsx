import { notFound } from 'next/navigation'
import { cookies } from 'next/headers'
import type { Lang } from '@/lib/types'
import { getProjectById } from '@/lib/db/queries/projects'
import { getDocumentById } from '@/lib/db/queries/documents'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Divider from '@mui/material/Divider'
import DownloadIcon from '@mui/icons-material/Download'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import GitHubIcon from '@mui/icons-material/GitHub'
import { LinkButton } from '@/components/ui/LinkButton'
import { FeedbackForm } from '@/components/public/FeedbackForm'

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const cookieStore = await cookies()
  const lang = (cookieStore.get('lang')?.value ?? 'en') as Lang

  const project = await getProjectById(Number(id))
  if (!project) notFound()

  const document = project.document_id ? await getDocumentById(project.document_id) : null
  const technologies = JSON.parse(project.technologies) as string[]

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <LinkButton
        href="/projects"
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 3 }}
        variant="text"
      >
        {lang === 'fi' ? 'Takaisin' : 'Back'}
      </LinkButton>

      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
        <Typography variant="h3" sx={{ fontWeight: 700, flex: 1 }}>
          {lang === 'fi' ? project.title_fi : project.title_en}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, pt: 1 }}>
          {project.repo_url && (
            <IconButton
              component="a"
              href={project.repo_url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <GitHubIcon />
            </IconButton>
          )}
          {project.url && (
            <IconButton
              component="a"
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Live site"
            >
              <OpenInNewIcon />
            </IconButton>
          )}
        </Box>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Typography variant="body1" sx={{ lineHeight: 1.9, whiteSpace: 'pre-line', mb: 4 }}>
        {lang === 'fi'
          ? (project.long_description_fi || project.description_fi)
          : (project.long_description_en || project.description_en)}
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

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        {project.url && (
          <Button
            component="a"
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            variant="contained"
            startIcon={<OpenInNewIcon />}
          >
            {lang === 'fi' ? 'Avaa projekti' : 'Open project'}
          </Button>
        )}
        {project.repo_url && (
          <Button
            component="a"
            href={project.repo_url}
            target="_blank"
            rel="noopener noreferrer"
            variant="outlined"
            startIcon={<GitHubIcon />}
          >
            GitHub
          </Button>
        )}
        {document && (
          <Button
            component="a"
            href={`/documents/${document.filename}`}
            download
            variant="outlined"
            startIcon={<DownloadIcon />}
          >
            {lang === 'fi' ? document.label_fi : document.label_en}
          </Button>
        )}
      </Box>

      <FeedbackForm
        lang={lang}
        targetType="project"
        targetId={project.id}
        targetTitle={lang === 'fi' ? project.title_fi : project.title_en}
      />
    </Container>
  )
}
