# Agent C — Julkiset UI-komponentit

**Tila**: KESKEN 🔄

## Vastuu

Portfolio-sivuston julkiset React-komponentit Materiaal UI:lla.

## Luotavat tiedostot

### Nav.tsx

`'use client'` — MUI AppBar + Toolbar, mobiilissa Drawer.
Linkit: Etusivu · Työkokemus · Projektit · Koulutus + LanguageToggle oikealla.

### LanguageToggle.tsx

`'use client'` — FI / EN -napit, asettaa `lang`-evästeen + `router.refresh()`.

### Footer.tsx

Server Component — copyright, GitHub- ja sähköpostilinkit.

### WorkCard.tsx

Server Component — MUI Card, props: `work: WorkExperience, lang: 'fi' | 'en'`.
Näyttää: rooli, yritys, aika, teknologiat Chip-elementeinä. Klikattava → /work/[id].

### ProjectCard.tsx

Server Component — MUI Card, props: `project: Project, lang: 'fi' | 'en'`.
Näyttää: otsikko, kuvaus, teknologiat, GitHub/live-ikonit jos url olemassa.

### EducationCard.tsx

Server Component — MUI Card, props: `education: Education, lang: 'fi' | 'en'`.
Näyttää: tutkinto, oppilaitos, aika.

### SkillsSection.tsx

Server Component — tekniset taidot kategorioittain (Chip) + kielet (taulukko).

## Käytännöt

- MUI-komponentit: Card, CardContent, Typography, Chip, AppBar, Button, Stack, Container
- Layout Tailwindillä: className="flex gap-4 flex-wrap"
- Kaksikielisyys: `lang === 'fi' ? teksti_fi : teksti_en`
- Next.js Link navigointiin, ei suoraa `<a>`

## Riippuvuudet

- lib/types.ts → WorkExperience, Project, Education
- @mui/material, @mui/icons-material
