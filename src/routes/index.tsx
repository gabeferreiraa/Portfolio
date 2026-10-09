import type { ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ContactForm } from "../components/ContactForm";
import { company, experience, intro, profiles, projects, site } from "../content";

export const Route = createFileRoute("/")({
  component: Home,
});

const hasCompany = Boolean(company.name && company.url);

function Home() {
  return (
    <>
      <a href="#content" className="skip-link">
        Skip to content
      </a>

      <div className="mx-auto max-w-[680px] px-5 pt-16 pb-12 sm:px-6 sm:pt-24 md:pt-32">
        <header>
          <h1 className="text-[1.75rem] leading-tight font-medium tracking-tight sm:text-[2rem]">{site.name}</h1>
          <p className="mt-1 text-muted">{`${site.role} in ${site.location}`}</p>
        </header>

        <main id="content" tabIndex={-1}>
          <div className="mt-8 space-y-4">
            {intro.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>

          <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-1" aria-label="Links">
            <li>
              <External href={site.resume} className="inline-block py-1">
                Resume
              </External>
            </li>
            {profiles.map((p) => (
              <li key={p.href}>
                <External href={p.href} className="inline-block py-1">
                  {p.label}
                </External>
              </li>
            ))}
            <li>
              <a href={`mailto:${site.email}`} className="inline-block py-1">
                Email
              </a>
            </li>
          </ul>

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

          {hasCompany && (
            <Section id="professional-work" title="Professional Work">
              <p>
                {company.relationship && <>{company.relationship} </>}
                <External href={company.url} className="font-medium">
                  {company.name}
                </External>
                {company.description && <>. {company.description}</>}
              </p>
            </Section>
          )}

          <Section id="experience" title="Experience">
            <p>
              Currently a {experience.current.role.toLowerCase()} at{" "}
              <External href={experience.current.href}>{experience.current.org}</External>.
            </p>
            <p className="mt-2 text-muted">
              The full picture is in my <External href={site.resume}>resume (PDF)</External>.
            </p>
          </Section>

          <Section id="contact" title="Contact">
            <p>
              The best way to reach me is by email at <a href={`mailto:${site.email}`}>{site.email}</a>, or on{" "}
              {profiles.map((p, i) => (
                <span key={p.href}>
                  {i > 0 && (i === profiles.length - 1 ? " or " : ", ")}
                  <External href={p.href}>{p.label}</External>
                </span>
              ))}
              . You can also send a message here:
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
