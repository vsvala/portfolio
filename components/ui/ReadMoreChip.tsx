import Box from '@mui/material/Box'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import type { Lang } from '@/lib/types'

export function ReadMoreChip({ lang }: { lang: Lang }) {
  return (
    <Box sx={{
      display: 'inline-flex', alignItems: 'center', gap: 0.5,
      border: '1px solid', borderColor: 'secondary.main', borderRadius: '20px',
      px: 1.5, py: 0.4, color: 'secondary.main', fontSize: '0.75rem', fontWeight: 600,
    }}>
      {lang === 'fi' ? 'Lue lisää' : 'Read more'}
      <ArrowForwardIcon sx={{ fontSize: 13 }} />
    </Box>
  )
}
