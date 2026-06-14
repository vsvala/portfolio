import { requireAdmin } from '@/lib/auth'
import { createSkillAction } from '@/actions/skills'
import { SkillForm } from '@/components/admin/SkillForm'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { LinkButton } from '@/components/ui/LinkButton'

export default async function AdminSkillNewPage() {
  await requireAdmin()

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <LinkButton href="/admin/skills" startIcon={<ArrowBackIcon />} sx={{ mb: 2 }} variant="text">
        Takaisin
      </LinkButton>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>Lisää taito</Typography>
      <SkillForm action={createSkillAction} />
    </Container>
  )
}
