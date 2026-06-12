import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const filename = searchParams.get('filename')
  const password = searchParams.get('password')

  if (!filename || !/^[\w\-. ]+\.(pdf|jpg|png)$/i.test(filename)) {
    return NextResponse.json({ error: 'Invalid filename' }, { status: 400 })
  }

  const expected = process.env.CERTIFICATE_PASSWORD
  if (!expected || password !== expected) {
    return NextResponse.json({ error: 'Väärä salasana' }, { status: 401 })
  }

  const filepath = join(process.cwd(), 'private-documents', filename)
  if (!existsSync(filepath)) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 })
  }

  const buffer = await readFile(filepath)
  const ext = filename.split('.').pop()?.toLowerCase()
  const contentType = ext === 'pdf' ? 'application/pdf' : `image/${ext}`

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': contentType,
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  })
}
