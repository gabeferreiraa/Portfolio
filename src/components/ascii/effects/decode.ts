import { hash, type EffectDef } from "../engine";
import { site } from "../../../content";

const PERIOD = 7; // seconds per loop
const FONT = '"Inter Variable", ui-sans-serif, system-ui, sans-serif';

type Mask = { key: string; cover: Float32Array; settle: Float32Array; leave: Float32Array };

// Renders the name into an offscreen canvas one pixel per cell, then reads its
// alpha back as a coverage mask. x is drawn at 1/aspect so letters keep their
// proportions once each pixel becomes a (narrower than tall) cell.
function buildMask(cols: number, rows: number, aspect: number, key: string): Mask {
  const cover = new Float32Array(cols * rows);
  const settle = new Float32Array(cols * rows);
  const leave = new Float32Array(cols * rows);
  const canvas = document.createElement("canvas");
  canvas.width = cols;
  canvas.height = rows;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (ctx) {
    const name = site.name.toUpperCase();
    const layouts = [[name], name.split(" ")];
    ctx.font = `700 100px ${FONT}`;
    // Pick the layout (one or two lines) that gives the largest letters
    let best = { size: 0, lines: layouts[0] };
    for (const lines of layouts) {
      const widest = Math.max(...lines.map((l) => ctx.measureText(l).width));
      const byWidth = ((cols * 0.88 * aspect) / widest) * 100;
      const byHeight = (rows * 0.62) / (lines.length * 1.05);
      const size = Math.min(byWidth, byHeight);
      if (size > best.size) best = { size, lines };
    }
    ctx.setTransform(1 / aspect, 0, 0, 1, cols / 2, rows / 2);
    ctx.font = `700 ${best.size}px ${FONT}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#000";
    const lh = best.size * 1.05;
    best.lines.forEach((line, i) => ctx.fillText(line, 0, (i - (best.lines.length - 1) / 2) * lh));
    const data = ctx.getImageData(0, 0, cols, rows).data;
    for (let i = 0; i < cols * rows; i++) {
      cover[i] = data[i * 4 + 3] / 255;
      const x = i % cols;
      // Resolves roughly left to right, with some scatter
      settle[i] = 0.08 + 0.38 * (x / cols) + 0.14 * hash(i, 1);
      leave[i] = 0.84 + 0.1 * hash(i, 2);
    }
  }
  return { key, cover, settle, leave };
}

export const decode: EffectDef = {
  id: "decode",
  name: "Name decode",
  caption: "Hero title intro, or a one-time load moment on the homepage. One cheap pass per frame; the mask is rebuilt only on resize.",
  still: PERIOD * 0.7,
  create() {
    let mask: Mask | null = null;
    let fontsReady = false;
    document.fonts?.ready.then(() => {
      fontsReady = true;
    });

    return (f) => {
      const { cols, rows, aspect, V, H, t } = f;
      const key = `${cols}x${rows}:${fontsReady}`;
      if (!mask || mask.key !== key) mask = buildMask(cols, rows, aspect, key);
      const u = (((t / PERIOD) % 1) + 1) % 1;
      // Glyphs reshuffle ~14 times a second, regardless of frame rate
      const tick = Math.floor(t * 14);
      for (let i = 0; i < cols * rows; i++) {
        const m = mask.cover[i];
        const noise = hash(i, tick);
        if (m > 0.4) {
          const s = mask.settle[i];
          const l = mask.leave[i];
          if (u >= s && u < l) {
            V[i] = 1; // settled: "@"
            H[i] = 165 + 150 * ((i % cols) / cols);
          } else {
            // Scrambling in (fading up from nothing) or dissolving out (fading away)
            const k = u < s ? Math.min(1, u / 0.06) : 1 - (u - l) / (1 - l);
            V[i] = (0.15 + 0.7 * noise) * Math.max(0, k);
            H[i] = noise * 360;
          }
        } else if (noise > 0.985) {
          V[i] = 0.12 + 0.15 * hash(i, tick + 1);
          H[i] = 200;
        }
      }
    };
  },
};
