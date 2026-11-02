// Single source of truth for site copy, links and metadata.
// Edit this file to update the site.

export const site = {
  name: "Gabriel Ferreira",
  role: "UI/UX Developer",
  location: "Philadelphia, PA",
  // Production origin, no trailing slash. Used for canonical, og:url, JSON-LD.
  // robots.txt and sitemap.xml in /public hardcode this too — update them together.
  url: "https://gabrielferreira.org",
  title: "Gabriel Ferreira — UI/UX Developer",
  description:
    "Gabriel Ferreira is a UI/UX developer in Philadelphia — a junior developer at Linque and the founder of Impossible Solutions, a software studio building websites and mobile apps.",
  email: "gferreira0404@gmail.com",
  phone: "(609) 351-7981",
  // E.164 form for the tel: link.
  phoneHref: "tel:+16093517981",
  // Replace the file in /public/pdf (or change this path) to update the resume.
  resume: "/pdf/Gabriel-Ferreira-Resume.pdf",
};

export type Link = { label: string; href: string };

// Each paragraph is a list of text and link segments.
export const intro: (string | Link)[][] = [
  [
    "I specialize in the development of web and mobile applications. I know what it takes to bring an idea to reality while prioritizing the user experience. Accessibility, clear hierarchy, and details that can't be missed are what make the difference.",
  ],
  [
    "Right now I'm a junior developer at ",
    { label: "Linque", href: "https://www.linque.com/" },
    " and the founder of ",
    {
      label: "Impossible Solutions",
      href: "https://impossiblesolutions.studio",
    },
    ", a software studio in Philadelphia.",
  ],
];

export const profiles: Link[] = [
  { label: "GitHub", href: "https://github.com/gabeferreiraa" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/gabriel-ferreira-544b95251/",
  },
];

export type Role = {
  role: string;
  // Current roles are listed as worksFor in the JSON-LD
  current?: boolean;
  org: string;
  href: string;
  description?: string;
};

// Most relevant first.
export const experience: Role[] = [
  {
    role: "Junior Developer · Current",
    current: true,
    org: "Linque",
    href: "https://www.linque.com/",
    description:
      "An industrial intelligence company connecting IT, OT and AI systems.",
  },
  {
    role: "Founder · Current",
    current: true,
    org: "Impossible Solutions",
    href: "https://impossiblesolutions.studio",
    description:
      "A software studio founded at Drexel and rooted in Philadelphia. We design, build and ship websites, mobile apps and full-stack platforms for founders and product teams.",
  },
  {
    role: "Co-op · 2025-2026",
    org: "Proconex",
    href: "https://www.proconexdirect.com",
    description:
      "A six-month co-op building software for the industrial automation and process control industry.",
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
    title: "Out&Abt",
    description:
      "A mobile app for finding restaurants, desserts, activities and spots worth going to near you. Designed in Figma and built as my Senior-year project.",
    meta: "Mobile app · React Native, Expo · 2025–Current",
    href: "https://www.outnabt.app/",
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
    title: "Moonrise",
    description:
      "An iOS meditation app made with five-time Grammy-winning artist Jeff Bhasker, pairing guided sessions and Dolby Atmos audio with real-time moon phase tracking.",
    meta: "iOS app · React Native, Expo, Firebase · 2025–2026",
    href: "https://moonrise-web.vercel.app/",
  },
  {
    title: "Drexel EGS",
    description:
      "A custom WordPress site for Drexel University's Entrepreneurial Game Studio.",
    meta: "Website · WordPress, Elementor · 2024",
    href: "https://egs.drexel.edu/",
  },
];

// HTML version of the resume at /resume. Keep in step with the PDF in /public/pdf.

// 1 Familiar · 2 Proficient · 3 Advanced · 4 Expert
export type Level = 1 | 2 | 3 | 4;
export const levelLabels: Record<Level, string> = {
  1: "Familiar",
  2: "Proficient",
  3: "Advanced",
  4: "Expert",
};

export type Skill = { name: string; level: Level };
export type SkillGroup = { title: string; skills: Skill[] };

// Strongest first within each group.
export const skills: SkillGroup[] = [
  {
    title: "Technologies",
    skills: [
      { name: "React", level: 3 },
      { name: "TypeScript", level: 3 },
      { name: "JavaScript", level: 3 },
      { name: "HTML5", level: 3 },
      { name: "CSS3", level: 3 },
      { name: "Tailwind", level: 3 },
      { name: "React Native", level: 3 },
      { name: "Next.js", level: 3 },
      { name: "REST APIs", level: 3 },
      { name: "C#", level: 2 },
      { name: ".NET MAUI", level: 2 },
      { name: "Storybook", level: 2 },
      { name: "Node", level: 2 },
      { name: "SASS", level: 2 },
      { name: "Supabase", level: 2 },
      { name: "Firebase", level: 2 },
      { name: "PostgreSQL", level: 2 },
      { name: "MySQL", level: 2 },
      { name: "SwiftUI", level: 1 },
      { name: "PHP", level: 1 },
    ],
  },
  {
    title: "Software",
    skills: [
      { name: "Figma", level: 3 },
      { name: "VS Code", level: 3 },
      { name: "Photoshop", level: 2 },
      { name: "Illustrator", level: 2 },
      { name: "Premiere Pro", level: 2 },
      { name: "After Effects", level: 1 },
      { name: "Canva", level: 2 },
    ],
  },
];

export const spokenLanguages = [
  { name: "English", level: "Fluent" },
  { name: "Portuguese", level: "Fluent" },
  { name: "Spanish", level: "Fluent" },
];

export type ResumeEntry = {
  title: string;
  org: string;
  location: string;
  dates: string;
  bullets: string[];
};

export const resumeExperience: ResumeEntry[] = [
  {
    title: "Software Developer - Intern",
    org: "Linque",
    location: "Royersford, PA",
    dates: "April 2025 – Current",
    bullets: [
      "Engineered a real-time output queue view in Mobius that surfaces each active device-fix task as it runs, giving plant operators live visibility into a process that previously had no feedback and reducing status-related support requests by 65%",
      "Designed and built Scheduled General Exports (Scheduled GenEx), letting non-technical users automate device data exports on custom recurring schedules, which replaced manual export pulls and saved customers ~10 hours per month",
      "Architected light/dark mode and a full UI overhaul in a customer-facing .NET MAUI app",
    ],
  },
  {
    title: "Software Engineer - Intern",
    org: "Proconex",
    location: "Royersford, PA",
    dates: "April 2025 – September 2025",
    bullets: [
      "Implemented dynamic dialogs to reduce repetitive code and streamline processes across the application, bringing total reusable dialogs to 40%",
      "Built and executed Selenium test suites and regression testing workflows to ensure stability and catch issues early, resulting in less QA testing by several hours",
      "Refactored a core search feature, reducing query wait times by up to 80% and significantly improving overall responsiveness",
    ],
  },
  {
    title: "Software Engineer - Frontend",
    org: "Impact Six, LLC",
    location: "Philadelphia, PA",
    dates: "February – Current",
    bullets: [
      "Developed interactive, reusable UI components using React and Storybook, improving user experience, accessibility, and design consistency across applications.",
      "Integrated front-end with backend APIs (Laravel, Next.js) using TypeScript, enhancing data flow efficiency and improving overall application performance by 85%.",
      "Optimized state management using React App Providers, facilitating seamless feature integration and improving application scalability.",
      "Contributed to project stability through Git version control, managing pull requests, branch workflows, and resolving merge conflicts to maintain code integrity.",
    ],
  },
];

export const education = {
  school: "Drexel University",
  degree: "BS in User Experience & Interaction Design",
  location: "Philadelphia, PA",
  dates: "Anticipated Graduation: June 2027",
};

export const resumeProjects: ResumeEntry[] = [
  {
    title: "Moonrise - iOS Meditation App",
    org: "Freelance Mobile Developer for Jeff Bhasker",
    location: "Philadelphia, PA",
    dates: "October 2025 – February 2026",
    bullets: [
      "Shipped a React Native (Expo) meditation app to the App Store via TestFlight and EAS deployments",
      "Built a native Swift/WidgetKit widget with live moon phases, plus Supabase chat and push alerts",
    ],
  },
];
