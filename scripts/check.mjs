/**
 * Local quality gate: accessibility, layout shift and sideways scroll.
 *
 * One browser, one page, routes visited one after another, then closed. It is
 * deliberately not parallel: this repository is developed in a small Codespace,
 * and three Chromium contexts at once is how a "high CPU" warning happens.
 *
 * Usage: node scripts/check.mjs [baseUrl]
 */
import { readFile } from "node:fs/promises";
import { chromium } from "playwright";

const BASE = process.argv[2] ?? "http://127.0.0.1:4173";
const ROUTES = ["/", "/docs", "/docs/workflows", "/changelog"];
const WIDTHS = [390, 1440];

const axeSource = await readFile(new URL("../node_modules/axe-core/axe.min.js", import.meta.url), "utf8");

const browser = await chromium.launch();
const problems = [];

try {
  for (const width of WIDTHS) {
    const context = await browser.newContext({ viewport: { width, height: 900 } });
    const page = await context.newPage();
    page.on("pageerror", (error) => problems.push(`${width}px pageerror: ${error.message}`));

    for (const route of ROUTES) {
      await page.goto(`${BASE}${route}`, { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(150);

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      if (overflow > 0) problems.push(`${width}px ${route}: page scrolls sideways by ${overflow}px`);

      const cls = await page.evaluate(() => {
        const shifts = performance.getEntriesByType("layout-shift");
        return shifts.reduce((sum, entry) => sum + (entry.hadRecentInput ? 0 : entry.value), 0);
      });
      if (cls > 0.05) problems.push(`${width}px ${route}: layout shift ${cls.toFixed(3)}`);

      await page.addScriptTag({ content: axeSource });
      const result = await page.evaluate(async () => {
        const run = await window.axe.run(document, {
          runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"] },
        });
        return run.violations.map((violation) => ({
          id: violation.id,
          impact: violation.impact,
          nodes: violation.nodes.length,
          target: violation.nodes[0]?.target?.join(" ") ?? "",
        }));
      });

      for (const violation of result) {
        if (violation.impact === "serious" || violation.impact === "critical") {
          problems.push(`${width}px ${route}: a11y ${violation.id} (${violation.nodes}) ${violation.target}`);
        }
      }
    }

    await context.close();
  }
} finally {
  await browser.close();
}

if (problems.length > 0) {
  console.log("PROBLEMS");
  for (const problem of problems) console.log(` - ${problem}`);
  process.exitCode = 1;
} else {
  console.log("a11y clean, layout shift under 0.05, no sideways scroll.");
}
