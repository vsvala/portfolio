'use client'
import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { ActionState, Project } from '@/lib/types'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
import Typography from '@mui/material/Typography'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FormAction = (prev: any, fd: FormData) => Promise<ActionState<any>>

interface Props {
  action: FormAction
  defaultValues?: Partial<Project>
}

const initial: ActionState = { success: false, errors: {} }

export function ProjectForm({ action, defaultValues }: Props) {
  const router = useRouter()
  const [state, formAction, pending] = useActionState(action as FormAction, initial)

  useEffect(() => {
    if (state?.success) router.push('/admin/projects')
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
        <Grid size={{ xs: 12 }}>
          <TextField fullWidth required label="Otsikko (FI)" name="title_fi" defaultValue={defaultValues?.title_fi} />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField fullWidth label="Lyhyt kuvaus (FI)" name="description_fi" defaultValue={defaultValues?.description_fi} />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField fullWidth multiline rows={5} label="Pitkä kuvaus (FI)" name="long_description_fi" defaultValue={defaultValues?.long_description_fi} />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1, mb: 1 }}>English</Typography>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField fullWidth required label="Title (EN)" name="title_en" defaultValue={defaultValues?.title_en} />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField fullWidth label="Short description (EN)" name="description_en" defaultValue={defaultValues?.description_en} />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField fullWidth multiline rows={5} label="Long description (EN)" name="long_description_en" defaultValue={defaultValues?.long_description_en} />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1, mb: 1 }}>Linkit ja teknologiat</Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField fullWidth label="Live URL" name="url" placeholder="https://..." defaultValue={defaultValues?.url ?? ''} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField fullWidth label="GitHub repo URL" name="repo_url" placeholder="https://github.com/..." defaultValue={defaultValues?.repo_url ?? ''} />
        </Grid>
        <Grid size={{ xs: 12, sm: 8 }}>
          <TextField
            fullWidth
            label="Teknologiat (pilkulla erotettu)"
            name="technologies"
            placeholder="React, TypeScript, Node.js"
            defaultValue={techs}
          />
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
