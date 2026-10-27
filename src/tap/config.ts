// Copy and settings for /tap — the page my NFC sticker opens.
// The sticker always points to the same URL; what the page says is decided here.

import { site } from "../content";

// ---------------------------------------------------------------------------
// Headline options. The first line renders in full contrast, the rest muted.
// ---------------------------------------------------------------------------

export const intros = {
  A: ["Nice to meet you.", "You've already experienced my work."],
  B: ["That wasn't just a tap.", "That was intentional."],
  C: ["You just experienced", "my approach to design."],
} satisfies Record<string, string[]>;

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
  cta: {
    work: string;
    resume: string;
    contact: string;
  };
};

export const modes = {
  general: {
    intro: "A",
    cta: {
      work: "Explore my work",
      resume: "View my resume",
      contact: "Save my contact",
    },
  },
} satisfies Record<string, Mode>;

export type ModeId = keyof typeof modes;

export const ACTIVE_MODE: ModeId = "general";

// Speed of the opening handshake: 1 is the designed ~2.2s sequence.
// 1.2 is 20% slower, 0.85 faster.
export const introTempo = 1;

// Served by src/routes/gabriel-ferreira[.]vcf.ts
export const vcardHref = "/gabriel-ferreira.vcf";

const mode: Mode = modes[ACTIVE_MODE];

export const tapPage = {
  headline: intros[mode.intro],
  cta: mode.cta,
};
