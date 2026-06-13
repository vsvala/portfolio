'use client'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import type { Lang } from '@/lib/types'

interface Certification {
  title_fi: string
  title_en: string
  issuer_fi: string
  issuer_en: string
  description_fi: string
  description_en: string
  year: string
  technologies: string[]
  imageUrl: string
  credentialUrl?: string
}

interface Achievement {
  text_fi: string
  text_en: string
  year: string
}

const certifications: Certification[] = [
  {
    title_fi: 'Claude Code: A Highly Agentic Coding Assistant',
    title_en: 'Claude Code: A Highly Agentic Coding Assistant',
    issuer_fi: 'DeepLearning.AI',
    issuer_en: 'DeepLearning.AI',
    description_fi:
      'Kurssi kattaa Claude Coden käytön tekoälyavusteisessa ohjelmistokehityksessä: agenttiset työnkulut, MCP-integraatiot, hookit ja automaatio.',
    description_en:
      'Course covering Claude Code for AI-assisted software development: agentic workflows, MCP integrations, hooks, and automation.',
    year: '2026',
    technologies: ['Claude Code', 'AI', 'MCP', 'Agentic Workflows'],
    imageUrl: '/images/certificate-claudecode.png',
    credentialUrl: 'https://learn.deeplearning.ai/accomplishments/dd8f1d3e-9145-4828-973f-409bf6c7ee92',
  },
  {
    title_fi: 'Full Stack Open',
    title_en: 'Full Stack Open',
    issuer_fi: 'Helsingin yliopisto',
    issuer_en: 'University of Helsinki',
    description_fi:
      'Avoin verkkokurssi modernista JavaScript-pohjaisesta web-sovelluskehityksestä. Sisältää React-, Redux-, Node.js-, Express-, MongoDB-, GraphQL- ja TypeScript-osiot.',
    description_en:
      'Open online course on modern JavaScript-based web application development. Covers React, Redux, Node.js, Express, MongoDB, GraphQL, and TypeScript.',
    year: '2024',
    technologies: ['React', 'Node.js', 'TypeScript', 'GraphQL', 'MongoDB'],
    imageUrl: '/images/certificate-fullstackopen.png',
  },
]

const achievements: Achievement[] = [
  {
    text_fi: 'Honours Programme -stipendi, Helsingin yliopisto – myönnetty akateemisesta erinomaisuudesta tietojenkäsittelytieteessä.',
    text_en: 'Honours Programme Scholarship, University of Helsinki – awarded for academic excellence in Computer Science.',
    year: '2019',
  },
  {
    text_fi: '2. sija, Beginner Compo, Graffathon – Aalto-yliopiston Digital Media Club.',
    text_en: '2nd Place, Beginner Compo, Graffathon – Aalto University Digital Media Club.',
    year: '2019',
  },
]

export function CertificationsSection({ lang }: { lang: Lang }) {
  return (
    <Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
        {certifications.map((cert) => (
          <Card key={cert.title_en} sx={{ flex: '1 1 300px', maxWidth: 480 }}>
            <CardActionArea
              component="a"
              href={cert.credentialUrl ?? cert.imageUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <CardMedia
                component="img"
                image={cert.imageUrl}
                alt={lang === 'fi' ? cert.title_fi : cert.title_en}
                sx={{ objectFit: 'cover', maxHeight: 220 }}
              />
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {lang === 'fi' ? cert.title_fi : cert.title_en}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  {lang === 'fi' ? cert.issuer_fi : cert.issuer_en} · {cert.year}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                  {lang === 'fi' ? cert.description_fi : cert.description_en}
                </Typography>
                <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 0.5 }}>
                  {cert.technologies.map((tech) => (
                    <Chip key={tech} label={tech} size="small" variant="outlined" />
                  ))}
                </Stack>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Stack sx={{ gap: 2 }}>
        {achievements.map((a) => (
          <Box key={a.year + a.text_en} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <EmojiEventsIcon sx={{ color: 'secondary.main', mt: 0.3, flexShrink: 0 }} />
            <Box>
              <Typography variant="body1">{lang === 'fi' ? a.text_fi : a.text_en}</Typography>
              <Typography variant="caption" color="text.secondary">{a.year}</Typography>
            </Box>
          </Box>
        ))}
      </Stack>
    </Box>
  )
}
