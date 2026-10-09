// Single source of truth for site copy, links and metadata.
// Edit this file to update the site.

export const site = {
  name: "Gabriel Ferreira",
  role: "UX/UI Engineer",
  location: "Philadelphia, PA",
  // Production origin, no trailing slash. Used for canonical, og:url, JSON-LD.
  // robots.txt and sitemap.xml in /public hardcode this too — update them together.
  url: "https://gabrielferreira.org",
  title: "Gabriel Ferreira — UX/UI Engineer",
  description:
    "Gabriel Ferreira is a UX/UI engineer in Philadelphia and the founder of Impossible Solutions, a software studio building websites and mobile apps.",
  email: "gferreira0404@gmail.com",
  // Replace the file in /public/pdf (or change this path) to update the resume.
  resume: "/pdf/24_25_resume.pdf",
};

export const intro = [
  "I design and build web and mobile applications. I care most about the parts people actually feel — accessibility, clear hierarchy, and details that hold up under a close look — because the experience is what people take away from the work.",
];

export type Link = { label: string; href: string };

export const profiles: Link[] = [
  { label: "GitHub", href: "https://github.com/gabeferreiraa" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/gabriel-ferreira-544b95251/" },
];

export type Role = {
  role: string;
  org: string;
  href: string;
  description?: string;
};

// Most relevant first.
export const experience: Role[] = [
  {
    role: "Founder",
    org: "Impossible Solutions",
    href: "https://impossiblesolutions.studio",
    description:
      "A software studio founded at Drexel and rooted in Philadelphia. We design, build and ship websites, mobile apps and full-stack platforms for founders and product teams.",
  },
  {
    role: "Software Developer (part-time)",
    org: "Proconex",
    href: "https://www.proconexdirect.com",
  },
];

export type Project = {
  title: string;
  description: string;
  meta: string;
  // Leave undefined until there's a public URL — the title renders as plain text.
  href?: string;
};

// Ordered by significance.
export const projects: Project[] = [
  {
    title: "Moonrise",
    description:
      "An iOS meditation app made with five-time Grammy-winning artist Jeff Bhasker, pairing guided sessions and Dolby Atmos audio with real-time moon phase tracking.",
    meta: "iOS app · React Native, Expo, Firebase · 2025–2026",
    href: "https://moonrise-web.vercel.app/",
  },
  {
    title: "Agent 7",
    description:
      "A WWII documentary platform bringing untold stories to life through immersive multimedia.",
    // TODO: add year
    meta: "Website · Next.js, Mux, Supabase",
    // TODO: agent7film.com returns Vercel DEPLOYMENT_NOT_FOUND (checked 2026-10-09) — restore the link once it's live again
    // href: "https://agent7film.com/",
  },
  {
    title: "Mix with Taner",
    description:
      "A music portfolio showcasing 50+ projects and 2.5M+ streams, with Spotify integration and CMS-managed content.",
    meta: "Website · TanStack Start, Sanity, Spotify API · 2026",
    href: "https://www.tanerprestholdt.com/",
  },
  {
    title: "Remco Insurance",
    description:
      "A corporate website for an insurance provider, built on a headless CMS so the team can manage content and SEO themselves.",
    meta: "Website · TanStack Start, Sanity · 2025–2026",
    href: "https://remcoinsuranceservices.com/",
  },
  {
    title: "Drexel EGS",
    description: "A custom WordPress site for Drexel University's Entrepreneurial Game Studio.",
    meta: "Website · WordPress, Elementor · 2024",
    href: "https://egs.drexel.edu/",
  },
  {
    title: "Out&Abt",
    // TODO: replace with a one-sentence description of what the app does
    description: "A social mobile app, designed in Figma and built as my junior-year project.",
    meta: "Mobile app · React Native, Expo · 2025–2026",
  },
];
