import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import DownloadIcon from '@mui/icons-material/Download'
import EmailIcon from '@mui/icons-material/Email'
import GitHubIcon from '@mui/icons-material/GitHub'
import PhoneIcon from '@mui/icons-material/Phone'

const introFi = `Olen ohjelmistosuunnittelija ja tietojenkäsittelytieteen maisteri Helsingin yliopistosta (2025), taustaltani kuvataiteen opettaja. Minulla on yli 6 vuotta käytännön kokemusta ohjelmistosuunnittelijan työstä Forecalla, jossa vastasin kuluttajapuolen sääpalveluiden, B2B-kehittäjäportaalin sekä dynaamisten sääsovellusten Full Stack -kehityksestä ja ylläpidosta. Ydinosaamiseeni kuuluu moderni web-kehitys — erityisesti Node.js, React, TypeScript ja Next.js. Teknisen osaamiseni lisäksi minulla on poikkeuksellisen vahva visuaalinen silmä taideopettajataustani ansiosta.`

const introEn = `I am a software developer and Master of Science in Computer Science from the University of Helsinki (2025), with a background as an art teacher. I have over 6 years of hands-on experience as a software developer at Foreca, where I was responsible for Full Stack development and maintenance of consumer weather services, a B2B developer portal, and dynamic weather applications. My core expertise lies in modern web development — particularly Node.js, React, TypeScript, and Next.js. In addition to my technical skills, I have an exceptionally strong visual eye from my background as an art teacher.`

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
        <Typography variant="h1" sx={{ fontSize: { xs: '2.5rem', md: '3.5rem' }, fontWeight: 700, mb: 1 }}>
          Virva Svala
        </Typography>
        <Typography variant="h4" sx={{ color: '#e94560', fontWeight: 500, mb: 3 }}>
          {lang === 'fi' ? 'Ohjelmistosuunnittelija' : 'Software Developer'}
        </Typography>
        <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8, mb: 4, maxWidth: 700, opacity: 0.9 }}>
          {lang === 'fi' ? introFi : introEn}
        </Typography>

        {/* Yhteystiedot */}
        <Stack direction="row" sx={{ flexWrap: "wrap", mb: 4, gap: 2 }}>
          <Button
            component="a"
            href="mailto:virva.svala@gmail.com"
            startIcon={<EmailIcon />}
            sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.4)', '&:hover': { borderColor: 'white' } }}
            variant="outlined"
            size="small"
          >
            virva.svala@gmail.com
          </Button>
          <Button
            component="a"
            href="tel:+358505415604"
            startIcon={<PhoneIcon />}
            sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.4)', '&:hover': { borderColor: 'white' } }}
            variant="outlined"
            size="small"
          >
            050-5415604
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
        </Stack>

        {/* CV-lataukset */}
        <Stack direction="row" sx={{ flexWrap: "wrap", gap: 2 }}>
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
        </Stack>
      </Container>
    </Box>
  )
}
