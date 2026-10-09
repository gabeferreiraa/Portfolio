// Single source of truth for site copy and links.

export const site = {
  name: "Gabriel Ferreira",
  role: "UX/UI Engineer",
  tagline: "I bring your idea to life, and opportunity keeps you growing beyond delivery",
  description:
    "Gabriel Ferreira is a UX/UI engineer in Philadelphia building accessible, meticulous web and mobile applications.",
  email: "gferreira0404@gmail.com",
  // TODO: swap in the current resume PDF (keep the same path or update here)
  resume: "/pdf/24_25_resume.pdf",
};

export const socials = [
  { label: "GitHub", href: "https://github.com/gabeferreiraa" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/gabriel-ferreira-544b95251/" },
];

export const nav = [
  { href: "#about", label: "About" },
  { href: "#work", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

export const employer = {
  name: "Proconex",
  href: "https://www.proconexdirect.com",
};

export const about = {
  intro:
    "I'm a UI/UX engineer who is driven to deliver accessible, unique, and meticulous applications. I specialize in web-accessibility, design, development and optimization of applications.",
  // Rendered with a link to `employer`
  current: "Currently I'm based in Philadelphia, PA where I work as a part-time Software Developer @",
  rest: [
    "Throughout my time as a developer I've been able to develop software across different applications, whether it was trouble shooting or starting from zero, there was always an opportunity for success.",
    "If you have any questions please reach out, and I'll respond as soon as I'm available!",
  ],
};

export type Project = {
  title: string;
  type: string;
  tools: string[];
  year: string;
  description: string;
  image?: string;
  imageAlt?: string;
  href: string;
};

// TODO: replace "#" hrefs with real project links
export const projects: Project[] = [
  {
    title: "Moonrise Meditation",
    type: "Mobile App, Creative",
    tools: ["TypeScript", "React Native", "Expo Go", "Dolby Atmos Audio"],
    year: "2025",
    description:
      "Curated a mobile app with 5 time grammy winning artist Jeff Bhasker to create a meditative experience",
    href: "#",
  },
  {
    title: "Out&Abt",
    type: "Mobile App, Social",
    tools: ["React Native", "Expo Go", "Figma"],
    year: "2025–2026",
    description: "Junior project",
    image: "/images/outnabt-cover.png",
    imageAlt: "Out&Abt app cover",
    href: "#",
  },
  {
    title: "Impossible Solutions",
    type: "Website, Business",
    tools: ["Next.js", "React", "Tailwind"],
    year: "2026",
    description: "Custom website for a new tech startup",
    href: "#",
  },
  {
    title: "Drexel EGS",
    type: "Website, Academic",
    tools: ["WordPress", "Elementor"],
    year: "2024",
    description:
      "Custom wordpress website for Drexel University's Entrepreneurial Gaming Studio",
    image: "/images/egs-hero.png",
    imageAlt: "Drexel EGS website hero",
    href: "#",
  },
];

export const howIWork = {
  paragraphs: [
    "I like building interfaces that feel quiet and intentional — clean hierarchy, smooth motion, and just enough personality to be memorable.",
    "The experience should be the most important thing the user takes away from my work.",
    "I'm very open and prefer to call clients instead of messaging, in the calls we can bounce ideas back and forth to find the perfect opportunity for you.",
  ],
  quote: "Opportunity keeps you growing beyond delivery.",
  focus: ["Design systems", "Motion & micro-interactions", "Accessible UI", "Performance + polish"],
};

export const contact = {
  heading: "Let's Build Something",
  blurb:
    "Feel free to reach out to me via email, linkedin, or github, or take a look at my resume below.",
};
