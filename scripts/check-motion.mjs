/**
 * Motion checks: the animation is real, and it gets out of the way when asked.
 *
 * These cannot be unit tests: they are about the browser actually running the
 * CSS. Two contexts, used one after the other (this repository is developed in a
 * small Codespace — three at once is how a "high CPU" warning happens).
 *
 * Usage: node scripts/check-motion.mjs [baseUrl]
 */
import { chromium } from "playwright";

const BASE = process.argv[2] ?? "http://localhost:4173";
const problems = [];
const browser = await chromium.launch();

// --- 1. Motion allowed ------------------------------------------------------
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "no-preference" });
  const page = await context.newPage();
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });

  const opts = await page.evaluate(() => {
    const glow = document.querySelector(".glow-drift");
    const shimmer = document.querySelector(".shimmer");
    return {
      jsMotion: document.documentElement.classList.contains("js-motion"),
      glowAnimation: glow ? getComputedStyle(glow).animationName : "missing",
      shimmerAnimation: shimmer ? getComputedStyle(shimmer).animationName : "missing",
      total: document.querySelectorAll("[data-reveal]").length,
      // Class, not opacity: a block that has just started fading is on its way in.
      inViewHidden: [...document.querySelectorAll("[data-reveal]:not(.is-in)")].filter((element) => {
        const box = element.getBoundingClientRect();
        return box.top < window.innerHeight && box.bottom > 0;
      }).length,
      inViewTotal: [...document.querySelectorAll("[data-reveal]")].filter((element) => {
        const box = element.getBoundingClientRect();
        return box.top < window.innerHeight && box.bottom > 0;
      }).length,
    };
  });

  if (!opts.jsMotion) problems.push("home: js-motion class missing, so no reveal would ever run");
  if (opts.glowAnimation !== "qronos-drift") problems.push(`home: glow animation is ${opts.glowAnimation}`);
  if (opts.shimmerAnimation !== "qronos-shimmer") problems.push(`home: wordmark animation is ${opts.shimmerAnimation}`);
  if (opts.total === 0) problems.push("home: no [data-reveal] elements found");
  // A tall block needs more than a sliver on screen before the observer fires,
  // so this only asserts that the reveal is working at all. Completeness is
  // checked after the page has been scrolled to the end.
  if (opts.inViewTotal > 0 && opts.inViewHidden === opts.inViewTotal) {
    problems.push("home: nothing on the first screen revealed");
  }

  // Blocks below the fold must be revealed as they arrive. A tall section needs
  // more than a sliver on screen before the observer fires, so the assertion is
  // made after the whole page has been scrolled, not at every step.
  for (let y = 0; y < 12000; y += 500) {
    await page.evaluate((top) => window.scrollTo({ top }), y);
    await page.waitForTimeout(120);
  }
  await page.waitForTimeout(400);
  const neverRevealed = await page.evaluate(
    () => document.querySelectorAll("[data-reveal]:not(.is-in)").length,
  );
  if (neverRevealed > 0) problems.push(`home: ${neverRevealed} blocks never revealed while scrolling`);

  // A revealed block must actually move, not just change opacity.
  const moved = await page.evaluate(() => {
    const first = document.querySelector("[data-reveal].is-in");
    if (!first) return false;
    const style = getComputedStyle(first);
    return style.transitionProperty.includes("opacity") && style.transitionProperty.includes("translate");
  });
  if (!moved) problems.push("home: reveal has no transition on opacity and translate");

  // Proof that something visibly moves: sample the drifting glow's transform
  // twice. A screenshot cannot be used here — Playwright waits for animations to
  // finish before it captures, and an infinite loop never finishes.
  await page.evaluate(() => window.scrollTo({ top: 0 }));
  const sample = () =>
    page.evaluate(() => getComputedStyle(document.querySelector(".glow-drift")).transform);
  const before = await sample();
  await page.waitForTimeout(1400);
  const after = await sample();
  if (before === after) problems.push("home: the glow transform did not change in 1.4 s, so nothing visibly moves");

  // And the switch must be able to stop it.
  await page.evaluate(() => {
    document.documentElement.dataset.motion = "off";
  });
  await page.waitForTimeout(120);
  const stopped = await page.evaluate(() => getComputedStyle(document.querySelector(".glow-drift")).animationName);
  if (stopped !== "none") problems.push(`motion switch: glow still animates (${stopped})`);
  await page.evaluate(() => {
    delete document.documentElement.dataset.motion;
  });

  await context.close();
}

// --- 2. Reduced motion ------------------------------------------------------
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });

  const opts = await page.evaluate(() => {
    const glow = document.querySelector(".glow-drift");
    const shimmer = document.querySelector(".shimmer");
    const hidden = [...document.querySelectorAll("[data-reveal]")].filter(
      (element) => Number(getComputedStyle(element).opacity) < 0.99,
    ).length;
    return {
      jsMotion: document.documentElement.classList.contains("js-motion"),
      glowAnimation: glow ? getComputedStyle(glow).animationName : "none",
      shimmerAnimation: shimmer ? getComputedStyle(shimmer).animationName : "none",
      hidden,
    };
  });

  if (opts.jsMotion) problems.push("reduced motion: js-motion was still added, so blocks could start hidden");
  if (opts.glowAnimation !== "none") problems.push(`reduced motion: glow still animates (${opts.glowAnimation})`);
  if (opts.shimmerAnimation !== "none") problems.push(`reduced motion: shimmer still animates (${opts.shimmerAnimation})`);
  if (opts.hidden > 0) problems.push(`reduced motion: ${opts.hidden} blocks are less than fully visible`);

  await context.close();
}

// --- 3. No JavaScript: content is not hidden ---------------------------------
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(`${BASE}/docs/workflows`, { waitUntil: "domcontentloaded" });

  const result = await page.evaluate(() => ({
    h1: document.querySelector("h1")?.textContent ?? "",
    sections: document.querySelectorAll("h2").length,
    hidden: [...document.querySelectorAll("[data-reveal]")].filter(
      (element) => Number(getComputedStyle(element).opacity) < 0.99,
    ).length,
  }));

  if (!result.h1.includes("Workflows")) problems.push("no JS: the prerendered h1 is missing");
  if (result.sections < 3) problems.push(`no JS: only ${result.sections} h2 sections in the HTML`);
  if (result.hidden > 0) problems.push(`no JS: ${result.hidden} blocks are invisible`);

  await context.close();
}

await browser.close();

if (problems.length > 0) {
  console.log("PROBLEMS");
  for (const problem of problems) console.log(` - ${problem}`);
  process.exitCode = 1;
} else {
  console.log("Motion runs, reduced motion stops it, and no-JS pages stay readable.");
}
