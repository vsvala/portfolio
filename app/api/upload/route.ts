import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import path from 'path'
import { randomUUID } from 'crypto'
import { decrypt } from '@/lib/session'
import db from '@/lib/db'

export async function POST(request: NextRequest) {
  const token = request.cookies.get('session')?.value
  const session = await decrypt(token)
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get('file') as File | null
  const label_fi = formData.get('label_fi') as string ?? ''
  const label_en = formData.get('label_en') as string ?? ''
  const document_type = (formData.get('document_type') as string) ?? 'other'

  if (!file) {
    return NextResponse.json({ error: 'No file' }, { status: 400 })
  }

  if (file.type !== 'application/pdf') {
    return NextResponse.json({ error: 'Only PDF allowed' }, { status: 400 })
  }
  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 400 })
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const filename = `${randomUUID()}-${safeName}`
  const filepath = path.join(process.cwd(), 'public', 'documents', filename)
  const bytes = await file.arrayBuffer()
  await writeFile(filepath, Buffer.from(bytes))

  const result = await db.execute({
    sql: `INSERT INTO pdf_documents (filename, label_fi, label_en, document_type, file_size)
          VALUES (:filename, :label_fi, :label_en, :document_type, :file_size)`,
    args: { filename, label_fi, label_en, document_type, file_size: file.size },
  })

  return NextResponse.json({ id: Number(result.lastInsertRowid), filename })
}
