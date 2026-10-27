import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { External } from "../components/External";
import { ThemeToggle } from "../components/ThemeToggle";
import { profiles, site } from "../content";
import { introTempo, profile, tapPage, vcardHref, whyNfc } from "../tap/config";

const title = `Meet ${site.name} — ${profile.positioning}`;
const description = `${site.name} is a developer with a background in UX and Interaction Design from ${profile.school}, graduating ${profile.graduation}. Selected work, resume and contact details.`;

// Per-tab memory of the intro: a reload, Back, or returning from another page skips
// it. sessionStorage ends with the tab, so nothing outlives the visit.
const SEEN_KEY = "tap-intro-seen";
const seenScript = `try{if(sessionStorage.getItem("${SEEN_KEY}"))document.documentElement.dataset.tapSeen=""}catch(e){}`;

export const Route = createFileRoute("/tap")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      // The landing page for my NFC tag; search should send people to the homepage
      { name: "robots", content: "noindex, follow" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: `${site.url}/tap` },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    // Runs before first paint so a returning visitor never sees the intro start
    scripts: [{ children: seenScript }],
  }),
  component: TapPage,
});

// Last reveal ends at 1.8s + 0.55s (.tap-reveal in styles.css), scaled by the tempo
const INTRO_MS = 2350 * introTempo;

// Delay before an element's entrance animation, on the same tempo as the CSS
const at = (seconds: number): CSSProperties => ({ animationDelay: `calc(${seconds}s * var(--tempo))` });

// A short tick on direct taps. Android Chrome only: iOS Safari has no Vibration
// API, so this quietly does nothing there.
function buzz() {
  if ("vibrate" in navigator) navigator.vibrate(12);
}

function rememberIntro() {
  try {
    sessionStorage.setItem(SEEN_KEY, "1");
  } catch {
    // Storage unavailable: the intro simply plays again next time
  }
}

function TapPage() {
  // The intro is pure CSS so it starts before hydration; this state only ends it early
  const [intro, setIntro] = useState<"playing" | "done">("playing");
  const [cardRequested, setCardRequested] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  const markRef = useRef<HTMLDivElement>(null);
  const dockRef = useRef<HTMLSpanElement>(null);
  const statusDotRef = useRef<HTMLSpanElement>(null);

  function finish() {
    setIntro("done");
    rememberIntro();
  }

  // Layout effect: decides before paint, so a client-side return never flashes the intro
  useLayoutEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) !== null;
    } catch {
      // Treat as a first visit
    }
    if (seen || matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finish();
      return;
    }

    // Aim the merged dot at the header's status dot so it lands exactly there
    const mark = markRef.current?.getBoundingClientRect();
    const target = statusDotRef.current?.getBoundingClientRect();
    const dock = dockRef.current;
    if (mark && target && dock) {
      dock.style.setProperty("--dock-x", `${target.left + target.width / 2 - mark.left}px`);
      dock.style.setProperty("--dock-y", `${target.top + target.height / 2 - mark.top}px`);
      dock.style.setProperty("--dock-scale", String(target.width / dock.offsetWidth));
    }

    const id = setTimeout(finish, INTRO_MS);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && finish();
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(id);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  // iOS Safari only applies :active (the press feedback) when a touch listener exists
  useEffect(() => {
    const noop = () => {};
    document.addEventListener("touchstart", noop, { passive: true });
    return () => document.removeEventListener("touchstart", noop);
  }, []);

  function skip() {
    finish();
    // The skip button disappears, so hand focus to the content
    mainRef.current?.focus();
  }

  const { headline, supporting, featured, cta } = tapPage;
  const [lead, ...follow] = headline;
  const links = [
    { label: "Phone", value: site.phone, href: site.phoneHref },
    ...profiles.map((p) => ({ label: p.label, value: p.href.replace(/^https:\/\/(www\.)?/, "").replace(/\/$/, ""), href: p.href })),
  ];

  return (
    <div
      className="tap-root"
      data-intro={intro}
      style={{ "--tempo": introTempo } as CSSProperties}
      onClickCapture={(e) => {
        const el = (e.target as Element).closest("a, button, summary");
        if (!el) return;
        buzz();
        // Following a link mid-intro shouldn't land on content that's still fading in
        if (intro === "playing" && el.tagName === "A") finish();
      }}
    >
      <a href="#content" className="skip-link">
        Skip to content
      </a>

      <Handshake markRef={markRef} dockRef={dockRef} />

      <button type="button" onClick={skip} className="tap-skip tap-press">
        Skip intro
      </button>

      <div className="mx-auto max-w-[760px] px-5 pt-6 pb-10 sm:px-6 sm:pt-10">
        <header className="tap-fade flex items-center justify-between" style={at(0.95)}>
          <p className="flex items-center gap-2.5 text-sm text-muted">
            <span ref={statusDotRef} aria-hidden="true" className="tap-status-dot" />
            Connected
          </p>
          <ThemeToggle />
        </header>

        <main id="content" ref={mainRef} tabIndex={-1} className="mt-12 sm:mt-20">
          <h1 className="text-[2.125rem] leading-[1.12] font-medium tracking-[-0.025em] text-balance sm:text-[3rem]">
            <span className="tap-reveal block" style={at(0.95)}>
              {lead}
            </span>
            {follow.length > 0 && (
              <span className="tap-reveal block text-muted" style={at(1.1)}>
                {follow.join(" ")}
              </span>
            )}
          </h1>

          <div className="tap-reveal mt-10 sm:mt-12" style={at(1.3)}>
            <p className="text-[1.0625rem] font-medium">{profile.name}</p>
            <p className="text-muted">{profile.positioning}</p>
            <p className="text-muted">
              {profile.school} · Graduating {profile.graduation}
            </p>
          </div>

          <p className="tap-reveal mt-5 max-w-[34rem] text-pretty" style={at(1.42)}>
            {supporting}
          </p>

          <nav aria-label="Start here" className="mt-10">
            <ul>
              <ActionRow href="#work" label={cta.work} hint={`${featured.length} projects`} icon="↓" delay={1.54} />
              <ActionRow href={site.resume} label={cta.resume} hint="PDF" icon="↗" delay={1.62} external />
              <ActionRow href="#connect" label={cta.connect} hint="Save my contact" icon="↓" delay={1.7} />
            </ul>
          </nav>

          <div className="tap-reveal" style={at(1.8)}>
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
            </Section>

            <Section id="connect" title="Let's connect">
              <a
                href={vcardHref}
                download="Gabriel-Ferreira.vcf"
                onClick={() => setCardRequested(true)}
                className="tap-button tap-press inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-fg px-6 font-medium hover:opacity-85 sm:w-auto"
              >
                <svg
                  // Re-mounts per tap so the arrow drops again each time
                  key={String(cardRequested)}
                  viewBox="0 0 24 24"
                  className={`size-[1.125rem] ${cardRequested ? "tap-drop" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 4v11M7 10l5 5 5-5M5 20h14" />
                </svg>
                Save contact card
              </a>
              {/* Only says what we know: the card was requested, not that it was saved */}
              <p className="mt-3 text-sm text-muted" aria-live="polite">
                {cardRequested
                  ? "Your phone should open the card. Add it to save my details."
                  : "Adds my email, phone and links to your contacts."}
              </p>

              <ul className="mt-8 border-t border-line">
                <li className="flex items-center gap-3 border-b border-line">
                  <a href={`mailto:${site.email}`} className="tap-plain tap-press group flex min-h-14 min-w-0 flex-1 items-center justify-between gap-4 py-3">
                    <span className="font-medium">Email</span>
                    <span className="min-w-0 truncate text-right text-muted transition-colors group-hover:text-fg">{site.email}</span>
                  </a>
                  <CopyButton text={site.email} />
                </li>
                {links.map((c) => {
                  const external = c.href.startsWith("http");
                  return (
                    <li key={c.label} className="border-b border-line">
                      <a
                        href={c.href}
                        {...(external && { target: "_blank", rel: "noopener noreferrer" })}
                        className="tap-plain tap-press group relative flex min-h-14 items-center justify-between gap-4 py-3"
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

            <details className="tap-details group mt-14 sm:mt-16">
              <summary className="tap-press inline-flex min-h-11 cursor-pointer list-none items-center gap-2 font-medium [&::-webkit-details-marker]:hidden">
                Why the NFC?
                <span aria-hidden="true" className="text-muted transition-transform duration-200 group-open:rotate-45">
                  +
                </span>
              </summary>
              <div className="tap-details-body mt-2 max-w-[34rem] space-y-3 text-muted">
                {whyNfc.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </details>

            <footer className="mt-16 border-t border-line pt-5">
              <Link to="/" className="tap-quiet tap-press inline-flex min-h-11 items-center gap-1.5 text-sm">
                Explore my website
                <span aria-hidden="true" className="tap-arrow">
                  →
                </span>
              </Link>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}

// Two points drawn together, a snap, a ripple — then the merged point settles into
// the header's "Connected" mark. Decorative only; the timeline lives in styles.css.
function Handshake({
  markRef,
  dockRef,
}: {
  markRef: RefObject<HTMLDivElement | null>;
  dockRef: RefObject<HTMLSpanElement | null>;
}) {
  return (
    <div aria-hidden="true" className="tap-overlay">
      <div className="tap-veil" />
      <div ref={markRef} className="tap-mark">
        <span className="tap-ripple tap-ripple-1" />
        <span className="tap-ripple tap-ripple-2" />
        <span className="tap-flash" />
        <span className="tap-dot" style={{ "--side": -1 } as CSSProperties} />
        <span className="tap-dot" style={{ "--side": 1 } as CSSProperties} />
        {/* Separate x and y movers with different easing give the docking flight a slight arc */}
        <span ref={dockRef} className="tap-dock-x">
          <span className="tap-dock-y">
            <span className="tap-core" />
          </span>
        </span>
      </div>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setState("copied");
    } catch {
      setState("failed");
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setState("idle"), 2000);
  }

  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <>
      <button
        type="button"
        onClick={copy}
        className="tap-press inline-flex min-h-11 min-w-[5.75rem] shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-full border border-line px-3.5 text-sm text-muted transition-colors hover:text-fg"
      >
        {state === "copied" ? (
          <>
            <svg viewBox="0 0 16 16" className="tap-check size-3.5 text-fg" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 8.5 6.5 12 13 4.5" />
            </svg>
            <span className="text-fg">Copied</span>
          </>
        ) : state === "failed" ? (
          "Try again"
        ) : (
          <>
            Copy<span className="sr-only"> email address</span>
          </>
        )}
      </button>
      <span className="sr-only" aria-live="polite">
        {state === "copied" ? "Email address copied" : state === "failed" ? "Couldn't copy the email address" : ""}
      </span>
    </>
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
    <li className="tap-reveal border-b border-line first:border-t" style={at(delay)}>
      <a
        href={href}
        {...(external && { target: "_blank", rel: "noopener noreferrer" })}
        className="tap-plain tap-press group relative flex min-h-16 items-center justify-between gap-4 py-3"
      >
        <span className="text-[1.1875rem] font-medium tracking-[-0.01em]">{label}</span>
        <span className="flex items-center gap-3 text-sm text-muted">
          {hint}
          <span aria-hidden="true" className={`tap-arrow inline-block text-base text-fg ${icon === "↓" ? "tap-arrow-down" : "tap-arrow-out"}`}>
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
