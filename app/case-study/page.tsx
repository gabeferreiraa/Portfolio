"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";


export default function CaseStudyPage() {
  const spotlightRef = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const el = spotlightRef.current;
    if (!el) return;
    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--spotlight-x", `${e.clientX - rect.left}px`);
      el.style.setProperty("--spotlight-y", `${e.clientY - rect.top}px`);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("theme") as "dark" | "light" | null;
    if (saved) {
      setTheme(saved);
      document.documentElement.classList.toggle("light", saved === "light");
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      localStorage.setItem("theme", next);
      document.documentElement.classList.toggle("light", next === "light");
      return next;
    });
  }, []);

  return (
    <>
      <a href="#content" className="skip-link">
        Skip to main content
      </a>

      <div role="presentation" className="bg-background text-foreground transition-colors duration-300">
        <div role="presentation" className="group/spotlight relative">
          <div
            ref={spotlightRef}
            className="pointer-events-none fixed inset-0 z-30 transition duration-300 lg:absolute spotlight-bg"
            aria-hidden="true"
          />

          {/* Hero Section */}
          <section aria-label="Project hero" className="relative">
            <div className="mx-auto max-w-screen-xl px-6 pt-12 md:px-12 lg:px-24">
              {/* Back link */}
              <nav aria-label="Breadcrumb" className="mb-8">
                <Link
                  href="/"
                  className="group inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-tertiary-mid focus-visible:text-tertiary-mid transition-colors"
                  aria-label="Back to home page"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-4 w-4 transition-transform group-hover:-translate-x-1 motion-reduce:transition-none"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Gabriel Ferreira
                </Link>
              </nav>

              {/* Project title + meta */}
              <div className="max-w-3xl">
                <p className="mb-3 text-xs font-bold uppercase tracking-widest text-tertiary-mid">
                  Case Study
                </p>
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                  Accessible Portfolio — Designing &amp; Developing for WCAG AAA
                </h1>
                <p className="mt-4 text-lg leading-relaxed text-foreground">
                  A personal portfolio built from scratch with accessibility as the primary
                  design constraint.
                </p>

                <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-sm text-foreground" role="list" aria-label="Project details">
                  <li aria-label="Role"><span className="font-semibold">Role:</span> Designer &amp; Developer</li>
                  <li aria-label="Timeline"><span className="font-semibold">Timeline:</span> 10 Weeks</li>
                  <li aria-label="Type"><span className="font-semibold">Type:</span> Solo Project</li>
                  <li aria-label="Year"><span className="font-semibold">Year:</span> 2026</li>
                </ul>

                <ul className="mt-4 flex flex-wrap gap-2" role="list" aria-label="Technologies used">
                  {["Next.js", "Tailwind CSS", "TypeScript", "Vercel", "Figma"].map((t) => (
                    <li
                      key={t}
                      className="rounded-full bg-tertiary-mid/10 px-3 py-1 text-xs font-medium leading-5 text-foreground"
                      aria-label={t}
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Hero image placeholder */}
            <div className="mx-auto mt-12 max-w-screen-xl px-6 md:px-12 lg:px-24">
              <figure>
                <div className="relative w-full overflow-hidden rounded-lg border border-neutral-dark bg-neutral-dark/30">
                  <Image src="/Capture-2026-03-20-124124.png" alt="Final portfolio design shown across desktop and mobile viewports" width={2967} height={1585} className="h-auto w-full" priority />
                </div>
                <figcaption className="mt-3 text-center text-xs text-foreground">
                  The final portfolio design.
                </figcaption>
              </figure>
            </div>
          </section>

          {/* Content */}
          <div className="mx-auto max-w-screen-xl px-6 md:px-12 lg:px-24">
            <main
              id="content"
              aria-label="Case study content"
              tabIndex={-1}
              className="mx-auto max-w-3xl py-16 lg:py-24"
            >

              {/* ── Overview ── */}
              <section aria-labelledby="overview-heading" className="mb-16 scroll-mt-24">
                <h2
                  id="overview-heading"
                  className="mb-6 text-xl font-bold tracking-tight sm:text-2xl"
                >
                  Overview
                </h2>
                <div className="space-y-4 leading-relaxed text-foreground">
                  <p>
                    This portfolio was designed and developed as part of a college web accessibility
                    course with one clear objective: prove that AAA-level accessibility and
                    polished visual design are not mutually exclusive. Every color pairing meets
                    WCAG 2.2 AAA contrast ratios, every
                    interactive element is keyboard-navigable, and the full DOM tree is described
                    for assistive technology.
                  </p>
                  <p>
                    The solution is a two-column portfolio featuring an about page, a dedicated
                    experience timeline, and a fully validated contact form — all wrapped in a
                    dark/light theme toggle that maintains AAA compliance in both modes. The site
                    scores 100 on Lighthouse accessibility.
                  </p>
                </div>
              </section>

              {/* ── Context & Challenge ── */}
              <section aria-labelledby="context-heading" className="mb-16 scroll-mt-24">
                <h2
                  id="context-heading"
                  className="mb-6 text-xl font-bold tracking-tight sm:text-2xl"
                >
                  Context &amp; Challenge
                </h2>
                <div className="space-y-4 leading-relaxed text-foreground">
                  <h3 className="text-lg font-semibold">Background</h3>
                  <p>
                    The project was assigned as the capstone for a web accessibility course. The
                    brief required a multi-page live site that demonstrates mastery of
                    semantic HTML, ARIA attributes, color contrast, keyboard navigation, and
                    responsive design. All evaluated against WCAG 2.2 AAA success criteria.
                  </p>

                  <h3 className="mt-8 text-lg font-semibold">The Problem</h3>
                  <p>
                    Most portfolios worry about accessibility when its too late, after they&apos;ve built the design. This makes the process
                    fail several areas when validating for WCAG 2.2 AAA standards. The challenge was inverting the previous workflow so 
                    that we start with accessibility and build up from there
                  </p>

                  <h3 className="mt-8 text-lg font-semibold">Goals &amp; Objectives</h3>
                  <ul className="ml-6 list-disc space-y-2" role="list" aria-label="Project goals">
                    <li aria-label="Goal: AAA contrast">Achieve WCAG 2.2 AAA contrast ratios on every text element in both dark and light mode.</li>
                    <li aria-label="Goal: Clean accessibility tree">Produce a clean, fully-described accessibility tree — no unnamed landmarks, no generic roles, no orphaned labels.</li>
                    <li aria-label="Goal: Keyboard navigation">Full keyboard navigation with visible focus indicators and skip links on every page.</li>
                    <li aria-label="Goal: Semantic HTML">Use semantic HTML elements wherever possible — minimize <code className="rounded bg-neutral-dark/50 px-1.5 py-0.5 text-xs font-mono">div</code> soup.</li>
                    <li aria-label="Goal: Form validation">Build an accessible contact form with real-time inline validation, ARIA live regions, and descriptive error messages.</li>
                    <li aria-label="Goal: Lighthouse score">Score 100 on Lighthouse accessibility audit.</li>
                  </ul>
                </div>
              </section>

              {/* ── Process & Insight ── */}
              <section aria-labelledby="process-heading" className="mb-16 scroll-mt-24">
                <h2
                  id="process-heading"
                  className="mb-6 text-xl font-bold tracking-tight sm:text-2xl"
                >
                  Process &amp; Insight
                </h2>
                <div className="space-y-4 leading-relaxed text-foreground">
                  <h3 className="text-lg font-semibold">Target Audience</h3>
                  <p>
                    Prospective employers and collaborators evaluating frontend engineering
                    skills, with special attention from accessibility-focused teams who will
                    inspect the DOM tree, run screen readers, and test keyboard flows before
                    reading a single line of copy.
                  </p>

                  <h3 className="mt-8 text-lg font-semibold">Color System &amp; Contrast</h3>
                  <p>
                    The color palette was built contrast-first. The dark mode background
                    (<code className="rounded bg-neutral-dark/50 px-1.5 py-0.5 text-xs font-mono">#0a1733</code>)
                    was chosen for its deep navy tone that pairs with pure white
                    (<code className="rounded bg-neutral-dark/50 px-1.5 py-0.5 text-xs font-mono">#ffffff</code>)
                    at a 16.3:1 ratio — well above the 7:1 AAA threshold. The accent teal was
                    tuned to two variants: a brighter
                    <code className="rounded bg-neutral-dark/50 px-1.5 py-0.5 text-xs font-mono">#56d4c8</code>{" "}
                    for dark mode (~10:1) and a darker
                    <code className="rounded bg-neutral-dark/50 px-1.5 py-0.5 text-xs font-mono">#0e7569</code>{" "}
                    for light mode (~7.2:1).
                  </p>

                  {/* Color palette image placeholder */}
                  <figure className="my-8">
                    <div className="relative w-full overflow-hidden rounded-lg border border-neutral-dark bg-neutral-dark/30">
                      <Image src="/casestudy-colors.png" alt="Color palette showing dark and light mode pairings with contrast ratios" width={2984} height={1440} className="h-auto w-full" />
                    </div>
                    <figcaption className="mt-3 text-center text-xs text-foreground">
                      The dual-mode color system with contrast ratios annotated for each pairing.
                    </figcaption>
                  </figure>

                  <h3 className="mt-8 text-lg font-semibold">Accessibility Tree Architecture</h3>
                  <p>
                    Before writing any Tailwind classes, the accessibility tree was mapped out.
                    Every landmark region (<code className="rounded bg-neutral-dark/50 px-1.5 py-0.5 text-xs font-mono">banner</code>,{" "}
                    <code className="rounded bg-neutral-dark/50 px-1.5 py-0.5 text-xs font-mono">main</code>,{" "}
                    <code className="rounded bg-neutral-dark/50 px-1.5 py-0.5 text-xs font-mono">contentinfo</code>)
                    was given an explicit <code className="rounded bg-neutral-dark/50 px-1.5 py-0.5 text-xs font-mono">aria-label</code>.
                    Decorative wrappers were marked with <code className="rounded bg-neutral-dark/50 px-1.5 py-0.5 text-xs font-mono">role=&quot;presentation&quot;</code>{" "}
                    to keep the tree clean. Every list, list item, and navigation region is named
                    so screen reader users can orient themselves without visual context.
                  </p>

                  <h3 className="mt-8 text-lg font-semibold">Form Validation</h3>
                  <p>
                    The contact form uses real-time inline validation with{" "}
                    <code className="rounded bg-neutral-dark/50 px-1.5 py-0.5 text-xs font-mono">aria-invalid</code>,{" "}
                    <code className="rounded bg-neutral-dark/50 px-1.5 py-0.5 text-xs font-mono">aria-describedby</code>,
                    and <code className="rounded bg-neutral-dark/50 px-1.5 py-0.5 text-xs font-mono">role=&quot;alert&quot;</code>{" "}
                    on error messages so screen readers announce errors as they appear. Each field
                    links to its error message via <code className="rounded bg-neutral-dark/50 px-1.5 py-0.5 text-xs font-mono">aria-describedby</code>,
                    and the required indicator asterisk is hidden from assistive technology with{" "}
                    <code className="rounded bg-neutral-dark/50 px-1.5 py-0.5 text-xs font-mono">aria-hidden</code>{" "}
                    while the actual requirement is conveyed via <code className="rounded bg-neutral-dark/50 px-1.5 py-0.5 text-xs font-mono">aria-required</code>.
                  </p>

                  <h3 className="mt-8 text-lg font-semibold">Responsive &amp; Motion</h3>
                  <p>
                    The layout uses a sticky two-column design on desktop that collapses to a
                    single column with sticky section headers on mobile. A{" "}
                    <code className="rounded bg-neutral-dark/50 px-1.5 py-0.5 text-xs font-mono">prefers-reduced-motion</code>{" "}
                    media query disables all animations and transitions for users who request it.
                    Touch targets meet the 44px minimum on touch devices via a dedicated media
                    query.
                  </p>

                  {/* Additional image placeholder */}
                  <figure className="my-8">
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-neutral-dark bg-neutral-dark/30">
                      <Image src="/casestudy-dom.png" alt="Chrome DevTools accessibility tree showing fully labeled landmarks" fill className="object-cover" />
                      <div className="flex h-full items-center justify-center text-neutral-mid">
                        <p className="text-sm">Additional image — replace with accessibility tree or wireframe screenshot</p>
                      </div>
                    </div>
                    <figcaption className="mt-3 text-center text-xs text-foreground">
                      The accessibility tree in Chrome DevTools — every landmark, list, and region is explicitly named.
                    </figcaption>
                  </figure>
                </div>
              </section>

              {/* ── The Solution ── */}
              <section aria-labelledby="solution-heading" className="mb-16 scroll-mt-24">
                <h2
                  id="solution-heading"
                  className="mb-6 text-xl font-bold tracking-tight sm:text-2xl"
                >
                  The Solution
                </h2>
                <div className="space-y-4 leading-relaxed text-foreground">
                  <p>
                    The final portfolio is a three-page Next.js application deployed on Vercel:
                  </p>
                  <ul className="ml-6 list-disc space-y-2" role="list" aria-label="Site pages">
                    <li aria-label="About page"><span className="font-semibold">About (Home)</span> — A concise introduction with the two-column sticky header pattern, social links, and a theme toggle.</li>
                    <li aria-label="Experience page"><span className="font-semibold">Experience</span> — A timeline of work history rendered from a data array, with hover cards, tech badges, and external links that all announce context to screen readers.</li>
                    <li aria-label="Contact page"><span className="font-semibold">Contact</span> — A fully accessible form with fieldset grouping, inline validation, ARIA live error regions, autocomplete hints, and a success confirmation with a reset action.</li>
                  </ul>

                  <h3 className="mt-8 text-lg font-semibold">Key Features</h3>
                  <ul className="ml-6 list-disc space-y-2" role="list" aria-label="Key features">
                    <li aria-label="Feature: Dark and light mode">Dark/light mode with AAA-compliant color overrides in both themes.</li>
                    <li aria-label="Feature: Skip links">Skip-to-content links on every page with visible focus styling.</li>
                    <li aria-label="Feature: Focus indicators">3px solid focus rings with a 3px offset on all interactive elements.</li>
                    <li aria-label="Feature: Reduced motion">Reduced motion support that disables all animations and scroll behavior.</li>
                    <li aria-label="Feature: High contrast">High contrast mode support with amplified accent colors and thicker focus outlines.</li>
                    <li aria-label="Feature: Print stylesheet">Print stylesheet that strips decorative elements and appends URLs after links.</li>
                    <li aria-label="Feature: Responsive typography">Responsive typography using <code className="rounded bg-neutral-dark/50 px-1.5 py-0.5 text-xs font-mono">clamp()</code> for fluid scaling.</li>
                  </ul>

                  <p className="mt-6">
                    <a
                      href="/"
                      className="group/link inline-flex items-center gap-1 font-medium text-foreground hover:text-tertiary-mid focus-visible:text-tertiary-mid transition-colors"
                      aria-label="View the live portfolio site"
                    >
                      View Live Site
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="h-4 w-4 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5 motion-reduce:transition-none"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>
                  </p>
                </div>
              </section>

              {/* ── Results ── */}
              <section aria-labelledby="results-heading" className="mb-16 scroll-mt-24">
                <h2
                  id="results-heading"
                  className="mb-6 text-xl font-bold tracking-tight sm:text-2xl"
                >
                  Results
                </h2>
                <div className="space-y-4 leading-relaxed text-foreground">
                  {/* Metrics grid */}
                  <div className="my-6 grid grid-cols-2 gap-4 sm:grid-cols-4" role="list" aria-label="Key metrics">
                    {[
                      { metric: "100", label: "Lighthouse Accessibility" },
                      { metric: "AAA", label: "WCAG 2.2 Compliance" },
                      { metric: "0", label: "axe-core Violations" },
                      { metric: "3", label: "Pages Shipped" },
                    ].map((item) => (
                      <div
                        key={item.label}
                        role="listitem"
                        aria-label={`${item.metric} — ${item.label}`}
                        className="rounded-lg border border-neutral-dark bg-neutral-dark/20 p-4 text-center"
                      >
                        <p className="text-2xl font-bold text-tertiary-mid">{item.metric}</p>
                        <p className="mt-1 text-xs text-foreground">{item.label}</p>
                      </div>
                    ))}
                  </div>

                  <p>
                    The project met every objective established in the brief. All text elements
                    pass AAA contrast in both themes. The accessibility tree contains zero
                    unnamed landmarks or generic roles. Every form field, navigation item, and
                    interactive element is operable via keyboard with visible focus indicators.
                  </p>

                  <h3 className="mt-8 text-lg font-semibold">Lessons Learned</h3>
                  <ul className="ml-6 list-disc space-y-2" role="list" aria-label="Lessons learned">
                    <li aria-label="Lesson: Contrast-first approach"><span className="font-semibold">Contrast-first color design</span> eliminates rework. Choosing accessible colors before building components prevented every contrast failure that typically surfaces late in QA.</li>
                    <li aria-label="Lesson: Accessibility tree mapping"><span className="font-semibold">Mapping the accessibility tree early</span> exposed structural issues (unnamed regions, orphaned roles) before any visual polish was applied.</li>
                    <li aria-label="Lesson: Dual-mode testing"><span className="font-semibold">Dual-mode testing is essential.</span> A color that passes AAA in dark mode can fail entirely in light mode. CSS custom property overrides per theme kept the system maintainable.</li>
                    <li aria-label="Lesson: Decorative elements"><span className="font-semibold">Decorative elements need explicit exclusion.</span> Without <code className="rounded bg-neutral-dark/50 px-1.5 py-0.5 text-xs font-mono">aria-hidden</code> and <code className="rounded bg-neutral-dark/50 px-1.5 py-0.5 text-xs font-mono">role=&quot;presentation&quot;</code>, spotlight overlays and indicator lines created noise in the accessibility tree.</li>
                  </ul>
                </div>
              </section>

              {/* ── Footer ── */}
              <footer aria-label="Case study footer" className="border-t border-neutral-dark pt-8 pb-16 text-sm text-foreground sm:pb-0">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <Link
                    href="/"
                    className="group inline-flex items-center gap-2 font-medium text-foreground hover:text-tertiary-mid focus-visible:text-tertiary-mid transition-colors"
                    aria-label="Back to home page"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-4 w-4 transition-transform group-hover:-translate-x-1 motion-reduce:transition-none"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Back to Home
                  </Link>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={toggleTheme}
                      className="rounded-md p-2 text-foreground hover:text-foreground hover:bg-foreground/10 focus-visible:text-foreground transition-colors"
                      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                    >
                      {theme === "dark" ? (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
                          <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
                          <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </footer>

            </main>
          </div>
        </div>
      </div>
    </>
  );
}
