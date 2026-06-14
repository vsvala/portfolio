import Image from 'next/image'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import DownloadIcon from '@mui/icons-material/Download'
import EmailIcon from '@mui/icons-material/Email'
import GitHubIcon from '@mui/icons-material/GitHub'
import PaletteIcon from '@mui/icons-material/Palette'
import VisibilityIcon from '@mui/icons-material/Visibility'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

const introFi = `Olen ohjelmistosuunnittelija ja tietojenkäsittelytieteen maisteri Helsingin yliopistosta (2025), ja aiemmalta koulutukseltani kuvataiteen opettaja. Minulla on yli 6 vuotta käytännön kokemusta ohjelmistosuunnittelijan työstä Forecalla, jossa vastasin kuluttajapuolen sääpalveluiden, B2B-kehittäjäportaalin sekä dynaamisten sääsovellusten Full Stack -kehityksestä ja ylläpidosta. Ydinosaamiseeni kuuluu moderni web-kehitys — erityisesti Node.js, React, TypeScript ja Next.js. Teknisen osaamiseni lisäksi minulla on poikkeuksellisen vahva visuaalinen silmä taideopettajataustani ansiosta.`

const introEn = `I am a software developer and Master of Science in Computer Science from the University of Helsinki (2025), with a background as an art teacher. I have over 6 years of hands-on experience as a software developer at Foreca, where I was responsible for Full Stack development and maintenance of consumer weather services, a B2B developer portal, and dynamic weather applications. My core expertise lies in modern web development — particularly Node.js, React, TypeScript, and Next.js. In addition to my technical skills, I have an exceptionally strong eye for visual design from my background as an art teacher.`

const anchorLinks = [
  { href: '/#tyokokemus', fi: 'Työkokemus', en: 'Experience' },
  { href: '/#osaaminen', fi: 'Osaaminen', en: 'Skills' },
  { href: '/#koulutus', fi: 'Koulutus', en: 'Education' },
  { href: '/#sertifikaatit', fi: 'Saavutukset & sertifikaatit', en: 'Achievements & Certifications' },
  { href: '/#hackathon', fi: 'Hackathon', en: 'Hackathon' },
  { href: '/#jarjesto', fi: 'Järjestö- ja aktiivitoiminta', en: 'Civic Activities' },
  { href: '/#harrastukset', fi: 'Harrastukset & vahvuudet', en: 'Hobbies & Strengths' },
]

export function HeroSection({ lang }: { lang: 'fi' | 'en' }) {
  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        color: 'white',
        py: { xs: 8, md: 12 },
      }}
    >
      <Container maxWidth="md">
        <Grid container spacing={4} sx={{ alignItems: 'flex-start' }}>

          {/* Right column: anchor links, desktop only */}
          <Grid size={{ xs: 12, md: 4 }} sx={{ display: { xs: 'none', md: 'block' } }}>
            <Box
              sx={{
                borderRight: '2px solid rgba(233,69,96,0.4)',
                pr: 3,
                pt: 1,
              }}
            >
              <Typography
                variant="overline"
                sx={{ color: 'rgba(255,255,255,0.5)', letterSpacing: 2, display: 'block', mb: 2 }}
              >
                {lang === 'fi' ? 'Sisältö' : 'Contents'}
              </Typography>
              <Stack sx={{ gap: 0.5 }}>
                {anchorLinks.map((link) => (
                  <Box
                    key={link.href}
                    component="a"
                    href={link.href}
                    sx={{
                      color: 'rgba(255,255,255,0.75)',
                      textDecoration: 'none',
                      fontSize: '0.9rem',
                      py: 0.5,
                      display: 'block',
                      transition: 'color 0.15s',
                      '&:hover': { color: '#e94560' },
                    }}
                  >
                    {lang === 'fi' ? link.fi : link.en}
                  </Box>
                ))}
              </Stack>
            </Box>
          </Grid>

          {/* Left column: intro */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Box sx={{ mb: 3 }}>
              <Image
                src="/virva.png"
                alt="Virva Svala"
                width={160}
                height={160}
                style={{ borderRadius: '50%', objectFit: 'cover' }}
              />
            </Box>
            <Typography variant="h1" sx={{ fontSize: { xs: '2.5rem', md: '3.5rem' }, fontWeight: 700, mb: 1 }}>
              Virva Svala
            </Typography>
            <Typography variant="h4" sx={{ color: '#e94560', fontWeight: 500, mb: 3 }}>
              {lang === 'fi' ? 'Ohjelmistosuunnittelija' : 'Software Developer'}
            </Typography>
            <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8, mb: 4, opacity: 0.9 }}>
              {lang === 'fi' ? introFi : introEn}
            </Typography>

            {/* Yhteystiedot */}
            <Stack direction="row" sx={{ flexWrap: 'wrap', mb: 4, gap: 2 }}>
              <Button
                component="a"
                href="mailto:virva.svala@gmail.com"
                startIcon={<EmailIcon />}
                sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.4)', '&:hover': { borderColor: 'white' } }}
                variant="outlined"
                size="small"
              >
                virva.svala(at)gmail.com
              </Button>

              <Button
                component="a"
                href="https://github.com/vsvala"
                target="_blank"
                rel="noopener noreferrer"
                startIcon={<GitHubIcon />}
                sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.4)', '&:hover': { borderColor: 'white' } }}
                variant="outlined"
                size="small"
              >
                github.com/vsvala
              </Button>
              <Button
                component="a"
                href="https://virvasvala.com"
                target="_blank"
                rel="noopener noreferrer"
                startIcon={<PaletteIcon />}
                sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.4)', '&:hover': { borderColor: 'white' } }}
                variant="outlined"
                size="small"
              >
                {lang === 'fi' ? 'Tutustu taiteeseeni' : 'Explore my art'}
              </Button>
            </Stack>

            {/* CV-lataukset */}
            <Typography variant="caption" sx={{ opacity: 0.6, display: 'block', mb: 1 }}>
              {lang === 'fi'
                ? 'Lyhyt CV PDF:nä — tai koko CV tulostettavana verkkoversiona.'
                : 'One-page PDF for quick download — or view the full printable version online.'}
            </Typography>
            <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1.5, alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Button
                  component="a"
                  href="/documents/cv_26_virva_svala_fi.pdf"
                  download
                  variant="contained"
                  startIcon={<DownloadIcon />}
                  sx={{ backgroundColor: '#e94560', '&:hover': { backgroundColor: '#c73652' } }}
                >
                  {lang === 'fi' ? 'Lataa CV (FI)' : 'Download CV (FI)'}
                </Button>
                <Tooltip title={lang === 'fi' ? 'Esikatsele' : 'Preview'}>
                  <IconButton
                    component="a"
                    href="/documents/cv_26_virva_svala_fi.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: 'white' } }}
                  >
                    <VisibilityIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Button
                  component="a"
                  href="/documents/cv_26_virva_svala_en.pdf"
                  download
                  variant="contained"
                  startIcon={<DownloadIcon />}
                  sx={{ backgroundColor: '#e94560', '&:hover': { backgroundColor: '#c73652' } }}
                >
                  {lang === 'fi' ? 'Lataa CV (EN)' : 'Download CV (EN)'}
                </Button>
                <Tooltip title={lang === 'fi' ? 'Esikatsele' : 'Preview'}>
                  <IconButton
                    component="a"
                    href="/documents/cv_26_virva_svala_en.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: 'white' } }}
                  >
                    <VisibilityIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              <Button
                component="a"
                href="/cv"
                variant="outlined"
                sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.4)', '&:hover': { borderColor: 'white' } }}
              >
                {lang === 'fi' ? 'Tulostettava CV' : 'Printable CV'}
              </Button>
            </Stack>
          </Grid>

        </Grid>
      </Container>
    </Box>
  )
}
