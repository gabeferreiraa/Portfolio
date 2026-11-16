import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";
import { caseStudies } from "./src/content";

export default defineConfig({
  server: { port: 3000 },
  resolve: { tsconfigPaths: true },
  plugins: [
    tailwindcss(),
    // Prerender "/" to static HTML; the contact server function still runs on Vercel
    // Dynamic routes aren't discovered without crawling, so case studies are listed explicitly
    tanstackStart({
      prerender: { enabled: true, crawlLinks: false },
      pages: caseStudies.map((c) => ({ path: `/case-study/${c.slug}` })),
    }),
    // Nitro builds the Vercel output (auto-detected on Vercel)
    nitro(),
    // React's plugin must come after Start's plugin
    viteReact(),
  ],
});
