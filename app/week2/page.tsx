"use client";

import React, { useEffect, useRef } from "react";
import "../globals.css";
import Link from "next/link";

export default function Page() {
  const spotlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = spotlightRef.current;
    if (!el) return;

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      el.style.setProperty("--spotlight-x", `${x}px`);
      el.style.setProperty("--spotlight-y", `${y}px`);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <>
      {/* Skip to main content link for keyboard navigation */}
      <a href="#content" className="skip-link">
        Skip to main content
      </a>

      <div id="__next" className="bg-primary-dark text-neutral-white">
        {/* Decorative spotlight overlay */}
        <article className="group/spotlight relative">
          <aside
            ref={spotlightRef}
            className="pointer-events-none fixed inset-0 z-30 transition duration-300 lg:absolute spotlight-bg"
            aria-hidden="true"
            role="presentation"
          />

          <div className="mx-auto min-h-screen max-w-screen-xl px-6 py-12 md:px-12 md:py-20 lg:px-24 lg:py-0">
            <div className="lg:flex lg:justify-between lg:gap-10">
              {/* LEFT COLUMN */}
              <header className="lg:sticky lg:top-0 lg:flex lg:max-h-screen lg:w-1/2 lg:flex-col lg:justify-between lg:py-24">
                <section>
                  <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                    <Link
                      href="/"
                      className="text-neutral-white hover:text-tertiary-mid focus-visible:text-tertiary-mid transition-colors"
                      aria-label="Gabriel Ferreira - Return to home page"
                    >
                      Gabriel Ferreira
                    </Link>
                  </h1>

                  <p className="mt-3 text-base font-medium tracking-tight sm:text-lg" role="doc-subtitle">
                    UI/UX Engineer
                  </p>

                  <p className="mt-4 max-w-xs leading-normal text-neutral-light">
                    I bring your idea to life, and opportunity keeps you growing
                    beyond delivery
                  </p>

                  {/* In-page navigation (desktop) */}
                  <nav className="hidden lg:block" aria-label="Jump to section">
                    <ul className="mt-16 w-max" role="list">
                      <li>
                        <a className="group flex items-center py-3" href="#week2" aria-label="Navigate to Home page">
                          <span
                            className="nav-indicator mr-4 h-px w-8 bg-neutral-mid group-hover:w-16 group-hover:bg-neutral-white group-focus-visible:w-16 group-focus-visible:bg-neutral-white motion-reduce:transition-none transition-all duration-200"
                            aria-hidden="true"
                          />
                          <span className="text-xs font-bold uppercase tracking-widest text-neutral-mid group-hover:text-neutral-white group-focus-visible:text-neutral-white transition-colors duration-200">
                            Home
                          </span>
                        </a>
                      </li>
                      <li>
                        <a
                          className="group flex items-center py-3"
                          href="#about"
                          aria-label="Navigate to About page"
                        >
                          <span
                            className="nav-indicator mr-4 h-px w-8 bg-neutral-mid group-hover:w-16 group-hover:bg-neutral-white group-focus-visible:w-16 group-focus-visible:bg-neutral-white motion-reduce:transition-none transition-all duration-200"
                            aria-hidden="true"
                          />
                          <span className="text-xs font-bold uppercase tracking-widest text-neutral-mid group-hover:text-neutral-white group-focus-visible:text-neutral-white transition-colors duration-200">
                            About
                          </span>
                        </a>
                      </li>
                      <li>
                        <a
                          className="group flex items-center py-3"
                          href="/week2/contact"
                          aria-label="Navigate to contact page"
                        >
                          <span
                            className="nav-indicator mr-4 h-px w-8 bg-neutral-mid group-hover:w-16 group-hover:bg-neutral-white group-focus-visible:w-16 group-focus-visible:bg-neutral-white motion-reduce:transition-none transition-all duration-200"
                            aria-hidden="true"
                          />
                          <span className="text-xs font-bold uppercase tracking-widest text-neutral-mid group-hover:text-neutral-white group-focus-visible:text-neutral-white transition-colors duration-200">
                            Contact
                          </span>
                        </a>
                      </li>
                    </ul>
                  </nav>
                </section>

                {/* Social links */}
                <nav aria-label="Social media links">
                  <ul className="ml-1 mt-8 flex items-center gap-5" role="list">
                    <li className="shrink-0 text-xs">
                      <a
                        className="block text-neutral-light hover:text-neutral-white focus-visible:text-neutral-white transition-colors"
                        href="https://github.com/bchiang7"
                        target="_blank"
                        rel="noreferrer noopener"
                        aria-label="Visit Gabriel's GitHub profile (opens in a new tab)"
                        title="GitHub"
                      >
                        <span className="sr-only">GitHub</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 16 16"
                          fill="currentColor"
                          className="h-6 w-6"
                          aria-hidden="true"
                          role="img"
                        >
                          <title>GitHub Logo</title>
                          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                        </svg>
                      </a>
                    </li>

                    <li className="shrink-0 text-xs">
                      <a
                        className="block text-neutral-light hover:text-neutral-white focus-visible:text-neutral-white transition-colors"
                        href="https://www.linkedin.com/in/bchiang7/"
                        target="_blank"
                        rel="noreferrer noopener"
                        aria-label="Visit Gabriel's LinkedIn profile (opens in a new tab)"
                        title="LinkedIn"
                      >
                        <span className="sr-only">LinkedIn</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="h-6 w-6"
                          aria-hidden="true"
                          role="img"
                        >
                          <title>LinkedIn Logo</title>
                          <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
                        </svg>
                      </a>
                    </li>



                    <li className="shrink-0 text-xs">
                      <a
                        className="block text-neutral-light hover:text-neutral-white focus-visible:text-neutral-white transition-colors"
                        href="https://instagram.com/bchiang7"
                        target="_blank"
                        rel="noreferrer noopener"
                        aria-label="Visit Gabriel's Instagram profile (opens in a new tab)"
                        title="Instagram"
                      >
                        <span className="sr-only">Instagram</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 1000 1000"
                          fill="currentColor"
                          className="h-6 w-6"
                          aria-hidden="true"
                          role="img"
                        >
                          <title>Instagram Logo</title>
                          <path d="M295.42,6c-53.2,2.51-89.53,11-121.29,23.48-32.87,12.81-60.73,30-88.45,57.82S40.89,143,28.17,175.92c-12.31,31.83-20.65,68.19-23,121.42S2.3,367.68,2.56,503.46,3.42,656.26,6,709.6c2.54,53.19,11,89.51,23.48,121.28,12.83,32.87,30,60.72,57.83,88.45S143,964.09,176,976.83c31.8,12.29,68.17,20.67,121.39,23s70.35,2.87,206.09,2.61,152.83-.86,206.16-3.39S799.1,988,830.88,975.58c32.87-12.86,60.74-30,88.45-57.84S964.1,862,976.81,829.06c12.32-31.8,20.69-68.17,23-121.35,2.33-53.37,2.88-70.41,2.62-206.17s-.87-152.78-3.4-206.1-11-89.53-23.47-121.32c-12.85-32.87-30-60.7-57.82-88.45S862,40.87,829.07,28.19c-31.82-12.31-68.17-20.7-121.39-23S637.33,2.3,501.54,2.56,348.75,3.4,295.42,6m5.84,903.88c-48.75-2.12-75.22-10.22-92.86-17-23.36-9-40-19.88-57.58-37.29s-28.38-34.11-37.5-57.42c-6.85-17.64-15.1-44.08-17.38-92.83-2.48-52.69-3-68.51-3.29-202s.22-149.29,2.53-202c2.08-48.71,10.23-75.21,17-92.84,9-23.39,19.84-40,37.29-57.57s34.1-28.39,57.43-37.51c17.62-6.88,44.06-15.06,92.79-17.38,52.73-2.5,68.53-3,202-3.29s149.31.21,202.06,2.53c48.71,2.12,75.22,10.19,92.83,17,23.37,9,40,19.81,57.57,37.29s28.4,34.07,37.52,57.45c6.89,17.57,15.07,44,17.37,92.76,2.51,52.73,3.08,68.54,3.32,202s-.23,149.31-2.54,202c-2.13,48.75-10.21,75.23-17,92.89-9,23.35-19.85,40-37.31,57.56s-34.09,28.38-57.43,37.5c-17.6,6.87-44.07,15.07-92.76,17.39-52.73,2.48-68.53,3-202.05,3.29s-149.27-.25-202-2.53m407.6-674.61a60,60,0,1,0,59.88-60.1,60,60,0,0,0-59.88,60.1M245.77,503c.28,141.8,115.44,256.49,257.21,256.22S759.52,643.8,759.25,502,643.79,245.48,502,245.76,245.5,361.22,245.77,503m90.06-.18a166.67,166.67,0,1,1,167,166.34,166.65,166.65,0,0,1-167-166.34" />
                        </svg>
                      </a>
                    </li>

                  </ul>
                </nav>
              </header>

              {/* RIGHT COLUMN */}
              <main
                id="content"
                tabIndex={-1}
                className="pt-24 lg:w-1/2 lg:py-24"
                role="main"
              >
                {/* About */}
                <section
                  id="about"
                  className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24"
                  aria-labelledby="about-heading"
                >
                  <header className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-primary-dark/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
                    <h2
                      id="about-heading"
                      className="text-sm font-bold uppercase tracking-widest text-neutral-white lg:sr-only"
                    >
                      About
                    </h2>
                  </header>

                  <article className="text-neutral-light">
                    <p className="mb-4">
                      I&apos;m a UI/UX engineer who is driven to deliver
                      accessible, unique, and meticulous applications. I
                      specialize in web accessibility, design, development, and
                      optimization of applications.
                    </p>

                    <p className="mb-4">
                      Currently, I&apos;m a junior developer at{" "}
                      <a
                        className="font-medium text-neutral-white hover:text-tertiary-mid focus-visible:text-tertiary-mid transition-colors"
                        href="https://www.proconexdirect.com/"
                        target="_blank"
                        rel="noreferrer noopener"
                        aria-label="Proconex company website (opens in a new tab)"
                      >
                        Proconex
                      </a>
                      . Throughout my time as a developer I&apos;ve been able to
                      develop software across different applications—whether it
                      was troubleshooting or starting from zero—there was always
                      an opportunity for success.
                    </p>

                    <p>
                      If you have any questions, please reach out, and I&apos;ll
                      respond as soon as I&apos;m available.
                    </p>
                  </article>
                </section>

                {/* Experience */}
                <section
                  id="experience"
                  className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24"
                  aria-labelledby="experience-heading"
                >
                  <header className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-primary-dark/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
                    <h2
                      id="experience-heading"
                      className="text-sm font-bold uppercase tracking-widest text-neutral-white lg:sr-only"
                    >
                      Experience
                    </h2>
                  </header>

                  <ol aria-label="Work experience timeline" className="group/list" role="list">
                    <li className="mb-12">
                      <article className="group relative grid pb-1 transition-all sm:grid-cols-8 sm:gap-8 md:gap-4 lg:hover:!opacity-100 lg:group-hover/list:opacity-50">
                        <aside
                          className="absolute -inset-x-4 -inset-y-4 z-0 hidden rounded-md transition motion-reduce:transition-none lg:block lg:group-hover:bg-neutral-dark/50 lg:group-hover:shadow-[inset_0_1px_0_0_rgba(148,163,184,0.1)] lg:group-hover:drop-shadow-lg"
                          aria-hidden="true"
                          role="presentation"
                        />

                        <time
                          dateTime="2024"
                          className="z-10 mb-2 mt-1 text-xs font-semibold uppercase tracking-wide text-neutral-mid sm:col-span-2"
                        >
                          2024 — Present
                        </time>

                        <section className="z-10 sm:col-span-6">
                          <h3 className="font-medium leading-snug text-neutral-white">
                            <a
                              className="group/link inline-flex items-baseline font-medium leading-tight text-neutral-white hover:text-tertiary-mid focus-visible:text-tertiary-mid text-base"
                              href="https://www.klaviyo.com/"
                              target="_blank"
                              rel="noreferrer noopener"
                              aria-label="Senior Frontend Engineer, Accessibility at Klaviyo (opens in a new tab)"
                            >
                              <span className="absolute -inset-x-4 -inset-y-2.5 hidden rounded md:-inset-x-6 md:-inset-y-4 lg:block" />
                              <span>
                                Senior Frontend Engineer, Accessibility ·{" "}
                                <span className="inline-block">
                                  Klaviyo
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    className="ml-1 inline-block h-4 w-4 shrink-0 translate-y-px transition-transform group-hover/link:-translate-y-1 group-hover/link:translate-x-1 group-focus-visible/link:-translate-y-1 group-focus-visible/link:translate-x-1 motion-reduce:transition-none"
                                    aria-hidden="true"
                                    role="img"
                                  >
                                    <title>External link icon</title>
                                    <path
                                      fillRule="evenodd"
                                      d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </span>
                              </span>
                            </a>
                          </h3>

                          <p className="mt-2 text-sm leading-normal text-neutral-light">
                            Build and maintain critical components used to
                            construct Klaviyo&apos;s frontend across the whole
                            product. Work closely with cross-functional teams,
                            including developers, designers, and product managers,
                            to implement and advocate for best practices in web
                            accessibility.
                          </p>

                          <ul
                            className="mt-2 flex flex-wrap gap-2"
                            aria-label="Technologies used in this role"
                            role="list"
                          >
                            <li className="rounded-full bg-tertiary-mid/10 px-3 py-1 text-xs font-medium leading-5 text-tertiary-light">
                              React
                            </li>
                            <li className="rounded-full bg-tertiary-mid/10 px-3 py-1 text-xs font-medium leading-5 text-tertiary-light">
                              TypeScript
                            </li>
                            <li className="rounded-full bg-tertiary-mid/10 px-3 py-1 text-xs font-medium leading-5 text-tertiary-light">
                              Storybook
                            </li>
                          </ul>
                        </section>
                      </article>
                    </li>
                  </ol>

                  <p className="mt-12">
                    <a
                      className="group/link inline-flex items-baseline font-medium leading-tight text-neutral-white hover:text-tertiary-mid focus-visible:text-tertiary-mid text-base"
                      href="/resume.pdf"
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label="View full résumé PDF (opens in a new tab)"
                    >
                      <span>
                        View Full{" "}
                        <span className="inline-block">
                          Résumé
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="ml-1 inline-block h-4 w-4 shrink-0 translate-y-px transition-transform group-hover/link:-translate-y-1 group-hover/link:translate-x-1 group-focus-visible/link:-translate-y-1 group-focus-visible/link:translate-x-1 motion-reduce:transition-none"
                            aria-hidden="true"
                            role="img"
                          >
                            <title>External link icon</title>
                            <path
                              fillRule="evenodd"
                              d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </span>
                      </span>
                    </a>
                  </p>
                </section>

                <footer className="max-w-md pb-16 text-sm text-neutral-mid sm:pb-0">
                  <p>
                    Loosely designed in{" "}
                    <a
                      href="https://www.figma.com/"
                      className="font-medium text-neutral-light hover:text-tertiary-mid focus-visible:text-tertiary-mid transition-colors"
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label="Figma design tool (opens in a new tab)"
                    >
                      Figma
                    </a>{" "}
                    and coded in{" "}
                    <a
                      href="https://code.visualstudio.com/"
                      className="font-medium text-neutral-light hover:text-tertiary-mid focus-visible:text-tertiary-mid transition-colors"
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label="Visual Studio Code editor (opens in a new tab)"
                    >
                      Visual Studio Code
                    </a>{" "}
                    by yours truly. Built with{" "}
                    <a
                      href="https://nextjs.org/"
                      className="font-medium text-neutral-light hover:text-tertiary-mid focus-visible:text-tertiary-mid transition-colors"
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label="Next.js React framework (opens in a new tab)"
                    >
                      Next.js
                    </a>{" "}
                    and{" "}
                    <a
                      href="https://tailwindcss.com/"
                      className="font-medium text-neutral-light hover:text-tertiary-mid focus-visible:text-tertiary-mid transition-colors"
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label="Tailwind CSS framework (opens in a new tab)"
                    >
                      Tailwind CSS
                    </a>
                    , deployed with{" "}
                    <a
                      href="https://vercel.com/"
                      className="font-medium text-neutral-light hover:text-tertiary-mid focus-visible:text-tertiary-mid transition-colors"
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label="Vercel hosting platform (opens in a new tab)"
                    >
                      Vercel
                    </a>
                    . All text is set in the{" "}
                    <a
                      href="https://rsms.me/inter/"
                      className="font-medium text-neutral-light hover:text-tertiary-mid focus-visible:text-tertiary-mid transition-colors"
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label="Inter typeface website (opens in a new tab)"
                    >
                      Inter
                    </a>{" "}
                    typeface.
                  </p>

                  <address className="mt-6 not-italic">
                    <a
                      href="mailto:you@example.com"
                      className="font-medium text-neutral-light hover:text-tertiary-mid focus-visible:text-tertiary-mid transition-colors"
                      aria-label="Send email to Gabriel Ferreira"
                    >
                      you@example.com
                    </a>
                  </address>
                </footer>
              </main>
            </div>
          </div>
        </article>
      </div>
    </>
  );
}