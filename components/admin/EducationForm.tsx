'use client'
import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { ActionState, Education } from '@/lib/types'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
import Typography from '@mui/material/Typography'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FormAction = (prev: any, fd: FormData) => Promise<ActionState<any>>

interface Props {
  action: FormAction
  defaultValues?: Partial<Education>
}

const initial: ActionState = { success: false, errors: {} }

export function EducationForm({ action, defaultValues }: Props) {
  const router = useRouter()
  const [state, formAction, pending] = useActionState(action as FormAction, initial)

  useEffect(() => {
    if (state?.success) router.push('/admin/education')
  }, [state, router])

  return (
    <form action={formAction}>
      {state && !state.success && state.message && (
        <Alert severity="error" sx={{ mb: 2 }}>{state.message}</Alert>
      )}

      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>Suomi</Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField fullWidth required label="Oppilaitos (FI)" name="institution_fi" defaultValue={defaultValues?.institution_fi} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField fullWidth required label="Tutkinto (FI)" name="degree_fi" defaultValue={defaultValues?.degree_fi} />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField fullWidth multiline rows={4} label="Kuvaus (FI)" name="description_fi" defaultValue={defaultValues?.description_fi} />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1, mb: 1 }}>English</Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField fullWidth required label="Institution (EN)" name="institution_en" defaultValue={defaultValues?.institution_en} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField fullWidth required label="Degree (EN)" name="degree_en" defaultValue={defaultValues?.degree_en} />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField fullWidth multiline rows={4} label="Description (EN)" name="description_en" defaultValue={defaultValues?.description_en} />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1, mb: 1 }}>Päivämäärät</Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField fullWidth required label="Aloitusvuosi" name="start_date" placeholder="2020" defaultValue={defaultValues?.start_date} />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField fullWidth label="Lopetuspvm (tyhjä = nykyinen)" name="end_date" placeholder="2025" defaultValue={defaultValues?.end_date ?? ''} />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField fullWidth required type="number" label="Järjestys" name="sort_order" defaultValue={defaultValues?.sort_order ?? 0} />
        </Grid>
      </Grid>

      <Button type="submit" variant="contained" sx={{ mt: 3 }} disabled={pending}>
        {pending ? 'Tallennetaan…' : 'Tallenna'}
      </Button>
    </form>
  )
}
