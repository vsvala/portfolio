'use server'
import { z } from 'zod'
import type { ActionState } from '@/lib/types'

const schema = z.object({
  name: z.string().min(1, 'Nimi vaaditaan / Name is required').max(100),
  email: z.string().email('Virheellinen sähköpostiosoite / Invalid email').max(200),
  message: z.string().min(10, 'Viesti on liian lyhyt / Message is too short').max(2000),
  honeypot: z.string().max(0, 'Bot detected'),
})

export async function sendContactMessage(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = schema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message'),
    honeypot: formData.get('honeypot') ?? '',
  })

  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  const { name, email, message } = parsed.data
  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey) {
    return { success: false, errors: {}, message: 'Email service not configured.' }
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Portfolio <onboarding@resend.dev>',
        to: process.env.CONTACT_EMAIL ?? '',
        reply_to: email,
        subject: `Portfolio contact: ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      }),
    })

    if (!res.ok) throw new Error(`Resend error: ${res.status}`)
    return { success: true }
  } catch {
    return { success: false, errors: {}, message: 'Sending failed. Please try again.' }
  }
}
