import { useEffect, useRef, useState, type ReactNode } from "react";
import { DAY, DayCountdown, msUntilMidnight } from "../DayCountdown";
import { Scramble } from "../Scramble";

export const uiDetails = {
  id: "ui",
  name: "UI details",
  caption:
    "Small DOM touches for links, the footer, dividers and form states. Plain text updates, no canvas: effectively free.",
};

const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

function Demo({ title, note, children }: { title: string; note: string; children: ReactNode }) {
  return (
    <section className="border-t border-line pt-4 first:border-t-0 first:pt-0">
      <h3 className="text-sm font-medium">{title}</h3>
      <p className="text-sm text-muted">{note}</p>
      <div className="mt-3">{children}</div>
    </section>
  );
}

// ---------- day bars ----------

const CELLS = 20;
const barStyles: { label: string; render: (p: number) => string }[] = [
  { label: "Blocks (live)", render: (p) => `[${"█".repeat(p)}${"░".repeat(CELLS - p)}]` },
  { label: "Hash", render: (p) => `[${"#".repeat(p)}${".".repeat(CELLS - p)}]` },
  { label: "Arrow", render: (p) => `|${"=".repeat(Math.max(0, p - 1))}${p ? ">" : ""}${" ".repeat(CELLS - p)}|` },
  { label: "Shade", render: (p) => `▕${"▓".repeat(p)}${"░".repeat(CELLS - p)}▏` },
];

function DayBars() {
  // Same pattern as DayCountdown: unknown during SSR, filled in after mount
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => {
    setLeft(msUntilMidnight());
    const id = setInterval(() => setLeft(msUntilMidnight()), 1000);
    return () => clearInterval(id);
  }, []);
  const p = Math.min(CELLS, Math.max(0, Math.round((1 - (left ?? DAY) / DAY) * CELLS)));
  return (
    <div className="space-y-3">
      <DayCountdown className="text-sm text-muted" />
      <ul className="grid gap-1 font-mono text-[0.8125rem]" style={left === null ? { visibility: "hidden" } : undefined}>
        {barStyles.map((s) => (
          <li key={s.label} className="flex flex-wrap items-baseline gap-x-3">
            <span aria-hidden="true" className="tracking-tight whitespace-pre">
              {s.render(p)}
            </span>
            <span className="font-sans text-xs text-muted">{s.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ---------- wave divider ----------

const WAVE = "_.-~^~-.";
const WAVE_CHARS = 140; // overflows and is clipped, so the width never depends on the text

function waveLine(t: number) {
  let s = "";
  for (let x = 0; x < WAVE_CHARS; x++) {
    const n = (Math.sin(x * 0.32 - t * 3) + Math.sin(x * 0.11 + t * 1.3)) / 4 + 0.5;
    s += WAVE[Math.min(WAVE.length - 1, Math.floor(n * WAVE.length))];
  }
  return s;
}

function WaveDivider() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion()) return;
    let raf = 0;
    let last = 0;
    const step = (now: number) => {
      raf = requestAnimationFrame(step);
      if (now - last < 80) return; // ~12fps is plenty for text
      last = now;
      el.textContent = waveLine(now / 1000);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);
  // The server renders frame 0, so the line is already there before hydration
  return (
    <div ref={ref} aria-hidden="true" className="overflow-hidden font-mono text-[0.8125rem] leading-none whitespace-pre text-muted">
      {waveLine(0)}
    </div>
  );
}

// ---------- spinners ----------

const spinners = [
  { label: "Line", frames: ["|", "/", "-", "\\"] },
  { label: "Braille", frames: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"] },
  { label: "Quarter", frames: ["◐", "◓", "◑", "◒"] },
  { label: "Grow", frames: [".", "o", "O", "@", "*", " "] },
  { label: "Dots", frames: [".  ", ".. ", "...", " ..", "  .", "   "] },
];

function Spinners() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (reducedMotion()) return;
    const id = setInterval(() => setTick((n) => n + 1), 100);
    return () => clearInterval(id);
  }, []);
  return (
    <ul className="flex flex-wrap gap-x-6 gap-y-2">
      {spinners.map((s) => (
        <li key={s.label} className="flex items-center gap-2 text-sm text-muted">
          {/* Fixed box: glyphs differ in width, the layout shouldn't */}
          <span aria-hidden="true" className="inline-block w-[3ch] text-center font-mono text-fg whitespace-pre">
            {s.frames[tick % s.frames.length]}
          </span>
          {s.label}
        </li>
      ))}
    </ul>
  );
}

// ---------- typed success box ----------

const BOX_LINES = ["[ok]  Message sent.", "      I'll reply within a day."];
const INNER = 34;
const BOX = [
  `+${"-".repeat(INNER)}+`,
  `|${" ".repeat(INNER)}|`,
  ...BOX_LINES.map((l) => `|  ${l.padEnd(INNER - 2)}|`),
  `|${" ".repeat(INNER)}|`,
  `+${"-".repeat(INNER)}+`,
].join("\n");

function TypedBox() {
  const [shown, setShown] = useState(0);
  const [done, setDone] = useState(false);
  const raf = useRef(0);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  function play() {
    cancelAnimationFrame(raf.current);
    setDone(false);
    if (reducedMotion()) {
      setShown(BOX.length);
      setDone(true);
      return;
    }
    const start = performance.now();
    const step = (now: number) => {
      const n = Math.min(BOX.length, Math.floor((now - start) / 4));
      setShown(n);
      if (n < BOX.length) raf.current = requestAnimationFrame(step);
      else setDone(true);
    };
    raf.current = requestAnimationFrame(step);
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={play}
        className="cursor-pointer rounded-md border border-line px-3 py-1.5 text-sm transition-colors hover:border-fg"
      >
        {shown ? "Replay" : "Send (demo)"}
      </button>
      {/* The full box is laid out invisibly underneath, so typing never shifts anything */}
      <div aria-hidden="true" className="relative overflow-x-auto font-mono text-[0.8125rem] leading-snug">
        <pre className="invisible m-0">{BOX}</pre>
        <pre className="absolute inset-0 m-0">{BOX.slice(0, shown)}</pre>
      </div>
      <p role="status" className="sr-only">
        {done ? BOX_LINES.map((l) => l.replace("[ok]", "").trim()).join(" ") : ""}
      </p>
    </div>
  );
}

// ---------- panel ----------

export function UiDetails() {
  return (
    <div className="space-y-6">
      <Demo title="Scramble on hover and focus" note="Real text stays in the DOM and holds its width; the shuffle is an aria-hidden overlay.">
        <ul className="flex flex-wrap gap-x-6 gap-y-2 font-medium">
          <li>
            <a href="/case-study" aria-label="Case studies">
              <Scramble text="Case studies" />
            </a>
          </li>
          <li>
            <a href="/resume" aria-label="Resume">
              <Scramble text="Resume" />
            </a>
          </li>
          <li>
            <a href="/#contact" aria-label="Get in touch">
              <Scramble text="Get in touch" />
            </a>
          </li>
        </ul>
      </Demo>
      <Demo title="Day progress bar" note="The live footer line, plus alternative bar styles at the same value.">
        <DayBars />
      </Demo>
      <Demo title="Wave divider" note="A clipped line of text between sections; static under reduced motion.">
        <WaveDivider />
      </Demo>
      <Demo title="Spinners" note="Loading glyphs for buttons and pending states.">
        <Spinners />
      </Demo>
      <Demo title="Typed success box" note="A contact-form confirmation; announced to screen readers once complete.">
        <TypedBox />
      </Demo>
    </div>
  );
}
