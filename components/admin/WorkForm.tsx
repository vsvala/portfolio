"use client";
import type { WorkExperience } from "@/lib/types";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import { useAdminForm, type FormAction } from "@/lib/hooks/useAdminForm";
import { parseTechnologies } from "@/lib/utils";
import {
  AdminFormError,
  AdminFormSectionLabel,
  AdminSubmitButton,
} from "@/components/admin/AdminFormControls";

interface Props {
  action: FormAction;
  defaultValues?: Partial<WorkExperience>;
}

export function WorkForm({ action, defaultValues }: Props) {
  const { state, formAction, pending } = useAdminForm(action, "/admin/work");

  const techs = defaultValues?.technologies
    ? parseTechnologies(defaultValues.technologies).join(", ")
    : "";

  return (
    <form action={formAction}>
      <AdminFormError message={state && !state.success ? state.message : undefined} />

      <Grid container spacing={2}>
        <AdminFormSectionLabel first>Suomi</AdminFormSectionLabel>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            required
            label="Yritys (FI)"
            name="company_name_fi"
            defaultValue={defaultValues?.company_name_fi}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            required
            label="Rooli (FI)"
            name="role_fi"
            defaultValue={defaultValues?.role_fi}
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

        <AdminFormSectionLabel>English</AdminFormSectionLabel>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            required
            label="Company (EN)"
            name="company_name_en"
            defaultValue={defaultValues?.company_name_en}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            required
            label="Role (EN)"
            name="role_en"
            defaultValue={defaultValues?.role_en}
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

        <AdminFormSectionLabel>Päivämäärät ja teknologiat</AdminFormSectionLabel>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            fullWidth
            required
            label="Aloituspvm"
            name="start_date"
            placeholder="2020-01"
            defaultValue={defaultValues?.start_date}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            fullWidth
            label="Lopetuspvm (tyhjä = nykyinen)"
            name="end_date"
            placeholder="2023-12"
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

      <AdminSubmitButton pending={pending} />
    </form>
  );
}
