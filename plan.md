# Portfolio-sivusto — Toteutussuunnitelma

## Konteksti

Henkilökohtainen portfoliosivusto Next.js 16.2.9:llä (App Router). Tavoite on saada nopeasti MVP julki, sitten laajentaa. Suunniteltu agenttiseen kehitykseen: vaiheet jaetaan rinnakkaisille agenteille.

---

## Tekninen pino

| Tarve      | Ratkaisu                          | Perustelu                                                       |
| ---------- | --------------------------------- | --------------------------------------------------------------- |
| Framework  | Next.js 16.2.9 (App Router)       | Jo asennettu                                                    |
| Tyylittely | Tailwind CSS v4 + **Material UI** | Tailwind layoutiin (flex/grid/spacing), MUI komponentteihin     |
| Tietokanta | `better-sqlite3` (SQLite)         | Lokaali dev. Vercel-tuotantoon → Turso tai Neon Postgres        |
| Auth       | `jose` (JWT-evästeet)             | Next.js 16 -dokumentaation malli, ei ylimääräisiä riippuvuuksia |
| Validointi | Zod                               | Jo asennettu                                                    |
| Lomakkeet  | `useActionState` (React 19)       | Dokumentaation mukainen Server Action -malli                    |

**Asennettavat**: `better-sqlite3 @types/better-sqlite3 jose server-only @mui/material @mui/icons-material @emotion/react @emotion/styled @emotion/cache`

### Material UI — App Router -asennus

MUI käyttää Emotion CSS-in-JS:ää, joka tarvitsee erikoisjärjestelyn Next.js SSR:n kanssa. Ilman tätä tyylitkin latautuvat vasta clientillä (flash).

Tarvittavat tiedostot:

- `lib/mui-theme.ts` — MUI-teeman määritys (värit, fontit, komponenttien oletukset)
- `lib/emotion-cache.ts` — Emotion cache -instanssi (`createCache`)
- `components/providers/MuiProvider.tsx` — Client Component joka wrappaa `ThemeProvider` + `CacheProvider`
- `app/layout.tsx` — importoi `MuiProvider` root layoutiin

```tsx
// components/providers/MuiProvider.tsx  (Client Component)
"use client";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { theme } from "@/lib/mui-theme";

export function MuiProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
```

`CssBaseline` normalisoi selainten tyylit (kuten CSS reset). `ThemeProvider` tekee teeman kaikkien MUI-komponenttien saataville.

### Mitä MUI korvaa

`components/ui/`-hakemistoa ei tarvita samassa laajuudessa — MUI tarjoaa valmiina:

- `Button`, `Card`, `CardContent`, `Chip` (Badge-tyyli)
- `TextField`, `Select`, `FormHelperText` (lomakekentät)
- `Typography` (otsikot, kappaleet yhtenäisellä tyylillä)
- `AppBar`, `Drawer`, `IconButton` (navigointi)
- `Dialog` (modal/popup)
- `CircularProgress`, `LinearProgress` (loading)
- `Timeline` (`@mui/lab`) — työkokemuksen aikajanaan
- `Accordion` — laajennettavat kortit

`components/ui/` säilyy vain projektikohtaisille custom-komponenteille joita MUI ei tarjoa.

---

## Next.js 16 -muutokset — noudatettava

1. **`proxy.ts` korvaa `middleware.ts`** — juuressa, funktio `proxy`
2. **Dynaamiset params ovat Promiseja**:
   ```typescript
   export default async function Page({
     params,
   }: {
     params: Promise<{ id: string }>;
   }) {
     const { id } = await params;
   }
   ```
3. **searchParams on myös Promise**
4. **`useActionState`** (React 19) lomakkeille

---

## V1 — MVP (nopea ensijulkaisu)

### Mitä MVP sisältää

| Osio                  | Kuvaus                                                               |
| --------------------- | -------------------------------------------------------------------- |
| **Hero / Esittely**   | Nimi, titteli, esittelyteksti, yhteystiedot, CV-lataukset (fi + en)  |
| **Työkokemus**        | 4 klikattavaa korttia → detaljinakyma + PDF-latauslinkki             |
| **Koulutus**          | 4 klikattavaa korttia + vaihto-opiskelu → detalji + PDF-latauslinkki |
| **Osaaminen**         | Teknologialistat + kielet (visuaalinen, ei admin-tarpeen aluksi)     |
| **Projektit**         | Omat/sivuprojektit erillisessä osiossa — hyvä näytepaikka koodille   |
| **Admin-paneeli**     | CRUD kaikelle sisällölle + PDF-upload + kirjautuminen                |
| **Kielitoggle fi/en** | Kaikki tekstisisältö kahtena versiona                                |
| **Responsiivisuus**   | Mobiilikäyttö Tailwind-breakpointeilla                               |
| **SEO-perusteet**     | title, description, OG-tagi jokaiselle sivulle                       |

### Mitä MVP EI sisällä (siirretty V2:een)

- Järjestö- ja aktiivitoiminta -osio (mainitaan About-teksteissä, ei oma sivu)
- Harrastukset ja vahvuudet (lyhyt kappale Hero-osiossa riittää)
- Sertifikaatit/kurssit -sivu
- Palautelomake / Suggest Edit
- RAG-chat
- Dark mode
- GitHub-integraatio
- Kontaktilomake (pelkkä sähköpostilinkki riittää MVP:ssä)

---

## Hakemistorakenne (MVP)

```
portfolio/
├── proxy.ts                          ← autentikoinnin suojaus /admin/*-reiteille
├── .env.local                        ← SESSION_SECRET, ADMIN_PASSWORD
│
├── lib/
│   ├── db/
│   │   ├── index.ts                  ← SQLite-singleton
│   │   ├── schema.sql                ← tietokannan rakenne
│   │   └── queries/
│   │       ├── work.ts
│   │       ├── projects.ts
│   │       ├── education.ts
│   │       └── documents.ts
│   ├── mui-theme.ts                  ← MUI-teema
│   ├── session.ts                    ← JWT encrypt/decrypt
│   ├── auth.ts                       ← getSession(), requireAdmin()
│   └── types.ts                      ← kaikki jaetut TypeScript-tyypit
│
├── actions/
│   ├── auth.ts                       ← login(), logout()
│   ├── work.ts
│   ├── projects.ts
│   └── education.ts
│
├── components/
│   ├── providers/
│   │   └── MuiProvider.tsx           ← ThemeProvider + CssBaseline
│   ├── ui/                           ← vain projektikohtaiset custom-komponentit
│   ├── public/                       ← Nav, Footer, HeroSection, WorkCard, ProjectCard,
│   │                                    EducationCard, SkillsSection, LanguageToggle
│   └── admin/                        ← AdminNav, WorkForm, ProjectForm, EducationForm, DeleteButton
│
├── app/
│   ├── layout.tsx                    ← MuiProvider täällä
│   ├── page.tsx                      ← Hero + Osaaminen (etusivu)
│   ├── work/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   ├── projects/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   ├── education/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   ├── admin/
│   │   ├── layout.tsx
│   │   ├── page.tsx                  ← dashboard
│   │   ├── login/page.tsx
│   │   ├── work/{page,new,[id]}/page.tsx
│   │   ├── projects/{page,new,[id]}/page.tsx
│   │   └── education/{page,new,[id]}/page.tsx
│   └── api/upload/route.ts
│
└── public/documents/                 ← PDF-tiedostot
```

---

## Tietomallit (`lib/types.ts`)

```typescript
export type Lang = "fi" | "en";

export interface WorkExperience {
  id: number;
  company_name_fi: string;
  company_name_en: string;
  role_fi: string;
  role_en: string;
  description_fi: string;
  description_en: string;
  start_date: string;
  end_date: string | null;
  technologies: string; // JSON-taulukko tekstinä
  certificate_document_id: number | null;
  sort_order: number;
}

export interface Project {
  id: number;
  title_fi: string;
  title_en: string;
  description_fi: string;
  description_en: string;
  long_description_fi: string;
  long_description_en: string;
  technologies: string;
  url: string | null;
  repo_url: string | null;
  document_id: number | null;
  sort_order: number;
}

export interface Education {
  id: number;
  institution_fi: string;
  institution_en: string;
  degree_fi: string;
  degree_en: string;
  description_fi: string;
  description_en: string;
  start_date: string;
  end_date: string | null;
  document_id: number | null;
  sort_order: number;
}

export interface PdfDocument {
  id: number;
  filename: string;
  label_fi: string;
  label_en: string;
  document_type: "cv" | "work_certificate" | "study_certificate" | "other";
  file_size: number;
}

export type ActionState<T = void> =
  | { success: true; data?: T }
  | { success: false; errors: Record<string, string[]>; message?: string };
```

---

## Autentikointi

- `SESSION_SECRET` + `ADMIN_PASSWORD` ympäristömuuttujissa
- `lib/session.ts`: `jose` SignJWT / jwtVerify, 7-päivän eväste
- `proxy.ts`: suojaa `/admin/*` paitsi `/admin/login`
- `actions/auth.ts`: `login()` vertaa hash, `logout()` tyhjentää evästeen

---

## PDF-käsittely

1. Admin valitsee tiedoston → multipart POST `/api/upload`
2. Route Handler tallentaa `public/documents/{uuid}-{nimi}`, lisää `pdf_documents`-rivin
3. Lomake saa `document_id`:n, Server Action tallentaa relaation
4. Julkisella puolella: suora linkki `/documents/{filename}`

---

## Kielituki

- `*_fi` ja `*_en` sarakkeet jokaiselle tekstikentälle
- `lang`-eväste (fi | en, oletus fi), luetaan Server Componenteissa `next/headers`:sta
- `LanguageToggle` asettaa evästeen

---

## MVP:n sisältö CV:stä

### Hero

Nimi · Ohjelmistosuunnittelija · esittelyteksti CV:stä · virva.svala@gmail.com · 050-5415604 · github.com/vsvala · CV-lataukset (fi + en PDF heti)

### Työkokemus

| Rooli                     | Paikka                    | Aika            |
| ------------------------- | ------------------------- | --------------- |
| Ohjelmistosuunnittelija   | Foreca                    | 2020–2026       |
| Kurssiassistentti         | HY Tietojenkäsittelytiede | kesä–syksy 2019 |
| Kuvataiteen opettaja      | Munkkiniemen yhteiskoulu  | 2011–2017       |
| Opetus- ja ohjaustehtävät | Eri oppilaitokset         | 2003–2017       |

### Koulutus

| Tutkinto                     | Oppilaitos          | Vuosi |
| ---------------------------- | ------------------- | ----- |
| FM Tietojenkäsittelytiede    | Helsingin yliopisto | 2025  |
| TaM Taidekasvatus            | TaiK                | 2009  |
| KM Opettajankoulutus         | Oulun yliopisto     | 2003  |
| Verkkotuotanto, AV-viestintä | Otavan opisto       | 2012  |

Vaihto-opiskelu Koulutus-sivun alla: Kypros 2001 · Malmö 2000 · Haag 1999

### Projektit (oma osio — lisätään admin-paneelista)

Foreca-työn projektit (sääpalvelut, karttakomponentit, B2B-portaali) + mahdolliset omat sivuprojektit. Jokaiseen: teknologiat, kuvaus, linkit (GitHub / live).

### Osaaminen

HTML/CSS · JS · React · Node.js · TypeScript · SQL · Python · Java · Adobe CC  
Kielet: Suomi (äidinkieli) · Englanti (sujuva) · Ruotsi (hyvä) · Ranska (perusteet)

---

## Toteutusvaiheet ja agenttijako

### Vaihe 1 — Perusta (1 agentti, peräkkäin)

1. Asenna riippuvuudet
2. `.env.local`, `lib/types.ts`, `lib/db/schema.sql + index.ts`
3. `lib/session.ts`, `lib/auth.ts`, `proxy.ts`
4. `lib/mui-theme.ts` + `components/providers/MuiProvider.tsx` + päivitä `app/layout.tsx`

### Vaihe 2 — Rinnakkaiset agentit (4 yhtä aikaa)

| Agentti           | Vastuu                                        |
| ----------------- | --------------------------------------------- |
| A: Data-kerros    | `lib/db/queries/*.ts`                         |
| B: Server Actions | `actions/*.ts`                                |
| C: UI-komponentit | `components/public/*` (MUI-pohjaiset)         |
| D: Upload + Hero  | `app/api/upload/route.ts` + `HeroSection.tsx` |

### Vaihe 3 — Julkiset sivut (2 agenttia)

| E: Listasivut | `app/page.tsx`, `work/page.tsx`, `projects/page.tsx`, `education/page.tsx` |
| F: Detaljisivut | `work/[id]`, `projects/[id]`, `education/[id]` |

### Vaihe 4 — Admin-UI (2 agenttia, rinnakkain vaiheen 3 kanssa)

| G: Auth + kuori | `admin/layout`, `admin/login`, `admin/page`, `AdminNav` |
| H: CRUD-lomakkeet | Kaikki admin CRUD -sivut + lomakekomponentit |

### Vaihe 5 — Viimeistely

- `loading.tsx` + `error.tsx`
- SEO-metadata kaikille sivuille
- Kokonaisläpikäynti + PDF-testaus

```
Vaihe 1:  [Perusta] ─────────────────── 1 agentti
               │
Vaihe 2:  A(Data) B(Actions) C(UI) D(Upload)   4 rinnakkain
               │
Vaihe 3:  E(Lista) F(Detalji)
Vaihe 4:  G(Auth)  H(Lomakkeet)                molemmat rinnakkain V3:n kanssa
               │
Vaihe 5:  [Viimeistely] ────────────────── 1 agentti
```

---

## Kriittiset tiedostot

- `lib/types.ts` — kaikki muut importtaavat täältä
- `lib/db/index.ts` — kaikki queryt riippuvat tästä
- `lib/session.ts` — auth.ts, proxy.ts ja actions/auth.ts riippuvat tästä
- `proxy.ts` — oltava oikein ennen admin-sivuja
- `components/providers/MuiProvider.tsx` — oltava ennen MUI-komponentteja

---

## V1-verifiointi

1. `npm run dev` — kaikki reitit toimivat
2. Admin: kirjautuminen, CRUD jokaiselle tyypille, PDF-upload
3. Julkinen: CV-lataus Hero-osiosta, PDF-linkit detaljisnäkymissä
4. Kielitoggle fi/en kaikilla sivuilla
5. Mobiiliresponsivisuus

---

## Jatkokehitys — priorisoitu TODO-lista

### PRIO 1 — helppo, nopea lisäarvo

**Sertifikaatit ja opinnot (`/certifications`)**

- Suoritetut kurssit + sertifikaatit + "In Progress" + "Upcoming"
- `completed`: vihreä merkki + PDF; `in_progress`: edistymispalkki; `upcoming`: badge
- Seuraa täsmälleen samaa mallia kuin koulutusosio → nopea toteuttaa
- Uusi taulu `certifications` tietokantaan, admin-CRUD samalla kaavalla

**Kontaktilomake (`/contact`)**

- Suora yhteydenotto: nimi, sähköposti, viesti
- Lähettää sähköpostin Resend API:n kautta → virva.svala@gmail.com
- Ei tietokantaa — pelkkä Server Action + sähköpostilähetys

**Dark mode**

- MUI:lla triviaali: `ThemeProvider` vaihtaa teeman `light` ↔ `dark`
- Toggle tallennetaan `theme`-evästeeseen (Server Componentit lukevat, Client toggle kirjoittaa)

---

### PRIO 2 — kohtalainen työ, iso näkyvyys

**Palautelomake / "Suggest Edit"**

- Jokaisen projektin/työkokemuksen detaljisnäkymässä "Kommentoi tätä" -painike
- Lomake linkittyy automaattisesti ko. kohteeseen (`target_type`, `target_id`)
- Admin-paneelissa "Saapuneet palautteet" -näkymä, merkitse luetuksi
- Uusi taulu `feedback(id, target_type, target_id, message, sender_name, sender_email, created_at, is_read)`
- Sähköposti-ilmoitus uudesta palautteesta (Resend API)

**GitHub-integraatio**

- Projektit-sivulle: pinned repos GitHubista (`github.com/vsvala`)
- GitHub public API — ei autentikointia tarvita
- Näyttää: repo-nimi, kuvaus, tähdet, käytetyt kielet
- Välimuistitus `next/cache` revalidate: 3600s

**Osaaminen visualisoituna**

- Teknologioille kategoriat: Frontend / Backend / Työkalut / Muut
- MUI LinearProgress tai Chip-pilvi visuaalisena esityksenä
- Kiinnostavampi kuin pelkkä tekstilista

**Testimonials / Suositukset**

- Lyhyet lainaukset kollegoilta tai johtajilta
- Admin-paneelista lisättävät: kuva + nimi + titteli + lainaus
- MUI Carousel tai grid Hero-sivun alaosaan

---

### PRIO 3 — vaativin, paras agenttikehitysharjoitus

**RAG-chat — Portfolio-botti**

- Käyttäjä kysyy chatissa: "Mitä projekteja olet tehnyt?", "Onko React-kokemusta?"
- Botti vastaa portfolion datan perusteella Claude API:n (`claude-sonnet-4-6`) kautta
- Pipeline: sisältö → embeddings → vektorihaku → Claude kontekstin kanssa → streamed vastaus
- Vektoritietokanta: `sqlite-vec` (SQLite) tai `pgvector` (Neon)
- UI: kelluva chat-widget kaikilla sivuilla
- Admin: "Päivitä indeksi" -nappi kun sisältö muuttuu
- **Loistava harjoitus**: RAG-pipelinen rakentaminen vaiheittain erillisillä agenteilla

**Blog / Artikkelit**

- Tekniset kirjoitukset: oppimiset, projektien post-mortemit, tekoäly, DevOps
- MDX-tuki (`@next/mdx`) → kirjoitat Markdownia, saat React-komponentteja
- Hyvä SEO-keino: Google löytää portfolion hakutulosten kautta

**Dynaaminen CV-tulostus**

- Painike Herossa: avaa tulostusoptimoidun näkymän
- CSS `@media print` — piilottaa navigoinnin, muuttaa värit, PDF-ystävällinen layout
- Aina ajantasainen tietokannasta, ei vanheneva staattinen PDF

**Analytics (yksityysystävällinen)**

- Plausible tai oma Umami-instanssi
- Näet: mistä vierailijat tulevat, mitkä sivut kiinnostavat, CV-latausten määrät
- Ei cookieja, GDPR-yhteensopiva

---

### Yhteenveto: missä järjestyksessä edetä

```
[MVP V1]
 Hero + Työ + Koulutus + Projektit + Osaaminen + Admin + PDF + fi/en
        │
        ├─ PRIO 1: Dark mode              ← helppo MUI:lla, teeman vaihto
        ├─ PRIO 1: Kontaktilomake         ← ~2 tuntia
        ├─ PRIO 1: /certifications        ← ~4 tuntia (sama malli kuin koulutus)
        │
        ├─ PRIO 2: GitHub-integraatio     ← ~3 tuntia
        ├─ PRIO 2: Osaaminen visuaalisesti ← ~2 tuntia
        ├─ PRIO 2: Palautelomake          ← ~4 tuntia
        ├─ PRIO 2: Testimonials           ← ~3 tuntia
        │
        └─ PRIO 3: RAG-chat              ← 1–2 päivää (paras agenttiprojekti)
                   Blog/MDX              ← ~1 päivä
                   Dynaaminen CV-print   ← ~3 tuntia
                   Analytics             ← ~1 tunti (ulkoinen palvelu)
```
