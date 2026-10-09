import type { ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ContactForm } from "../components/ContactForm";
import { ThemeToggle } from "../components/ThemeToggle";
import { experience, intro, profiles, projects, site } from "../content";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <>
      <a href="#content" className="skip-link">
        Skip to content
      </a>

      <div className="mx-auto max-w-[760px] px-5 pt-16 pb-12 sm:px-6 sm:pt-24 md:pt-32">
        <header>
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-[1.75rem] leading-tight font-medium tracking-tight sm:text-[2rem]">{site.name}</h1>
            <ThemeToggle />
          </div>
          <p className="mt-1 text-muted">{`${site.role} in ${site.location}`}</p>
        </header>

        <main id="content" tabIndex={-1}>
          <div className="mt-8 space-y-4">
            {intro.map((parts, i) => (
              <p key={i}>
                {parts.map((part, j) =>
                  typeof part === "string" ? (
                    part
                  ) : (
                    <External key={j} href={part.href}>
                      {part.label}
                    </External>
                  ),
                )}
              </p>
            ))}
          </div>

          <Section id="experience" title="Experience">
            <ul className="space-y-6">
              {experience.map((r) => (
                <li key={r.org}>
                  <h3 className="font-medium">
                    <External href={r.href}>{r.org}</External>
                  </h3>
                  <p className="text-sm text-muted">{r.role}</p>
                  {r.description && <p className="mt-1 text-muted">{r.description}</p>}
                </li>
              ))}
            </ul>
            <p className="mt-6">
              <External href={site.resume}>Full resume (PDF)</External>
            </p>
          </Section>

          <Section id="work" title="Selected Work">
            <ul className="space-y-6">
              {projects.map((p) => (
                <li key={p.title}>
                  <h3 className="font-medium">
                    {p.href ? <External href={p.href}>{p.title}</External> : p.title}
                  </h3>
                  <p className="text-muted">{p.description}</p>
                  <p className="mt-0.5 text-sm text-muted">{p.meta}</p>
                </li>
              ))}
            </ul>
          </Section>

          <Section id="contact" title="Contact">
            <p>
              Have a project in mind, or just want to say hello? Send me a message below, or find me on{" "}
              {profiles.map((p, i) => (
                <span key={p.href}>
                  {i > 0 && (i === profiles.length - 1 ? " and " : ", ")}
                  <External href={p.href}>{p.label}</External>
                </span>
              ))}
              .
            </p>
            <div className="mt-8">
              <ContactForm />
            </div>
          </Section>
        </main>

        <footer className="mt-20 text-sm text-muted">
          <p>{`© ${new Date().getFullYear()} ${site.name}`}</p>
        </footer>
      </div>
    </>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="mt-14 sm:mt-16">
      <h2 id={`${id}-heading`} className="mb-4 text-[1.0625rem] font-medium">
        {title}
      </h2>
      {children}
    </section>
  );
}

function External({ href, className, children }: { href: string; className?: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
      <span aria-hidden="true" className="ml-0.5 inline-block text-[0.85em] text-muted">
        ↗
      </span>
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
