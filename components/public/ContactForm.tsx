'use client'
import { useActionState } from 'react'
import { sendContactMessage } from '@/actions/contact'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Alert from '@mui/material/Alert'
import type { Lang } from '@/lib/types'
import type { ActionState } from '@/lib/types'

const initialState: ActionState = { success: false, errors: {} }

export function ContactForm({ lang }: { lang: Lang }) {
  const [state, action, pending] = useActionState(sendContactMessage, initialState)

  if (state.success) {
    return (
      <Alert severity="success" sx={{ mt: 2 }}>
        {lang === 'fi'
          ? 'Viesti lähetetty! Palaan sinulle pian.'
          : 'Message sent! I will get back to you soon.'}
      </Alert>
    )
  }

  return (
    <Box component="form" action={action} sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 560 }}>
      {state.message && <Alert severity="error">{state.message}</Alert>}

      {/* Honeypot — hidden from real users, bots fill it in */}
      <input name="honeypot" tabIndex={-1} aria-hidden="true" style={{ display: 'none' }} />

      <TextField
        name="name"
        label={lang === 'fi' ? 'Nimi' : 'Name'}
        required
        fullWidth
        error={!!state.errors?.name}
        helperText={state.errors?.name?.[0]}
      />
      <TextField
        name="email"
        label={lang === 'fi' ? 'Sähköposti' : 'Email'}
        type="email"
        required
        fullWidth
        error={!!state.errors?.email}
        helperText={state.errors?.email?.[0]}
      />
      <TextField
        name="message"
        label={lang === 'fi' ? 'Viesti' : 'Message'}
        multiline
        rows={5}
        required
        fullWidth
        error={!!state.errors?.message}
        helperText={state.errors?.message?.[0]}
      />
      <Button
        type="submit"
        variant="contained"
        disabled={pending}
        sx={{ alignSelf: 'flex-start', backgroundColor: '#e94560', '&:hover': { backgroundColor: '#c73652' } }}
      >
        {pending
          ? (lang === 'fi' ? 'Lähetetään...' : 'Sending...')
          : (lang === 'fi' ? 'Lähetä viesti' : 'Send message')}
      </Button>
    </Box>
  )
}
