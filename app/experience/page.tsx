"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";

const experiences = [
  {
    date: "2026",
    dateLabel: "2026 — Present",
    title: "Founder, Software Engineer",
    company: "Impossible Solutions LLC",
    url: "https://impossiblesolutions.vercel.app/",
    description:
      "Built tons of work for clients that range from small businesses to large corporations. I've worked on a variety of projects, from simple websites to complex web applications.",
    tech: ["Next.js", "Typescript", "React"],
  },
  {
    date: "2025",
    dateLabel: "March 2025 — September 2025",
    title: "Software Development Intern",
    company: "Proconex",
    url: "https://www.proconexdirect.com/",
    description:
      "Assisted the development team in building internal tools and updating the company website. Gained foundational experience in C#, SQL, Typescript, and version control. Participated in code reviews and agile sprint ceremonies.",
    tech: ["C#", "SQL", "Angular", "Azure"],
  },
  {
    date: "2024",
    dateLabel: "2024 — 2026",
    title: "Web Developer",
    company: "Impact Six LLC",
    url: "https://www.impactsix.com/",
    description:
      "Designed and developed custom websites for small businesses and startups. Focused on performance, SEO, and accessibility from the ground up. Managed full project lifecycle from client discovery through deployment and maintenance.",
    tech: ["Next.js", "Tanstack", "React"],
  },
];

export default function ExperiencePage() {
  const spotlightRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  /* Spotlight pointer tracking */
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

  const [theme, setTheme] = useState<"dark" | "light">("dark");

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

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && menuOpen) setMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

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

          <div className="mx-auto min-h-screen max-w-screen-xl px-6 py-12 md:px-12 md:py-20 lg:px-24 lg:py-0">
            <div className="lg:flex lg:justify-between lg:gap-10">

              {/* LEFT COLUMN */}
              <header aria-label="Gabriel Ferreira – Experience" className="lg:sticky lg:top-0 lg:flex lg:max-h-screen lg:w-1/2 lg:flex-col lg:justify-between lg:py-24">
                <div>
                  <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                    <Link
                      href="/"
                      className="text-foreground hover:text-tertiary-mid focus-visible:text-tertiary-mid transition-colors"
                      aria-label="Gabriel Ferreira – Return to home page"
                    >
                      Gabriel Ferreira
                    </Link>
                  </h1>

                  <p
                    className="mt-3 text-base font-medium tracking-tight sm:text-lg"
                    role="doc-subtitle"
                  >
                    Frontend Engineer
                  </p>

                  <p className="mt-4 max-w-xs leading-normal text-foreground">
                    A timeline of my professional journey building accessible,
                    performant web experiences.
                  </p>

                  {/* Mobile hamburger button */}
                  <button
                    type="button"
                    className="mt-6 flex items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground hover:bg-foreground/10 transition-colors lg:hidden"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-expanded={menuOpen}
                    aria-controls="nav-menu"
                    aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="h-5 w-5"
                      aria-hidden="true"
                    >
                      {menuOpen ? (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                      )}
                    </svg>
                    Menu
                  </button>

                  {/* Page navigation */}
                  <nav
                    id="nav-menu"
                    className={`${menuOpen ? "block" : "hidden"} lg:block`}
                    aria-label="Page navigation"
                  >
                    <ul className="mt-4 w-max lg:mt-16" role="list" aria-label="Page sections">
                      <li aria-label="About">
                        <Link
                          className="group flex items-center py-3"
                          href="/"
                          onClick={() => setMenuOpen(false)}
                        >
                          <span
                            className="nav-indicator mr-4 h-px w-8 bg-foreground/30 group-hover:w-16 group-hover:bg-foreground group-focus-visible:w-16 group-focus-visible:bg-foreground motion-reduce:transition-none transition-all duration-200"
                            aria-hidden="true"
                          />
                          <span className="text-xs font-bold uppercase tracking-widest text-foreground group-hover:text-foreground group-focus-visible:text-foreground transition-colors duration-200">
                            About
                          </span>
                        </Link>
                      </li>
                      <li aria-label="Experience">
                        <Link
                          className="group flex items-center py-3"
                          href="/experience"
                          aria-current="page"
                          onClick={() => setMenuOpen(false)}
                        >
                          <span
                            className="nav-indicator mr-4 h-px w-16 bg-foreground motion-reduce:transition-none transition-all duration-200"
                            aria-hidden="true"
                          />
                          <span className="text-xs font-bold uppercase tracking-widest text-foreground transition-colors duration-200">
                            Experience
                          </span>
                        </Link>
                      </li>
                      <li aria-label="Contact">
                        <Link
                          className="group flex items-center py-3"
                          href="/contact"
                          onClick={() => setMenuOpen(false)}
                        >
                          <span
                            className="nav-indicator mr-4 h-px w-8 bg-foreground/30 group-hover:w-16 group-hover:bg-foreground group-focus-visible:w-16 group-focus-visible:bg-foreground motion-reduce:transition-none transition-all duration-200"
                            aria-hidden="true"
                          />
                          <span className="text-xs font-bold uppercase tracking-widest text-foreground group-hover:text-foreground group-focus-visible:text-foreground transition-colors duration-200">
                            Contact
                          </span>
                        </Link>
                      </li>
                    </ul>
                  </nav>
                </div>

                {/* Social links + theme toggle */}
                <div role="presentation" className="ml-1 mt-8 flex items-center gap-5">
                  <nav aria-label="Social media links">
                    <ul className="flex items-center gap-5" role="list" aria-label="Social media profiles">
                      <li className="shrink-0 text-xs" aria-label="GitHub">
                        <a
                          className="block text-foreground hover:text-foreground focus-visible:text-foreground transition-colors"
                          href="https://github.com/gabeferreiraa"
                          target="_blank"
                          rel="noreferrer noopener"
                          aria-label="GitHub profile (opens in a new tab)"
                          title="GitHub"
                        >
                          <span className="sr-only">GitHub</span>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-6 w-6" aria-hidden="true">
                            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                          </svg>
                        </a>
                      </li>
                      <li className="shrink-0 text-xs" aria-label="LinkedIn">
                        <a
                          className="block text-foreground hover:text-foreground focus-visible:text-foreground transition-colors"
                          href="https://www.linkedin.com/in/gabriel-ferreira-544b95251/"
                          target="_blank"
                          rel="noreferrer noopener"
                          aria-label="LinkedIn profile (opens in a new tab)"
                          title="LinkedIn"
                        >
                          <span className="sr-only">LinkedIn</span>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6" aria-hidden="true">
                            <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
                          </svg>
                        </a>
                      </li>
                    </ul>
                  </nav>

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
              </header>

              {/* RIGHT COLUMN */}
              <main
                id="content"
                aria-label="Work experience"
                tabIndex={-1}
                className="pt-24 lg:w-1/2 lg:py-24"
              >
                <section
                  aria-labelledby="experience-heading"
                  className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24"
                >
                  <header className="sticky top-0 z-20 -mx-6 mb-8 w-screen bg-background/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:bg-transparent">
                    <h2
                      id="experience-heading"
                      className="text-sm font-bold uppercase tracking-widest text-foreground lg:text-2xl lg:font-bold lg:tracking-tight lg:normal-case"
                    >
                      Experience
                    </h2>
                  </header>

                  <ol aria-label="Work experience timeline" className="group/list" role="list">
                    {experiences.map((job) => (
                      <li
                        key={`${job.company}-${job.date}`}
                        className="mb-12"
                        aria-label={`${job.company} – ${job.title}`}
                      >
                        <div className="group relative grid pb-1 transition-all sm:grid-cols-8 sm:gap-8 md:gap-4 lg:hover:!opacity-100 lg:group-hover/list:opacity-50">
                          <div
                            className="absolute -inset-x-4 -inset-y-4 z-0 hidden rounded-md transition motion-reduce:transition-none lg:block lg:group-hover:bg-neutral-dark/50 lg:group-hover:shadow-[inset_0_1px_0_0_rgba(148,163,184,0.1)] lg:group-hover:drop-shadow-lg"
                            aria-hidden="true"
                          />

                          <time
                            dateTime={job.date}
                            className="z-10 mb-2 mt-1 text-xs font-semibold uppercase tracking-wide text-foreground sm:col-span-2"
                          >
                            {job.dateLabel}
                          </time>

                          <div className="z-10 sm:col-span-6">
                            <h3 className="font-medium leading-snug text-foreground">
                              {job.url ? (
                                <a
                                  className="group/link inline-flex items-baseline font-medium leading-tight text-foreground hover:text-tertiary-mid focus-visible:text-tertiary-mid text-base"
                                  href={job.url}
                                  target="_blank"
                                  rel="noreferrer noopener"
                                  aria-label={`${job.title} at ${job.company} (opens in a new tab)`}
                                >
                                  <span className="absolute -inset-x-4 -inset-y-2.5 hidden rounded md:-inset-x-6 md:-inset-y-4 lg:block" />
                                  <span>
                                    {job.title} ·{" "}
                                    <span className="inline-block">
                                      {job.company}
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        className="ml-1 inline-block h-4 w-4 shrink-0 translate-y-px transition-transform group-hover/link:-translate-y-1 group-hover/link:translate-x-1 group-focus-visible/link:-translate-y-1 group-focus-visible/link:translate-x-1 motion-reduce:transition-none"
                                        aria-hidden="true"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    </span>
                                  </span>
                                </a>
                              ) : (
                                <span className="font-medium leading-tight text-foreground text-base">
                                  {job.title} · {job.company}
                                </span>
                              )}
                            </h3>

                            <p className="mt-2 text-sm leading-normal text-foreground">
                              {job.description}
                            </p>

                            <ul
                              className="mt-2 flex flex-wrap gap-2"
                              aria-label={`Technologies used at ${job.company}`}
                              role="list"
                            >
                              {job.tech.map((t) => (
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
                      </li>
                    ))}
                  </ol>

                </section>

                {/* Footer */}
                <footer aria-label="Site credits and contact information" className="max-w-md pb-16 text-sm text-foreground sm:pb-0">
                  <p>
                    Built with{" "}
                    <a
                      href="https://nextjs.org/"
                      className="font-medium text-foreground hover:text-tertiary-mid focus-visible:text-tertiary-mid transition-colors"
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label="Next.js React framework (opens in a new tab)"
                    >
                      Next.js
                    </a>{" "}
                    and{" "}
                    <a
                      href="https://tailwindcss.com/"
                      className="font-medium text-foreground hover:text-tertiary-mid focus-visible:text-tertiary-mid transition-colors"
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label="Tailwind CSS framework (opens in a new tab)"
                    >
                      Tailwind CSS
                    </a>
                    .
                  </p>
                  <address className="mt-6 not-italic">
                    <a
                      href="mailto:gferreira0404@gmail.com"
                      className="font-medium text-foreground hover:text-tertiary-mid focus-visible:text-tertiary-mid transition-colors"
                      aria-label="Send email to Gabriel Ferreira"
                    >
                      gferreira0404@gmail.com
                    </a>
                  </address>
                </footer>
              </main>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
