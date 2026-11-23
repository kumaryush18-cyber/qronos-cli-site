/*
 * The share card.
 *
 * A generated image got the headline text wrong (a model drawing letters is not
 * a typesetter), so the card is drawn by the browser from the same tokens and the
 * same font files as the site. It is deterministic: run it twice, get the same
 * bytes.
 *
 *   node scripts/og.mjs            -> public/og.png (1200x630)
 */
import { chromium } from "playwright";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");

const CARD = (fontCss) => `<!doctype html>
<html><head><meta charset="utf-8"><style>
${fontCss}
* { box-sizing: border-box; margin: 0; }
body {
  width: 1200px; height: 630px; overflow: hidden;
  background: #07070a; color: #f4f2ef;
  font-family: "Plus Jakarta Sans", system-ui, sans-serif;
  display: flex; align-items: center; gap: 56px; padding: 0 72px;
  position: relative;
}
.glow {
  position: absolute; inset: -200px auto auto -160px; width: 620px; height: 620px;
  background: radial-gradient(circle, rgba(255, 107, 0, 0.20), transparent 68%);
}
.left { position: relative; width: 610px; }
.eyebrow {
  display: flex; align-items: center; gap: 10px;
  font-family: "JetBrains Mono", monospace; font-size: 15px; letter-spacing: 0.16em;
  color: #ffcd82; text-transform: uppercase; margin-bottom: 26px;
}
.dot { width: 9px; height: 9px; border-radius: 999px; background: #ff6b00; }
h1 { font-size: 62px; line-height: 1.06; font-weight: 800; letter-spacing: -0.03em; }
h1 em { font-style: normal; color: #ff6b00; }
.sub { margin-top: 24px; font-size: 21px; line-height: 1.45; color: #a9a49d; }
.panel {
  position: relative; width: 430px; border-radius: 18px;
  border: 1px solid rgba(255, 107, 0, 0.25); background: #0e0e13;
  box-shadow: 0 30px 90px rgba(255, 107, 0, 0.10);
  overflow: hidden;
}
.bar { display: flex; gap: 7px; padding: 15px 18px; border-bottom: 1px solid rgba(255, 255, 255, 0.06); }
.bar i { width: 9px; height: 9px; border-radius: 999px; background: #2a2a33; }
.bar i:first-child { background: #ff6b00; }
.term {
  font-family: "JetBrains Mono", monospace; font-size: 14.5px; line-height: 2.05;
  padding: 20px 22px 26px; color: #cfcac4;
}
.term b { color: #ffcd82; font-weight: 500; }
.term span { color: #2ee676; }
.term u { text-decoration: none; color: #78b4ff; }
</style></head>
<body>
  <div class="glow"></div>
  <div class="left">
    <div class="eyebrow"><span class="dot"></span>Qronos CLI</div>
    <h1>A terminal that thinks<br>in <em>workflows</em>.</h1>
    <p class="sub">Many agents, one run. Retry, stop and replay any of them.<br>Free, open source, and it installs in one line.</p>
  </div>
  <div class="panel">
    <div class="bar"><i></i><i></i><i></i></div>
    <div class="term">
      <b>$</b> qronos<br>
      <u>✻</u> Orchestrating 6 agents<br>
      <span>✓</span> plan &nbsp; <span>✓</span> build<br>
      <span>✓</span> test &nbsp; <span>✓</span> review<br>
      <b>⏵</b> workflow finished in 2m 30s
    </div>
  </div>
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });

// Reuse the site's own font files so the card cannot drift from the site.
const fontCss = `
@font-face { font-family: "Plus Jakarta Sans"; font-weight: 400 800; font-display: block;
  src: url("file://${root}/public/fonts/plus-jakarta-sans-normal.woff2") format("woff2"); }
@font-face { font-family: "JetBrains Mono"; font-weight: 400 700; font-display: block;
  src: url("file://${root}/public/fonts/jetbrains-mono-normal.woff2") format("woff2"); }`;

await page.setContent(CARD(fontCss), { waitUntil: "load" });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(150);
await page.screenshot({ path: resolve(root, "public/og.png") });
await browser.close();

console.log("wrote public/og.png (1200x630)");
