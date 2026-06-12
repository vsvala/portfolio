'use client'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Link from 'next/link'
import type { Education, Lang } from '@/lib/types'

export function EducationCard({ education, lang }: { education: Education; lang: Lang }) {
  const endYear = education.end_date
    ? education.end_date.slice(0, 4)
    : lang === 'fi' ? 'nykyinen' : 'present'

  return (
    <Card>
      <CardActionArea component={Link} href={`/education/${education.id}`}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {lang === 'fi' ? education.degree_fi : education.degree_en}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            {lang === 'fi' ? education.institution_fi : education.institution_en}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {education.start_date.slice(0, 4)} – {endYear}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}
