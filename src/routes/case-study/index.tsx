import { Link, createFileRoute } from "@tanstack/react-router";
import { StatRow, pad } from "../../components/CaseStudy";
import { ThemeToggle } from "../../components/ThemeToggle";
import { caseStudies, site } from "../../content";

const title = `Case Studies — ${site.name}`;
const description = `How ${site.name} designed and built ${caseStudies.map((c) => c.title).join(", ")}: the problem, the process and the numbers.`;

export const Route = createFileRoute("/case-study/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: `${site.url}/case-study` },
    ],
  }),
  component: CaseStudyIndex,
});

function CaseStudyIndex() {
  return (
    <>
      <a href="#content" className="skip-link">
        Skip to content
      </a>

      <div className="mx-auto max-w-[760px] px-5 pt-16 pb-12 sm:px-6 sm:pt-24">
        <header>
          <div className="flex items-center justify-between gap-4">
            <Link to="/" className="tap-quiet group text-sm">
              <span aria-hidden="true" className="tap-arrow mr-1 inline-block">
                ←
              </span>
              {site.name}
            </Link>
            <ThemeToggle />
          </div>
          <h1 className="mt-10 text-[1.75rem] leading-tight font-medium tracking-tight sm:text-[2rem]">Case Studies</h1>
          <p className="mt-3 max-w-[34rem] text-muted">
            A closer look at three projects: what the problem was, how I approached it, and what changed once it
            shipped.
          </p>
        </header>

        <main id="content" tabIndex={-1} className="mt-12">
          <ol className="border-b border-line/40">
            {caseStudies.map((c, i) => (
              <li key={c.slug} className="group relative border-t border-line/40 py-8 sm:grid sm:grid-cols-[3rem_1fr]">
                <p aria-hidden="true" className="text-sm text-muted tabular-nums sm:pt-1.5">
                  {pad(i + 1)}
                </p>
                <div>
                  <h2 className="text-[1.375rem] leading-snug font-medium tracking-tight">
                    {/* The ::after stretches the link over the whole row */}
                    <Link
                      to="/case-study/$slug"
                      params={{ slug: c.slug }}
                      className="link-plain after:absolute after:inset-0 after:content-['']"
                    >
                      {c.title}
                      <span aria-hidden="true" className="tap-arrow tap-arrow-right ml-2 inline-block text-muted">
                        →
                      </span>
                    </Link>
                  </h2>
                  <p className="mt-1 text-muted">{c.tagline}</p>
                  <p className="mt-1 text-sm text-muted">
                    {c.meta.find((m) => m.label === "Timeline")?.value} ·{" "}
                    {c.meta.find((m) => m.label === "Stack")?.value}
                  </p>
                  <div className="mt-5">
                    <StatRow stats={c.stats} size="sm" />
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </main>

        <footer className="mt-20 text-sm text-muted">
          <p>{`© ${new Date().getFullYear()} ${site.name}`}</p>
        </footer>
      </div>
    </>
  );
}
