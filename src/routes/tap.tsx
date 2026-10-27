import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ThemeToggle } from "../components/ThemeToggle";
import { site } from "../content";
import { introTempo, profile, tapPage, vcardHref } from "../tap/config";

const title = `Meet ${site.name} — ${profile.positioning}`;
const description = `${site.name} is a developer with a background in User Experience and Interaction Design from ${profile.school}, graduating ${profile.graduation}. Work, resume and contact card.`;

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

// Last reveal ends at 1.78s + 0.5s (.tap-reveal in styles.css), scaled by the tempo
const INTRO_MS = 2280 * introTempo;

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
  // Counts contact-card taps so the download arrow can drop again each time
  const [cardTaps, setCardTaps] = useState(0);
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

  const { headline, cta } = tapPage;
  const [lead, ...follow] = headline;

  return (
    <div
      className="tap-root"
      data-intro={intro}
      style={{ "--tempo": introTempo } as CSSProperties}
      onClickCapture={(e) => {
        const el = (e.target as Element).closest("a, button");
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

      <div className="mx-auto flex min-h-svh max-w-[30rem] flex-col px-6 pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        <header className="tap-fade flex items-center justify-between" style={at(1.35)}>
          <p className="flex items-center gap-2.5 text-sm text-muted">
            <span ref={statusDotRef} aria-hidden="true" className="tap-status-dot" />
            Connected
          </p>
          <ThemeToggle />
        </header>

        {/* Centered in the space between header and footer, like a card */}
        <main id="content" ref={mainRef} tabIndex={-1} className="flex flex-1 flex-col justify-center py-10">
          <h1 className="text-[2.125rem] leading-[1.12] font-medium tracking-[-0.025em] text-balance">
            <span className="tap-reveal block" style={at(1.4)}>
              {lead}
            </span>
            {follow.length > 0 && (
              <span className="tap-reveal block text-muted" style={at(1.5)}>
                {follow.join(" ")}
              </span>
            )}
          </h1>

          <div className="tap-reveal mt-8" style={at(1.6)}>
            <p className="text-[1.0625rem] font-medium">{profile.name}</p>
            <p className="text-muted">{profile.positioning}</p>
            <p className="mt-1 text-sm text-muted">
              {profile.school} · Graduating {profile.graduation}
            </p>
          </div>

          <nav aria-label="Start here" className="mt-10">
            <ul className="divide-y divide-line">
              <Action delay={1.66}>
                <a href={site.resume} target="_blank" rel="noopener noreferrer" className="tap-row tap-press group">
                  {cta.resume}
                  <span className="flex items-center gap-2.5">
                    <span className="text-sm text-muted">PDF</span>
                    <Arrow className="tap-arrow-out">↗</Arrow>
                  </span>
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </Action>
              <Action delay={1.72}>
                <Link to="/" hash="work" className="tap-row tap-press group">
                  {cta.work}
                  <Arrow className="tap-arrow-right">→</Arrow>
                </Link>
              </Action>
              <Action delay={1.78}>
                <a
                  href={vcardHref}
                  download="Gabriel-Ferreira.vcf"
                  onClick={() => setCardTaps((n) => n + 1)}
                  className="tap-row tap-press group"
                >
                  {cta.contact}
                  <Arrow key={cardTaps} className={`tap-arrow-down ${cardTaps ? "tap-drop" : ""}`}>
                    ↓
                  </Arrow>
                </a>
              </Action>
            </ul>
          </nav>
        </main>

        <footer className="tap-reveal" style={at(1.78)}>
          <Link to="/" className="tap-quiet tap-press group inline-flex min-h-11 items-center gap-1.5 text-sm">
            Explore my website
            <Arrow className="tap-arrow-right">→</Arrow>
          </Link>
        </footer>
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

function Action({ delay, children }: { delay: number; children: ReactNode }) {
  return (
    <li className="tap-reveal" style={at(delay)}>
      {children}
    </li>
  );
}

function Arrow({ className, children }: { className: string; children: ReactNode }) {
  return (
    <span aria-hidden="true" className={`tap-arrow inline-block text-muted transition-colors group-hover:text-fg ${className}`}>
      {children}
    </span>
  );
}
