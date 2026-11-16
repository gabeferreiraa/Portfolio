import type { ReactNode } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ContactForm } from "../components/ContactForm";
import { DayCountdown } from "../components/DayCountdown";
import { External } from "../components/External";
import { AsciiField } from "../components/AsciiField";
import { Intro } from "../components/Intro";
import { Scramble } from "../components/Scramble";
import { ThemeToggle } from "../components/ThemeToggle";
import { experience, profiles, projects, site } from "../content";

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
        {/* isolate: the field's -z-10 stays inside the header, above the page background */}
        <header className="relative isolate">
          {/* Reaches up into the top padding; never extends below the header into body text */}
          <AsciiField className="absolute inset-x-0 -top-16 bottom-0 -z-10 sm:-top-24 md:-top-32" />
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-[1.75rem] leading-tight font-medium tracking-tight sm:text-[2rem]">{site.name}</h1>
            <ThemeToggle />
          </div>
          <p className="mt-1 text-muted">{`${site.role} in ${site.location}`}</p>
        </header>

        <main id="content" tabIndex={-1}>
          <Intro className="mt-8 space-y-4" />

          <Section id="experience" title="Experience">
            <ul className="space-y-6">
              {experience.map((r) => (
                <li key={r.org}>
                  <h3 className="font-medium">
                    <External href={r.href}>
                      <Scramble text={r.org} />
                    </External>
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
                    {p.href ? (
                      <External href={p.href}>
                        <Scramble text={p.title} />
                      </External>
                    ) : (
                      <Scramble text={p.title} />
                    )}
                  </h3>
                  <p className="text-muted">{p.description}</p>
                  <p className="mt-0.5 text-sm text-muted">{p.meta}</p>
                </li>
              ))}
            </ul>
            <p className="mt-6">
              <Link to="/case-study">Read the case studies</Link>
            </p>
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

        <footer className="mt-20 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
          <p>{`© ${new Date().getFullYear()} ${site.name}`}</p>
          <a href={`mailto:${site.email}`}>{site.email}</a>
          <a href={site.phoneHref}>{site.phone}</a>
          <DayCountdown className="basis-full" />
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
