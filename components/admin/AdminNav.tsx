'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logout } from '@/actions/auth'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'

const links = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/work', label: 'Työ' },
  { href: '/admin/projects', label: 'Projektit' },
  { href: '/admin/education', label: 'Koulutus' },
]

export function AdminNav() {
  const pathname = usePathname()

  return (
    <AppBar position="sticky" elevation={0} sx={{ backgroundColor: '#1a1a2e' }}>
      <Toolbar sx={{ gap: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: 'white', mr: 2 }}>
          Admin
        </Typography>
        <Box sx={{ display: 'flex', gap: 0.5, flex: 1 }}>
          {links.map((link) => (
            <Button
              key={link.href}
              component={Link}
              href={link.href}
              sx={{
                color: 'white',
                fontWeight: pathname === link.href ? 700 : 400,
                borderBottom: pathname === link.href ? '2px solid #e94560' : '2px solid transparent',
                borderRadius: 0,
              }}
            >
              {link.label}
            </Button>
          ))}
        </Box>
        <form action={logout}>
          <Button type="submit" sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: 'white' } }}>
            Kirjaudu ulos
          </Button>
        </form>
      </Toolbar>
    </AppBar>
  )
}
