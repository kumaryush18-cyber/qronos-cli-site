/**
 * Local screenshots for review. Not part of the build.
 *
 * Usage: node scripts/shoot.mjs [baseUrl]
 * Output: shots/<route>-<width>.png
 */
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";

const BASE = process.argv[2] ?? "http://127.0.0.1:4173";
const ROUTES = [
  ["home", "/"],
  ["docs", "/docs"],
  ["docs-workflows", "/docs/workflows"],
  ["changelog", "/changelog"],
  ["404", "/nope"],
];
const WIDTHS = [1440, 820, 390];

await mkdir("shots", { recursive: true });

const browser = await chromium.launch();
const problems = [];

for (const width of WIDTHS) {
  const context = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  // The 404 route is meant to answer 404; the browser logs that as a console
  // error and it is not a defect.
  const expected404 = (url) => url.endsWith("/nope");

  page.on("console", (message) => {
    if (message.type() !== "error") return;
    if (message.text().includes("404") && page.url().endsWith("/nope")) return;
    problems.push(`${width} console: ${message.text()}`);
  });
  page.on("pageerror", (error) => problems.push(`${width} pageerror: ${error.message}`));

  for (const [name, route] of ROUTES) {
    await page.goto(`${BASE}${route}`, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(120);

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    if (overflow > 0) problems.push(`${width} ${route}: page scrolls sideways by ${overflow}px`);

    await page.screenshot({
      path: `shots/${name}-${width}.png`,
      fullPage: name === "home" && width === 1440,
    });
  }

  await context.close();
}

await browser.close();

if (problems.length) {
  console.log("PROBLEMS");
  for (const problem of problems) console.log(` - ${problem}`);
  process.exitCode = 1;
} else {
  console.log("No console errors, no page overflow sideways.");
}
