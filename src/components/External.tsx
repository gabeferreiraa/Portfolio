import type { ReactNode } from "react";

// Link that opens in a new tab, with a visible arrow and a screen-reader hint
export function External({ href, className, children }: { href: string; className?: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
      <span aria-hidden="true" className="ml-0.5 inline-block text-[0.85em] text-muted">
        ↗
      </span>
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
