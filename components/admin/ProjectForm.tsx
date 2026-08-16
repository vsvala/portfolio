"use client";
import type { Project } from "@/lib/types";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Grid from "@mui/material/Grid";
import { useAdminForm, type FormAction } from "@/lib/hooks/useAdminForm";
import { parseTechnologies } from "@/lib/utils";
import { PROJECT_CATEGORIES } from "@/lib/constants/categories";
import {
  AdminFormError,
  AdminFormSectionLabel,
  AdminSubmitButton,
} from "@/components/admin/AdminFormControls";

interface Props {
  action: FormAction;
  defaultValues?: Partial<Project>;
}

export function ProjectForm({ action, defaultValues }: Props) {
  const { state, formAction, pending } = useAdminForm(action, "/admin/projects");

  const techs = defaultValues?.technologies
    ? parseTechnologies(defaultValues.technologies).join(", ")
    : "";

  return (
    <form action={formAction}>
      <AdminFormError message={state && !state.success ? state.message : undefined} />

      <Grid container spacing={2}>
        <AdminFormSectionLabel first>Suomi</AdminFormSectionLabel>
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            required
            label="Otsikko (FI)"
            name="title_fi"
            defaultValue={defaultValues?.title_fi}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="Lyhyt kuvaus (FI)"
            name="description_fi"
            defaultValue={defaultValues?.description_fi}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            multiline
            rows={5}
            label="Pitkä kuvaus (FI)"
            name="long_description_fi"
            defaultValue={defaultValues?.long_description_fi}
          />
        </Grid>

        <AdminFormSectionLabel>English</AdminFormSectionLabel>
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            required
            label="Title (EN)"
            name="title_en"
            defaultValue={defaultValues?.title_en}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="Short description (EN)"
            name="description_en"
            defaultValue={defaultValues?.description_en}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            multiline
            rows={5}
            label="Long description (EN)"
            name="long_description_en"
            defaultValue={defaultValues?.long_description_en}
          />
        </Grid>

        <AdminFormSectionLabel>Linkit ja teknologiat</AdminFormSectionLabel>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Live URL"
            name="url"
            placeholder="https://..."
            defaultValue={defaultValues?.url ?? ""}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="GitHub repo URL"
            name="repo_url"
            placeholder="https://github.com/..."
            defaultValue={defaultValues?.repo_url ?? ""}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="Status badge (esim. 🚧 Under Active Development)"
            name="status"
            defaultValue={defaultValues?.status ?? ""}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            fullWidth
            select
            label="Kategoria"
            name="category"
            defaultValue={defaultValues?.category ?? "hackathon"}
          >
            {PROJECT_CATEGORIES.map((category) => (
              <MenuItem key={category.value} value={category.value}>
                {category.labelFi}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Teknologiat (pilkulla erotettu)"
            name="technologies"
            placeholder="React, TypeScript, Node.js"
            defaultValue={techs}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 2 }}>
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
