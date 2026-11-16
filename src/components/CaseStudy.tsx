import type { ReactNode } from "react";
import type { Stat } from "../content";

// Two-digit index used across the case study pages: 1 → "01"
export const pad = (n: number) => String(n).padStart(2, "0");

// Oversized numbers with a short label under each. The value comes first visually
// and in reading order, so screen readers hear "2.5M+, Streams across…".
export function StatRow({ stats, size = "lg" }: { stats: Stat[]; size?: "lg" | "sm" }) {
  const lg = size === "lg";
  return (
    <ul
      className={
        lg
          ? "grid border-y border-line/40 sm:grid-cols-3 sm:divide-x sm:divide-line/40"
          : "grid grid-cols-3 gap-4"
      }
    >
      {stats.map((s) => (
        <li
          key={s.label}
          className={lg ? "border-b border-line/40 py-6 last:border-b-0 sm:border-b-0 sm:px-6 sm:first:pl-0 sm:last:pr-0" : ""}
        >
          <p
            className={
              lg
                ? "text-[2.5rem] leading-none font-medium tracking-tight tabular-nums sm:text-[2.75rem]"
                : "text-[1.0625rem] leading-tight font-medium tabular-nums"
            }
          >
            {s.value}
          </p>
          <p className={lg ? "mt-3 text-sm leading-snug text-muted" : "mt-1 text-xs leading-snug text-muted"}>
            {s.label}
          </p>
        </li>
      ))}
    </ul>
  );
}

// Label column on the left from sm up, stacked on phones
export function Block({ id, index, title, children }: { id: string; index: number; title: string; children: ReactNode }) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className="mt-14 sm:mt-16 sm:grid sm:grid-cols-[9rem_1fr] sm:gap-8"
    >
      <h2 id={`${id}-heading`} className="mb-3 text-[1.0625rem] font-medium sm:mb-0 sm:text-[0.9375rem]">
        <span className="mr-2 text-sm text-muted tabular-nums sm:block sm:mr-0">{pad(index)}</span>
        {title}
      </h2>
      <div>{children}</div>
    </section>
  );
}
