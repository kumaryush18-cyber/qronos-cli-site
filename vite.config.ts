import { fileURLToPath, URL } from "node:url";
import mdx from "@mdx-js/rollup";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { defineConfig } from "vite";
import { inlineCss } from "./scripts/plugins/inline-css";

// Static site: everything in `dist/` is plain files, which is exactly what
// Azure Static Web Apps serves. No server, no SSR.
export default defineConfig({
  plugins: [
    // MDX before React: the MDX plugin compiles .mdx into a JSX module that the
    // React plugin then handles like any other component.
    mdx({
      remarkPlugins: [remarkGfm],
      rehypePlugins: [rehypeSlug],
    }),
    react(),
    tailwindcss(),
    inlineCss(),
  ],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  build: {
    outDir: "dist",
    // One CSS file keeps the first paint to two requests (html + css).
    cssCodeSplit: false,
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    css: false,
  },
});
