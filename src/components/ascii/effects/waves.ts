import type { EffectDef } from "../engine";

// Four sine-wave surfaces, back to front. Every size is a fraction of the stage,
// so a thin strip still shows all four layers.
export const waves: EffectDef = {
  id: "waves",
  name: "Waves",
  caption: "A thin strip above the footer or between sections. One pass over the grid with a few sines per column: very cheap.",
  create() {
    return (f) => {
      const { cols, rows, aspect, V, H, t } = f;
      const W = cols * aspect;
      for (let i = 0; i < 4; i++) {
        const base = rows * (0.3 + 0.15 * i);
        const amp = rows * (0.07 + 0.015 * i);
        const k1 = (Math.PI * 2 * (1.1 + i * 0.45)) / W;
        const k2 = (Math.PI * 2 * (2.3 + i * 0.7)) / W;
        const k3 = (Math.PI * 2 * (5.1 + i)) / W;
        const shade = 0.12 + 0.05 * i;
        for (let x = 0; x < cols; x++) {
          const X = x * aspect;
          const top =
            base +
            amp *
              (0.6 * Math.sin(X * k1 + t * (0.5 + 0.12 * i) + i * 1.7) +
                0.3 * Math.sin(X * k2 - t * (0.8 + 0.1 * i) + i * 2.9) +
                0.1 * Math.sin(X * k3 + t * 1.6));
          const first = Math.max(0, Math.floor(top));
          for (let y = first; y < rows; y++) {
            const idx = y * cols + x;
            const depth = y + 0.5 - top;
            let v: number;
            if (y === Math.floor(top)) {
              // Crest cell: denser the more of it the surface covers
              v = 0.5 + 0.45 * (1 - (top - y));
            } else {
              v = shade + 0.32 * Math.exp(-depth / (rows * 0.05 + 0.8)) + 0.05 * Math.sin(X * 0.8 + y * 1.3 + t * 0.7);
            }
            // Front layers overwrite back ones below their surface
            V[idx] = v;
            H[idx] = 188 + i * 9 + Math.min(depth, 6) * 2;
          }
        }
      }
    };
  },
};
