"use client";
import type { Recommendation } from "@/lib/types";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useAdminForm, type FormAction } from "@/lib/hooks/useAdminForm";
import { AdminFormError, AdminSubmitButton } from "@/components/admin/AdminFormControls";

interface Props {
  action: FormAction;
  defaultValues?: Partial<Recommendation>;
}

export function RecommendationForm({ action, defaultValues }: Props) {
  const { state, formAction, pending } = useAdminForm(action, "/admin/recommendations");

  return (
    <form action={formAction}>
      <AdminFormError message={state && !state.success ? state.message : undefined} />

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            required
            label="Nimi"
            name="name"
            defaultValue={defaultValues?.name}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            required
            label="Rooli / titteli"
            name="role"
            defaultValue={defaultValues?.role}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Yritys"
            name="company"
            defaultValue={defaultValues?.company}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Suhde suosittelijaan"
            name="relationship"
            defaultValue={defaultValues?.relationship}
            placeholder="esim. Kimmo managed Virva directly"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            fullWidth
            required
            label="Päivämäärä"
            name="rec_date"
            placeholder="2025-01-15"
            defaultValue={defaultValues?.rec_date}
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

        <Grid size={{ xs: 12 }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1, mb: 1 }}>
            Suositusteksti
          </Typography>
          <TextField
            fullWidth
            required
            multiline
            rows={8}
            label="Teksti (EN)"
            name="text"
            defaultValue={defaultValues?.text}
          />
        </Grid>
      </Grid>

      <AdminSubmitButton pending={pending} />
    </form>
  );
}
