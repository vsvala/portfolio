# Agent D — Upload Route Handler + HeroSection

**Tila**: VALMIS ✅

## Vastuu

PDF-tiedostojen upload-käsittely ja portfolion Hero-komponentti.

## Luotavat tiedostot

### app/api/upload/route.ts

POST Route Handler:

1. Tarkista session (cookies → decrypt → role === 'admin')
2. Ota formData: file, label_fi, label_en, document_type
3. Validoi: vain PDF, max 10MB
4. Tallenna: public/documents/{uuid}-{filename}
5. Lisää pdf_documents-tauluun
6. Palauta { id, filename }

### components/public/HeroSection.tsx

Server Component:

- Nimi: "Virva Svala" (MUI Typography h1)
- Titteli: "Ohjelmistosuunnittelija" / "Software Developer"
- Esittelyteksti (fi/en)
- Yhteystiedot: email · puhelin · github
- CV-latausnapit: /documents/cv_26_virva_svala_fi.pdf + cv_26_virva_svala_en.pdf

## Riippuvuudet

- lib/session.ts → decrypt
- lib/db/index.ts → db
- lib/types.ts → PdfDocument
