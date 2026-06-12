import { notFound } from 'next/navigation'
import { requireAdmin } from '@/lib/auth'
import { getCourseById } from '@/lib/db/queries/courses'
import { updateCourseAction } from '@/actions/courses'
import { CourseForm } from '@/components/admin/CourseForm'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import { LinkButton } from '@/components/ui/LinkButton'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

export default async function AdminCourseEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await requireAdmin()
  const { id } = await params
  const course = await getCourseById(Number(id))
  if (!course) notFound()

  const boundAction = updateCourseAction.bind(null, course.id)

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <LinkButton href="/admin/courses" startIcon={<ArrowBackIcon />} sx={{ mb: 2 }} variant="text">
        Takaisin
      </LinkButton>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>Muokkaa kurssia</Typography>
      <CourseForm action={boundAction} defaultValues={course} />
    </Container>
  )
}
