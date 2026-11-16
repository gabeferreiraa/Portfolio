// Shared ASCII grid engine. An effect fills a brightness array V (0..1) and a hue
// array H (degrees) per cell; the renderer maps V onto RAMP and draws each cell
// from a pre-rendered glyph atlas, which is much cheaper than fillText per cell.

export const RAMP = " .:-=+*#%@";
const LEVELS = RAMP.length;
// Native color: hue is quantized to 15° steps so the atlas stays small
const HUES = 24;
const FONT = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";

export type ColorMode = "mono" | "native" | "amber" | "green";

export const colorModes: { id: ColorMode; label: string }[] = [
  { id: "mono", label: "Mono" },
  { id: "native", label: "Native" },
  { id: "amber", label: "Amber" },
  { id: "green", label: "Terminal" },
];

export type EffectOptions = { image?: ImageBitmap | null };

export type Frame = {
  cols: number;
  rows: number;
  /** Cell width / cell height (~0.6). Multiply a column by it for square units. */
  aspect: number;
  /** Cell height in CSS px, so effects can keep their size when the cell slider moves */
  px: number;
  V: Float32Array;
  H: Float32Array;
  /** Seconds, already scaled by the speed slider */
  t: number;
  dt: number;
  /** In cell coordinates; null when the pointer is outside the canvas */
  pointer: { x: number; y: number } | null;
  clicks: { x: number; y: number }[];
  dark: boolean;
  options: EffectOptions;
};

export type Runner = (f: Frame) => void;

export type EffectDef = {
  id: string;
  name: string;
  /** Where it could go on the real site, and what it costs */
  caption: string;
  /** Time to render for a static frame (paused at load, or reduced motion) */
  still?: number;
  create: () => Runner;
};

// ---------- helpers for effects ----------

export const clamp = (v: number, a = 0, b = 1) => (v < a ? a : v > b ? b : v);

export function smoothstep(a: number, b: number, x: number) {
  const k = clamp((x - a) / (b - a));
  return k * k * (3 - 2 * k);
}

// Integer hash to 0..1: stable per-cell randomness that doesn't depend on frame rate
export function hash(a: number, b = 0) {
  let h = Math.imul(a | 0, 374761393) + Math.imul(b | 0, 668265263);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

// Seeded PRNG (mulberry32)
export function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Brightest write wins, so overlapping shapes don't need sorting
export function plot(f: Frame, col: number, row: number, v: number, h: number) {
  const x = Math.floor(col);
  const y = Math.floor(row);
  if (x < 0 || y < 0 || x >= f.cols || y >= f.rows) return;
  const i = y * f.cols + x;
  if (v > f.V[i]) {
    f.V[i] = v;
    f.H[i] = h;
  }
}

// ---------- renderer ----------

const FIXED: Record<"amber" | "green", { dark: string; light: string }> = {
  amber: { dark: "#ffb000", light: "#9a5800" },
  green: { dark: "#3dff7a", light: "#0b7a32" },
};

export class GridRenderer {
  readonly ok: boolean;
  cols = 0;
  rows = 0;
  /** Cell size in device pixels (integers, so glyphs land on whole pixels) */
  cw = 0;
  ch = 0;
  dpr = 1;
  V = new Float32Array(0);
  H = new Float32Array(0);

  private ctx: CanvasRenderingContext2D | null;
  private atlas = document.createElement("canvas");
  private atlasKey = "";
  private probe = document.createElement("canvas").getContext("2d");
  private darkCache = new Map<string, boolean>();

  constructor(private canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext("2d");
    this.ok = !!this.ctx;
  }

  /** Returns true when the grid dimensions changed (V and H were reallocated) */
  resize(cssW: number, cssH: number, cellSize: number, dpr: number) {
    const w = Math.max(1, Math.round(cssW * dpr));
    const h = Math.max(1, Math.round(cssH * dpr));
    if (this.canvas.width !== w) this.canvas.width = w;
    if (this.canvas.height !== h) this.canvas.height = h;
    this.dpr = dpr;
    const ch = Math.max(6, Math.round(cellSize * dpr));
    const cw = Math.max(4, Math.round(ch * 0.6));
    const cols = Math.ceil(w / cw);
    const rows = Math.ceil(h / ch);
    const changed = cols !== this.cols || rows !== this.rows || cw !== this.cw || ch !== this.ch;
    this.cw = cw;
    this.ch = ch;
    if (cols !== this.cols || rows !== this.rows) {
      this.cols = cols;
      this.rows = rows;
      this.V = new Float32Array(cols * rows);
      this.H = new Float32Array(cols * rows);
    }
    return changed;
  }

  /** Whether a CSS color is dark, via the canvas color parser */
  isDark(color: string) {
    const hit = this.darkCache.get(color);
    if (hit !== undefined) return hit;
    const p = this.probe;
    let dark = false;
    if (p) {
      p.fillStyle = "#000";
      p.fillStyle = color;
      const s = String(p.fillStyle);
      let r = 0;
      let g = 0;
      let b = 0;
      if (s[0] === "#") {
        r = parseInt(s.slice(1, 3), 16);
        g = parseInt(s.slice(3, 5), 16);
        b = parseInt(s.slice(5, 7), 16);
      } else {
        [r, g, b] = (s.match(/[\d.]+/g) ?? ["0", "0", "0"]).map(Number);
      }
      dark = 0.2126 * r + 0.7152 * g + 0.0722 * b < 128;
    }
    this.darkCache.set(color, dark);
    return dark;
  }

  private buildAtlas(mode: ColorMode, fg: string, dark: boolean) {
    const { cw, ch } = this;
    const hues = mode === "native" ? HUES : 1;
    const a = this.atlas;
    a.width = cw * (LEVELS - 1);
    a.height = ch * hues;
    const c = a.getContext("2d");
    if (!c) return;
    c.clearRect(0, 0, a.width, a.height);
    c.font = `${Math.round(ch * 0.86)}px ${FONT}`;
    c.textAlign = "center";
    c.textBaseline = "middle";
    for (let r = 0; r < hues; r++) {
      c.fillStyle =
        mode === "native"
          ? `hsl(${r * (360 / HUES)} 85% ${dark ? 64 : 40}%)`
          : mode === "mono"
            ? fg
            : FIXED[mode][dark ? "dark" : "light"];
      for (let l = 1; l < LEVELS; l++) {
        // Sparse glyphs are also fainter, which reads as depth
        c.globalAlpha = 0.32 + 0.68 * (l / (LEVELS - 1));
        c.fillText(RAMP[l], (l - 1) * cw + cw / 2, r * ch + ch / 2 + ch * 0.04);
      }
    }
  }

  draw(mode: ColorMode, fg: string, dark: boolean) {
    const ctx = this.ctx;
    if (!ctx) return;
    const { cw, ch, cols, rows, V, H } = this;
    const key = `${mode}|${fg}|${dark}|${cw}|${ch}`;
    if (key !== this.atlasKey) {
      this.buildAtlas(mode, fg, dark);
      this.atlasKey = key;
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const native = mode === "native";
    const atlas = this.atlas;
    for (let y = 0; y < rows; y++) {
      const dy = y * ch;
      const row = y * cols;
      for (let x = 0; x < cols; x++) {
        const v = V[row + x];
        if (!(v >= 0.1)) continue;
        const level = v >= 1 ? LEVELS - 1 : (v * LEVELS) | 0;
        let sy = 0;
        if (native) {
          const hb = Math.round(H[row + x] / (360 / HUES)) % HUES;
          sy = (hb < 0 ? hb + HUES : hb || 0) * ch;
        }
        ctx.drawImage(atlas, (level - 1) * cw, sy, cw, ch, x * cw, dy, cw, ch);
      }
    }
  }
}
