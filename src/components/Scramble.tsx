import { useEffect, useRef } from "react";

const GLYPHS = "abcdefghijklmnopqrstuvwxyz#%&*+=?";
const DURATION = 300;

// Letters shuffle and resolve left to right on hover or keyboard focus.
// The real text stays in the DOM (it's what screen readers and copy-paste get)
// and keeps reserving its own width. It's only made transparent while an
// aria-hidden copy on top shows the shuffle, so the link underline stays visible.
export function Scramble({ text }: { text: string }) {
  const real = useRef<HTMLSpanElement>(null);
  const fake = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = real.current;
    const trigger = el?.closest("a, button") ?? el?.parentElement;
    if (!el || !trigger) return;
    let raf = 0;

    function run() {
      if (raf || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const start = performance.now();
      let lastSwap = 0;
      el!.style.color = "transparent";
      const step = (now: number) => {
        const p = (now - start) / DURATION;
        if (p >= 1) {
          fake.current!.textContent = "";
          el!.style.color = "";
          raf = 0;
          return;
        }
        // Swap glyphs every ~40ms so it shimmers instead of strobing
        if (now - lastSwap > 40) {
          lastSwap = now;
          fake.current!.textContent = [...text]
            .map((ch, i) =>
              ch === " " || i < p * text.length ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
            )
            .join("");
        }
        raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }

    trigger.addEventListener("mouseenter", run);
    trigger.addEventListener("focusin", run);
    return () => {
      cancelAnimationFrame(raf);
      trigger.removeEventListener("mouseenter", run);
      trigger.removeEventListener("focusin", run);
    };
  }, [text]);

  return (
    <span className="relative">
      <span ref={real}>{text}</span>
      {/* line-height: normal matches the inline box it covers (the font's own height).
          Inheriting the page's 1.7 would add half-leading above the glyphs and draw
          the shuffle lower than the real text, so the link would appear to drop. */}
      <span
        ref={fake}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden whitespace-nowrap [line-height:normal]"
      />
    </span>
  );
}
