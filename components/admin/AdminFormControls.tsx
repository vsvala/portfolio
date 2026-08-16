"use client";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";

export function AdminFormSectionLabel({
  children,
  first = false,
}: {
  children: ReactNode;
  first?: boolean;
}) {
  return (
    <Grid size={{ xs: 12 }}>
      <Typography variant="subtitle2" color="text.secondary" sx={{ mt: first ? 0 : 1, mb: 1 }}>
        {children}
      </Typography>
    </Grid>
  );
}

export function AdminFormError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return (
    <Alert severity="error" sx={{ mb: 2 }}>
      {message}
    </Alert>
  );
}

export function AdminSubmitButton({ pending }: { pending: boolean }) {
  return (
    <Button type="submit" variant="contained" sx={{ mt: 3 }} disabled={pending}>
      {pending ? "Tallennetaan…" : "Tallenna"}
    </Button>
  );
}
