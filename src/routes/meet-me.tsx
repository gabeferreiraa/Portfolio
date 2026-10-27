import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { External } from "../components/External";
import { ThemeToggle } from "../components/ThemeToggle";
import { profiles, site } from "../content";
import { meetMe, profile, vcardHref, whyNfc } from "../meet-me/config";

const title = `Meet ${site.name} — ${profile.positioning}`;
const description = `${site.name} is a developer with a background in UX and Interaction Design from ${profile.school}, graduating ${profile.graduation}. Selected work, resume and contact details.`;

export const Route = createFileRoute("/meet-me")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      // The landing page for my NFC tag; search should send people to the homepage
      { name: "robots", content: "noindex, follow" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: `${site.url}/meet-me` },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
  }),
  component: MeetMe,
});

// Matches the last reveal: 2.8s delay + 0.65s (.mm-reveal in styles.css)
const INTRO_MS = 3450;

// Delay before an element's entrance animation
const at = (seconds: number): CSSProperties => ({ animationDelay: `${seconds}s` });

function MeetMe() {
  // The intro is pure CSS so it starts before hydration; this state only ends it early
  const [intro, setIntro] = useState<"playing" | "done">("playing");
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const id = setTimeout(() => setIntro("done"), INTRO_MS);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setIntro("done");
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(id);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  function skip() {
    setIntro("done");
    // The skip button disappears, so hand focus to the content
    mainRef.current?.focus();
  }

  const { headline, supporting, featured, skills, cta } = meetMe;
  const [lead, ...follow] = headline;
  const contacts = [
    { label: "Email", value: site.email, href: `mailto:${site.email}` },
    { label: "Phone", value: site.phone, href: site.phoneHref },
    ...profiles.map((p) => ({ label: p.label, value: p.href.replace(/^https:\/\/(www\.)?/, "").replace(/\/$/, ""), href: p.href })),
    { label: "Portfolio", value: site.url.replace(/^https:\/\//, ""), href: "/" },
  ];

  return (
    <div
      className="mm-root"
      data-intro={intro}
      // Following a link mid-intro shouldn't land on content that's still fading in
      onClickCapture={(e) => {
        if (intro === "playing" && (e.target as Element).closest("a")) setIntro("done");
      }}
    >
      <a href="#content" className="skip-link">
        Skip to content
      </a>

      <Handshake />

      <button type="button" onClick={skip} className="mm-skip">
        Skip intro
      </button>

      <div className="mx-auto max-w-[760px] px-5 pt-6 pb-12 sm:px-6 sm:pt-10">
        <header className="mm-reveal flex items-center justify-between" style={at(1.5)}>
          <p className="flex items-center gap-2.5 text-sm text-muted">
            <span aria-hidden="true" className="mm-status-dot" />
            Connected
          </p>
          <ThemeToggle />
        </header>

        <main id="content" ref={mainRef} tabIndex={-1} className="mt-12 sm:mt-20">
          <h1 className="text-[2.125rem] leading-[1.12] font-medium tracking-[-0.025em] text-balance sm:text-[3rem]">
            <span className="mm-reveal block" style={at(1.4)}>
              {lead}
            </span>
            {follow.length > 0 && (
              <span className="mm-reveal block text-muted" style={at(1.65)}>
                {follow.join(" ")}
              </span>
            )}
          </h1>

          <div className="mm-reveal mt-10 sm:mt-12" style={at(2.0)}>
            <p className="text-[1.0625rem] font-medium">{profile.name}</p>
            <p className="text-muted">{profile.positioning}</p>
            <p className="text-muted">
              {profile.school} · Graduating {profile.graduation}
            </p>
          </div>

          <p className="mm-reveal mt-5 max-w-[34rem] text-pretty" style={at(2.2)}>
            {supporting}
          </p>

          <nav aria-label="Start here" className="mt-10">
            <ul>
              <ActionRow href="#work" label={cta.work} hint={`${featured.length} projects`} icon="↓" delay={2.4} />
              <ActionRow href={site.resume} label={cta.resume} hint="PDF" icon="↗" delay={2.52} external />
              <ActionRow href="#connect" label={cta.connect} hint="Save my contact" icon="↓" delay={2.64} />
            </ul>
          </nav>

          <div className="mm-reveal" style={at(2.8)}>
            <Section id="work" title="Selected work">
              <ul className="space-y-6">
                {featured.map((p) => (
                  <li key={p.title}>
                    <h3 className="font-medium">{p.href ? <External href={p.href}>{p.title}</External> : p.title}</h3>
                    <p className="text-muted">{p.description}</p>
                    <p className="mt-0.5 text-sm text-muted">{p.meta}</p>
                  </li>
                ))}
              </ul>
              <p className="mt-8 text-sm text-muted">
                <span className="text-fg">Tools I build with:</span> {skills.join(" · ")}
              </p>
              <p className="mt-3">
                <a href="/">Full portfolio and experience</a>
              </p>
            </Section>

            <Section id="connect" title="Let's connect">
              <a
                href={vcardHref}
                download="Gabriel-Ferreira.vcf"
                className="inline-flex h-12 w-full items-center justify-center gap-2 mm-button rounded-lg bg-fg px-6 font-medium transition-opacity hover:opacity-85 active:opacity-75 sm:w-auto"
              >
                <svg viewBox="0 0 24 24" className="size-[1.125rem]" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 4v11M7 10l5 5 5-5M5 20h14" />
                </svg>
                Save contact card
              </a>
              <p className="mt-3 text-sm text-muted">Adds my email, phone and links to your contacts.</p>

              <ul className="mt-8 border-t border-line">
                {contacts.map((c) => {
                  const external = c.href.startsWith("http");
                  return (
                    <li key={c.label} className="border-b border-line">
                      <a
                        href={c.href}
                        {...(external && { target: "_blank", rel: "noopener noreferrer" })}
                        className="group relative flex min-h-14 items-center justify-between gap-4 py-3 mm-plain"
                      >
                        <span className="font-medium">{c.label}</span>
                        <span className="min-w-0 truncate text-right text-muted transition-colors group-hover:text-fg">
                          {c.value}
                        </span>
                        {/* Outside the truncated span: an absolute child there escapes its clipping and widens the page */}
                        {external && <span className="sr-only"> (opens in a new tab)</span>}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </Section>

            <details className="mm-details group mt-14 mb-8 sm:mt-16">
              <summary className="inline-flex min-h-11 cursor-pointer list-none items-center gap-2 font-medium [&::-webkit-details-marker]:hidden">
                Why the NFC?
                <span aria-hidden="true" className="text-muted transition-transform duration-200 group-open:rotate-45">
                  +
                </span>
              </summary>
              <div className="mm-details-body mt-2 max-w-[34rem] space-y-3 text-muted">
                {whyNfc.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </details>
          </div>
        </main>
      </div>
    </div>
  );
}

// Two points meet and settle: the tap, translated into motion. Decorative only.
function Handshake() {
  return (
    <div aria-hidden="true" className="mm-overlay">
      <div className="mm-mark">
        <span className="mm-dot mm-dot-a" />
        <span className="mm-dot mm-dot-b" />
        <span className="mm-ring" />
      </div>
      <p className="mm-overlay-label text-sm text-muted">Connected</p>
    </div>
  );
}

function ActionRow({
  href,
  label,
  hint,
  icon,
  delay,
  external,
}: {
  href: string;
  label: string;
  hint: string;
  icon: string;
  delay: number;
  external?: boolean;
}) {
  return (
    <li className="mm-reveal border-b border-line first:border-t" style={at(delay)}>
      <a
        href={href}
        {...(external && { target: "_blank", rel: "noopener noreferrer" })}
        className="group relative flex min-h-16 items-center justify-between gap-4 py-3 mm-plain transition-colors active:bg-fg/[0.04]"
      >
        <span className="text-[1.1875rem] font-medium tracking-[-0.01em]">{label}</span>
        <span className="flex items-center gap-3 text-sm text-muted">
          {hint}
          <span aria-hidden="true" className={`mm-arrow inline-block text-base text-fg ${icon === "↓" ? "mm-arrow-down" : "mm-arrow-out"}`}>
            {icon}
          </span>
        </span>
        {external && <span className="sr-only"> (opens in a new tab)</span>}
      </a>
    </li>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="mt-16 scroll-mt-6 sm:mt-20">
      <h2 id={`${id}-heading`} className="mb-5 text-[1.0625rem] font-medium">
        {title}
      </h2>
      {children}
    </section>
  );
}
