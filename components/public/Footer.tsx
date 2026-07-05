import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import MuiLink from "@mui/material/Link";
import Stack from "@mui/material/Stack";

export function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "primary.main",
        color: "rgba(255,255,255,0.7)",
        py: 3,
        mt: "auto",
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: "lg",
          mx: "auto",
          px: 3,
          gap: 1,
        }}
      >
        <Typography variant="body2">© {new Date().getFullYear()} Virva Svala</Typography>
        <Stack direction="row" sx={{ gap: 2 }}>
          <MuiLink
            href="https://github.com/vsvala"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ color: "rgba(255,255,255,0.7)", "&:hover": { color: "white" } }}
            underline="hover"
          >
            GitHub
          </MuiLink>
          <MuiLink
            href="mailto:virva.svala@gmail.com"
            sx={{ color: "rgba(255,255,255,0.7)", "&:hover": { color: "white" } }}
            underline="hover"
          >
            virva.svala@gmail.com
          </MuiLink>
        </Stack>
      </Stack>
    </Box>
  );
}
