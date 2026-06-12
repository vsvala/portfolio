import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Container from '@mui/material/Container'
import type { Lang } from '@/lib/types'

const skills = {
  frontend: ['HTML/CSS', 'JavaScript', 'TypeScript', 'React', 'Next.js'],
  backend: ['Node.js', 'SQL', 'Python', 'Java'],
  tools: ['Git', 'Adobe Creative Cloud', 'Leaflet', 'MapLibre'],
}

const categoryLabels = {
  frontend: { fi: 'Frontend', en: 'Frontend' },
  backend: { fi: 'Backend', en: 'Backend' },
  tools: { fi: 'Työkalut', en: 'Tools' },
}

const languages = [
  { fi: 'Suomi', en: 'Finnish', level: 'Äidinkieli / Native' },
  { fi: 'Englanti', en: 'English', level: 'Sujuva / Fluent' },
  { fi: 'Ruotsi', en: 'Swedish', level: 'Hyvä / Good' },
  { fi: 'Ranska', en: 'French', level: 'Perusteet / Basic' },
]

const exchangeStudies = [
  { place: 'Kyproksen Suomi-koulu', placeEn: 'Cyprus Finnish School', detail: 'Opetusharjoittelu', detailEn: 'Teaching practice', period: 'Syksy 2001' },
  { place: 'Malmö University, School of Education', placeEn: 'Malmö University, School of Education', detail: '', detailEn: '', period: 'Kevät 2000' },
  { place: 'Haagse Hogeschool, Haagi, Hollanti', placeEn: 'Haagse Hogeschool, The Hague, Netherlands', detail: '', detailEn: '', period: 'Syksy 1999' },
]

export function SkillsSection({ lang }: { lang: Lang }) {
  return (
    <Box sx={{ py: 6, backgroundColor: 'background.default' }}>
      <Container maxWidth="md">
        <Typography variant="h4" sx={{ fontWeight: 700 }} gutterBottom>
          {lang === 'fi' ? 'Osaaminen' : 'Skills'}
        </Typography>

        <Stack sx={{ gap: 3, mb: 5 }}>
          {(Object.keys(skills) as Array<keyof typeof skills>).map((cat) => (
            <Box key={cat}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, textTransform: 'uppercase', letterSpacing: 1 }}>
                {categoryLabels[cat][lang]}
              </Typography>
              <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1 }}>
                {skills[cat].map((skill) => (
                  <Chip key={skill} label={skill} sx={{ backgroundColor: 'primary.main', color: 'white', fontWeight: 500 }} />
                ))}
              </Stack>
            </Box>
          ))}
        </Stack>

        <Typography variant="h5" sx={{ fontWeight: 600 }} gutterBottom>
          {lang === 'fi' ? 'Kielitaito' : 'Languages'}
        </Typography>
        <Stack sx={{ gap: 1, mb: 4 }}>
          {languages.map((l) => (
            <Stack key={l.fi} direction="row" sx={{ justifyContent: 'space-between', maxWidth: 360 }}>
              <Typography variant="body1">{lang === 'fi' ? l.fi : l.en}</Typography>
              <Typography variant="body1" color="text.secondary">{l.level}</Typography>
            </Stack>
          ))}
        </Stack>

        <Typography variant="h5" sx={{ fontWeight: 600 }} gutterBottom>
          {lang === 'fi' ? 'Vaihto-opiskelu' : 'Exchange Studies'}
        </Typography>
        <Stack sx={{ gap: 1 }}>
          {exchangeStudies.map((e) => (
            <Stack key={e.period} direction="row" sx={{ justifyContent: 'space-between', maxWidth: 520, gap: 2 }}>
              <Typography variant="body1">
                {lang === 'fi' ? e.place : e.placeEn}
                {e.detail && (
                  <Typography component="span" variant="body2" color="text.secondary">
                    {' — '}{lang === 'fi' ? e.detail : e.detailEn}
                  </Typography>
                )}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                {e.period}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Container>
    </Box>
  )
}
