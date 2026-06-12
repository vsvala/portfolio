import { notFound } from 'next/navigation'
import { requireAdmin } from '@/lib/auth'
import { getEducationById } from '@/lib/db/queries/education'
import { updateEducationAction } from '@/actions/education'
import { EducationForm } from '@/components/admin/EducationForm'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { LinkButton } from '@/components/ui/LinkButton'

export default async function AdminEducationEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await requireAdmin()
  const { id } = await params
  const education = getEducationById(Number(id))
  if (!education) notFound()

  const boundAction = updateEducationAction.bind(null, education.id)

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <LinkButton href="/admin/education" startIcon={<ArrowBackIcon />} sx={{ mb: 2 }} variant="text">
        Takaisin
      </LinkButton>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>Muokkaa koulutusta</Typography>
      <EducationForm action={boundAction} defaultValues={education} />
    </Container>
  )
}
