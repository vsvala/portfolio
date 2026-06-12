'use client'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
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
}

const certifications: Certification[] = [
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

export function CertificationsSection({ lang }: { lang: Lang }) {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
      {certifications.map((cert) => (
        <Card
          key={cert.title_en}
          sx={{ maxWidth: 480, width: '100%' }}
        >
          <CardActionArea
            component="a"
            href={cert.imageUrl}
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
  )
}
