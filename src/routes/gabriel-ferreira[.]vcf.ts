import { createFileRoute } from "@tanstack/react-router";
import { buildVCard } from "../tap/vcard";

// Contact card for /tap. Server-only (no component), so it isn't prerendered
// and always reflects src/content.ts.
export const Route = createFileRoute("/gabriel-ferreira.vcf")({
  server: {
    handlers: {
      GET: () =>
        new Response(buildVCard(), {
          headers: {
            "Content-Type": "text/vcard; charset=utf-8",
            "Content-Disposition": 'attachment; filename="Gabriel-Ferreira.vcf"',
            "Cache-Control": "public, max-age=3600, s-maxage=86400",
          },
        }),
    },
  },
});
