export type Lang = 'fi' | 'en'

export interface WorkExperience {
  id: number
  company_name_fi: string
  company_name_en: string
  role_fi: string
  role_en: string
  description_fi: string
  description_en: string
  start_date: string
  end_date: string | null
  technologies: string
  certificate_document_id: number | null
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Project {
  id: number
  title_fi: string
  title_en: string
  description_fi: string
  description_en: string
  long_description_fi: string
  long_description_en: string
  technologies: string
  url: string | null
  repo_url: string | null
  document_id: number | null
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Education {
  id: number
  institution_fi: string
  institution_en: string
  degree_fi: string
  degree_en: string
  description_fi: string
  description_en: string
  start_date: string
  end_date: string | null
  document_id: number | null
  sort_order: number
  created_at: string
  updated_at: string
}

export interface PdfDocument {
  id: number
  filename: string
  label_fi: string
  label_en: string
  document_type: 'cv' | 'work_certificate' | 'study_certificate' | 'other'
  file_size: number
  created_at: string
}

export interface SessionPayload {
  role: 'admin'
  exp: number
  iat: number
}

export type ActionState<T = void> =
  | { success: true; data?: T }
  | { success: false; errors: Record<string, string[]>; message?: string }
