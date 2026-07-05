"use client";
import { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Alert from "@mui/material/Alert";
import type { ActionState } from "@/lib/types";

interface Props {
  action: () => Promise<void | ActionState>;
  label?: string;
}

export function DeleteButton({ action, label = "Poista" }: Props) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleDelete() {
    setPending(true);
    setErrorMessage(null);
    try {
      const result = await action();
      if (result && typeof result === "object" && "success" in result && !result.success) {
        setErrorMessage(result.message ?? "Poisto epaonnistui / Delete failed. Please try again.");
        return;
      }
      setOpen(false);
    } catch {
      setErrorMessage("Poisto epaonnistui / Delete failed. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <Button
        variant="outlined"
        color="error"
        size="small"
        onClick={() => {
          setErrorMessage(null);
          setOpen(true);
        }}
      >
        {label}
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Vahvista poisto</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Haluatko varmasti poistaa tämän? Toimintoa ei voi perua.
          </DialogContentText>
          {errorMessage && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {errorMessage}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Peruuta</Button>
          <Button onClick={handleDelete} color="error" disabled={pending}>
            {pending ? "Poistetaan…" : "Poista"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
