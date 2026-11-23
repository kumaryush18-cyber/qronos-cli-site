/*
 * The icon set.
 *
 * Apple will not use an SVG for a home-screen icon and most manifest readers
 * want a PNG, so the logo is drawn once in the browser and photographed at the
 * two sizes that are actually asked for. No image library, no guessing.
 *
 *   node scripts/icons.mjs   -> public/apple-touch-icon.png (180)
 *                               public/icon-512.png         (512)
 */
import { chromium } from "playwright";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");

const page_html = (size) => `<!doctype html>
<html><head><meta charset="utf-8"><style>
  * { margin: 0; }
  body { width: ${size}px; height: ${size}px; background: transparent; }
  svg { width: ${size}px; height: ${size}px; display: block; }
</style></head><body>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#07070a"/>
  <circle cx="32" cy="32" r="16" fill="none" stroke="#ff6b00" stroke-width="6"/>
  <path d="M40 42 L50 52" stroke="#ffcd82" stroke-width="6" stroke-linecap="round"/>
</svg>
</body></html>`;

const browser = await chromium.launch();

for (const [name, size] of [
  ["apple-touch-icon.png", 180],
  ["icon-512.png", 512],
]) {
  const page = await browser.newPage({ viewport: { width: size, height: size }, deviceScaleFactor: 1 });
  await page.setContent(page_html(size), { waitUntil: "load" });
  await page.screenshot({ path: resolve(root, "public", name), omitBackground: true, scale: "css" });
  await page.close();
  console.log(`wrote public/${name} (${size}x${size})`);
}

await browser.close();
