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
  {
    title_fi: 'Honours Programme Diploma',
    title_en: 'Honours Programme Diploma',
    issuer_fi: 'Helsingin yliopisto, Matemaattis-luonnontieteellinen tiedekunta',
    issuer_en: 'University of Helsinki, Faculty of Science',
    description_fi:
      'Kandidaatintutkinto suoritettu kolmessa lukuvuodessa hyväksytyn Honours Programme -ohjelman kautta tietojenkäsittelytieteessä hyvin arvosanoin.',
    description_en:
      'Bachelor of Science degree completed in three academic years through an approved Honours Programme in Computer Science with good average grades.',
    year: '2019',
    technologies: [],
    imageUrl: '/images/diploma-honours.jpeg',
  },
  {
    title_fi: 'Graffathon 2019 – 2. sija, Beginner Compo',
    title_en: 'Graffathon 2019 – 2nd Place, Beginner Compo',
    issuer_fi: 'Aalto-yliopiston Digital Media Club (DOT)',
    issuer_en: 'Aalto University Digital Media Club (DOT)',
    description_fi:
      'Teos: Mandaloid / Vadod. Graffathon on Aalto-yliopiston Digital Media Clubin järjestämä demoskene-tapahtuma.',
    description_en:
      'Entry: Mandaloid / Vadod. Graffathon is a demoscene event organised by Aalto University\'s Digital Media Club.',
    year: '2019',
    technologies: [],
    imageUrl: '/images/certificate-graffathon.jpeg',
  },
]

const achievements: Achievement[] = []

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

      {achievements.length > 0 && (
        <>
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
        </>
      )}
    </Box>
  )
}
