'use client'
import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { ActionState, Skill } from '@/lib/types'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FormAction = (prev: any, fd: FormData) => Promise<ActionState<any>>

interface Props {
  action: FormAction
  defaultValues?: Partial<Skill>
}

const categories = [
  { value: 'frontend',  label: 'Frontend' },
  { value: 'backend',   label: 'Backend' },
  { value: 'databases', label: 'Databases / Tietokannat' },
  { value: 'tools',     label: 'Tools / Työkalut' },
  { value: 'methods',   label: 'Methods / Työtavat' },
]

const initial: ActionState = { success: false, errors: {} }

export function SkillForm({ action, defaultValues }: Props) {
  const router = useRouter()
  const [state, formAction, pending] = useActionState(action as FormAction, initial)

  useEffect(() => {
    if (state?.success) router.push('/admin/skills')
  }, [state, router])

  return (
    <form action={formAction}>
      {state && !state.success && state.message && (
        <Alert severity="error" sx={{ mb: 2 }}>{state.message}</Alert>
      )}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField select fullWidth required label="Kategoria" name="category" defaultValue={defaultValues?.category ?? 'frontend'}>
            {categories.map((c) => (
              <MenuItem key={c.value} value={c.value}>{c.label}</MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField fullWidth required label="Taito / Tech" name="name" defaultValue={defaultValues?.name} />
        </Grid>
        <Grid size={{ xs: 12, sm: 2 }}>
          <TextField fullWidth required type="number" label="Järjestys" name="sort_order" defaultValue={defaultValues?.sort_order ?? 0} />
        </Grid>
      </Grid>
      <Button type="submit" variant="contained" sx={{ mt: 3 }} disabled={pending}>
        {pending ? 'Tallennetaan…' : 'Tallenna'}
      </Button>
    </form>
  )
}
