import { useEffect, useRef } from "react";

// Sparse to dense. Cells below the threshold stay empty, so most of the grid is blank.
const RAMP = ".·:-+*";

// A slow field of characters behind the header. Decorative only: it starts after
// mount (nothing in the prerendered HTML), ignores the pointer, and pauses when
// it can't be seen.
export function AsciiField({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const root = document.documentElement;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    const dark = matchMedia("(prefers-color-scheme: dark)");
    let w = 0;
    let h = 0;
    let cell = 14;
    let fps = 12;
    let t = Math.random() * 100;
    let raf = 0;
    let last = 0;
    let onScreen = true;

    function draw() {
      // Read at draw time so a theme switch is picked up on the next frame. The
      // canvas stays transparent, so --bg shows through and the mask fades into it.
      const fg = getComputedStyle(root).getPropertyValue("--fg").trim();
      ctx!.clearRect(0, 0, w, h);
      ctx!.fillStyle = fg;
      ctx!.font = `${cell * 0.8}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
      ctx!.textAlign = "center";
      ctx!.textBaseline = "middle";
      for (let y = 0; y * cell < h; y++) {
        for (let x = 0; x * cell < w; x++) {
          // Three crossing sine waves read as noise at this density, at a fraction of the cost
          const n = Math.sin(x * 0.31 + t) + Math.sin(y * 0.53 - t * 0.7) + Math.sin((x + y) * 0.17 + t * 0.4);
          if (n < 1.1) continue;
          const k = Math.min(RAMP.length - 1, Math.floor((n - 1.1) * 3));
          // 6–11% opacity, so text over the field keeps AA contrast
          ctx!.globalAlpha = 0.06 + (k / (RAMP.length - 1)) * 0.05;
          ctx!.fillText(RAMP[k], x * cell + cell / 2, y * cell + cell / 2);
        }
      }
    }

    function frame(now: number) {
      raf = requestAnimationFrame(frame);
      if (now - last < 1000 / fps) return;
      last = now;
      t += 0.035;
      draw();
    }

    function start() {
      if (!raf && onScreen && !document.hidden && !reduce.matches) raf = requestAnimationFrame(frame);
    }

    function stop() {
      cancelAnimationFrame(raf);
      raf = 0;
    }

    function resize() {
      const r = canvas!.getBoundingClientRect();
      const dpr = Math.min(devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      canvas!.width = Math.round(w * dpr);
      canvas!.height = Math.round(h * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Coarser and slower on phones
      const small = w < 640;
      cell = small ? 18 : 14;
      fps = small ? 8 : 12;
      draw();
    }

    function onMotion() {
      stop();
      draw();
      start();
    }

    const sizer = new ResizeObserver(resize);
    sizer.observe(canvas);
    const seen = new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting;
      onScreen ? start() : stop();
    });
    seen.observe(canvas);
    const theme = new MutationObserver(draw);
    theme.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);
    dark.addEventListener("change", draw);
    reduce.addEventListener("change", onMotion);

    resize();
    start();

    return () => {
      stop();
      sizer.disconnect();
      seen.disconnect();
      theme.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      dark.removeEventListener("change", draw);
      reduce.removeEventListener("change", onMotion);
    };
  }, []);

  // The wrapper is positioned by the caller; a canvas won't stretch to absolute insets on its own
  return (
    <div aria-hidden="true" className={`ascii-field pointer-events-none ${className ?? ""}`}>
      <canvas ref={ref} className="block size-full" />
    </div>
  );
}
