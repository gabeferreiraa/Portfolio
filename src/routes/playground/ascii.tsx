import { useEffect, useState, type ChangeEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AsciiCanvas, type FrameStats } from "../../components/ascii/AsciiCanvas";
import { colorModes, glyphSets, type ColorMode, type EffectDef, type GlyphSet } from "../../components/ascii/engine";
import { effects } from "../../components/ascii/effects";
import { UiDetails, uiDetails } from "../../components/ascii/UiDetails";
import { ThemeToggle } from "../../components/ThemeToggle";
import { site } from "../../content";

// Hidden tool for comparing ASCII effects. Not linked from anywhere, not in the
// sitemap, and not prerendered (vite.config only lists public pages).
export const Route = createFileRoute("/playground/ascii")({
  head: () => ({
    meta: [{ title: "ASCII playground" }, { name: "robots", content: "noindex" }],
  }),
  component: Playground,
});

type Item = { id: string; name: string; caption: string; def?: EffectDef };

const items: Item[] = [...effects.map((def) => ({ id: def.id, name: def.name, caption: def.caption, def })), uiDetails];

const STORE = "ascii-playground";

function Playground() {
  const [activeId, setActiveId] = useState(items[0].id);
  const [stars, setStars] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [mode, setMode] = useState<ColorMode>("mono");
  const [glyphs, setGlyphs] = useState<GlyphSet>("slashes");
  // Small cells read as finer, more "real" detail; 10px still holds 60fps
  const [cell, setCell] = useState(10);
  const [speed, setSpeed] = useState(1);
  const [paused, setPaused] = useState(false);
  const [context, setContext] = useState(false);
  const [hud, setHud] = useState(false);
  const [image, setImage] = useState<ImageBitmap | null>(null);
  const [stats, setStats] = useState<FrameStats | null>(null);

  const active = items.find((i) => i.id === activeId) ?? items[0];
  const isCanvas = !!active.def;

  // After mount: reduced motion starts paused; restore the shortlist and last pick
  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) setPaused(true);
    const onReduce = () => reduce.matches && setPaused(true);
    reduce.addEventListener("change", onReduce);
    try {
      const saved = JSON.parse(localStorage.getItem(STORE) ?? "{}") as { active?: string; stars?: string[] };
      if (saved.active && items.some((i) => i.id === saved.active)) setActiveId(saved.active);
      if (Array.isArray(saved.stars)) setStars(saved.stars.filter((s) => items.some((i) => i.id === s)));
    } catch {
      // Storage unavailable or corrupt: start fresh
    }
    setLoaded(true);
    return () => reduce.removeEventListener("change", onReduce);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORE, JSON.stringify({ active: activeId, stars }));
    } catch {
      // Private mode: the shortlist lasts for this page view
    }
  }, [loaded, activeId, stars]);

  // The readout is stale once the effect or pause state changes
  useEffect(() => setStats(null), [activeId, paused]);

  function toggleStar(id: string) {
    setStars((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }

  function onFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    createImageBitmap(file)
      .then((bmp) =>
        setImage((prev) => {
          prev?.close();
          return bmp;
        }),
      )
      .catch(() => {
        // Not a decodable image: keep the current one
      });
  }

  const shortlist = items.filter((i) => stars.includes(i.id));

  return (
    <div className="mx-auto max-w-[1100px] px-4 pt-10 pb-16 sm:px-6 sm:pt-14">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[1.75rem] leading-tight font-medium tracking-tight">ASCII playground</h1>
          <p className="mt-1 text-sm text-muted">Compare effects and star the ones worth using. Hidden route: not linked or indexed.</p>
        </div>
        <ThemeToggle />
      </header>

      <main className="mt-8">
        <ul aria-label="Effects" className="flex flex-wrap gap-2">
          {items.map((item) => {
            const on = item.id === active.id;
            const starred = stars.includes(item.id);
            return (
              <li
                key={item.id}
                className={`inline-flex min-h-9 items-center rounded-full border text-sm transition-colors ${
                  on ? "border-fg bg-fg text-bg" : "border-line hover:border-fg"
                }`}
              >
                <button type="button" aria-pressed={on} onClick={() => setActiveId(item.id)} className="cursor-pointer self-stretch pr-1 pl-3.5">
                  {item.name}
                </button>
                <button
                  type="button"
                  aria-pressed={starred}
                  aria-label={`Shortlist ${item.name}`}
                  onClick={() => toggleStar(item.id)}
                  className={`cursor-pointer self-stretch pr-3 pl-1.5 ${on ? "" : starred ? "text-fg" : "text-muted"}`}
                >
                  <span aria-hidden="true">{starred ? "★" : "☆"}</span>
                </button>
              </li>
            );
          })}
        </ul>

        {/* Controls stay mounted (just disabled for the DOM demo), so switching effects never shifts the stage */}
        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
          <Segmented label="Color" options={colorModes} value={mode} onChange={setMode} disabled={!isCanvas} />
          <Segmented label="Glyphs" options={glyphSets} value={glyphs} onChange={setGlyphs} disabled={!isCanvas} />
          <Range label="Cell" value={cell} min={6} max={28} step={1} format={(v) => `${v}px`} onChange={setCell} disabled={!isCanvas} />
          <Range label="Speed" value={speed} min={0.25} max={3} step={0.25} format={(v) => `${v}×`} onChange={setSpeed} disabled={!isCanvas} />
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            disabled={!isCanvas}
            className="w-[4.5rem] cursor-pointer rounded-md border border-line px-2.5 py-1 transition-colors hover:border-fg disabled:cursor-not-allowed disabled:opacity-50"
          >
            {paused ? "Play" : "Pause"}
          </button>
          <label className={`inline-flex items-center gap-2 ${isCanvas ? "cursor-pointer" : "opacity-50"}`}>
            <input
              type="checkbox"
              checked={context}
              disabled={!isCanvas}
              onChange={(e) => setContext(e.target.checked)}
              className="size-4 accent-[var(--fg)]"
            />
            In context
          </label>
          {active.def?.hud && (
            <label className="inline-flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                role="switch"
                checked={hud}
                onChange={(e) => setHud(e.target.checked)}
                className="size-4 accent-[var(--fg)]"
              />
              HUD
            </label>
          )}
        </div>

        <div className="relative isolate mt-4 h-[clamp(320px,62svh,600px)] overflow-hidden rounded-lg border border-line">
          {active.def ? (
            <>
              <div className="absolute inset-0 -z-10 transition-opacity" style={{ opacity: context ? 0.3 : 1 }}>
                <AsciiCanvas
                  effect={active.def}
                  colorMode={mode}
                  glyphs={glyphs}
                  cellSize={cell}
                  speed={speed}
                  paused={paused}
                  options={{ image }}
                  onStats={setStats}
                />
              </div>
              {context && <HeroMock />}
              {hud && active.def.hud && stats && (
                <dl
                  aria-hidden="true"
                  className="absolute top-2 left-2 grid grid-cols-[auto_auto] gap-x-3 rounded bg-bg/80 px-2 py-1 font-mono text-[0.6875rem] leading-4 text-muted tabular-nums"
                >
                  {Object.entries(stats.hud).map(([k, v]) => (
                    <div key={k} className="contents">
                      <dt>{k}</dt>
                      <dd className="text-right text-fg">{v}</dd>
                    </div>
                  ))}
                </dl>
              )}
              <p
                aria-hidden="true"
                className="absolute right-2 bottom-2 rounded bg-bg/80 px-1.5 font-mono text-xs leading-5 text-muted tabular-nums"
              >
                {paused ? "paused" : stats ? `${Math.round(stats.fps)} fps · ${stats.ms.toFixed(1)} ms` : "…"}
              </p>
            </>
          ) : (
            <div className="absolute inset-0 overflow-y-auto p-5 sm:p-6">
              <UiDetails />
            </div>
          )}
        </div>

        <div className="mt-3 flex min-h-12 flex-wrap items-start justify-between gap-x-6 gap-y-2">
          <p className="max-w-[70ch] text-sm text-muted">
            <span className="font-medium text-fg">{active.name}.</span> {active.caption}
          </p>
          {active.id === "image" && (
            <label className="text-sm">
              <span className="sr-only">Image file</span>
              <input
                type="file"
                accept="image/*"
                onChange={onFile}
                className="max-w-full text-sm text-muted file:mr-2 file:cursor-pointer file:rounded-md file:border file:border-solid file:border-line file:bg-transparent file:px-2.5 file:py-1 file:text-fg"
              />
            </label>
          )}
        </div>

        <section aria-labelledby="shortlist-heading" className="mt-12">
          <div className="flex items-baseline justify-between gap-4">
            <h2 id="shortlist-heading" className="text-[1.0625rem] font-medium">
              Shortlist
            </h2>
            {shortlist.length > 0 && (
              <button type="button" onClick={() => setStars([])} className="cursor-pointer text-sm text-muted hover:text-fg">
                Clear
              </button>
            )}
          </div>
          {shortlist.length === 0 ? (
            <p className="mt-2 text-sm text-muted">Star an effect (☆) to add it here.</p>
          ) : (
            <ol className="mt-3 space-y-3">
              {shortlist.map((i) => (
                <li key={i.id} className="text-sm">
                  <button type="button" onClick={() => setActiveId(i.id)} className="cursor-pointer font-medium underline decoration-line underline-offset-4 hover:decoration-current">
                    {i.name}
                  </button>
                  <p className="text-muted">{i.caption}</p>
                </li>
              ))}
            </ol>
          )}
        </section>
      </main>
    </div>
  );
}

function Range({
  label,
  value,
  min,
  max,
  step,
  format,
  onChange,
  disabled,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
  disabled?: boolean;
}) {
  return (
    <label className={`inline-flex items-center gap-2 ${disabled ? "opacity-50" : ""}`}>
      <span className="text-muted">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-24 accent-[var(--fg)] sm:w-28"
      />
      {/* Fixed width so the row doesn't reflow as the value changes */}
      <output className="w-[3.25rem] font-mono text-xs tabular-nums">{format(value)}</output>
    </label>
  );
}

// Mirrors the homepage header, to judge legibility over the effect at 30%
function HeroMock() {
  return (
    <div className="relative px-5 pt-10 sm:px-10 sm:pt-16">
      <p className="text-[1.75rem] leading-tight font-medium tracking-tight sm:text-[2rem]">{site.name}</p>
      <p className="mt-1 text-muted">{`${site.role} in ${site.location}`}</p>
      <p className="mt-6 max-w-[52ch]">
        I build web and mobile apps, with a focus on accessibility, clear hierarchy, and details that can't be missed.
      </p>
    </div>
  );
}

function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
  disabled,
}: {
  label: string;
  options: { id: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  disabled?: boolean;
}) {
  return (
    <div role="group" aria-label={label} className="inline-flex overflow-hidden rounded-md border border-line">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          aria-pressed={value === o.id}
          disabled={disabled}
          onClick={() => onChange(o.id)}
          className={`cursor-pointer px-2.5 py-1 transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
            value === o.id ? "bg-fg text-bg" : "text-muted hover:text-fg"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
