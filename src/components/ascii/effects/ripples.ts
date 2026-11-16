import { rng, type EffectDef } from "../engine";

type Ripple = { x: number; y: number; t0: number; amp: number };

const LIFE = 3.2;
const MAX = 18;

// Rings spread from the pointer (small) and clicks (big). With no pointer for a
// couple of seconds, they start dropping on their own like rain on a pond.
export const ripples: EffectDef = {
  id: "ripples",
  name: "Cursor ripples",
  caption: "Interactive hero or contact backdrop that answers the pointer. Cost grows with active rings (capped at 18): moderate.",
  still: 1.6,
  create() {
    const rand = rng(5);
    const list: Ripple[] = [];
    let lastSpawn = -10;
    let lastPointer = -10;
    let last: { x: number; y: number } | null = null;
    let seeded = false;

    function add(r: Ripple) {
      list.push(r);
      if (list.length > MAX) list.shift();
      lastSpawn = r.t0;
    }

    return (f) => {
      const { cols, rows, aspect, px, V, H, t, pointer, clicks } = f;
      // Ring speed and width in CSS px, so they don't change with the cell size
      const speed = 170 / px;
      if (!seeded) {
        // A few rings already in flight, so the first (or static) frame isn't empty
        seeded = true;
        for (let k = 0; k < 3; k++) add({ x: rand() * cols, y: rand() * rows, t0: t - 0.4 - k * 0.9, amp: 0.8 });
      }
      for (const c of clicks) add({ x: c.x, y: c.y, t0: t, amp: 1.15 });
      if (pointer) {
        const moved = !last || Math.hypot((pointer.x - last.x) * aspect, pointer.y - last.y) > 1.5;
        if (moved && t - lastSpawn > 0.09) {
          add({ x: pointer.x, y: pointer.y, t0: t, amp: 0.5 });
          last = { ...pointer };
        }
        lastPointer = t;
      } else {
        last = null;
      }
      if (t - lastPointer > 2.2 && t - lastSpawn > 0.85) {
        add({ x: rand() * cols, y: rand() * rows, t0: t, amp: 0.6 + rand() * 0.4 });
      }
      while (list.length && t - list[0].t0 > LIFE) list.shift();

      for (const r of list) {
        const age = t - r.t0;
        if (age < 0) continue;
        const radius = age * speed;
        const width = 1 + age * 0.9;
        const fade = r.amp * (1 - age / LIFE) ** 1.5;
        const reach = radius + width * 3;
        // Only the cells around the ring's current band
        const y0 = Math.max(0, Math.floor(r.y - reach));
        const y1 = Math.min(rows - 1, Math.ceil(r.y + reach));
        const x0 = Math.max(0, Math.floor(r.x - reach / aspect));
        const x1 = Math.min(cols - 1, Math.ceil(r.x + reach / aspect));
        const rx = r.x * aspect;
        for (let y = y0; y <= y1; y++) {
          const dy = y + 0.5 - r.y;
          for (let x = x0; x <= x1; x++) {
            const dx = (x + 0.5) * aspect - rx;
            const d = Math.sqrt(dx * dx + dy * dy);
            const a = (d - radius) / width;
            if (a > 3 || a < -6) continue;
            // Leading ring plus a weaker trailing one
            const v = fade * (Math.exp(-a * a) + 0.4 * Math.exp(-((a + 2.6) ** 2)));
            const i = y * cols + x;
            if (v > 0.02) {
              if (v > V[i] * 0.5) H[i] = 175 + age * 45;
              V[i] = Math.min(1, V[i] + v);
            }
          }
        }
      }
    };
  },
};
