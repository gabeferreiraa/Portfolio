import type { ReactNode } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { External } from "../components/External";
import { Intro } from "../components/Intro";
import { ThemeToggle } from "../components/ThemeToggle";
import {
  education,
  levelLabels,
  resumeExperience,
  resumeProjects,
  site,
  skills,
  spokenLanguages,
  type Level,
  type ResumeEntry,
} from "../content";

const title = `Resume — ${site.name}`;

export const Route = createFileRoute("/resume")({
  head: () => ({
    meta: [
      { title },
      // Shared by link only; the PDF stays the public resume
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ResumePage,
});

const levels = Object.keys(levelLabels).map(Number) as Level[];

function ResumePage() {
  return (
    <>
      <a href="#content" className="skip-link">
        Skip to content
      </a>

      <div className="mx-auto max-w-[760px] px-5 pt-16 pb-12 sm:px-6 sm:pt-24">
        <header>
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-[1.75rem] leading-tight font-medium tracking-tight sm:text-[2rem]">{site.name}</h1>
            <ThemeToggle />
          </div>
          <p className="mt-1 text-muted">{`${site.role} in ${site.location}`}</p>
          <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
            <a href={`mailto:${site.email}`}>{site.email}</a>
            <a href={site.phoneHref}>{site.phone}</a>
            <Link to="/">gabrielferreira.org</Link>
            <External href={site.resume}>PDF</External>
          </p>
        </header>

        <main id="content" tabIndex={-1}>
          <Intro className="mt-8 space-y-4" />

          <Section id="experience" title="Work Experience">
            <Entries entries={resumeExperience} />
          </Section>

          <Section id="skills" title="Skills">
            <p className="text-sm text-muted">
              Proficiency: {levels.map((l) => `${l} ${levelLabels[l]}`).join(" · ")}
            </p>
            {skills.map((group) => (
              <div key={group.title} className="mt-6">
                <h3 className="font-medium">{group.title}</h3>
                <ul className="mt-2 grid gap-x-10 sm:grid-cols-2">
                  {group.skills.map((s) => (
                    <li key={s.name} className="flex items-center justify-between gap-4 border-b border-line/40 py-1.5">
                      <span>{s.name}</span>
                      <span className="flex items-center gap-3">
                        <span className="text-sm text-muted">{levelLabels[s.level]}</span>
                        <Meter level={s.level} />
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="mt-6">
              <h3 className="font-medium">Languages</h3>
              <ul className="mt-2 grid gap-x-10 sm:grid-cols-2">
                {spokenLanguages.map((l) => (
                  <li key={l.name} className="flex items-center justify-between gap-4 border-b border-line/40 py-1.5">
                    <span>{l.name}</span>
                    <span className="text-sm text-muted">{l.level}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Section>

          <Section id="education" title="Education">
            <EntryHeading
              title={education.school}
              org={education.degree}
              location={education.location}
              dates={education.dates}
            />
          </Section>

          <Section id="projects" title="Projects">
            <Entries entries={resumeProjects} />
          </Section>
        </main>

        <footer className="mt-20 text-sm text-muted">
          <p>{`© ${new Date().getFullYear()} ${site.name}`}</p>
        </footer>
      </div>
    </>
  );
}

// Filled segments out of the full scale; the text label beside it carries the meaning
function Meter({ level }: { level: Level }) {
  return (
    <span aria-hidden="true" className="flex gap-1">
      {levels.map((l) => (
        <span key={l} className={`h-1.5 w-4 rounded-full ${l <= level ? "bg-fg" : "bg-line/50"}`} />
      ))}
    </span>
  );
}

function Entries({ entries }: { entries: ResumeEntry[] }) {
  return (
    <ul className="space-y-8">
      {entries.map((e) => (
        <li key={`${e.org}-${e.title}`}>
          <EntryHeading {...e} />
          <ul className="mt-2 list-disc space-y-1.5 pl-5 marker:text-muted">
            {e.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}

function EntryHeading({ title, org, location, dates }: Omit<ResumeEntry, "bullets">) {
  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4">
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-muted">{location}</p>
      </div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4">
        <p className="text-muted">{org}</p>
        <p className="text-sm text-muted">{dates}</p>
      </div>
    </div>
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
