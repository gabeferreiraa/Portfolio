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

// ---------- Case studies (/case-study) ----------
// Order here is the order on the index page. Anything marked TODO is a guess or a
// gap. Outcome lines that start with "TODO:" are hidden on the page until rewritten.

export type Stat = { value: string; label: string };

export type CaseStudy = {
  slug: string;
  title: string;
  // One line under the title
  tagline: string;
  href: string;
  // Served from /public. Omit for no cover.
  cover?: { src: string; alt: string; width: number; height: number };
  meta: { label: string; value: string }[];
  // Three reads best; the first is shown on the index card
  stats: Stat[];
  overview: string;
  challenge: string;
  approach: { title: string; body: string }[];
  outcome: string[];
  // Optional pull quote
  quote?: { text: string; cite: string };
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "outnabt",
    title: "Out&Abt",
    tagline: "A mobile app for finding the places worth going to, near you.",
    href: "https://www.outnabt.app/",
    cover: {
      src: "/images/outnabt-cover.png",
      alt: "The Out&Abt app icon beside an iPhone showing the launch screen, with the project team listed.",
      width: 1920,
      height: 1080,
    },
    meta: [
      { label: "Role", value: "Developer & data architect" },
      { label: "Timeline", value: "2025 – Current" },
      { label: "Team", value: "6 people: PMs, designers, researchers, developers" },
      { label: "Stack", value: "React Native, Expo, Figma" },
    ],
    stats: [
      // TODO: swap in real numbers, e.g. beta testers, spots listed, venues onboarded
      { value: "iOS beta", label: "Live on TestFlight, Android coming soon" },
      { value: "2", label: "Sides of the product: explorers and venues" },
      { value: "6", label: "Person senior-project team at Drexel" },
    ],
    overview:
      "Out&Abt helps people find restaurants, desserts, activities and spots worth going to nearby. It started as our senior-year project at Drexel, was designed in Figma, and now runs as a React Native app in public beta, starting in Philadelphia.",
    challenge:
      "Discovery apps tend to fall into two traps: endless lists of every place in a city, or review scores that all blur together around four stars. We wanted something that felt closer to a friend's recommendation, focused on the vibe of a place and what it's good for, and venues needed a reason to keep their own information accurate.",
    approach: [
      {
        title: "Research to tags",
        body: "Our designers and researchers interviewed people about how they actually choose where to go. Those findings became the tag system that sits at the center of the app: what a place is good for, not just what it serves.",
      },
      {
        title: "Data model first",
        // TODO: add a line on the backend (Supabase? Firebase?) and how tags are queried
        body: "As the data architect, I modeled spots, tags and venues so the same data drives both sides of the product: the explorer feed and the venue dashboard.",
      },
      {
        title: "Built for real phones",
        body: "I built the app in React Native with Expo, turning the Figma system into reusable components and shipping builds to testers through TestFlight so feedback came from real use, not prototypes.",
      },
      {
        title: "A side for venues",
        body: "Venues get their own partner portal and demo, where they can see how people find them and manage their tags. That gives them a reason to keep listings accurate.",
      },
    ],
    outcome: [
      "Shipped a working iOS beta to TestFlight, with Android next.",
      "Launched a venue partner portal and demo alongside the consumer app.",
      // TODO: add a measurable result: testers, retention, venues signed, feedback themes
      "TODO: one measurable result from the beta, such as testers, retention or venues signed.",
    ],
  },
  {
    slug: "mix-with-taner",
    title: "Mix with Taner",
    tagline: "A portfolio that lets a mix engineer's credits speak for themselves.",
    href: "https://www.tanerprestholdt.com/",
    meta: [
      { label: "Role", value: "Design & development, via Impossible Solutions" },
      { label: "Timeline", value: "2026" },
      { label: "Client", value: "Taner Prestholdt, mix engineer" },
      { label: "Stack", value: "TanStack Start, Sanity, Spotify API" },
    ],
    stats: [
      { value: "2.5M+", label: "Streams across the work on show" },
      { value: "73+", label: "Projects mixed, all managed in the CMS" },
      { value: "15+", label: "Editorial playlists on Apple Music and Spotify" },
    ],
    overview:
      "Taner Prestholdt is a mix engineer and producer working between Philadelphia and Los Angeles, trained at MilkBoy Studios. He needed a site that would turn a long list of credits into a reason for independent artists to book him.",
    challenge:
      "In music, the work is the pitch, but credits buried in a PDF or a social bio don't get played. The site had to put dozens of records in front of visitors, stay current without a developer every time a song is released, and still load fast on a phone.",
    approach: [
      {
        title: "Credits as the hero",
        body: "The homepage leads with headline numbers, then a Selected Work grid of about 50 records, each linked straight to Spotify so a visitor can go from browsing to listening in one tap.",
      },
      {
        title: "Spotify does the busywork",
        body: "Cover art and track data come from the Spotify API, so adding a release only takes a link. There's no artwork to export and no metadata to type.",
      },
      {
        title: "Content he owns",
        body: "Projects, stats, the about page and testimonials all live in Sanity, so Taner can update the site himself the day a record drops.",
      },
      {
        title: "Fast and accessible",
        body: "It's server-rendered with TanStack Start, with semantic markup, a skip link and keyboard-friendly navigation, because a portfolio that's hard to use reflects on the person behind it.",
      },
    ],
    outcome: [
      "One page now shows 73+ projects, 2.5M+ streams and 6+ years of experience.",
      "New releases go live from the CMS without any code changes.",
      // TODO: add a client result, e.g. inquiries per month or bookings since launch
      "TODO: a client result, such as inquiries or bookings since launch.",
    ],
    // TODO: add a quote from Taner about the site, if you have one:
    // quote: { text: "…", cite: "Taner Prestholdt, mix engineer" },
  },
  {
    slug: "remco-insurance",
    title: "Remco Insurance",
    tagline: "A commercial insurance site the team can run themselves.",
    href: "https://remcoinsuranceservices.com/",
    meta: [
      { label: "Role", value: "Frontend developer, at Impact Six" },
      { label: "Timeline", value: "2025 – 2026" },
      { label: "Client", value: "Remco Insurance Services, Southampton, PA" },
      { label: "Stack", value: "TanStack Start, Sanity" },
    ],
    stats: [
      { value: "3,000+", label: "Businesses insured by the agency" },
      { value: "40+", label: "States covered" },
      { value: "19", label: "Coverage pages, each built for search" },
    ],
    overview:
      "Remco is an independent commercial insurance agency, founded in 2008, that covers businesses in more than 40 states, from bars and restaurants to trucking fleets. Its website is how most new clients find it, through searches for a specific type of coverage.",
    challenge:
      "Every line of coverage, from cyber to liquor liability to workers' comp, needs its own page that ranks and explains it clearly to a business owner. On top of that, the team publishes a blog, a podcast and community news. All of it had to be editable by insurance people, not developers.",
    approach: [
      {
        title: "A headless CMS",
        body: "Every page, service and post is modeled in Sanity, so the team can add a coverage line or publish a podcast episode without filing a ticket.",
      },
      {
        title: "SEO in the content model",
        body: "Titles, descriptions and structured fields are part of each document, so search basics get filled in as content is written, not bolted on afterwards.",
      },
      {
        title: "One template, 19 coverages",
        body: "A single coverage template keeps every service page consistent and quick to scan, with a clear path to a quote and a same-day reply.",
      },
      {
        title: "Fast by default",
        body: "Server-rendered pages and responsive WebP images served from Sanity's CDN keep the site quick on the phones business owners browse from.",
      },
    ],
    outcome: [
      "The team manages its own pages, posts and SEO without a developer.",
      "19 coverage pages and the blog, podcast and community sections run on one content model.",
      // TODO: add a traffic or lead metric, e.g. organic traffic or quote requests
      "TODO: a traffic or lead metric, such as organic sessions or quote requests.",
    ],
  },
];
