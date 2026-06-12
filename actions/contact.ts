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
    const { Resend } = await import('resend')
    const resend = new Resend(apiKey)

    await resend.emails.send({
      from: 'Portfolio <onboarding@resend.dev>',
      to: 'virva.svala@gmail.com',
      replyTo: email,
      subject: `Portfolio contact: ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    })

    return { success: true }
  } catch {
    return { success: false, errors: {}, message: 'Sending failed. Please try again.' }
  }
}
