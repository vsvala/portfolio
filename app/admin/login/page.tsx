"use client";
import { useActionState } from "react";
import { login } from "@/actions/auth";
import type { ActionState } from "@/lib/types";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Paper from "@mui/material/Paper";

const initialState: ActionState = { success: false, errors: {}, message: "" };

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, initialState);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        backgroundColor: "grey.100",
      }}
    >
      <Container maxWidth="xs">
        <Paper sx={{ p: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, textAlign: "center" }}>
            Admin
          </Typography>
          {state && !state.success && state.message && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {state.message}
            </Alert>
          )}
          <form action={action}>
            <TextField
              fullWidth
              label="Salasana / Password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              sx={{ mb: 2 }}
            />
            <Button type="submit" fullWidth variant="contained" disabled={pending}>
              {pending ? "Kirjaudutaan…" : "Kirjaudu sisään"}
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}
