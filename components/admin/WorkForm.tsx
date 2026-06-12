'use client'
import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { ActionState, WorkExperience } from '@/lib/types'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
import Typography from '@mui/material/Typography'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FormAction = (prev: any, fd: FormData) => Promise<ActionState<any>>

interface Props {
  action: FormAction
  defaultValues?: Partial<WorkExperience>
}

const initial: ActionState = { success: false, errors: {} }

export function WorkForm({ action, defaultValues }: Props) {
  const router = useRouter()
  const [state, formAction, pending] = useActionState(action as FormAction, initial)

  useEffect(() => {
    if (state?.success) router.push('/admin/work')
  }, [state, router])

  const techs = defaultValues?.technologies
    ? (JSON.parse(defaultValues.technologies) as string[]).join(', ')
    : ''

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
          <TextField fullWidth required label="Yritys (FI)" name="company_name_fi" defaultValue={defaultValues?.company_name_fi} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField fullWidth required label="Rooli (FI)" name="role_fi" defaultValue={defaultValues?.role_fi} />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField fullWidth multiline rows={4} label="Kuvaus (FI)" name="description_fi" defaultValue={defaultValues?.description_fi} />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1, mb: 1 }}>English</Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField fullWidth required label="Company (EN)" name="company_name_en" defaultValue={defaultValues?.company_name_en} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField fullWidth required label="Role (EN)" name="role_en" defaultValue={defaultValues?.role_en} />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField fullWidth multiline rows={4} label="Description (EN)" name="description_en" defaultValue={defaultValues?.description_en} />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1, mb: 1 }}>Päivämäärät ja teknologiat</Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField fullWidth required label="Aloituspvm" name="start_date" placeholder="2020-01" defaultValue={defaultValues?.start_date} />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField fullWidth label="Lopetuspvm (tyhjä = nykyinen)" name="end_date" placeholder="2023-12" defaultValue={defaultValues?.end_date ?? ''} />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField fullWidth required type="number" label="Järjestys" name="sort_order" defaultValue={defaultValues?.sort_order ?? 0} />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="Teknologiat (pilkulla erotettu)"
            name="technologies"
            placeholder="React, TypeScript, Node.js"
            defaultValue={techs}
            helperText="Tallentuu JSON-taulukkona"
          />
        </Grid>
      </Grid>

      <Button type="submit" variant="contained" sx={{ mt: 3 }} disabled={pending}>
        {pending ? 'Tallennetaan…' : 'Tallenna'}
      </Button>
    </form>
  )
}
