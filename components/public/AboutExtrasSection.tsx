import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Divider from '@mui/material/Divider'
import Link from '@mui/material/Link'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import type { Lang } from '@/lib/types'

const civicActivities = [
  { fi: 'Akateemisen viiniseuran tasa-arvo- ja ympäristövastaava', en: 'Academic Wine Society, equality and environmental officer', year: '2018' },
  { fi: 'KOL:n hallituksen opiskelijajäsen', en: 'KOL Board, student member', year: '2004' },
  { fi: 'AIESEC, työharjoittelijan kummi', en: 'AIESEC, trainee mentor', year: '1998–1999' },
  { fi: 'Uusien opiskelijoiden tutorohjaaja', en: 'Tutor for new students', year: '1998' },
  { fi: 'Lukion oppilaskunnan sihteeri ja rahastonhoitaja', en: 'Upper secondary school student council, secretary and treasurer', year: '1993–1995' },
]

const hobbyFi = 'Harrastan öljyvärimaalausta ja monipuolisesti liikuntaa kuten tanssia, joogaa ja jumppia. Vahvuuksiani ovat sosiaalisuus, positiivisuus, luovuus, ideointikyky, organisointitaidot ja ohjaustaidot. Lisäksi olen utelias ja innokas oppimaan ja kokeilemaan aina uutta.'
const hobbyEn = 'I paint with oils and keep active through dancing, yoga, and aerobics. My strengths include creativity, positivity, strong organisational and coaching skills — paired with a natural curiosity and a drive to keep learning.'

export function AboutExtrasSection({ lang }: { lang: Lang }) {
  return (
    <Box sx={{ py: 6 }}>
      <Container maxWidth="md">

        <Box id="jarjesto">
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
            {lang === 'fi' ? 'Järjestö- ja aktiivitoiminta' : 'Civic & Volunteer Activities'}
          </Typography>
          <Stack sx={{ gap: 1, mb: 5 }}>
            {civicActivities.map((a) => (
              <Stack key={a.year + a.en} direction="row" sx={{ justifyContent: 'space-between', gap: 2, maxWidth: 600 }}>
                <Typography variant="body1">{lang === 'fi' ? a.fi : a.en}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>{a.year}</Typography>
              </Stack>
            ))}
          </Stack>
        </Box>

        <Divider sx={{ mb: 5 }} />

        <Box id="harrastukset">
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
            {lang === 'fi' ? 'Harrastukset ja vahvuudet' : 'Hobbies & Strengths'}
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.8, maxWidth: 680, mb: 1.5 }}>
            {lang === 'fi' ? hobbyFi : hobbyEn}
          </Typography>
          <Link
            href="https://www.virvasvala.com"
            target="_blank"
            rel="noopener noreferrer"
            variant="body1"
            sx={{ fontWeight: 500 }}
          >
            {lang === 'fi' ? 'Tutustu maalauksiini → virvasvala.com' : 'Explore my paintings → virvasvala.com'}
          </Link>
        </Box>

      </Container>
    </Box>
  )
}
