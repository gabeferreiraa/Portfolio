import { plot, rng, type EffectDef } from "../engine";

type Star = { x: number; y: number; z: number; h: number };

const STREAK = 0.07; // tail length in depth units, so streaks show even in a still frame

export const warp: EffectDef = {
  id: "warp",
  name: "Warp",
  caption: "A transition flourish, e.g. on the contact form's success state. Up to 700 streaks: cheap, cost follows star count not area.",
  still: 2,
  create() {
    const rand = rng(3);
    const stars: Star[] = [];
    const spawn = (s: Star, far: boolean) => {
      s.x = rand() * 2 - 1;
      s.y = rand() * 2 - 1;
      s.z = far ? 1 : 0.1 + rand() * 0.9;
      s.h = rand() < 0.8 ? 205 + rand() * 50 : 30 + rand() * 20;
    };

    return (f) => {
      const { cols, rows, aspect, t, dt } = f;
      const target = Math.min(700, Math.floor((cols * rows) / 12));
      while (stars.length < target) {
        const s = { x: 0, y: 0, z: 0, h: 0 };
        spawn(s, false);
        stars.push(s);
      }
      const W = cols * aspect;
      const cx = W / 2 + Math.sin(t * 0.2) * W * 0.04;
      const cy = rows / 2 + Math.cos(t * 0.17) * rows * 0.04;
      const F = Math.max(W, rows) * 0.42;
      for (let k = 0; k < target; k++) {
        const s = stars[k];
        s.z -= dt * 0.3;
        if (s.z <= 0.03) spawn(s, true);
        const hx = cx + (s.x / s.z) * F;
        const hy = cy + (s.y / s.z) * F;
        if (hx < 0 || hy < 0 || hx > W || hy > rows) {
          spawn(s, true);
          continue;
        }
        const tz = s.z + STREAK;
        const tx = cx + (s.x / tz) * F;
        const ty = cy + (s.y / tz) * F;
        const head = Math.min(1, 0.2 + 0.85 * (1 - s.z));
        const len = Math.hypot((hx - tx) / aspect, hy - ty);
        const steps = Math.min(60, Math.ceil(len * 1.5) + 1);
        for (let n = 0; n <= steps; n++) {
          const a = n / steps; // 0 at the tail, 1 at the head
          plot(f, (tx + (hx - tx) * a) / aspect, ty + (hy - ty) * a, head * (0.15 + 0.85 * a * a), s.h);
        }
      }
    };
  },
};
