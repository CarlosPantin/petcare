# PetCare

A centralized platform for pet owners to manage medical records, health history, and care scheduling.

## Tech stack

- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS** + **shadcn/ui**-style components
- **PostgreSQL** + **Prisma**
- **NextAuth.js** (Credentials provider, JWT sessions)
- **UploadThing** for vet document/image storage
- **React Hook Form** + **Zod** for validation

## Project structure

```
src/
  app/
    (auth)/login, (auth)/register        # public auth pages
    (dashboard)/dashboard                # authenticated dashboard + reminders widget
    (dashboard)/pets, pets/[id], pets/new, pets/[id]/edit
    api/auth/[...nextauth]               # NextAuth route
    api/uploadthing                      # UploadThing route
  components/
    ui/                                  # shadcn-style primitives (button, input, card, ...)
    pets/, records/, reminders/          # feature components (forms, lists)
    providers/                           # SessionProvider wrapper
  lib/                                   # prisma client, zod schemas, utils, uploadthing client
  server/
    actions/                             # server actions: auth, pets, medical-records, reminders
    session.ts                           # requireUser()/getCurrentUser() helpers
  middleware.ts                          # protects /dashboard and /pets routes
prisma/
  schema.prisma                          # data model
  seed.ts                                # demo data
```

Server actions are the only place that talk to the database; all of them
re-verify the current session and, for pet-scoped resources, confirm the
pet belongs to the requesting user before reading or mutating anything.

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

- `DATABASE_URL` — a Postgres connection string. Easiest options:
  - [Supabase](https://supabase.com) (free Postgres project, copy the connection string from Project Settings → Database)
  - [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres) / [Neon](https://neon.tech)
  - A local Postgres instance
- `NEXTAUTH_SECRET` — generate with `openssl rand -base64 32`
- `NEXTAUTH_URL` — `http://localhost:3000` for local dev
- `UPLOADTHING_TOKEN` — from your [UploadThing dashboard](https://uploadthing.com/dashboard) (needed for Phase 3, file uploads)

### 3. Set up the database

```bash
npm run db:push     # push the Prisma schema to your database
npm run db:seed     # optional: seed a demo user + pet
```

Demo login after seeding: `demo@petcare.app` / `password123`

### 4. Run the dev server

```bash
npm run dev
```

Visit `http://localhost:3000`.

## Implemented so far

- **Phase 1 — Foundation:** Next.js + TypeScript scaffold, Prisma/Postgres wiring, NextAuth Credentials auth (register/login/logout), protected route middleware.
- **Phase 2 — Core data:** Full Pet CRUD (create, list, detail, edit, delete) scoped to the logged-in user.
- **Phase 3 — Records & files:** MedicalRecord CRUD with UploadThing-backed file upload for vaccine/vet documents.
- **Phase 4 — Scheduling:** Reminder CRUD, dashboard "upcoming tasks" widget, manual check-off (toggle Pending/Completed).
- **Phase 5 — Polish:** Baseline shadcn/ui-style component library and mobile-first responsive layout are in place; further visual refinement is left as a follow-up.

## Notes on things you'll want to double check

- The Credentials-only NextAuth setup is a good default for "email + password" auth; if you later want Google/GitHub login, add providers in `src/lib/auth.ts`.
- `deletePet`/`deleteMedicalRecord`/`deleteReminder` server actions exist, but there's no delete button wired into the UI yet — add one where you'd like that control to live.
- File deletion from UploadThing when a record is removed isn't handled yet (only the DB row is deleted).
- No automated tests yet; consider adding Playwright/Vitest as the app grows.
