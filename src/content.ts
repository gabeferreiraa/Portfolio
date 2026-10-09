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
    "Gabriel Ferreira is a UX/UI engineer in Philadelphia who designs and builds accessible web and mobile applications.",
  email: "gferreira0404@gmail.com",
  // Replace the file in /public/pdf (or change this path) to update the resume.
  resume: "/pdf/24_25_resume.pdf",
};

export const intro = [
  "I design and build web and mobile applications, and I care most about the parts people actually feel — accessibility, clear hierarchy, and details that hold up under a close look.",
  "I'd rather talk an idea through on a call than trade messages, and I think the experience is the most important thing anyone takes away from my work.",
];

export type Link = { label: string; href: string };

export const profiles: Link[] = [
  { label: "GitHub", href: "https://github.com/gabeferreiraa" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/gabriel-ferreira-544b95251/" },
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
    title: "Moonrise Meditation",
    description:
      "A meditation app made with five-time Grammy-winning artist Jeff Bhasker, built around immersive Dolby Atmos audio.",
    meta: "Mobile app · React Native, Expo · 2025",
  },
  {
    title: "Impossible Solutions",
    description: "A custom website for a new tech startup.",
    meta: "Website · Next.js, React, Tailwind · 2026",
  },
  {
    title: "Out&Abt",
    // TODO: replace with a one-sentence description of what the app does
    description: "A social mobile app, designed in Figma and built as my junior-year project.",
    meta: "Mobile app · React Native, Expo · 2025–2026",
  },
  {
    title: "Drexel EGS",
    description: "A custom WordPress site for Drexel University's Entrepreneurial Gaming Studio.",
    meta: "Website · WordPress, Elementor · 2024",
  },
];

// TODO: fill in to show the Professional Work section (hidden while name/url are empty).
export const company = {
  name: "",
  url: "",
  description: "",
  relationship: "",
};

export const experience = {
  current: {
    role: "Software Developer (part-time)",
    org: "Proconex",
    href: "https://www.proconexdirect.com",
  },
};
