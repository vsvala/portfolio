'use client'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import Link from 'next/link'
import type { WorkExperience, Lang } from '@/lib/types'

export function WorkCard({ work, lang }: { work: WorkExperience; lang: Lang }) {
  const technologies = JSON.parse(work.technologies) as string[]
  const endLabel = work.end_date ?? (lang === 'fi' ? 'nykyinen' : 'present')

  return (
    <Card>
      <CardActionArea component={Link} href={`/work/${work.id}`}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {lang === 'fi' ? work.role_fi : work.role_en}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            {lang === 'fi' ? work.company_name_fi : work.company_name_en}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
            {work.start_date} – {endLabel}
          </Typography>
          {technologies.length > 0 && (
            <Stack direction="row" sx={{ flexWrap: "wrap", gap: 0.5, mb: 2 }}>
              {technologies.slice(0, 6).map((tech) => (
                <Chip key={tech} label={tech} size="small" variant="outlined" />
              ))}
              {technologies.length > 6 && (
                <Chip label={`+${technologies.length - 6}`} size="small" variant="outlined" />
              )}
            </Stack>
          )}
          <Typography variant="body2" sx={{ color: 'secondary.main', display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {lang === 'fi' ? 'Lue lisää' : 'Read more'}
            <ArrowForwardIcon sx={{ fontSize: 14 }} />
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}
