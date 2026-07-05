"use client";
import type { Course, Education } from "@/lib/types";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useAdminForm, type FormAction } from "@/lib/hooks/useAdminForm";
import { COURSE_CATEGORIES } from "@/lib/constants/categories";
import { AdminFormError, AdminSubmitButton } from "@/components/admin/AdminFormControls";

interface Props {
  action: FormAction;
  defaultValues?: Partial<Course>;
  educationOptions: Pick<Education, "id" | "institution_fi" | "degree_fi">[];
}

export function CourseForm({ action, defaultValues, educationOptions }: Props) {
  const { state, formAction, pending } = useAdminForm(action, "/admin/courses");

  return (
    <form action={formAction}>
      <AdminFormError message={state && !state.success ? state.message : undefined} />

      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
            Suomi
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 8 }}>
          <TextField
            fullWidth
            required
            label="Kurssin nimi (FI)"
            name="name_fi"
            defaultValue={defaultValues?.name_fi}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            fullWidth
            required
            label="Oppilaitos (FI)"
            name="institution_fi"
            defaultValue={defaultValues?.institution_fi}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Kuvaus (FI)"
            name="description_fi"
            defaultValue={defaultValues?.description_fi}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1, mb: 1 }}>
            English
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 8 }}>
          <TextField
            fullWidth
            required
            label="Course name (EN)"
            name="name_en"
            defaultValue={defaultValues?.name_en}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            fullWidth
            required
            label="Institution (EN)"
            name="institution_en"
            defaultValue={defaultValues?.institution_en}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Description (EN)"
            name="description_en"
            defaultValue={defaultValues?.description_en}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1, mb: 1 }}>
            Lisätiedot
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            fullWidth
            select
            required
            label="Kategoria"
            name="category"
            defaultValue={defaultValues?.category ?? "other"}
          >
            {COURSE_CATEGORIES.map((category) => (
              <MenuItem key={category.value} value={category.value}>
                {category.labelFi}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid size={{ xs: 12, sm: 2 }}>
          <TextField
            fullWidth
            type="number"
            label="Opintopisteet"
            name="credits"
            defaultValue={defaultValues?.credits ?? ""}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 2 }}>
          <TextField
            fullWidth
            type="number"
            label="Vuosi"
            name="year"
            placeholder="2023"
            defaultValue={defaultValues?.year ?? ""}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 2 }}>
          <TextField
            fullWidth
            label="Arvosana"
            name="grade"
            placeholder="5 / Hyv."
            defaultValue={defaultValues?.grade ?? ""}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 2 }}>
          <TextField
            fullWidth
            type="number"
            label="Järjestys"
            name="sort_order"
            defaultValue={defaultValues?.sort_order ?? 0}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Linkki kurssisivulle (URL)"
            name="url"
            placeholder="https://..."
            defaultValue={defaultValues?.url ?? ""}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            select
            label="Liitä koulutukseen (valinnainen)"
            name="education_id"
            defaultValue={defaultValues?.education_id ?? ""}
          >
            <MenuItem value="">— ei liitosta —</MenuItem>
            {educationOptions.map((e) => (
              <MenuItem key={e.id} value={e.id}>
                {e.degree_fi} — {e.institution_fi}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>

      <AdminSubmitButton pending={pending} />
    </form>
  );
}
