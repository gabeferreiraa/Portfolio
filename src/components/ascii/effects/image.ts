import type { EffectDef } from "../engine";

let fallback: HTMLCanvasElement | null = null;

// A procedural stand-in until a file is chosen: a lit sphere over a checker floor
function defaultImage() {
  if (fallback) return fallback;
  const c = document.createElement("canvas");
  c.width = 480;
  c.height = 320;
  const g = c.getContext("2d");
  if (g) {
    const sky = g.createLinearGradient(0, 0, 0, 200);
    sky.addColorStop(0, "#0b1a3a");
    sky.addColorStop(1, "#6f8fc7");
    g.fillStyle = sky;
    g.fillRect(0, 0, 480, 200);
    // Floor: checkers in perspective
    for (let row = 0; row < 12; row++) {
      const y0 = 200 + (row * row * 120) / 144;
      const y1 = 200 + ((row + 1) * (row + 1) * 120) / 144;
      for (let col = -12; col < 12; col++) {
        const xAt = (y: number, k: number) => 240 + (k * 40 * (y - 190)) / 30;
        g.fillStyle = (row + col) % 2 ? "#e8e4dc" : "#2a2622";
        g.beginPath();
        g.moveTo(xAt(y0, col), y0);
        g.lineTo(xAt(y0, col + 1), y0);
        g.lineTo(xAt(y1, col + 1), y1);
        g.lineTo(xAt(y1, col), y1);
        g.fill();
      }
    }
    // Shadow, then the sphere
    g.fillStyle = "rgba(0,0,0,0.55)";
    g.beginPath();
    g.ellipse(250, 252, 92, 18, 0, 0, Math.PI * 2);
    g.fill();
    const ball = g.createRadialGradient(205, 120, 8, 240, 160, 100);
    ball.addColorStop(0, "#fff6e8");
    ball.addColorStop(0.35, "#e0703a");
    ball.addColorStop(1, "#2a0c06");
    g.fillStyle = ball;
    g.beginPath();
    g.arc(240, 160, 88, 0, Math.PI * 2);
    g.fill();
  }
  fallback = c;
  return c;
}

export const image: EffectDef = {
  id: "image",
  name: "Image to ASCII",
  caption: "Portrait or project thumbnails rendered as type, e.g. on case-study covers. Sampled once per resize or image; static, nearly free.",
  create() {
    let key = "";
    let lum = new Float32Array(0);
    let hue = new Float32Array(0);
    let source: ImageBitmap | HTMLCanvasElement | null = null;

    function sample(src: ImageBitmap | HTMLCanvasElement, cols: number, rows: number, aspect: number) {
      lum = new Float32Array(cols * rows);
      hue = new Float32Array(cols * rows);
      const c = document.createElement("canvas");
      c.width = cols;
      c.height = rows;
      const g = c.getContext("2d", { willReadFrequently: true });
      if (!g) return;
      // Contain-fit in square units, then squeeze x back into cells
      const W = cols * aspect;
      const ia = src.width / src.height;
      const w = W / rows > ia ? rows * ia : W;
      const h = w / ia;
      g.drawImage(src, (W - w) / 2 / aspect, (rows - h) / 2, w / aspect, h);
      const d = g.getImageData(0, 0, cols, rows).data;
      let lo = 1;
      let hi = 0;
      for (let i = 0; i < cols * rows; i++) {
        const r = d[i * 4] / 255;
        const gg = d[i * 4 + 1] / 255;
        const b = d[i * 4 + 2] / 255;
        const a = d[i * 4 + 3] / 255;
        lum[i] = a ? 0.2126 * r + 0.7152 * gg + 0.0722 * b : -1;
        if (a) {
          lo = Math.min(lo, lum[i]);
          hi = Math.max(hi, lum[i]);
        }
        const max = Math.max(r, gg, b);
        const min = Math.min(r, gg, b);
        const delta = max - min;
        hue[i] = !delta
          ? 200
          : max === r
            ? 60 * (((gg - b) / delta + 6) % 6)
            : max === gg
              ? 60 * ((b - r) / delta + 2)
              : 60 * ((r - gg) / delta + 4);
      }
      // Stretch contrast to the full ramp
      const span = Math.max(0.01, hi - lo);
      for (let i = 0; i < lum.length; i++) if (lum[i] >= 0) lum[i] = (lum[i] - lo) / span;
    }

    return (f) => {
      const { cols, rows, aspect, V, H, dark } = f;
      const src = f.options.image ?? defaultImage();
      const k = `${cols}x${rows}:${aspect}`;
      if (src !== source || k !== key) {
        source = src;
        key = k;
        sample(src, cols, rows, aspect);
      }
      for (let i = 0; i < lum.length; i++) {
        if (lum[i] < 0) continue; // outside the image
        // Dense glyphs read as ink: bright pixels on a dark page, dark pixels on a light one
        V[i] = dark ? lum[i] : 1 - lum[i];
        H[i] = hue[i];
      }
    };
  },
};
