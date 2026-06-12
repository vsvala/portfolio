# Agent B — Server Actions

**Tila**: KESKEN 🔄

## Vastuu
Next.js Server Actions autentikointiin ja CRUD-operaatioihin.

## Luotavat tiedostot

### actions/auth.ts
```typescript
'use server'
// login(prevState, formData) → tarkistaa ADMIN_PASSWORD, luo session, redirect('/admin')
// logout() → poistaa session, redirect('/')
```

### actions/work.ts
```typescript
'use server'
// createWork(prevState, formData) → requireAdmin, Zod-validointi, createWork query, revalidatePath
// updateWork(id, prevState, formData) → requireAdmin, validointi, updateWork query, revalidatePath  
// deleteWork(id) → requireAdmin, deleteWork query, revalidatePath
```

### actions/projects.ts  
Sama rakenne kuin work.ts projekteille.

### actions/education.ts
Sama rakenne kuin work.ts koulutukselle.

## Käytännöt
- `'use server'` jokaisen tiedoston alussa
- `requireAdmin()` ensin jokaisessa suojatussa actionissa
- Zod-validointi ennen DB-kutsua
- `revalidatePath` muutosten jälkeen (sekä julkinen että admin-polku)
- Palauttaa `ActionState<{ id: number }>` (tyyppi lib/types.ts:ssä)

## Riippuvuudet
- lib/types.ts → ActionState
- lib/auth.ts → requireAdmin
- lib/session.ts → createSession, deleteSession
- lib/db/queries/*.ts → CRUD-funktiot
