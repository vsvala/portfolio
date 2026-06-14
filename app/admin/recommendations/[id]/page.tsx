import { notFound } from 'next/navigation'
import { requireAdmin } from '@/lib/auth'
import { getRecommendationById } from '@/lib/db/queries/recommendations'
import { updateRecommendationAction } from '@/actions/recommendations'
import { RecommendationForm } from '@/components/admin/RecommendationForm'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { LinkButton } from '@/components/ui/LinkButton'

export default async function AdminRecommendationEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await requireAdmin()
  const { id } = await params
  const rec = await getRecommendationById(Number(id))
  if (!rec) notFound()

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <LinkButton href="/admin/recommendations" startIcon={<ArrowBackIcon />} sx={{ mb: 2 }} variant="text">
        Takaisin
      </LinkButton>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>Muokkaa suositusta</Typography>
      <RecommendationForm action={updateRecommendationAction.bind(null, rec.id)} defaultValues={rec} />
    </Container>
  )
}
