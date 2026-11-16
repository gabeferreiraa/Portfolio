import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { Block, StatRow, pad } from "../../components/CaseStudy";
import { External } from "../../components/External";
import { ThemeToggle } from "../../components/ThemeToggle";
import { caseStudies, site } from "../../content";

export const Route = createFileRoute("/case-study/$slug")({
  loader: ({ params }) => {
    const index = caseStudies.findIndex((c) => c.slug === params.slug);
    if (index === -1) throw notFound();
    return { index };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const c = caseStudies[loaderData.index];
    const title = `${c.title} case study — ${site.name}`;
    return {
      meta: [
        { title },
        { name: "description", content: `${c.tagline} ${c.overview}` },
        { property: "og:title", content: title },
        { property: "og:description", content: c.tagline },
        { property: "og:url", content: `${site.url}/case-study/${c.slug}` },
      ],
    };
  },
  component: CaseStudyPage,
});

function CaseStudyPage() {
  const { index } = Route.useLoaderData();
  const c = caseStudies[index];
  const next = caseStudies[(index + 1) % caseStudies.length];
  // Gaps still to fill are kept in content.ts but never rendered
  const outcome = c.outcome.filter((o) => !o.startsWith("TODO"));

  return (
    <>
      <a href="#content" className="skip-link">
        Skip to content
      </a>

      <div className="mx-auto max-w-[760px] px-5 pt-16 pb-12 sm:px-6 sm:pt-24">
        <header>
          <div className="flex items-center justify-between gap-4">
            <Link to="/case-study" className="tap-quiet group text-sm">
              <span aria-hidden="true" className="tap-arrow mr-1 inline-block">
                ←
              </span>
              Case studies
            </Link>
            <ThemeToggle />
          </div>

          <p className="mt-10 text-sm text-muted tabular-nums">
            Case study {pad(index + 1)} / {pad(caseStudies.length)}
          </p>
          <h1 className="mt-2 text-[2.25rem] leading-[1.1] font-medium tracking-tight sm:text-[3rem]">{c.title}</h1>
          <p className="mt-3 max-w-[34rem] text-[1.125rem] leading-snug text-muted sm:text-[1.25rem]">{c.tagline}</p>
          <p className="mt-5 text-sm">
            <External href={c.href}>Visit the live project</External>
          </p>
        </header>

        <main id="content" tabIndex={-1}>
          <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-line/40 pt-6 sm:grid-cols-4">
            {c.meta.map((m) => (
              <div key={m.label}>
                <dt className="text-sm text-muted">{m.label}</dt>
                <dd className="mt-0.5 text-[0.9375rem] leading-snug">{m.value}</dd>
              </div>
            ))}
          </dl>

          {c.cover && (
            <figure className="mt-10">
              <img
                src={c.cover.src}
                alt={c.cover.alt}
                width={c.cover.width}
                height={c.cover.height}
                className="h-auto w-full rounded-lg border border-line/40"
              />
            </figure>
          )}

          <section aria-label="Key numbers" className="mt-12">
            <StatRow stats={c.stats} />
          </section>

          <Block id="overview" index={1} title="Overview">
            <p>{c.overview}</p>
          </Block>

          <Block id="challenge" index={2} title="Challenge">
            <p>{c.challenge}</p>
          </Block>

          <Block id="approach" index={3} title="Approach">
            <ol className="space-y-6">
              {c.approach.map((step, i) => (
                <li key={step.title} className="grid grid-cols-[2rem_1fr] gap-x-2">
                  <span aria-hidden="true" className="pt-px text-sm text-muted tabular-nums">
                    {pad(i + 1)}
                  </span>
                  <div>
                    <h3 className="font-medium">{step.title}</h3>
                    <p className="mt-1 text-muted">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Block>

          {c.quote && (
            <figure className="mt-14 border-l-2 border-fg pl-5 sm:mt-16 sm:ml-[10.5rem]">
              <blockquote className="text-[1.125rem] leading-snug sm:text-[1.25rem]">“{c.quote.text}”</blockquote>
              <figcaption className="mt-3 text-sm text-muted">{c.quote.cite}</figcaption>
            </figure>
          )}

          {outcome.length > 0 && (
            <Block id="outcome" index={4} title="Outcome">
              <ul className="list-disc space-y-1.5 pl-5 marker:text-muted">
                {outcome.map((o) => (
                  <li key={o}>{o}</li>
                ))}
              </ul>
            </Block>
          )}
        </main>

        <nav aria-label="Next case study" className="mt-20 border-t border-line/40 pt-6">
          <p className="text-sm text-muted">Next case study</p>
          <Link to="/case-study/$slug" params={{ slug: next.slug }} className="link-plain group mt-1 inline-block">
            <span className="text-[1.5rem] leading-snug font-medium tracking-tight">{next.title}</span>
            <span aria-hidden="true" className="tap-arrow tap-arrow-right ml-2 inline-block text-[1.5rem] text-muted">
              →
            </span>
            <span className="block text-muted">{next.tagline}</span>
          </Link>
        </nav>

        <footer className="mt-16 text-sm text-muted">
          <p>{`© ${new Date().getFullYear()} ${site.name}`}</p>
        </footer>
      </div>
    </>
  );
}
