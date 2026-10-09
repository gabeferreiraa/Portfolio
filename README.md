# gabrielferreira.org

Single-page personal site. [TanStack Start](https://tanstack.com/start) + React + Tailwind CSS v4, prerendered to static HTML and deployed on Vercel. The only server code is the contact form's email function.

## Run locally

```bash
pnpm install
cp .env.example .env   # add RESEND_API_KEY to test the contact form
pnpm dev               # http://localhost:3000
```

## Build

```bash
pnpm build       # prerenders / into .output/public, server function into .output/server
pnpm start       # serve the production build locally
pnpm typecheck
```

## Editing content

Everything lives in **`src/content.ts`**: name, intro, links, experience, projects, metadata.

- **Projects** — add `href` to make a title a link; without it the title renders as plain text. Order = display order.
- **Experience** — `experience` list (Proconex, Impossible Solutions). Order = display order.
- **Resume** — replace `public/pdf/24_25_resume.pdf`, or add a new file and update `site.resume`.

Styles and color tokens are in `src/styles.css`. The theme follows the OS until a visitor uses the toggle (`src/components/ThemeToggle.tsx`), which sets `<html data-theme>` and saves the choice in localStorage. The page markup is `src/routes/index.tsx`; `<head>` metadata and JSON-LD are in `src/routes/__root.tsx`.

## Domain / SEO

The production origin is `site.url` in `src/content.ts` (canonical, `og:url`, JSON-LD). Two static files also contain it and must be updated with it:

- `public/robots.txt` (sitemap line)
- `public/sitemap.xml`

## Contact form (Resend)

Set these in Vercel → Project → Settings → Environment Variables:

| Variable | Notes |
|---|---|
| `RESEND_API_KEY` | Required. From resend.com/api-keys |
| `CONTACT_TO_EMAIL` | Defaults to gferreira0404@gmail.com |
| `CONTACT_FROM_EMAIL` | Defaults to `onboarding@resend.dev`, which only delivers to your Resend account email. Verify `gabrielferreira.org` in Resend and use e.g. `Portfolio <hello@gabrielferreira.org>`. |

Without a key the form shows a friendly "email me directly" message.

## Deploy

Push the branch to the GitHub repo connected to Vercel. In Vercel, set **Framework Preset** to *Other* (it was Next.js), keep **Build Command** `pnpm build`, add the env vars above, and point `gabrielferreira.org` at the project under Domains. Nitro detects Vercel and emits the right output automatically.
