import { External } from "./External";
import { intro } from "../content";

// The opening paragraphs, shared by the homepage and /resume
export function Intro({ className }: { className?: string }) {
  return (
    <div className={className}>
      {intro.map((parts, i) => (
        <p key={i}>
          {parts.map((part, j) =>
            typeof part === "string" ? (
              part
            ) : (
              <External key={j} href={part.href}>
                {part.label}
              </External>
            ),
          )}
        </p>
      ))}
    </div>
  );
}
