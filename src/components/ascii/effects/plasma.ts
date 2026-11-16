import type { EffectDef } from "../engine";

// Summed sines in CSS-pixel space, so the pattern keeps its scale when the cell size changes
export const plasma: EffectDef = {
  id: "plasma",
  name: "Plasma",
  caption: "Soft texture behind a section heading or a case-study cover. Four sines per cell, every cell: moderate on large areas.",
  create() {
    return (f) => {
      const { cols, rows, aspect, px, V, H, t } = f;
      const sx = aspect * px;
      const cx = cols * sx * (0.5 + 0.3 * Math.sin(t * 0.3));
      const cy = rows * px * (0.5 + 0.3 * Math.cos(t * 0.23));
      for (let y = 0; y < rows; y++) {
        const Y = y * px;
        const a = Math.sin(Y * 0.011 - t * 0.7);
        for (let x = 0; x < cols; x++) {
          const X = x * sx;
          const dx = X - cx;
          const dy = Y - cy;
          const n =
            (Math.sin(X * 0.009 + t * 0.9) +
              a +
              Math.sin((X + Y) * 0.006 + t * 0.5) +
              Math.sin(Math.sqrt(dx * dx + dy * dy) * 0.014 - t * 1.1)) /
            4;
          const i = y * cols + x;
          V[i] = 0.1 + 0.52 * (0.5 + 0.5 * Math.sin(n * Math.PI * 1.6));
          H[i] = (n * 100 + t * 25 + 600) % 360;
        }
      }
    };
  },
};
