import { requireAdmin } from "@/lib/auth";
import { getAllFeedback } from "@/lib/db/queries/feedback";
import { markReadAction, deleteFeedbackAction } from "@/actions/feedback";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";

export default async function FeedbackPage() {
  await requireAdmin();
  const items = await getAllFeedback();
  const unread = items.filter((f) => !f.is_read).length;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Palautteet
        </Typography>
        {unread > 0 && <Chip label={`${unread} uutta`} color="error" size="small" />}
      </Box>

      {items.length === 0 && <Typography color="text.secondary">Ei palautteita vielä.</Typography>}

      <Stack sx={{ gap: 3 }}>
        {items.map((f) => (
          <Box
            key={f.id}
            sx={{
              p: 3,
              border: "1px solid",
              borderColor: f.is_read ? "divider" : "secondary.main",
              borderRadius: 2,
              backgroundColor: f.is_read ? "transparent" : "rgba(233,69,96,0.04)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                mb: 1,
                gap: 2,
                flexWrap: "wrap",
              }}
            >
              <Box>
                <Chip label={f.target_type} size="small" variant="outlined" sx={{ mr: 1 }} />
                <Typography component="span" variant="subtitle2">
                  {f.target_title}
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary">
                {new Date(f.created_at).toLocaleString("fi-FI")}
              </Typography>
            </Box>

            <Typography variant="body1" sx={{ mb: 1.5, whiteSpace: "pre-wrap" }}>
              {f.message}
            </Typography>

            {(f.sender_name || f.sender_email) && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                {f.sender_name}
                {f.sender_name && f.sender_email && " — "}
                {f.sender_email}
              </Typography>
            )}

            <Divider sx={{ mb: 1.5 }} />

            <Box sx={{ display: "flex", gap: 1 }}>
              {!f.is_read && (
                <form action={markReadAction.bind(null, f.id)}>
                  <button
                    type="submit"
                    style={{
                      cursor: "pointer",
                      padding: "4px 12px",
                      borderRadius: 4,
                      border: "1px solid #ccc",
                      background: "white",
                      fontSize: 13,
                    }}
                  >
                    Merkitse luetuksi
                  </button>
                </form>
              )}
              <form action={deleteFeedbackAction.bind(null, f.id)}>
                <button
                  type="submit"
                  style={{
                    cursor: "pointer",
                    padding: "4px 12px",
                    borderRadius: 4,
                    border: "1px solid #e94560",
                    color: "#e94560",
                    background: "white",
                    fontSize: 13,
                  }}
                >
                  Poista
                </button>
              </form>
            </Box>
          </Box>
        ))}
      </Stack>
    </Container>
  );
}
