"use client";
import type { Education } from "@/lib/types";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useAdminForm, type FormAction } from "@/lib/hooks/useAdminForm";
import { AdminFormError, AdminSubmitButton } from "@/components/admin/AdminFormControls";

interface Props {
  action: FormAction;
  defaultValues?: Partial<Education>;
}

export function EducationForm({ action, defaultValues }: Props) {
  const { state, formAction, pending } = useAdminForm(action, "/admin/education");

  return (
    <form action={formAction}>
      <AdminFormError message={state && !state.success ? state.message : undefined} />

      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
            Suomi
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            required
            label="Oppilaitos (FI)"
            name="institution_fi"
            defaultValue={defaultValues?.institution_fi}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            required
            label="Tutkinto (FI)"
            name="degree_fi"
            defaultValue={defaultValues?.degree_fi}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            multiline
            rows={4}
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
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            required
            label="Institution (EN)"
            name="institution_en"
            defaultValue={defaultValues?.institution_en}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            required
            label="Degree (EN)"
            name="degree_en"
            defaultValue={defaultValues?.degree_en}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Description (EN)"
            name="description_en"
            defaultValue={defaultValues?.description_en}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="Thesis URL"
            name="thesis_url"
            placeholder="https://..."
            defaultValue={defaultValues?.thesis_url ?? ""}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1, mb: 1 }}>
            Päivämäärät
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            fullWidth
            required
            label="Aloitusvuosi"
            name="start_date"
            placeholder="2020"
            defaultValue={defaultValues?.start_date}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            fullWidth
            label="Lopetuspvm (tyhjä = nykyinen)"
            name="end_date"
            placeholder="2025"
            defaultValue={defaultValues?.end_date ?? ""}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            fullWidth
            required
            type="number"
            label="Järjestys"
            name="sort_order"
            defaultValue={defaultValues?.sort_order ?? 0}
          />
        </Grid>
      </Grid>

      <AdminSubmitButton pending={pending} />
    </form>
  );
}
