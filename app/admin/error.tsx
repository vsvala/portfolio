"use client";
import { Button, Container, Typography } from "@mui/material";

export default function AdminError({ reset }: { reset: () => void }) {
  return (
    <Container sx={{ py: 8, textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        Jotain meni pieleen / Something went wrong
      </Typography>
      <Button variant="contained" onClick={reset}>
        Yritä uudelleen / Try again
      </Button>
    </Container>
  );
}
