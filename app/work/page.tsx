"use client";

// @ts-expect-error -- splide types don't resolve under package.json "exports"
import { Splide, SplideSlide, SplideTrack } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import Link from "next/link";

const projects = [
  {
    title: "Moonrise Meditation",
    type: "Mobile App, Creative",
    tools: "Typescript, React Native, Expo Go",
    year: "2025",
    description:
      "Curated a mobile app with 5 time grammy winning artist Jeff Bhasker to create a meditative experience",
    slides: [] as { src: string; alt: string }[],
    repoLink: "",
    liveLink: "",
  },
  {
    title: "Out&Abt",
    type: "Mobile App, Social",
    tools: "Expo Go, React Native, Figma",
    year: "2025-2026",
    description: "Junior project",
    slides: [{ src: "/images/outnabt-cover.png", alt: "Out&Abt app cover" }],
    repoLink: "https://github.com/gabeferreiraa/nextjs-portfolio",
    liveLink: "https://portfolio-psi-virid-27.vercel.app",
  },
  {
    title: "Impossible Solutions",
    type: "Website, Business",
    tools: "NextJS, React, Tailwind",
    year: "2026",
    description: "Custom website for a new tech startup",
    slides: [] as { src: string; alt: string }[],
    repoLink: "",
    liveLink: "",
  },
  {
    title: "Drexel EGS",
    type: "Website, Academic",
    tools: "Wordpress, Elementor",
    year: "2024",
    description:
      "Custom wordpress website for Drexel University's Entrepreneurial Gaming Studio",
    slides: [{ src: "/images/egs-hero.png", alt: "Drexel EGS hero" }],
    repoLink: "",
    liveLink: "",
  },
];

const splideOptions = {
  type: "loop" as const,
  focus: "center" as const,
  padding: { left: "20rem", right: "20rem" },
  gap: "2rem",
  height: "26rem",
  autoplay: true,
  pauseOnHover: true,
  pagination: false,
  arrows: false,
  breakpoints: {
    640: {
      height: "18rem",
      padding: { left: "0", right: "0" },
    },
  },
};

export default function WorkPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <section className="w-full min-h-[60vh] flex flex-col justify-center px-8 md:px-16 lg:px-24 py-24">
        <Link
          href="/"
          className="text-sm font-medium tracking-widest uppercase text-neutral-mid hover:text-neutral-white transition-colors duration-300 mb-12 w-fit"
        >
          &larr; Back
        </Link>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-white leading-tight">
          Selected Work
        </h1>
        <p className="mt-4 text-neutral-light font-light max-w-lg">
          A collection of projects I&apos;ve worked on — scroll through each to
          explore.
        </p>
      </section>

      {/* Project sections */}
      <section className="bg-background w-full">
        {projects.map((project) => (
          <div key={project.title} id={project.title.toLowerCase().replace(/[&\s]+/g, "-")} className="my-20 mx-auto scroll-mt-16">
            <Splide
              options={splideOptions}
              aria-labelledby={`project-${project.title}`}
              hasTrack={false}
            >
              <h2 className="text-tertiary-mid font-extrabold text-3xl md:text-4xl  uppercase mx-auto my-4 w-3/4">
                {project.title}
              </h2>

              <SplideTrack className="cursor-grab">
                {project.slides.length > 0 ? (
                  project.slides.map((slide) => (
                    <SplideSlide key={slide.src}>
                      <img
                        src={slide.src}
                        alt={slide.alt}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </SplideSlide>
                  ))
                ) : (
                  <SplideSlide>
                    <div className="w-full h-full rounded-lg bg-neutral-white/5 border border-neutral-white/10 flex items-center justify-center">
                      <span className="text-neutral-mid text-sm tracking-widest uppercase">
                        Images coming soon
                      </span>
                    </div>
                  </SplideSlide>
                )}
              </SplideTrack>

              <div className="flex flex-col font-bold justify-between mx-auto w-3/4 mt-8 sm:mt-4 sm:flex-row sm:font-normal">
                <div className="flex flex-col text-neutral-white leading-6 tracking-wide uppercase text-2xl sm:text-sm sm:font-thin">
                  <p className="text-xs">
                    <span className="font-medium text-sm text-tertiary-mid">Type </span>
                    {project.type}
                  </p>
                  <p className="text-xs">
                    <span className="font-medium text-sm text-tertiary-mid">Tools </span>
                    {project.tools}
                  </p>
                  <p className="text-xs">
                    <span className="font-medium text-sm text-tertiary-mid">Year </span>
                    {project.year}
                  </p>
                  {project.repoLink && (
                    <Link
                      href={project.repoLink}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="text-sm font-medium text-neutral-white mt-1 hover:text-tertiary-mid"
                    >
                      Repo link
                    </Link>
                  )}
                  {project.liveLink && (
                    <Link
                      href={project.liveLink}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="font-bold text-tertiary-mid underline mt-4 hover:text-neutral-white"
                    >
                      Live link
                    </Link>
                  )}
                </div>
                <div className="mt-8 sm:mt-0 max-w-[700px]">
                  <p className="text-neutral-light font-light tracking-wide text-xl leading-8 sm:text-base sm:leading-7">
                    {project.description}
                  </p>
                </div>
              </div>
            </Splide>
          </div>
        ))}
      </section>
    </div>
  );
}
