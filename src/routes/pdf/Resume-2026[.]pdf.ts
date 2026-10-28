import { createFileRoute } from "@tanstack/react-router";

// The resume's previous filename. Kept so links shared before the rename still work.
export const Route = createFileRoute("/pdf/Resume-2026.pdf")({
  server: {
    handlers: {
      GET: () => new Response(null, { status: 308, headers: { Location: "/pdf/Gabriel-Ferreira-Resume.pdf" } }),
    },
  },
});
