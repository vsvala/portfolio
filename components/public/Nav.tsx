'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import MenuIcon from '@mui/icons-material/Menu'
import GitHubIcon from '@mui/icons-material/GitHub'
import Box from '@mui/material/Box'
import { LanguageToggle } from './LanguageToggle'

const navLinks = [
  { href: '/', labelFi: 'Etusivu', labelEn: 'Home' },
  { href: '/work', labelFi: 'Työkokemus', labelEn: 'Experience' },
  { href: '/#osaaminen', labelFi: 'Osaaminen', labelEn: 'Skills' },
  { href: '/education', labelFi: 'Koulutus', labelEn: 'Education' },
  { href: '/#sertifikaatit', labelFi: 'Sertifikaatit', labelEn: 'Certifications' },
  { href: '/projects', labelFi: 'Hackathon', labelEn: 'Hackathon' },
  { href: '/contact', labelFi: 'Yhteystiedot', labelEn: 'Contact' },
]

export function Nav({ lang }: { lang: 'fi' | 'en' }) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      <AppBar position="sticky" elevation={0} sx={{ backgroundColor: 'primary.main' }}>
        <Toolbar>
          <Typography
            component={Link}
            href="/"
            variant="h6"
            sx={{ flexGrow: 1, color: 'white', textDecoration: 'none', fontWeight: 700 }}
          >
            Virva Svala
          </Typography>

          {/* Desktop nav */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, alignItems: 'center' }}>
            {navLinks.map((link) => (
              <Button
                key={link.href}
                component={Link}
                href={link.href}
                sx={{
                  color: 'white',
                  fontWeight: pathname === link.href ? 700 : 400,
                  borderBottom: pathname === link.href ? '2px solid #e94560' : '2px solid transparent',
                  borderRadius: 0,
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
                }}
              >
                {lang === 'fi' ? link.labelFi : link.labelEn}
              </Button>
            ))}
            <IconButton
              component="a"
              href="https://github.com/vsvala"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              sx={{ color: 'white', ml: 1 }}
            >
              <GitHubIcon />
            </IconButton>
            <Box sx={{ ml: 1 }}>
              <LanguageToggle currentLang={lang} />
            </Box>
          </Box>

          {/* Mobile hamburger */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 1, alignItems: 'center' }}>
            <LanguageToggle currentLang={lang} />
            <IconButton
              color="inherit"
              onClick={() => setDrawerOpen(true)}
              aria-label="menu"
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 220, pt: 2 }}>
          <List>
            {navLinks.map((link) => (
              <ListItemButton
                key={link.href}
                component={Link}
                href={link.href}
                selected={pathname === link.href}
                onClick={() => setDrawerOpen(false)}
              >
                <ListItemText primary={lang === 'fi' ? link.labelFi : link.labelEn} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  )
}
