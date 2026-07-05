"use client";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";

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
