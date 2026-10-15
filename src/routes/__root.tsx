import type { ReactNode } from "react";
import { HeadContent, Outlet, Scripts, createRootRoute } from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { experience, profiles, site } from "../content";
import { themeInitScript } from "../components/ThemeToggle";

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  url: `${site.url}/`,
  jobTitle: site.role,
  email: `mailto:${site.email}`,
  address: { "@type": "PostalAddress", addressLocality: "Philadelphia", addressRegion: "PA", addressCountry: "US" },
  worksFor: experience.filter((r) => r.current).map((r) => ({ "@type": "Organization", name: r.org, url: r.href })),
  sameAs: profiles.map((p) => p.href),
};

// Easter egg for anyone who opens View Source or the devtools console.
// Lives in an inline script (not a JSX comment) so it survives the production build.
const helloScript = `/*
  Olá! 👋 Thanks for peeking under the hood.

  A few things about me:
   - I'm bilingual: I speak English and Portuguese (português)
   - I study at Drexel University in Philadelphia
   - Come summer, you'll find me grilling picanha

  Reaching out through the contact form? Tell me your favorite album. 🎶
*/
console.log("%cOlá! 👋", "font-size:20px;font-weight:600");
console.log("Thanks for poking around. Writing to me through the contact form? Include your favorite album. 🎶");`;

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: site.title },
      { name: "description", content: site.description },
      { name: "robots", content: "index, follow" },
      { name: "color-scheme", content: "light dark" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: site.title },
      { property: "og:description", content: site.description },
      { property: "og:url", content: `${site.url}/` },
      { property: "og:site_name", content: site.name },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: site.title },
      { name: "twitter:description", content: site.description },
    ],
    links: [
      { rel: "canonical", href: `${site.url}/` },
      { rel: "preload", href: "/fonts/inter-latin-wght.woff2", as: "font", type: "font/woff2", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
    ],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(personJsonLd) }],
  }),
  component: RootComponent,
  notFoundComponent: NotFound,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    // The init script may set data-theme before hydration
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: helloScript }} />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <HeadContent />
        {/* Written directly: head() dedupes metas that share a name */}
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#fafaf9" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#161616" />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function NotFound() {
  return (
    <main className="mx-auto max-w-[760px] px-6 py-24">
      <h1 className="text-2xl font-medium">Page not found</h1>
      <p className="mt-4 text-muted">
        <a href="/">Back to the homepage</a>
      </p>
    </main>
  );
}
