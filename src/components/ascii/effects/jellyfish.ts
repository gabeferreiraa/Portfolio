import { hash, plot, rng, smoothstep, type EffectDef, type Frame } from "../engine";

// World units are cell heights: x = column * aspect, y = row. Circles stay round.

type Jelly = {
  fx: number; // position as a fraction of the stage, so resizing keeps the composition
  fy: number;
  size: number; // bell radius as a fraction of the stage's smaller side
  depth: number; // brightness: the far ones are dimmer
  freq: number; // pulses per second
  phase: number;
  hue: number;
  seed: number;
};

const TAU = Math.PI * 2;

// One pulse: a quick contraction (30% of the cycle), then a slow relax. 0 = relaxed, 1 = contracted.
function contraction(t: number, j: Jelly) {
  const u = (((t * j.freq + j.phase) % 1) + 1) % 1;
  return u < 0.3 ? smoothstep(0, 1, u / 0.3) : 1 - smoothstep(0, 1, (u - 0.3) / 0.7);
}

function drawJelly(f: Frame, j: Jelly, W: number, Hh: number) {
  const { t, aspect } = f;
  const R = Math.min(Hh, W * 0.8) * j.size;
  const c = contraction(t, j);
  // Bell narrows and grows taller on the contraction; it also lifts slightly
  const Rx = R * (1 - 0.2 * c);
  const Ry = R * (0.78 + 0.2 * c);
  const cx = j.fx * W + Math.sin(t * 0.13 + j.seed) * R * 0.5;
  const cy = j.fy * Hh - c * R * 0.06;
  const hue = 185 + 115 * c + j.hue;
  const glow = j.depth * (0.88 + 0.12 * c);

  // --- tentacles: six thin ones around the margin, their sway lagging the pulse
  const w = TAU * j.freq;
  for (let k = 0; k < 6; k++) {
    const nx = -0.86 + k * 0.344;
    const L = R * (2.3 + 0.7 * hash(j.seed * 31 + k));
    const steps = Math.ceil((L / Math.min(1, aspect)) * 2.4);
    for (let n = 0; n <= steps; n++) {
      const s = n / steps;
      // The pulse travels down the tentacle: further along = later
      const cl = contraction(t - 0.18 - 0.55 * s, j);
      const len = L * (1 - 0.14 * cl);
      const spread = 1 + s * (0.75 * (1 - cl) - 0.2);
      const sway = R * 0.2 * s * Math.sin(w * t - s * 3.4 + k * 1.3 + j.seed);
      const x = cx + R * nx * 0.84 * spread + sway;
      const y = cy + R * (0.1 + 0.16 * nx * nx) + s * len;
      const v = (0.82 - 0.55 * s) * glow * (0.85 + 0.15 * Math.sin(s * 18 - t * 2 + k));
      plot(f, x / aspect, y, v, hue + 70 * s);
    }
  }

  // --- oral arms: two thick, frilled, slower ribbons under the bell's center
  for (let k = 0; k < 2; k++) {
    const side = k ? 1 : -1;
    const L = R * 1.75;
    const steps = Math.ceil(L * 2.2);
    for (let n = 0; n <= steps; n++) {
      const s = n / steps;
      const cl = contraction(t - 0.3 - 0.8 * s, j);
      const sway = R * 0.22 * s * Math.sin(w * 0.7 * t - s * 2.6 + side * 1.4 + j.seed);
      const x = cx + R * side * 0.14 * (1 - s * 0.6) * (1 + 0.6 * (1 - cl)) + sway;
      const y = cy + R * 0.12 + s * L * (1 - 0.1 * cl);
      const width = Math.max(0.6, R * 0.13 * (1 - 0.55 * s));
      const frill = 0.55 + 0.3 * Math.sin(s * 24 - t * 3 + side);
      const v = frill * (1 - 0.45 * s) * glow;
      // Disc splat, in square units so the arm keeps its width at any aspect
      const c0 = Math.floor((x - width) / aspect);
      const c1 = Math.ceil((x + width) / aspect);
      for (let row = Math.floor(y - width); row <= Math.ceil(y + width); row++) {
        for (let col = c0; col <= c1; col++) {
          const dx = (col + 0.5) * aspect - x;
          const dy = row + 0.5 - y;
          const d = Math.sqrt(dx * dx + dy * dy) / width;
          if (d < 1) plot(f, col, row, v * (1 - 0.45 * d), hue + 40 + 60 * s);
        }
      }
    }
  }

  // --- bell: a dome with a bright rim, radial ribs, gonads and a scalloped margin
  const top = Math.floor(cy - Ry - 1);
  const bottom = Math.ceil(cy + R * 0.4);
  const c0 = Math.floor((cx - Rx - 1) / aspect);
  const c1 = Math.ceil((cx + Rx + 1) / aspect);
  for (let row = top; row <= bottom; row++) {
    if (row < 0 || row >= f.rows) continue;
    for (let col = c0; col <= c1; col++) {
      if (col < 0 || col >= f.cols) continue;
      const nx = ((col + 0.5) * aspect - cx) / Rx;
      const ny = (row + 0.5 - cy) / Ry;
      // Skirt below the dome's equator tapers inward, more when contracted
      const margin = 0.12 + 0.2 * nx * nx - 0.05 * c + 0.03 * Math.sin(nx * 14 + t);
      let r: number;
      if (ny < 0) {
        r = Math.sqrt(nx * nx + ny * ny);
      } else {
        if (ny > margin) continue;
        r = Math.abs(nx) / (1 - ny * (0.35 + 0.6 * c));
      }
      if (r >= 1) {
        // Faint halo just outside the rim
        if (r < 1.12 && ny < margin) plot(f, col, row, 0.14 * glow, hue);
        continue;
      }
      const theta = Math.atan2(nx, -ny + 0.2);
      const rim = Math.exp(-(((1 - r) / 0.1) ** 2));
      const edge = ny > 0 ? Math.exp(-(((margin - ny) / 0.07) ** 2)) : 0;
      const body = 0.2 + 0.16 * (1 - r) + 0.1 * c;
      const ribs = Math.abs(Math.cos(theta * 4.5)) ** 14 * 0.38 * smoothstep(0.15, 0.7, r);
      const lobes = Math.exp(-(((r - 0.42) / 0.09) ** 2)) * (0.5 + 0.5 * Math.cos(theta * 4 + 0.8)) ** 2 * 0.42;
      const v = Math.max(rim * 0.98, edge * 0.85, body + ribs + lobes) * glow;
      plot(f, col, row, v, hue + (1 - r) * 25 + lobes * 60);
    }
  }
}

export const jellyfish: EffectDef = {
  id: "jellyfish",
  name: "Jellyfish",
  caption:
    "Hero backdrop or a 404 page; the most memorable piece. Only cells near each jellyfish are computed, so it's cheap at any size.",
  still: 0.1,
  create() {
    const rand = rng(11);
    const jellies: Jelly[] = [
      { fx: 0.3, fy: 0.42, size: 0.21, depth: 1, freq: 0.42, phase: 0, hue: 0, seed: 1 },
      { fx: 0.74, fy: 0.22, size: 0.13, depth: 0.78, freq: 0.55, phase: 0.37, hue: 18, seed: 2 },
      { fx: 0.56, fy: 0.78, size: 0.085, depth: 0.6, freq: 0.68, phase: 0.71, hue: -12, seed: 3 },
    ];
    const plankton = Array.from({ length: 260 }, () => ({
      x: rand(),
      y: rand(),
      s: 0.2 + rand() * 0.8,
      p: rand() * TAU,
    }));

    return (f) => {
      const { cols, rows, aspect, t, dt } = f;
      const W = cols * aspect;
      const Hh = rows;

      // Plankton: sparse, slowly rising specks that twinkle
      const count = Math.min(plankton.length, Math.floor((cols * rows) / 22));
      for (let i = 0; i < count; i++) {
        const p = plankton[i];
        p.y -= (dt * 0.006 * p.s) % 1;
        if (p.y < 0) p.y += 1;
        const x = (p.x + Math.sin(t * 0.2 * p.s + p.p) * 0.01) * cols;
        const v = 0.1 + 0.13 * (0.5 + 0.5 * Math.sin(t * 1.3 * p.s + p.p));
        plot(f, x, p.y * rows, v, 195);
      }

      for (const j of jellies) {
        const R = Math.min(Hh, W * 0.8) * j.size;
        // Swim upward, mostly during the contraction
        j.fy -= (dt * R * (0.08 + 0.55 * contraction(f.t, j))) / Hh;
        // Wrap once the tentacle tips have cleared the top
        if (j.fy * Hh + R * 3.2 < 0) {
          j.fy = (Hh + R * 1.1) / Hh;
          j.fx = 0.15 + rand() * 0.7;
        }
        drawJelly(f, j, W, Hh);
      }
    };
  },
};
