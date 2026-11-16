import { useEffect, useRef, type CSSProperties } from "react";
import { GridRenderer, type ColorMode, type EffectDef, type EffectOptions } from "./engine";

export type FrameStats = { fps: number; ms: number };

type Props = {
  effect: EffectDef;
  colorMode: ColorMode;
  /** Cell height in CSS px */
  cellSize: number;
  speed: number;
  paused: boolean;
  options?: EffectOptions;
  className?: string;
  style?: CSSProperties;
  onStats?: (s: FrameStats) => void;
};

// Fills its positioned parent. Decorative: aria-hidden and ignores the pointer
// (pointer position is read from window events instead). Nothing is drawn until
// after mount, so the server HTML is an empty canvas and hydration is clean.
export function AsciiCanvas(props: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const live = useRef(props);
  const sync = useRef<() => void>(() => {});

  // Prop changes (color, cell size, speed, pause) reach the running loop without restarting it
  useEffect(() => {
    live.current = props;
    sync.current();
  });

  const { effect } = props;

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const renderer = new GridRenderer(canvas);
    if (!renderer.ok) return;
    const run = effect.create();
    const root = document.documentElement;
    const darkMq = matchMedia("(prefers-color-scheme: dark)");

    let raf = 0;
    let last = 0;
    // A static first frame (reduced motion, or paused) shows the effect's best moment
    let t = live.current.paused ? (effect.still ?? 0) : 0;
    let onScreen = true;
    let dirty = true;
    let rect = canvas.getBoundingClientRect();
    let pointer: { x: number; y: number } | null = null;
    const clicks: { x: number; y: number }[] = [];
    let frames = 0;
    let cost = 0;
    let statStart = 0;
    let options = live.current.options;

    const inside = (x: number, y: number) => x >= rect.left && x < rect.right && y >= rect.top && y < rect.bottom;
    const toCell = (p: { x: number; y: number }) => ({
      x: ((p.x - rect.left) * renderer.dpr) / renderer.cw,
      y: ((p.y - rect.top) * renderer.dpr) / renderer.ch,
    });

    function measure() {
      rect = canvas!.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (renderer.resize(rect.width, rect.height, live.current.cellSize, dpr)) dirty = true;
    }

    function paint(advance: boolean, dt: number) {
      // Read at draw time so a theme switch is picked up immediately
      const cs = getComputedStyle(root);
      const fg = cs.getPropertyValue("--fg").trim() || "#222";
      const dark = renderer.isDark(cs.getPropertyValue("--bg").trim() || "#fff");
      if (advance || dirty) {
        rect = canvas!.getBoundingClientRect();
        renderer.V.fill(0);
        renderer.H.fill(0);
        run({
          cols: renderer.cols,
          rows: renderer.rows,
          aspect: renderer.cw / renderer.ch,
          px: renderer.ch / renderer.dpr,
          V: renderer.V,
          H: renderer.H,
          t,
          dt,
          pointer: pointer && inside(pointer.x, pointer.y) ? toCell(pointer) : null,
          clicks: clicks.splice(0).map(toCell),
          dark,
          options: live.current.options ?? {},
        });
        dirty = false;
      }
      renderer.draw(live.current.colorMode, fg, dark);
    }

    function tick(now: number) {
      raf = requestAnimationFrame(tick);
      const dt = last ? Math.min(0.05, (now - last) / 1000) * live.current.speed : 0;
      last = now;
      t += dt;
      const start = performance.now();
      paint(true, dt);
      cost += performance.now() - start;
      frames++;
      if (!statStart) statStart = now;
      if (now - statStart >= 500) {
        live.current.onStats?.({ fps: (frames * 1000) / (now - statStart), ms: cost / frames });
        frames = 0;
        cost = 0;
        statStart = now;
      }
    }

    function stop() {
      cancelAnimationFrame(raf);
      raf = 0;
      statStart = 0;
      frames = 0;
      cost = 0;
    }

    function refresh() {
      measure();
      if (live.current.options !== options) {
        options = live.current.options;
        dirty = true;
      }
      if (!live.current.paused && onScreen && !document.hidden) {
        if (!raf) {
          last = 0;
          raf = requestAnimationFrame(tick);
        }
      } else {
        stop();
        clicks.length = 0;
        paint(false, 0);
      }
    }

    function onTheme() {
      // The image effect inverts by theme, so recompute rather than just repaint
      dirty = true;
      if (!raf) paint(false, 0);
    }

    function onMove(e: PointerEvent) {
      pointer = { x: e.clientX, y: e.clientY };
    }
    function onDown(e: PointerEvent) {
      if (raf && inside(e.clientX, e.clientY)) clicks.push({ x: e.clientX, y: e.clientY });
    }
    function onOut(e: PointerEvent) {
      if (!e.relatedTarget) pointer = null;
    }

    const sizer = new ResizeObserver(() => {
      measure();
      if (!raf) paint(false, 0);
    });
    sizer.observe(canvas);
    const seen = new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting;
      refresh();
    });
    seen.observe(canvas);
    const theme = new MutationObserver(onTheme);
    theme.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    darkMq.addEventListener("change", onTheme);
    document.addEventListener("visibilitychange", refresh);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    document.addEventListener("pointerout", onOut);

    sync.current = refresh;
    refresh();

    return () => {
      stop();
      sync.current = () => {};
      sizer.disconnect();
      seen.disconnect();
      theme.disconnect();
      darkMq.removeEventListener("change", onTheme);
      document.removeEventListener("visibilitychange", refresh);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointerout", onOut);
    };
  }, [effect]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none block size-full ${props.className ?? ""}`}
      style={props.style}
    />
  );
}
