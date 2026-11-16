import { hash, rng, type EffectDef } from "../engine";

type Drop = { y: number; speed: number; len: number; seed: number };

// Falling columns of code, kept faint: the head is the only dense glyph and the
// trail flickers through the sparse end of the ramp.
export const rain: EffectDef = {
  id: "rain",
  name: "Rain",
  caption: "Faint texture down the side of a projects page or behind the footer. One drop per column: very cheap.",
  still: 4,
  create() {
    const rand = rng(9);
    let drops: Drop[] = [];
    const reset = (d: Drop, rows: number, anywhere: boolean) => {
      d.y = anywhere ? rand() * rows * 1.5 : -rand() * rows * 0.6;
      d.speed = 120 + rand() * 260; // CSS px per second
      d.len = 5 + Math.floor(rand() * 16);
      d.seed = Math.floor(rand() * 1e6);
    };

    return (f) => {
      const { cols, rows, px, V, H, t, dt } = f;
      while (drops.length < cols) {
        const d = { y: 0, speed: 0, len: 0, seed: 0 };
        reset(d, rows, true);
        drops.push(d);
      }
      if (drops.length > cols) drops = drops.slice(0, cols);
      const tick = Math.floor(t * 10);
      for (let x = 0; x < cols; x++) {
        const d = drops[x];
        d.y += (dt * d.speed) / px;
        if (d.y - d.len > rows) reset(d, rows, false);
        const head = Math.floor(d.y);
        for (let k = 0; k < d.len; k++) {
          const y = head - k;
          if (y < 0 || y >= rows) continue;
          const flicker = 0.7 + 0.3 * hash(x * 977 + y, tick + d.seed);
          const i = y * cols + x;
          V[i] = k === 0 ? 0.78 : 0.5 * (1 - k / d.len) * flicker + 0.08;
          H[i] = k === 0 ? 110 : 135;
        }
      }
    };
  },
};
