import { readdir, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { Plugin } from "vite";

/**
 * Inline the one stylesheet into `index.html` at build time.
 *
 * The stylesheet is 7 kB gzipped; as a separate file it blocks the first paint
 * for one full round trip on a slow connection. Inlined, the browser has the
 * whole page in one response. Lighthouse measured 1.5 s of render-blocking time
 * before this existed.
 *
 * It runs in `closeBundle`, after Vite has written `index.html`, so it works on
 * the real output instead of guessing a hashed file name.
 */
export function inlineCss(): Plugin {
  return {
    name: "qronos-inline-css",
    apply: "build",
    async closeBundle() {
      const outDir = join(process.cwd(), "dist");
      const htmlPath = join(outDir, "index.html");
      const html = await readFile(htmlPath, "utf8");

      const link = /<link rel="stylesheet"[^>]*href="\/(assets\/[^"]+\.css)"[^>]*>/;
      const match = link.exec(html);
      if (!match?.[1]) return;

      const cssPath = join(outDir, match[1]);
      const css = await readFile(cssPath, "utf8");

      const inlined = html.replace(match[0], `<style>${css}</style>`);
      await writeFile(htmlPath, inlined, "utf8");
      await rm(cssPath, { force: true });

      // The sourcemap, if one was written, no longer describes anything.
      const maps = await readdir(join(outDir, "assets")).catch(() => [] as string[]);
      for (const file of maps) {
        if (file.startsWith(match[1].replace("assets/", "")) && file.endsWith(".map")) {
          await rm(join(outDir, "assets", file), { force: true });
        }
      }
    },
  };
}
