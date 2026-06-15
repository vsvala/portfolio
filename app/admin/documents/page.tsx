import { requireAdmin } from '@/lib/auth'
import { getAllDocuments } from '@/lib/db/queries/documents'
import { deleteDocumentAction } from '@/actions/documents'
import { DeleteButton } from '@/components/admin/DeleteButton'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Box from '@mui/material/Box'
import { LinkButton } from '@/components/ui/LinkButton'

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default async function AdminDocumentsPage() {
  await requireAdmin()
  const documents = await getAllDocuments()

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>Dokumentit</Typography>
        <LinkButton href="/admin" variant="text">← Dashboard</LinkButton>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Dokumentit ladataan ylös työ-, koulutus- ja projektilomakkeilla. Täällä voit poistaa yksittäisiä tiedostoja.
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Tiedostonimi</TableCell>
            <TableCell>Tyyppi</TableCell>
            <TableCell>Kuvaus (FI)</TableCell>
            <TableCell>Koko</TableCell>
            <TableCell>Lisätty</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {documents.map((doc) => (
            <TableRow key={doc.id}>
              <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.8rem', maxWidth: 200, wordBreak: 'break-all' }}>
                {doc.filename}
              </TableCell>
              <TableCell>{doc.document_type}</TableCell>
              <TableCell>{doc.label_fi || '—'}</TableCell>
              <TableCell>{formatBytes(doc.file_size)}</TableCell>
              <TableCell>{doc.created_at.slice(0, 10)}</TableCell>
              <TableCell>
                <DeleteButton action={deleteDocumentAction.bind(null, doc.id)} />
              </TableCell>
            </TableRow>
          ))}
          {documents.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} sx={{ textAlign: 'center', color: 'text.secondary' }}>
                Ei dokumentteja.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Container>
  )
}
