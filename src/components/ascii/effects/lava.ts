import type { EffectDef } from "../engine";

const BALLS = [
  { fx: 0.18, ax: 0.08, sx: 0.21, sy: 0.17, p: 0.0, r: 0.13 },
  { fx: 0.34, ax: 0.1, sx: 0.13, sy: 0.23, p: 1.9, r: 0.1 },
  { fx: 0.5, ax: 0.12, sx: 0.17, sy: 0.12, p: 3.1, r: 0.15 },
  { fx: 0.63, ax: 0.07, sx: 0.25, sy: 0.19, p: 4.4, r: 0.09 },
  { fx: 0.78, ax: 0.09, sx: 0.11, sy: 0.15, p: 5.2, r: 0.12 },
  { fx: 0.9, ax: 0.05, sx: 0.19, sy: 0.21, p: 2.5, r: 0.08 },
  { fx: 0.42, ax: 0.15, sx: 0.09, sy: 0.27, p: 0.8, r: 0.07 },
];

// Metaballs: field = Σ r² / d². Inside the threshold is a blob, with a bright rim
// at the surface and a faint glow outside it. A pool sits at the bottom.
export const lava: EffectDef = {
  id: "lava",
  name: "Lava lamp",
  caption: "Slow, ambient block for an About or Contact section. Seven balls summed per cell: moderate; fine below full-screen.",
  create() {
    const bx = new Float32Array(BALLS.length);
    const by = new Float32Array(BALLS.length);
    const br = new Float32Array(BALLS.length);
    return (f) => {
      const { cols, rows, aspect, V, H, t } = f;
      const W = cols * aspect;
      const m = Math.min(W, rows);
      BALLS.forEach((b, k) => {
        bx[k] = W * (b.fx + b.ax * Math.sin(t * b.sx + b.p));
        by[k] = rows * (0.5 + 0.44 * Math.sin(t * b.sy + b.p * 1.3));
        br[k] = (m * b.r) ** 2;
      });
      for (let y = 0; y < rows; y++) {
        const Y = y + 0.5;
        const pool = Math.exp(-(rows - Y) / (rows * 0.06 + 0.5)) * 1.3;
        for (let x = 0; x < cols; x++) {
          const X = (x + 0.5) * aspect;
          let field = pool * (0.85 + 0.15 * Math.sin(X * 0.35 + t));
          for (let k = 0; k < bx.length; k++) {
            const dx = X - bx[k];
            const dy = Y - by[k];
            field += br[k] / (dx * dx + dy * dy + 0.5);
          }
          const i = y * cols + x;
          let v = 0;
          if (field >= 1) v = field < 1.22 ? 0.95 : 0.42 + 0.28 * Math.min(1, (field - 1.22) * 0.5);
          else if (field > 0.4) v = ((field - 0.4) / 0.6) * 0.3;
          V[i] = v;
          // Yellow near the top, red near the bottom, hotter inside the blobs
          H[i] = 42 * (1 - Y / rows) + 8 * Math.min(field, 2);
        }
      }
    };
  },
};
