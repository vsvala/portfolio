import { cookies } from 'next/headers'
import type { Lang } from '@/lib/types'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Link from '@mui/material/Link'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import EmailIcon from '@mui/icons-material/Email'
import GitHubIcon from '@mui/icons-material/GitHub'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import PaletteIcon from '@mui/icons-material/Palette'

export const metadata = {
  title: 'Contact — Virva Svala',
  description: 'Ota yhteyttä / Get in touch with Virva Svala.',
}

const contactItems = [
  { icon: <EmailIcon />, label: 'virva.svala@gmail.com', href: 'mailto:virva.svala@gmail.com' },
  { icon: <LinkedInIcon />, label: 'linkedin.com/in/virvasvala', href: 'https://www.linkedin.com/in/virvasvala/' },
  { icon: <GitHubIcon />, label: 'github.com/vsvala', href: 'https://github.com/vsvala' },
  { icon: <PaletteIcon />, label: 'virvasvala.com', href: 'https://www.virvasvala.com' },
]

export default async function ContactPage() {
  const cookieStore = await cookies()
  const lang = (cookieStore.get('lang')?.value ?? 'en') as Lang

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
        {lang === 'fi' ? 'Ota yhteyttä' : 'Contact'}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 5 }}>
        {lang === 'fi'
          ? 'Vastaan mielelläni kysymyksiin tai yhteydenottopyyntöihin.'
          : 'I am happy to answer questions or requests for contact.'}
      </Typography>

      <Stack sx={{ gap: 2.5 }}>
        {contactItems.map((item) => (
          <Stack key={item.href} direction="row" sx={{ gap: 2, alignItems: 'center' }}>
            <Box sx={{ color: 'secondary.main', display: 'flex' }}>{item.icon}</Box>
            <Link
              href={item.href}
              target={item.href.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              underline="hover"
              variant="body1"
            >
              {item.label}
            </Link>
          </Stack>
        ))}
      </Stack>
    </Container>
  )
}
