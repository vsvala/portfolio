'use client'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import GitHubIcon from '@mui/icons-material/GitHub'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import Link from 'next/link'
import type { Project, Lang } from '@/lib/types'

export function ProjectCard({ project, lang }: { project: Project; lang: Lang }) {
  const technologies = JSON.parse(project.technologies) as string[]

  return (
    <Card>
      <CardActionArea component={Link} href={`/projects/${project.id}`}>
        <CardContent>
          <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, flex: 1 }}>
              {lang === 'fi' ? project.title_fi : project.title_en}
            </Typography>
            <Stack direction="row" onClick={(e) => e.stopPropagation()}>
              {project.url && (
                <IconButton
                  size="small"
                  aria-label="Open project"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.open(project.url!, '_blank', 'noopener,noreferrer') }}
                >
                  <OpenInNewIcon fontSize="small" />
                </IconButton>
              )}
              {project.repo_url && (
                <IconButton
                  size="small"
                  aria-label="Open repository"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.open(project.repo_url!, '_blank', 'noopener,noreferrer') }}
                >
                  <GitHubIcon fontSize="small" />
                </IconButton>
              )}
            </Stack>
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
            {lang === 'fi' ? project.description_fi : project.description_en}
          </Typography>
          {technologies.length > 0 && (
            <Stack direction="row" sx={{ flexWrap: "wrap", gap: 0.5, mb: 2 }}>
              {technologies.map((tech) => (
                <Chip key={tech} label={tech} size="small" variant="outlined" />
              ))}
            </Stack>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
            <Box sx={{
              display: 'inline-flex', alignItems: 'center', gap: 0.5,
              border: '1px solid', borderColor: 'secondary.main', borderRadius: '20px',
              px: 1.5, py: 0.4, color: 'secondary.main', fontSize: '0.75rem', fontWeight: 600,
            }}>
              {lang === 'fi' ? 'Lue lisää' : 'Read more'}
              <ArrowForwardIcon sx={{ fontSize: 13 }} />
            </Box>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}
