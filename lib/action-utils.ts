import type { ZodError } from 'zod'
import type { ActionState } from '@/lib/types'

export function validationError<T = void>(error: ZodError): ActionState<T> {
  return {
    success: false,
    errors: error.flatten().fieldErrors as Record<string, string[]>,
    message: 'Tarkista lomakkeen kentät / Please check the form fields',
  }
}
