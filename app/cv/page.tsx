import Image from 'next/image'
import { cookies } from 'next/headers'
import type { Lang } from '@/lib/types'
import { getAllWork } from '@/lib/db/queries/work'
import { getAllEducation } from '@/lib/db/queries/education'
import { getAllSkills } from '@/lib/db/queries/skills'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Chip from '@mui/material/Chip'
import { PrintButton } from '@/components/public/PrintButton'

const introFi = 'Ohjelmistosuunnittelija ja tietojenkäsittelytieteen maisteri Helsingin yliopistosta (2025). Yli 6 vuotta käytännön kokemusta Full Stack -kehityksestä Forecalla — React, TypeScript, Node.js ja Next.js. Poikkeuksellisen vahva visuaalinen silmä taideopettajataustani ansiosta.'
const introEn = 'Software developer and M.Sc. in Computer Science from the University of Helsinki (2025). Over 6 years of hands-on full stack experience at Foreca — React, TypeScript, Node.js and Next.js. Strong eye for visual design from a background as an art teacher.'

const skillCategoryLabels: Record<string, { fi: string; en: string }> = {
  frontend:  { fi: 'Frontend',    en: 'Frontend' },
  backend:   { fi: 'Backend',     en: 'Backend' },
  databases: { fi: 'Tietokannat', en: 'Databases' },
  tools:     { fi: 'Työkalut',    en: 'Tools' },
  methods:   { fi: 'Työtavat',    en: 'Methods' },
}
const skillCategoryOrder = ['frontend', 'backend', 'databases', 'tools', 'methods']

const certifications = [
  { titleFi: 'Claude Code: A Highly Agentic Coding Assistant', titleEn: 'Claude Code: A Highly Agentic Coding Assistant', issuerFi: 'DeepLearning.AI', issuerEn: 'DeepLearning.AI', year: '2026' },
  { titleFi: 'Full Stack Open', titleEn: 'Full Stack Open', issuerFi: 'Helsingin yliopisto', issuerEn: 'University of Helsinki', year: '2024' },
  { titleFi: 'Honours Programme Diploma', titleEn: 'Honours Programme Diploma', issuerFi: 'Helsingin yliopisto, Matemaattis-luonnontieteellinen tiedekunta', issuerEn: 'University of Helsinki, Faculty of Science', year: '2019' },
  { titleFi: 'Graffathon 2019 – 2. sija, Beginner Compo', titleEn: 'Graffathon 2019 – 2nd Place, Beginner Compo', issuerFi: 'Aalto-yliopiston Digital Media Club (DOT)', issuerEn: 'Aalto University Digital Media Club (DOT)', year: '2019' },
]

const civicActivities = [
  { fi: 'Akateemisen viiniseuran tasa-arvo- ja ympäristövastaava', en: 'Academic Wine Society, equality and environmental officer', year: '2018' },
  { fi: 'KOL:n hallituksen opiskelijajäsen', en: 'KOL Board, student member', year: '2004' },
  { fi: 'AIESEC, työharjoittelijan kummi', en: 'AIESEC, trainee mentor', year: '1998–1999' },
  { fi: 'Uusien opiskelijoiden tutorohjaaja', en: 'Tutor for new students', year: '1998' },
  { fi: 'Lukion oppilaskunnan sihteeri ja rahastonhoitaja', en: 'Upper secondary school student council, secretary and treasurer', year: '1993–1995' },
]

const hobbyFi = 'Harrastan öljyvärimaalausta ja monipuolisesti liikuntaa kuten tanssia, joogaa ja jumppia. Vahvuuksiani ovat sosiaalisuus, positiivisuus, luovuus, ideointikyky, organisointitaidot ja ohjaustaidot. Lisäksi olen utelias ja innokas oppimaan ja kokeilemaan aina uutta.'
const hobbyEn = 'I paint with oils and keep active through dancing, yoga, and aerobics. My strengths include creativity, positivity, strong organisational and coaching skills — paired with a natural curiosity and a drive to keep learning.'

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
  const lang = (cookieStore.get('lang')?.value ?? 'en') as Lang

  const work = await getAllWork()
  const education = await getAllEducation()
  const allSkills = await getAllSkills()
  const skillsGrouped = skillCategoryOrder.reduce<Record<string, string[]>>((acc, cat) => {
    acc[cat] = allSkills.filter((s) => s.category === cat).map((s) => s.name)
    return acc
  }, {})

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
      <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start', mb: 3 }}>
        <Box sx={{ flexShrink: 0 }}>
          <Image
            src="/virva.png"
            alt="Virva Svala"
            width={90}
            height={90}
            style={{ borderRadius: '50%', objectFit: 'cover' }}
          />
        </Box>
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 700, color: '#1a1a2e', mb: 0.5 }}>
            Virva Svala
          </Typography>
          <Typography variant="h6" sx={{ color: '#e94560', fontWeight: 400, mb: 1 }}>
            {isFi ? 'Ohjelmistosuunnittelija' : 'Software Developer'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            virva.svala(at)gmail.com · linkedin.com/in/virvasvala · github.com/vsvala · virvasvala.com
          </Typography>
          <Typography variant="body2" sx={{ lineHeight: 1.7, maxWidth: 560 }}>
            {isFi ? introFi : introEn}
          </Typography>
        </Box>
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
        {skillCategoryOrder.filter((cat) => skillsGrouped[cat]?.length > 0).map((cat) => (
          <Box key={cat} sx={{ mb: 1.5, display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <Typography variant="body2" sx={{ fontWeight: 600, minWidth: 100, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: 0.5, pt: 0.3 }}>
              {skillCategoryLabels[cat]?.[lang] ?? cat}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {skillsGrouped[cat].map((s) => (
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

      {/* Certifications */}
      <Section title={isFi ? 'Sertifikaatit & saavutukset' : 'Certifications & Achievements'} />
      <Box sx={{ mt: 2 }}>
        {certifications.map((c) => (
          <Box key={c.titleEn} sx={{ mb: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 1 }}>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>{isFi ? c.titleFi : c.titleEn}</Typography>
              <Typography variant="body2" color="text.secondary">{isFi ? c.issuerFi : c.issuerEn}</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>{c.year}</Typography>
          </Box>
        ))}
      </Box>

      {/* Civic Activities */}
      <Section title={isFi ? 'Järjestö- ja aktiivitoiminta' : 'Civic & Volunteer Activities'} />
      <Box sx={{ mt: 2 }}>
        {civicActivities.map((a) => (
          <Box key={a.year + a.en} sx={{ mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 2 }}>
            <Typography variant="body2">{isFi ? a.fi : a.en}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>{a.year}</Typography>
          </Box>
        ))}
      </Box>

      {/* Hobbies & Strengths */}
      <Section title={isFi ? 'Harrastukset & vahvuudet' : 'Hobbies & Strengths'} />
      <Typography variant="body2" color="text.secondary" sx={{ mt: 2, lineHeight: 1.7 }}>
        {isFi ? hobbyFi : hobbyEn}
      </Typography>
    </Box>
  )
}
