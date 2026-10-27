// Copy and settings for /tap — the page my NFC sticker opens.
// The sticker always points to the same URL; what the page says is decided here.

import { projects, site, type Project } from "../content";

// ---------------------------------------------------------------------------
// Headline options. The first line renders in full contrast, the rest muted.
// ---------------------------------------------------------------------------

export const intros = {
  A: {
    headline: ["Nice to meet you.", "You've already experienced my work."],
    supporting:
      "I build technology that doesn't just work. I believe the smallest interactions can leave the biggest impressions.",
  },
  B: {
    headline: ["That wasn't just a tap.", "That was intentional."],
    supporting:
      "I build technology that doesn't just work. I believe the smallest interactions can leave the biggest impressions.",
  },
  C: {
    headline: ["You just experienced", "my approach to design."],
    supporting:
      "I build technology that doesn't just work. I believe the smallest interactions can leave the biggest impressions.",
  },
} satisfies Record<string, { headline: string[]; supporting: string }>;

export type IntroId = keyof typeof intros;

// Shown under my name in every mode.
export const profile = {
  name: site.name,
  positioning: "Developer · UX & Interaction Design",
  school: "Drexel University",
  // Shown as "Graduating …"; after it passes, change the wording in routes/tap.tsx and tap/vcard.ts
  graduation: "June 2027",
};

// ---------------------------------------------------------------------------
// Modes: one per audience. To add one (e.g. "comcast"), copy `general`,
// change what you need, and point ACTIVE_MODE at it. A mode change ships with
// a deploy, so it never swaps content under someone who already has the page open.
// ---------------------------------------------------------------------------

export type Mode = {
  intro: IntroId;
  // Replaces the intro's supporting copy for this audience
  supporting?: string;
  // Project titles from src/content.ts, in display order
  featured: string[];
  cta: {
    work: string;
    resume: string;
    connect: string;
  };
};

export const modes = {
  general: {
    intro: "A",
    featured: ["Out&Abt", "Moonrise", "Mix with Taner", "Remco Insurance"],
    cta: {
      work: "Explore my work",
      resume: "View my resume",
      connect: "Let's connect",
    },
  },
} satisfies Record<string, Mode>;

export type ModeId = keyof typeof modes;

export const ACTIVE_MODE: ModeId = "general";

// Speed of the opening handshake: 1 is the designed ~1.4s connection
// (~2.35s until everything has settled). 1.25 is 25% slower, 0.8 faster.
export const introTempo = 1;

// "Why the NFC?" disclosure
export const whyNfc = [
  "Because I believe even something as ordinary as exchanging a resume deserves thoughtful interaction design.",
  "Paper resumes end up in a stack. A tap opens this page instead, and that's how I like to work: notice an everyday moment, then design and build something better for it.",
];

// Served by src/routes/gabriel-ferreira[.]vcf.ts
export const vcardHref = "/gabriel-ferreira.vcf";

// ---------------------------------------------------------------------------

function resolve(id: ModeId) {
  const mode: Mode = modes[id];
  const intro = intros[mode.intro];
  const featured = mode.featured.map((title) => {
    const project = projects.find((p) => p.title === title);
    // Fails the build rather than silently dropping a project after a rename
    if (!project) throw new Error(`tap: no project titled "${title}" in src/content.ts`);
    return project;
  });
  return {
    headline: intro.headline,
    supporting: mode.supporting ?? intro.supporting,
    featured: featured satisfies Project[],
    cta: mode.cta,
  };
}

export const tapPage = resolve(ACTIVE_MODE);
