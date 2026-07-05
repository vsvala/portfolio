import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import type { ReactNode } from "react";

export function AdminPageHeader({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 3,
      }}
    >
      <Typography variant="h4" sx={{ fontWeight: 700 }}>
        {title}
      </Typography>
      {action}
    </Box>
  );
}

export function AdminEmptyTableRow({ colSpan, message }: { colSpan: number; message: string }) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} sx={{ textAlign: "center", color: "text.secondary" }}>
        {message}
      </TableCell>
    </TableRow>
  );
}
