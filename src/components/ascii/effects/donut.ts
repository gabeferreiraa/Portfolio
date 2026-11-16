import type { EffectDef } from "../engine";

const R1 = 1; // tube radius
const R2 = 2; // distance from the center to the tube
const K2 = 5; // viewer distance

// The classic spinning torus: sample the surface, project, z-buffer, and shade
// by the surface normal against a fixed light.
export const donut: EffectDef = {
  id: "donut",
  name: "Donut",
  caption: "A wink on the 404 page or as a loading state. Samples ~40k surface points per frame: moderate, independent of cell count.",
  still: 1.2,
  create() {
    let z = new Float32Array(0);
    return (f) => {
      const { cols, rows, aspect, V, H, t } = f;
      if (z.length !== cols * rows) z = new Float32Array(cols * rows);
      z.fill(0);
      const radius = 0.44 * Math.min(rows, cols * aspect);
      const K1 = (radius * K2) / (R1 + R2) / 1.15;
      const cx = (cols * aspect) / 2;
      const cy = rows / 2;
      // Sample finely enough that adjacent points land at most ~half a cell apart
      const dPhi = Math.max(0.006, 0.3 / radius);
      const dTheta = Math.max(0.012, 0.9 / radius);
      const A = t * 0.9;
      const B = t * 0.45;
      const cA = Math.cos(A);
      const sA = Math.sin(A);
      const cB = Math.cos(B);
      const sB = Math.sin(B);
      for (let th = 0; th < Math.PI * 2; th += dTheta) {
        const ct = Math.cos(th);
        const st = Math.sin(th);
        const ox = R2 + R1 * ct;
        const oy = R1 * st;
        for (let ph = 0; ph < Math.PI * 2; ph += dPhi) {
          const cp = Math.cos(ph);
          const sp = Math.sin(ph);
          const x = ox * (cB * cp + sA * sB * sp) - oy * cA * sB;
          const y = ox * (sB * cp - sA * cB * sp) + oy * cA * cB;
          const ooz = 1 / (K2 + cA * ox * sp + oy * sA);
          const col = Math.floor((cx + K1 * ooz * x) / aspect);
          const row = Math.floor(cy - K1 * ooz * y);
          if (col < 0 || row < 0 || col >= cols || row >= rows) continue;
          const i = row * cols + col;
          if (ooz <= z[i]) continue;
          z[i] = ooz;
          const L = cp * ct * sB - cA * ct * sp - sA * st + cB * (cA * st - ct * sA * sp);
          V[i] = L > 0 ? 0.22 + 0.78 * (L / Math.SQRT2) : 0.12;
          H[i] = ((ph * 180) / Math.PI + t * 40) % 360;
        }
      }
    };
  },
};
