import { createFileRoute } from "@tanstack/react-router";

// The page's original URL. Kept so stickers and links written before the rename still work.
export const Route = createFileRoute("/meet-me")({
  server: {
    handlers: {
      GET: ({ request }) =>
        new Response(null, { status: 308, headers: { Location: `/tap${new URL(request.url).search}` } }),
    },
  },
});
