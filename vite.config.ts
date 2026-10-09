import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";

export default defineConfig({
  server: { port: 3000 },
  resolve: { tsconfigPaths: true },
  plugins: [
    tailwindcss(),
    // Prerender "/" to static HTML; the contact server function still runs on Vercel
    tanstackStart({ prerender: { enabled: true, crawlLinks: false } }),
    // Nitro builds the Vercel output (auto-detected on Vercel)
    nitro(),
    // React's plugin must come after Start's plugin
    viteReact(),
  ],
});
