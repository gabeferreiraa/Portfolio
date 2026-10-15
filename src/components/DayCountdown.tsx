import { useEffect, useState } from "react";

// Milliseconds until midnight in the visitor's own timezone (from their device clock — no location needed)
function msUntilMidnight() {
  const now = new Date();
  const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  return midnight.getTime() - now.getTime();
}

function format(ms: number) {
  const total = Math.floor(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${h}h ${String(m).padStart(2, "0")}m ${String(s).padStart(2, "0")}s`;
}

// Counts down the rest of the visitor's day
export function DayCountdown({ className }: { className?: string }) {
  // Unknown during SSR (the server can't know the visitor's timezone); set after mount
  const [left, setLeft] = useState<number | null>(null);

  useEffect(() => {
    setLeft(msUntilMidnight());
    const id = setInterval(() => setLeft(msUntilMidnight()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    // Kept in the layout before mount so the line doesn't pop in and shift the page
    <p className={className} style={left === null ? { visibility: "hidden" } : undefined}>
      You have <span className="text-fg tabular-nums">{left === null ? "0h 00m 00s" : format(left)}</span> left to make
      the day great.
    </p>
  );
}
