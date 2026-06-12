import { cookies } from 'next/headers'
import type { Lang } from '@/lib/types'
import { getAllWork } from '@/lib/db/queries/work'
import { getAllEducation } from '@/lib/db/queries/education'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Chip from '@mui/material/Chip'
import { PrintButton } from '@/components/public/PrintButton'

const skills = {
  frontend: ['HTML/CSS', 'JavaScript', 'TypeScript', 'React', 'Next.js', 'Vite', 'Leaflet', 'MapLibre'],
  backend: ['Node.js', 'SQL', 'Python', 'Java'],
  databases: ['PostgreSQL', 'MongoDB', 'SQLite'],
  tools: ['Git', 'Adobe Creative Cloud', 'GitHub Copilot', 'Claude Code'],
  methods: ['Scrum', 'Kanban'],
}

const skillLabels: Record<string, { fi: string; en: string }> = {
  frontend: { fi: 'Frontend', en: 'Frontend' },
  backend: { fi: 'Backend', en: 'Backend' },
  databases: { fi: 'Tietokannat', en: 'Databases' },
  tools: { fi: 'Työkalut', en: 'Tools' },
  methods: { fi: 'Työtavat', en: 'Methods' },
}

const languages = [
  { fi: 'Suomi', en: 'Finnish', levelFi: 'Äidinkieli', levelEn: 'Native' },
  { fi: 'Englanti', en: 'English', levelFi: 'Sujuva', levelEn: 'Fluent' },
  { fi: 'Ruotsi', en: 'Swedish', levelFi: 'Hyvä', levelEn: 'Good' },
  { fi: 'Ranska', en: 'French', levelFi: 'Perusteet', levelEn: 'Basic' },
]

function Section({ title }: { title: string }) {
  return (
    <Box sx={{ mb: 0.5, mt: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a1a2e', textTransform: 'uppercase', letterSpacing: 1, fontSize: '0.85rem' }}>
        {title}
      </Typography>
      <Divider sx={{ borderColor: '#e94560', borderBottomWidth: 2, mt: 0.5 }} />
    </Box>
  )
}

export default async function CvPage() {
  const cookieStore = await cookies()
  const lang = (cookieStore.get('lang')?.value ?? 'fi') as Lang

  const work = await getAllWork()
  const education = await getAllEducation()

  const isFi = lang === 'fi'

  return (
    <Box
      sx={{
        maxWidth: 800,
        mx: 'auto',
        px: { xs: 3, sm: 6 },
        py: { xs: 4, sm: 6 },
        fontFamily: 'Georgia, serif',
        '@media print': {
          px: 4,
          py: 2,
          maxWidth: '100%',
        },
      }}
    >
      {/* Print button — hidden when printing */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3, '@media print': { display: 'none' } }}>
        <PrintButton lang={lang} />
      </Box>

      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h3" sx={{ fontWeight: 700, color: '#1a1a2e', mb: 0.5 }}>
          Virva Svala
        </Typography>
        <Typography variant="h6" sx={{ color: '#e94560', fontWeight: 400, mb: 1.5 }}>
          {isFi ? 'Ohjelmistosuunnittelija' : 'Software Developer'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          virva.svala(at)gmail.com · github.com/vsvala · virvasvala.com
        </Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Work experience */}
      <Section title={isFi ? 'Työkokemus' : 'Work Experience'} />
      <Box sx={{ mt: 2 }}>
        {work.map((w) => {
          let techs: string[] = []
          try { techs = JSON.parse(w.technologies) } catch { /* empty */ }
          return (
            <Box key={w.id} sx={{ mb: 2.5, '@media print': { mb: 1.5 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  {isFi ? w.role_fi : w.role_en}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                  {w.start_date}{w.end_date ? `–${w.end_date}` : '–'}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#e94560', mb: 0.5 }}>
                {isFi ? w.company_name_fi : w.company_name_en}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.75, lineHeight: 1.6 }}>
                {isFi ? w.description_fi : w.description_en}
              </Typography>
              {techs.length > 0 && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {techs.map((t) => (
                    <Chip key={t} label={t} size="small" sx={{ fontSize: '0.7rem', height: 20, backgroundColor: 'rgba(26,26,46,0.08)' }} />
                  ))}
                </Box>
              )}
            </Box>
          )
        })}
      </Box>

      {/* Education */}
      <Section title={isFi ? 'Koulutus' : 'Education'} />
      <Box sx={{ mt: 2 }}>
        {education.map((e) => (
          <Box key={e.id} sx={{ mb: 2, '@media print': { mb: 1.5 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                {isFi ? e.degree_fi : e.degree_en}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                {e.start_date}{e.end_date ? `–${e.end_date}` : '–'}
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#e94560', mb: 0.5 }}>
              {isFi ? e.institution_fi : e.institution_en}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
              {isFi ? e.description_fi : e.description_en}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Skills */}
      <Section title={isFi ? 'Osaaminen' : 'Skills'} />
      <Box sx={{ mt: 2 }}>
        {(Object.keys(skills) as Array<keyof typeof skills>).map((cat) => (
          <Box key={cat} sx={{ mb: 1.5, display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <Typography variant="body2" sx={{ fontWeight: 600, minWidth: 100, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: 0.5, pt: 0.3 }}>
              {skillLabels[cat][lang]}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {skills[cat].map((s) => (
                <Chip key={s} label={s} size="small" sx={{ fontSize: '0.75rem', height: 22, backgroundColor: 'rgba(26,26,46,0.08)' }} />
              ))}
            </Box>
          </Box>
        ))}
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontStyle: 'italic' }}>
          {isFi
            ? 'Lisäksi yliopistokursseilta kokemusta: Ruby on Rails, R sekä Java Spring Boot.'
            : 'Additional university coursework in: Ruby on Rails, R, and Java Spring Boot.'}
        </Typography>
      </Box>

      {/* Languages */}
      <Section title={isFi ? 'Kielitaito' : 'Languages'} />
      <Box sx={{ mt: 2, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        {languages.map((l) => (
          <Box key={l.fi}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>{isFi ? l.fi : l.en}</Typography>
            <Typography variant="body2" color="text.secondary">{isFi ? l.levelFi : l.levelEn}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
