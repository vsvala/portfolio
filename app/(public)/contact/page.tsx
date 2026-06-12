import { cookies } from 'next/headers'
import type { Lang } from '@/lib/types'
import { ContactForm } from '@/components/public/ContactForm'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import EmailIcon from '@mui/icons-material/Email'
import GitHubIcon from '@mui/icons-material/GitHub'
import PaletteIcon from '@mui/icons-material/Palette'
import PhoneIcon from '@mui/icons-material/Phone'

export const metadata = {
  title: 'Contact — Virva Svala',
  description: 'Ota yhteyttä / Get in touch with Virva Svala.',
}

const contactItems = [
  { icon: <EmailIcon />, label: 'virva.svala@gmail.com', href: 'mailto:virva.svala@gmail.com' },
  { icon: <PhoneIcon />, label: '050-5415604', href: 'tel:+358505415604' },
  { icon: <GitHubIcon />, label: 'github.com/vsvala', href: 'https://github.com/vsvala' },
  { icon: <PaletteIcon />, label: 'virvasvala.com', href: 'https://www.virvasvala.com' },
]

export default async function ContactPage() {
  const cookieStore = await cookies()
  const lang = (cookieStore.get('lang')?.value ?? 'fi') as Lang

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
        {lang === 'fi' ? 'Ota yhteyttä' : 'Contact'}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 5 }}>
        {lang === 'fi'
          ? 'Vastaan mielelläni kysymyksiin tai yhteydenottopyyntöihin.'
          : 'I am happy to answer questions or requests for contact.'}
      </Typography>

      <Grid container spacing={6}>
        {/* Contact info */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
            {lang === 'fi' ? 'Yhteystiedot' : 'Contact details'}
          </Typography>
          <Stack sx={{ gap: 2 }}>
            {contactItems.map((item) => (
              <Stack key={item.href} direction="row" sx={{ gap: 1.5, alignItems: 'center' }}>
                <Box sx={{ color: 'secondary.main' }}>{item.icon}</Box>
                <Link href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" underline="hover">
                  {item.label}
                </Link>
              </Stack>
            ))}
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 1 }} sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
          <Divider orientation="vertical" />
        </Grid>

        {/* Contact form */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
            {lang === 'fi' ? 'Lähetä viesti' : 'Send a message'}
          </Typography>
          <ContactForm lang={lang} />
        </Grid>
      </Grid>
    </Container>
  )
}
