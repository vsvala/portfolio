'use client'
import { useActionState, useState } from 'react'
import { submitFeedback } from '@/actions/feedback'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Collapse from '@mui/material/Collapse'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import FeedbackIcon from '@mui/icons-material/Feedback'
import type { ActionState } from '@/lib/types'
import type { Lang } from '@/lib/types'

interface Props {
  lang: Lang
  targetType: 'work' | 'project' | 'education'
  targetId: number
  targetTitle: string
}

const initial: ActionState = { success: false, errors: {} }

export function FeedbackForm({ lang, targetType, targetId, targetTitle }: Props) {
  const [open, setOpen] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [state, action, pending] = useActionState(submitFeedback as any, initial)

  if (state.success) {
    return (
      <Alert severity="success" sx={{ mt: 4 }}>
        {lang === 'fi' ? 'Kiitos palautteesta!' : 'Thank you for your feedback!'}
      </Alert>
    )
  }

  return (
    <Box sx={{ mt: 5 }}>
      <Button
        variant="text"
        startIcon={<FeedbackIcon />}
        onClick={() => setOpen((o) => !o)}
        sx={{ color: 'text.secondary', mb: 1 }}
      >
        {lang === 'fi' ? 'Jäikö jotain epäselväksi tai halusitko tietää jotain lisää?' : 'Anything unclear or want to know more?'}
      </Button>

      <Collapse in={open}>
        <Box
          component="form"
          action={action}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 520, pt: 1 }}
        >
          <input type="hidden" name="target_type" value={targetType} />
          <input type="hidden" name="target_id" value={targetId} />
          <input type="hidden" name="target_title" value={targetTitle} />
          <input name="honeypot" tabIndex={-1} aria-hidden="true" style={{ display: 'none' }} />

          <Typography variant="body2" color="text.secondary">
            {lang === 'fi'
              ? 'Oliko jotain muuta mitä olisit halunnut tietää tästä osiosta? Voit jättää viestin nimettömästi.'
              : 'Was there something else you wanted to know about this section? You can leave a message anonymously.'}
          </Typography>

          <TextField
            name="message"
            label={lang === 'fi' ? 'Viesti *' : 'Message *'}
            multiline
            rows={3}
            fullWidth
            required
            error={!!state.errors?.message}
            helperText={state.errors?.message?.[0]}
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              name="sender_name"
              label={lang === 'fi' ? 'Nimi (vapaaehtoinen)' : 'Name (optional)'}
              fullWidth
              error={!!state.errors?.sender_name}
            />
            <TextField
              name="sender_email"
              label={lang === 'fi' ? 'Sähköposti (vapaaehtoinen)' : 'Email (optional)'}
              type="email"
              fullWidth
              error={!!state.errors?.sender_email}
              helperText={state.errors?.sender_email?.[0]}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button type="submit" variant="contained" disabled={pending}
              sx={{ backgroundColor: '#e94560', '&:hover': { backgroundColor: '#c73652' } }}>
              {pending ? '...' : (lang === 'fi' ? 'Lähetä' : 'Send')}
            </Button>
            <Button variant="text" onClick={() => setOpen(false)} sx={{ color: 'text.secondary' }}>
              {lang === 'fi' ? 'Peruuta' : 'Cancel'}
            </Button>
          </Box>
        </Box>
      </Collapse>
    </Box>
  )
}
