import { requireAdmin } from "@/lib/auth";
import { createCourseAction } from "@/actions/courses";
import { getAllEducation } from "@/lib/db/queries/education";
import { CourseForm } from "@/components/admin/CourseForm";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { LinkButton } from "@/components/ui/LinkButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default async function AdminCourseNewPage() {
  await requireAdmin();
  const education = await getAllEducation();
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <LinkButton href="/admin/courses" startIcon={<ArrowBackIcon />} sx={{ mb: 2 }} variant="text">
        Takaisin
      </LinkButton>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        Uusi kurssi
      </Typography>
      <CourseForm action={createCourseAction} educationOptions={education} />
    </Container>
  );
}
