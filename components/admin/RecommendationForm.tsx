'use client'
import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { ActionState, Recommendation } from '@/lib/types'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
import Typography from '@mui/material/Typography'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FormAction = (prev: any, fd: FormData) => Promise<ActionState<any>>

interface Props {
  action: FormAction
  defaultValues?: Partial<Recommendation>
}

const initial: ActionState = { success: false, errors: {} }

export function RecommendationForm({ action, defaultValues }: Props) {
  const router = useRouter()
  const [state, formAction, pending] = useActionState(action as FormAction, initial)

  useEffect(() => {
    if (state?.success) router.push('/admin/recommendations')
  }, [state, router])

  return (
    <form action={formAction}>
      {state && !state.success && state.message && (
        <Alert severity="error" sx={{ mb: 2 }}>{state.message}</Alert>
      )}

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField fullWidth required label="Nimi" name="name" defaultValue={defaultValues?.name} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField fullWidth required label="Rooli / titteli" name="role" defaultValue={defaultValues?.role} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField fullWidth label="Yritys" name="company" defaultValue={defaultValues?.company} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField fullWidth label="Suhde suosittelijaan" name="relationship" defaultValue={defaultValues?.relationship} placeholder="esim. Kimmo managed Virva directly" />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField fullWidth required label="Päivämäärä" name="rec_date" placeholder="2025-01-15" defaultValue={defaultValues?.rec_date} />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField fullWidth required type="number" label="Järjestys" name="sort_order" defaultValue={defaultValues?.sort_order ?? 0} />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1, mb: 1 }}>Suositusteksti</Typography>
          <TextField fullWidth required multiline rows={8} label="Teksti (EN)" name="text" defaultValue={defaultValues?.text} />
        </Grid>
      </Grid>

      <Button type="submit" variant="contained" sx={{ mt: 3 }} disabled={pending}>
        {pending ? 'Tallennetaan…' : 'Tallenna'}
      </Button>
    </form>
  )
}
