import { clamp, hash, plot, rng, smoothstep, type EffectDef, type Frame } from "../engine";

// World units are cell heights: x = column * aspect, y = row, so circles stay round.

const TAU = Math.PI * 2;

// Hue stops from the top of the bell (0) to the tentacle tips (1). The body
// cross-fades between the two palettes over PALETTE_PERIOD seconds.
const PALETTES = [
  [320, 48, 24], // magenta → yellow → orange
  [185, 228, 325], // cyan → blue → pink
];
const PALETTE_PERIOD = 26;

function lerpHue(a: number, b: number, k: number) {
  const d = ((b - a + 540) % 360) - 180;
  return a + d * k;
}

function hueAt(g: number, t: number, pulse: number, shift: number) {
  const seg = (p: number[]) => (g < 0.5 ? lerpHue(p[0], p[1], g * 2) : lerpHue(p[1], p[2], (g - 0.5) * 2));
  const mix = 0.5 - 0.5 * Math.cos((t / PALETTE_PERIOD) * TAU + shift);
  return lerpHue(seg(PALETTES[0]), seg(PALETTES[1]), mix) + 22 * pulse;
}

type Jelly = {
  main: boolean;
  fx: number; // fraction of the stage, so resizing keeps the composition
  fy: number;
  size: number; // bell radius as a fraction of the stage's smaller side
  depth: number; // overall brightness
  freq: number; // pulses per second
  phase: number;
  shift: number; // palette offset
  seed: number;
  tentacles: number;
  arms: number;
  lastC: number;
  emit: number; // fractional sparks carried between frames
};

type Spark = { x: number; y: number; vx: number; vy: number; age: number; life: number; seed: number; big: boolean; hue: number };

// One pulse: a quick contraction (30% of the cycle), then a slow relax. 0 = relaxed, 1 = contracted.
function contraction(t: number, j: Jelly) {
  const u = (((t * j.freq + j.phase) % 1) + 1) % 1;
  return u < 0.3 ? smoothstep(0, 1, u / 0.3) : 1 - smoothstep(0, 1, (u - 0.3) / 0.7);
}

type Geo = { R: number; Rx: number; Ry: number; cx: number; cy: number; c: number; span: number };

function geometry(j: Jelly, t: number, W: number, Hh: number): Geo {
  const R = Math.min(Hh, W * 0.8) * j.size;
  const c = contraction(t, j);
  const lift = j.main ? -c * R * 0.12 + Math.sin(t * 0.11) * R * 0.15 : -c * R * 0.06;
  return {
    R,
    c,
    // Narrower and taller on the contraction
    Rx: R * (1 - 0.2 * c),
    Ry: R * (0.8 + 0.2 * c),
    cx: j.fx * W + Math.sin(t * 0.09 + j.seed) * R * (j.main ? 0.35 : 0.6),
    cy: j.fy * Hh + lift,
    // Bell top to tentacle tips, for the vertical color gradient
    span: R * (j.main ? 4.4 : 3.6),
  };
}

function drawJelly(f: Frame, j: Jelly, W: number, Hh: number) {
  const { t, aspect } = f;
  const { R, Rx, Ry, cx, cy, c, span } = geometry(j, t, W, Hh);
  const topY = cy - Ry;
  const grad = (y: number) => clamp((y - topY) / span);
  const hue = (y: number) => hueAt(grad(y), t, c, j.shift);
  const glow = j.depth * (0.9 + 0.1 * c);
  const w = TAU * j.freq;
  const disc = (x: number, y: number, radius: number, v: number, h: number) => {
    const c0 = Math.floor((x - radius) / aspect);
    const c1 = Math.ceil((x + radius) / aspect);
    for (let row = Math.floor(y - radius); row <= Math.ceil(y + radius); row++) {
      for (let col = c0; col <= c1; col++) {
        const dx = (col + 0.5) * aspect - x;
        const dy = row + 0.5 - y;
        const d = Math.sqrt(dx * dx + dy * dy) / radius;
        if (d < 1) plot(f, col, row, v * (1 - 0.35 * d), h);
      }
    }
  };

  // --- thin tentacles around the margin; the pulse travels down them, so their sway lags it
  for (let k = 0; k < j.tentacles; k++) {
    const nx = j.tentacles === 1 ? 0 : -0.9 + (k * 1.8) / (j.tentacles - 1);
    const L = R * (j.main ? 3.0 + 0.8 * hash(j.seed * 31 + k) : 2.4 + 0.6 * hash(j.seed * 31 + k));
    const steps = Math.ceil((L / Math.min(1, aspect)) * 2.4);
    for (let n = 0; n <= steps; n++) {
      const s = n / steps;
      const cl = contraction(t - 0.18 - 0.6 * s, j);
      const spread = 1 + s * (0.7 * (1 - cl) - 0.2);
      const sway = R * 0.18 * s * Math.sin(w * t - s * 3.6 + k * 1.7 + j.seed);
      const x = cx + R * nx * 0.86 * spread + sway;
      const y = cy + R * (0.1 + 0.16 * nx * nx) + s * L * (1 - 0.12 * cl);
      const v = (0.8 - 0.5 * s) * glow * (0.85 + 0.15 * Math.sin(s * 20 - t * 2.4 + k));
      plot(f, x / aspect, y, v, hue(y));
    }
  }

  // --- oral arms: long, thick, frilled ribbons that curl slower than the tentacles
  for (let k = 0; k < j.arms; k++) {
    const side = k % 2 ? 1 : -1;
    const lane = j.arms > 2 ? (k < 2 ? 0.1 : 0.26) : 0.14;
    const L = R * (j.main ? 2.5 + 0.35 * (k >> 1) : 1.8);
    const steps = Math.ceil(L * 2.2);
    for (let n = 0; n <= steps; n++) {
      const s = n / steps;
      const cl = contraction(t - 0.3 - 0.9 * s, j);
      const curl = R * 0.22 * s * Math.sin(w * 0.6 * t - s * 2.8 + side * 1.4 + k + j.seed);
      const frillX = R * 0.05 * Math.sin(s * 16 - t * 2.2 + k);
      const x = cx + R * side * lane * (1 - s * 0.5) * (1 + 0.5 * (1 - cl)) + curl + frillX;
      const y = cy + R * 0.18 + s * L * (1 - 0.1 * cl);
      const width = Math.max(0.55, R * 0.1 * (1 - 0.6 * s));
      const frill = 0.62 + 0.3 * Math.sin(s * 26 - t * 3 + side);
      disc(x, y, width, frill * (1 - 0.35 * s) * glow, hue(y) + 15);
    }
  }

  // --- inner organ under the bell, in the complementary color
  const organY = cy + R * 0.22;
  const orx = R * 0.3 * (1 + 0.12 * Math.sin(t * 2.1 + j.seed));
  const ory = R * 0.3;
  for (let row = Math.floor(organY - ory); row <= Math.ceil(organY + ory); row++) {
    for (let col = Math.floor((cx - orx) / aspect); col <= Math.ceil((cx + orx) / aspect); col++) {
      const dx = ((col + 0.5) * aspect - cx) / orx;
      const dy = (row + 0.5 - organY) / ory;
      // A bulb with a ruffled lower edge
      const edge = 1 + 0.12 * Math.sin(Math.atan2(dy, dx) * 7 + t * 1.5);
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < edge) plot(f, col, row, (0.72 + 0.2 * (1 - d / edge)) * glow, hue(row) + 180);
    }
  }

  // --- bell: dense fill, bright rim, glowing core, gonad lobes and a scalloped margin
  const c0 = Math.floor((cx - Rx - 1) / aspect);
  const c1 = Math.ceil((cx + Rx + 1) / aspect);
  for (let row = Math.floor(topY - 2); row <= Math.ceil(cy + R * 0.42); row++) {
    if (row < 0 || row >= f.rows) continue;
    for (let col = c0; col <= c1; col++) {
      if (col < 0 || col >= f.cols) continue;
      const nx = ((col + 0.5) * aspect - cx) / Rx;
      const ny = (row + 0.5 - cy) / Ry;
      // The skirt below the dome's equator tapers inward, more when contracted
      const margin = 0.14 + 0.2 * nx * nx - 0.06 * c + 0.035 * Math.sin(nx * 15 + t * 1.3);
      let r: number;
      if (ny < 0) r = Math.sqrt(nx * nx + ny * ny);
      else {
        if (ny > margin) continue;
        r = Math.abs(nx) / (1 - ny * (0.35 + 0.6 * c));
      }
      const h = hue(row);
      if (r >= 1) {
        // Soft halo just outside the rim
        if (r < 1.14 && ny < margin) plot(f, col, row, (0.3 - (r - 1) * 1.6) * glow, h);
        continue;
      }
      const theta = Math.atan2(nx, -ny + 0.25);
      const rim = Math.exp(-(((1 - r) / 0.08) ** 2));
      const lip = ny > 0 ? Math.exp(-(((margin - ny) / 0.07) ** 2)) : 0;
      const dc = Math.hypot(nx, (ny + 0.45) * 1.25);
      const core = Math.exp(-((dc / 0.36) ** 2)) * (0.75 + 0.25 * c);
      const ribs = Math.abs(Math.cos(theta * 5)) ** 12 * 0.22;
      const texture = 0.06 * Math.sin(nx * 11 + ny * 7 - t * 1.7);
      const fill = 0.44 + 0.14 * (1 - r) + ribs + texture;
      const lobes = Math.exp(-(((r - 0.5) / 0.08) ** 2)) * (0.5 + 0.5 * Math.cos(theta * 4 + 0.8)) ** 3;
      if (lobes > 0.35) {
        plot(f, col, row, (0.6 + 0.3 * lobes) * glow, h + 180);
        continue;
      }
      plot(f, col, row, Math.max(rim, lip * 0.92, fill + core * 0.55) * glow, h + core * 25);
    }
  }
}

export const jellyfish: EffectDef = {
  id: "jellyfish",
  name: "Jellyfish",
  caption:
    "Hero backdrop or a 404 page; the most memorable piece. Draws only the cells around each jelly plus up to 500 sparks: light for its size.",
  still: 0.4,
  hud: true,
  backdrop: "ascii-water",
  create() {
    const rand = rng(11);
    const base = { lastC: 0, emit: 0 };
    const jellies: Jelly[] = [
      // Background jellies first: dim, small, slower, at different depths
      { ...base, main: false, fx: 0.12, fy: 0.3, size: 0.07, depth: 0.22, freq: 0.5, phase: 0.2, shift: 1.2, seed: 4, tentacles: 4, arms: 2 },
      { ...base, main: false, fx: 0.86, fy: 0.62, size: 0.09, depth: 0.25, freq: 0.45, phase: 0.55, shift: 2.4, seed: 5, tentacles: 5, arms: 2 },
      { ...base, main: false, fx: 0.72, fy: 0.12, size: 0.05, depth: 0.16, freq: 0.62, phase: 0.8, shift: 3.1, seed: 6, tentacles: 4, arms: 2 },
      { ...base, main: false, fx: 0.25, fy: 0.85, size: 0.06, depth: 0.18, freq: 0.58, phase: 0.35, shift: 0.6, seed: 7, tentacles: 4, arms: 2 },
      { ...base, main: true, fx: 0.48, fy: 0.36, size: 0.25, depth: 1, freq: 0.4, phase: 0, shift: 0, seed: 1, tentacles: 10, arms: 4 },
    ];
    const sparks: Spark[] = [];
    const stars = Array.from({ length: 420 }, () => ({ x: rand(), y: rand(), s: 0.3 + rand() * 0.7, p: rand() * TAU }));
    let warmed = false;
    let clock = 0;

    // Movement and particles, separate from drawing so the first frame can be pre-simulated
    function simulate(dt: number, t: number, W: number, Hh: number) {
      for (const j of jellies) {
        const g = geometry(j, t, W, Hh);
        if (!j.main) {
          // Drift upward, mostly on the contraction, and wrap past the top
          j.fy -= (dt * g.R * (0.1 + 0.5 * g.c)) / Hh;
          if (j.fy * Hh + g.R * 3.4 < 0) {
            j.fy = (Hh + g.R * 1.2) / Hh;
            j.fx = 0.06 + rand() * 0.88;
          }
        }
        // Sparks burst from the bell while it contracts
        const rising = Math.max(0, g.c - j.lastC);
        j.lastC = g.c;
        j.emit += rising * (j.main ? 260 : 18);
        while (j.emit >= 1 && sparks.length < 500) {
          j.emit -= 1;
          const a = -Math.PI * (0.04 + 0.92 * rand());
          const speed = g.R * (0.5 + rand() * 1.3);
          sparks.push({
            x: g.cx + g.Rx * Math.cos(a) * 1.02,
            y: g.cy + g.Ry * Math.sin(a) * 1.02 + g.R * 0.1,
            vx: Math.cos(a) * speed,
            vy: Math.sin(a) * speed * 0.7,
            age: 0,
            life: 1.4 + rand() * 2.2,
            seed: rand() * 1000,
            big: rand() < 0.035,
            hue: hueAt(0.15 + rand() * 0.3, t, g.c, j.shift),
          });
        }
        if (j.emit > 1) j.emit = 0;
      }
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.age += dt;
        if (s.age > s.life) {
          sparks.splice(i, 1);
          continue;
        }
        // Drag, a slow sink, and a little curl so each one wanders its own way
        const drag = Math.exp(-dt * 1.4);
        s.vx = s.vx * drag + Math.sin(s.y * 0.35 + s.seed) * dt * 2;
        s.vy = s.vy * drag + dt * 0.8;
        s.x += s.vx * dt;
        s.y += s.vy * dt;
      }
    }

    return (f) => {
      const { cols, rows, aspect, t, dt } = f;
      const W = cols * aspect;
      const Hh = rows;
      if (!warmed) {
        // Run a few seconds of physics so the first (or static) frame already has sparks
        warmed = true;
        for (let k = 60; k > 0; k--) simulate(1 / 20, t - k / 20, W, Hh);
      }
      simulate(dt, t, W, Hh);
      clock += dt;

      // Background stars / plankton, twinkling
      const count = Math.min(stars.length, Math.floor((cols * rows) / 30));
      for (let i = 0; i < count; i++) {
        const p = stars[i];
        p.y -= dt * 0.004 * p.s;
        if (p.y < 0) p.y += 1;
        const tw = 0.5 + 0.5 * Math.sin(t * 1.6 * p.s + p.p);
        const v = 0.1 + 0.14 * tw + (tw > 0.985 ? 0.25 : 0);
        plot(f, (p.x + Math.sin(t * 0.15 * p.s + p.p) * 0.008) * cols, p.y * rows, v, 205);
      }

      for (const j of jellies) drawJelly(f, j, W, Hh);

      for (const s of sparks) {
        const k = s.age / s.life;
        const fade = (1 - k) ** 1.3 * Math.min(1, s.age * 10);
        const twinkle = 0.55 + 0.45 * Math.sin(t * 15 + s.seed * 6);
        const v = fade * twinkle;
        const col = s.x / aspect;
        plot(f, col, s.y, Math.min(1, v * 1.05), s.hue);
        if (s.big) {
          // Starburst: long horizontal arms, shorter vertical ones, a hint of diagonals
          const arm = 2 + Math.round(3 * (1 - k));
          for (let a = 1; a <= arm; a++) {
            const fall = v * (1 - a / (arm + 1));
            plot(f, col - a, s.y, fall, s.hue);
            plot(f, col + a, s.y, fall, s.hue);
            if (a <= Math.ceil(arm * 0.5)) {
              plot(f, col, s.y - a, fall, s.hue);
              plot(f, col, s.y + a, fall, s.hue);
            }
          }
          plot(f, col - 1, s.y - 1, v * 0.45, s.hue);
          plot(f, col + 1, s.y - 1, v * 0.45, s.hue);
          plot(f, col - 1, s.y + 1, v * 0.45, s.hue);
          plot(f, col + 1, s.y + 1, v * 0.45, s.hue);
        }
      }

      const m = Math.floor(clock / 60);
      const sec = (clock % 60).toFixed(1).padStart(4, "0");
      f.hud.time = `${String(m).padStart(2, "0")}:${sec}`;
      f.hud.jellies = String(jellies.length);
      f.hud.tentacles = String(jellies.reduce((n, j) => n + j.tentacles + j.arms, 0));
      f.hud.sparks = String(sparks.length);
    };
  },
};
