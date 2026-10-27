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
- **Experience** — `experience` list (Linque, Proconex, Impossible Solutions); `current: true` marks roles you still hold. Order = display order.
- **Resume** — replace `public/pdf/Resume-2026.pdf`, or add a new file and update `site.resume`.

Styles and color tokens are in `src/styles.css`. The theme follows the OS until a visitor uses the toggle (`src/components/ThemeToggle.tsx`), which sets `<html data-theme>` and saves the choice in localStorage. The page markup is `src/routes/index.tsx`; `<head>` metadata and JSON-LD are in `src/routes/__root.tsx`.

## /tap (NFC page)

The NFC sticker on my hand opens `https://gabrielferreira.org/tap`. It works the same from a QR code or plain link, and the old `/meet-me` URL redirects there.

- **Copy and settings:** `src/tap/config.ts`. Headline options `A`/`B`/`C` live in `intros`. Pick one with the active mode's `intro` field.
- **Modes:** `modes` holds per-audience content (headline option and action labels). Add a mode by copying `general` and pointing `ACTIVE_MODE` at it. Changes ship with a deploy, so a page someone already has open never changes under them.
- **Intro speed:** `introTempo` in the same file scales the whole handshake (1 = the designed ~2.2s, 1.2 = 20% slower).
- **Intro animation:** CSS in `src/styles.css` (`.tap-*`), so it starts before JavaScript loads. It's skippable (button or Esc), plays once per browser tab, and is off under reduced motion.
- **Contact card:** `/gabriel-ferreira.vcf` is generated from `src/content.ts` by `src/routes/gabriel-ferreira[.]vcf.ts`.

The page is `noindex`, so search sends people to the homepage instead.

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
| `CONTACT_FROM_EMAIL` | `"Gabriel Ferreira <hello@gabrielferreira.org>"` — must be on a Resend-verified domain. Falls back to `onboarding@resend.dev`, which only delivers to your Resend account email. |

Without a key the form shows a friendly "email me directly" message.

## Deploy

Push the branch to the GitHub repo connected to Vercel. In Vercel, set **Framework Preset** to *Other* (it was Next.js), keep **Build Command** `pnpm build`, add the env vars above, and point `gabrielferreira.org` at the project under Domains. Nitro detects Vercel and emits the right output automatically.
