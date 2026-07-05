"use client";
import { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import LockIcon from "@mui/icons-material/Lock";
import DownloadIcon from "@mui/icons-material/Download";

interface Props {
  filename: string;
  labelFi: string;
  labelEn: string;
  lang: "fi" | "en";
}

export function ProtectedDownload({ filename, labelFi, labelEn, lang }: Props) {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const label = lang === "fi" ? labelFi : labelEn;

  async function handleDownload() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/protected-doc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename, password }),
      });
      if (res.status === 401) {
        setError(lang === "fi" ? "Väärä salasana." : "Incorrect password.");
        setLoading(false);
        return;
      }
      if (!res.ok) {
        setError(lang === "fi" ? "Lataus epäonnistui." : "Download failed.");
        setLoading(false);
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
      setOpen(false);
      setPassword("");
    } catch {
      setError(lang === "fi" ? "Lataus epäonnistui." : "Download failed.");
      setLoading(false);
    }
  }

  return (
    <>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 2, mb: 1 }}>
        {lang === "fi"
          ? "Salasanan saa erikseen pyytämällä."
          : "The password is available on request."}
      </Typography>
      <Button variant="contained" startIcon={<LockIcon />} onClick={() => setOpen(true)}>
        {label}
      </Button>

      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
          setPassword("");
          setError("");
        }}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>{lang === "fi" ? "Syötä salasana" : "Enter password"}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {lang === "fi"
              ? "Tämä asiakirja on suojattu. Pyydä salasana ottamalla yhteyttä."
              : "This document is protected. Contact me to request the password."}
          </Typography>
          <TextField
            autoFocus
            fullWidth
            type="password"
            label={lang === "fi" ? "Salasana" : "Password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleDownload();
            }}
            error={!!error}
            helperText={error}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpen(false);
              setPassword("");
              setError("");
            }}
          >
            {lang === "fi" ? "Peruuta" : "Cancel"}
          </Button>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={handleDownload}
            disabled={!password || loading}
          >
            {lang === "fi" ? "Lataa" : "Download"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
