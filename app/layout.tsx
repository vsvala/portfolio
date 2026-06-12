import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import { cookies } from 'next/headers'
import { MuiProvider } from '@/components/providers/MuiProvider'
import './globals.css'

const geist = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Virva Svala — Ohjelmistosuunnittelija',
  description:
    'Virva Svalan portfolio — ohjelmistosuunnittelija, FM tietojenkäsittelytieteen, yli 6 vuotta kokemusta Full Stack -kehityksestä.',
  openGraph: {
    title: 'Virva Svala — Ohjelmistosuunnittelija',
    description: 'Portfolio: Next.js, React, TypeScript, Node.js, sääpalvelut, karttasovellukset.',
    type: 'website',
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const lang = (cookieStore.get('lang')?.value ?? 'fi') as 'fi' | 'en'

  return (
    <html lang={lang} className={geist.variable} style={{ scrollBehavior: 'smooth' }}>
      <body className="min-h-screen flex flex-col bg-gray-50">
        <MuiProvider>{children}</MuiProvider>
      </body>
    </html>
  )
}
