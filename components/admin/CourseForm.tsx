'use client'
import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { ActionState, Course, Education } from '@/lib/types'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
import Typography from '@mui/material/Typography'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FormAction = (prev: any, fd: FormData) => Promise<ActionState<any>>

interface Props {
  action: FormAction
  defaultValues?: Partial<Course>
  educationOptions: Pick<Education, 'id' | 'institution_fi' | 'degree_fi'>[]
}

const categories = [
  { value: 'programming', labelFi: 'Ohjelmointi' },
  { value: 'math', labelFi: 'Matematiikka & tilastot' },
  { value: 'ai_data', labelFi: 'Tekoäly & data' },
  { value: 'systems', labelFi: 'Järjestelmät & verkot' },
  { value: 'design', labelFi: 'Suunnittelu & UX' },
  { value: 'other', labelFi: 'Muut' },
]

const initial: ActionState = { success: false, errors: {} }

export function CourseForm({ action, defaultValues, educationOptions }: Props) {
  const router = useRouter()
  const [state, formAction, pending] = useActionState(action as FormAction, initial)

  useEffect(() => {
    if (state?.success) router.push('/admin/courses')
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
        <Grid size={{ xs: 12, sm: 8 }}>
          <TextField fullWidth required label="Kurssin nimi (FI)" name="name_fi" defaultValue={defaultValues?.name_fi} />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField fullWidth required label="Oppilaitos (FI)" name="institution_fi" defaultValue={defaultValues?.institution_fi} />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField fullWidth multiline rows={3} label="Kuvaus (FI)" name="description_fi" defaultValue={defaultValues?.description_fi} />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1, mb: 1 }}>English</Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 8 }}>
          <TextField fullWidth required label="Course name (EN)" name="name_en" defaultValue={defaultValues?.name_en} />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField fullWidth required label="Institution (EN)" name="institution_en" defaultValue={defaultValues?.institution_en} />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField fullWidth multiline rows={3} label="Description (EN)" name="description_en" defaultValue={defaultValues?.description_en} />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1, mb: 1 }}>Lisätiedot</Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField fullWidth select required label="Kategoria" name="category" defaultValue={defaultValues?.category ?? 'other'}>
            {categories.map((c) => (
              <MenuItem key={c.value} value={c.value}>{c.labelFi}</MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid size={{ xs: 12, sm: 2 }}>
          <TextField fullWidth type="number" label="Opintopisteet" name="credits" defaultValue={defaultValues?.credits ?? ''} />
        </Grid>
        <Grid size={{ xs: 12, sm: 2 }}>
          <TextField fullWidth type="number" label="Vuosi" name="year" placeholder="2023" defaultValue={defaultValues?.year ?? ''} />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField fullWidth type="number" label="Järjestys" name="sort_order" defaultValue={defaultValues?.sort_order ?? 0} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField fullWidth label="Linkki kurssisivulle (URL)" name="url" placeholder="https://..." defaultValue={defaultValues?.url ?? ''} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField fullWidth select label="Liitä koulutukseen (valinnainen)" name="education_id" defaultValue={defaultValues?.education_id ?? ''}>
            <MenuItem value="">— ei liitosta —</MenuItem>
            {educationOptions.map((e) => (
              <MenuItem key={e.id} value={e.id}>{e.degree_fi} — {e.institution_fi}</MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>

      <Button type="submit" variant="contained" sx={{ mt: 3 }} disabled={pending}>
        {pending ? 'Tallennetaan…' : 'Tallenna'}
      </Button>
    </form>
  )
}
