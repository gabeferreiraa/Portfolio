# Gabriel Ferreira — Portfolio

Single-page portfolio built with [TanStack Start](https://tanstack.com/start), React 19, Tailwind CSS v4 and GSAP. Deployed on Vercel.

## Develop

```bash
pnpm install
cp .env.example .env   # add RESEND_API_KEY to test the contact form
pnpm dev               # http://localhost:3000
```

| Script | |
|---|---|
| `pnpm dev` | Dev server |
| `pnpm build` | Production build (Nitro → `.output/`, Vercel output on Vercel) |
| `pnpm start` | Run the production build locally |
| `pnpm typecheck` | TypeScript check |

## Where things live

- `src/content.ts` — all copy, links and projects. Edit this to update the site.
- `src/routes/index.tsx` — the page.
- `src/routes/__root.tsx` — document shell, `<head>` metadata.
- `src/components/ContactForm.tsx` — accessible contact form.
- `src/server/contact.ts` — server function that emails form submissions via Resend.
- `src/styles.css` — Tailwind theme tokens + global accessibility styles.
- `public/` — images, resume PDF, favicon.

## Contact form / Vercel env vars

| Variable | Notes |
|---|---|
| `RESEND_API_KEY` | Required. From resend.com/api-keys |
| `CONTACT_TO_EMAIL` | Defaults to gferreira0404@gmail.com |
| `CONTACT_FROM_EMAIL` | Defaults to `onboarding@resend.dev` (only delivers to your Resend account email). Use an address on a verified domain for production. |

## Accessibility

Skip link, landmark structure, visible `:focus-visible` rings, AA contrast tokens, labelled form fields with `aria-invalid`/`aria-describedby`, live-region status messages, and focus moved to the first invalid field / success message. Motion is disabled under `prefers-reduced-motion`; transparency and spotlight effects respect `prefers-reduced-transparency`, `prefers-contrast` and forced-colors mode.
