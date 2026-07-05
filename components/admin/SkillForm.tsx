"use client";
import type { Skill } from "@/lib/types";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Grid from "@mui/material/Grid";
import { useAdminForm, type FormAction } from "@/lib/hooks/useAdminForm";
import { SKILL_CATEGORY_KEYS, SKILL_CATEGORY_LABELS } from "@/lib/constants/categories";
import { AdminFormError, AdminSubmitButton } from "@/components/admin/AdminFormControls";

interface Props {
  action: FormAction;
  defaultValues?: Partial<Skill>;
}

export function SkillForm({ action, defaultValues }: Props) {
  const { state, formAction, pending } = useAdminForm(action, "/admin/skills");

  return (
    <form action={formAction}>
      <AdminFormError message={state && !state.success ? state.message : undefined} />
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            select
            fullWidth
            required
            label="Kategoria"
            name="category"
            defaultValue={defaultValues?.category ?? "frontend"}
          >
            {SKILL_CATEGORY_KEYS.map((categoryKey) => (
              <MenuItem key={categoryKey} value={categoryKey}>
                {`${SKILL_CATEGORY_LABELS[categoryKey].en} / ${SKILL_CATEGORY_LABELS[categoryKey].fi}`}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            fullWidth
            required
            label="Taito / Tech"
            name="name"
            defaultValue={defaultValues?.name}
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
