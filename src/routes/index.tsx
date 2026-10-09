import { useEffect, useRef, type ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ContactForm } from "../components/ContactForm";
import { about, contact, employer, howIWork, nav, projects, site, socials } from "../content";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const rootRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  // Spotlight follows pointer (decorative)
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

  // Reveal animations — only when the user hasn't asked for reduced motion
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
          gsap.from(el, {
            y: 22,
            opacity: 0,
            filter: "blur(6px)",
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
          });
        });
        gsap.from("[data-card]", {
          y: 18,
          opacity: 0,
          duration: 0.7,
          ease: "power2.out",
          stagger: 0.08,
          scrollTrigger: { trigger: "[data-cards]", start: "top 80%", once: true },
        });
      });
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} className="group/spotlight relative">
      <a href="#content" className="skip-link">
        Skip to content
      </a>

      <div
        ref={spotlightRef}
        className="spotlight-bg pointer-events-none fixed inset-0 z-30 transition duration-300 lg:absolute"
        aria-hidden="true"
      />

      <div className="mx-auto min-h-screen max-w-screen-xl px-6 py-12 md:px-12 md:py-16 lg:py-0">
        <div className="lg:flex lg:justify-between lg:gap-4">
          <header className="lg:sticky lg:top-0 lg:flex lg:max-h-screen lg:w-[48%] lg:flex-col lg:justify-between lg:py-24">
            <div>
              <h1 className="text-4xl font-bold tracking-tight whitespace-nowrap text-neutral-white sm:text-5xl" data-reveal>
                {site.name}
              </h1>
              <p className="mt-3 text-lg font-medium tracking-tight text-neutral-white sm:text-xl" data-reveal>
                {site.role}
              </p>
              <p className="mt-4 max-w-xs leading-normal text-neutral-light" data-reveal>
                {site.tagline}
              </p>

              <nav className="hidden lg:block" aria-label="Sections" data-reveal>
                <ul className="mt-16 w-max">
                  {nav.map((x) => (
                    <li key={x.href}>
                      <a className="group flex items-center py-3 no-underline" href={x.href}>
                        <span
                          className="mr-4 h-px w-8 bg-neutral-mid/70 transition-all group-hover:w-16 group-hover:bg-neutral-white group-focus-visible:w-16 group-focus-visible:bg-neutral-white"
                          aria-hidden="true"
                        />
                        <span className="text-xs font-bold tracking-widest text-neutral-mid uppercase group-hover:text-neutral-white group-focus-visible:text-neutral-white">
                          {x.label}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            <ul className="mt-10 flex gap-5 text-sm" aria-label="Social media" data-reveal>
              {socials.map((s) => (
                <li key={s.href}>
                  <ExternalLink href={s.href} className="text-neutral-light no-underline hover:text-neutral-white">
                    {s.label}
                  </ExternalLink>
                </li>
              ))}
            </ul>
          </header>

          <main id="content" tabIndex={-1} className="pt-24 lg:w-[52%] lg:py-24">
            <Section id="about" title="About">
              <div className="space-y-4 text-neutral-light">
                <p data-reveal>{about.intro}</p>
                <p data-reveal>
                  {about.current}{" "}
                  <ExternalLink
                    href={employer.href}
                    className="font-medium text-neutral-white hover:text-tertiary-mid"
                  >
                    {employer.name}
                  </ExternalLink>
                  .
                </p>
                {about.rest.map((p) => (
                  <p key={p} data-reveal>
                    {p}
                  </p>
                ))}
              </div>
            </Section>

            <Section id="work" title="Selected Work">
              <ul className="grid grid-cols-1 gap-6" data-cards>
                {projects.map((p) => (
                  <li key={p.title} data-card>
                    <article className="group relative rounded-2xl border border-neutral-white/10 bg-neutral-white/5 p-6 transition-colors duration-200 hover:bg-neutral-white/10 focus-within:bg-neutral-white/10">
                      <div className="flex items-baseline justify-between gap-4">
                        <h3 className="text-xl font-medium text-neutral-white">
                          <ExternalLink href={p.href} className="no-underline after:absolute after:inset-0 after:rounded-2xl">
                            {p.title}
                          </ExternalLink>
                        </h3>
                        <span className="shrink-0 text-xs text-neutral-mid">{p.year}</span>
                      </div>
                      <p className="mt-1 text-xs tracking-wide text-tertiary-mid uppercase">{p.type}</p>

                      {p.image && (
                        <div className="mt-6 h-40 overflow-hidden rounded-xl bg-neutral-white/5">
                          <img
                            src={p.image}
                            alt={p.imageAlt ?? ""}
                            loading="lazy"
                            className="h-40 w-full object-cover object-top"
                          />
                        </div>
                      )}

                      <p className="mt-4 text-sm font-light text-neutral-light">{p.description}</p>

                      <ul className="mt-4 flex flex-wrap gap-2" aria-label="Tools used">
                        {p.tools.map((t) => (
                          <li
                            key={t}
                            className="rounded-full border border-neutral-white/10 bg-neutral-white/5 px-3 py-1 text-xs text-neutral-light"
                          >
                            {t}
                          </li>
                        ))}
                      </ul>
                    </article>
                  </li>
                ))}
              </ul>
            </Section>

            <Section id="how-i-work" title="How I Work">
              <div className="space-y-6 leading-7 font-light text-neutral-light">
                {howIWork.paragraphs.map((p) => (
                  <p key={p} data-reveal>
                    {p}
                  </p>
                ))}
              </div>

              <figure className="mt-10 rounded-2xl border border-neutral-white/10 bg-neutral-white/5 p-6" data-reveal>
                <blockquote className="text-sm font-light text-neutral-light">
                  <p>&ldquo;{howIWork.quote}&rdquo;</p>
                </blockquote>
                <figcaption className="sr-only">{site.name}</figcaption>
                <h3 className="mt-6 mb-3 text-xs font-bold tracking-widest text-neutral-mid uppercase">Focus areas</h3>
                <ul className="space-y-3">
                  {howIWork.focus.map((x) => (
                    <li
                      key={x}
                      className="rounded-xl border border-neutral-white/10 bg-neutral-white/5 px-4 py-3 text-neutral-white/90"
                    >
                      {x}
                    </li>
                  ))}
                </ul>
              </figure>
            </Section>

            <Section id="contact" title={contact.heading}>
              <p className="font-light text-neutral-light" data-reveal>
                {contact.blurb}
              </p>

              <ul className="mt-8 flex flex-wrap gap-3" aria-label="Contact links" data-reveal>
                <li>
                  <a href={`mailto:${site.email}`} className={pillClass}>
                    Email
                  </a>
                </li>
                {socials.map((s) => (
                  <li key={s.href}>
                    <ExternalLink href={s.href} className={pillClass}>
                      {s.label}
                    </ExternalLink>
                  </li>
                ))}
                <li>
                  <a href={site.resume} download="gabriel-ferreira-resume.pdf" className={pillClass}>
                    Resume <span className="sr-only">(PDF download)</span>
                  </a>
                </li>
              </ul>

              <div className="mt-12 rounded-2xl border border-neutral-white/10 bg-neutral-white/5 p-6 md:p-8">
                <ContactForm />
              </div>
            </Section>

            <footer className="pb-16 text-sm text-neutral-mid">
              <p>
                &copy; {new Date().getFullYear()} {site.name}
              </p>
            </footer>
          </main>
        </div>
      </div>
    </div>
  );
}

const pillClass =
  "inline-flex min-h-11 items-center rounded-md border border-neutral-white/10 bg-neutral-white/5 px-4 py-2 text-sm font-medium text-neutral-white no-underline transition hover:bg-neutral-white/10";

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  const headingId = `${id}-heading`;
  return (
    <section id={id} aria-labelledby={headingId} className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24">
      {/* Sticky label on mobile, regular heading on desktop */}
      <div className="sticky top-0 z-20 -mx-6 mb-6 bg-background/80 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:static lg:mx-0 lg:bg-transparent lg:px-0 lg:py-0 lg:backdrop-blur-none">
        <h2
          id={headingId}
          className="text-sm font-bold tracking-widest text-neutral-white uppercase lg:text-2xl lg:tracking-tight lg:normal-case"
        >
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

function ExternalLink({ href, className, children }: { href: string; className?: string; children: ReactNode }) {
  // Placeholder links ("#") stay in-tab until real URLs are added
  if (href === "#") {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }
  return (
    <a href={href} target="_blank" rel="noreferrer noopener" className={className}>
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
