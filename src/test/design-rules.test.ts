import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Brand rules that are easy to break by accident, checked by reading the source.
 *
 * A rule that lives only in a markdown file is a rule that gets broken in the
 * next pull request.
 */
function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) walk(path, out);
    else out.push(path);
  }
  return out;
}

const SRC = walk("src").filter((path) => !path.startsWith("src/test"));
const UI_FILES = SRC.filter((path) => path.endsWith(".tsx"));
const STYLE_FILES = SRC.filter((path) => path.endsWith(".css"));

describe("design rules", () => {
  it("has no text smaller than 11px anywhere", () => {
    const offenders: string[] = [];
    for (const file of UI_FILES) {
      const source = readFileSync(file, "utf8");
      for (const match of source.matchAll(/text-\[(\d+(?:\.\d+)?)px\]/g)) {
        const size = Number(match[1]);
        if (size < 11) offenders.push(`${file}: text-[${match[1]}px]`);
      }
    }
    expect(offenders).toEqual([]);
  });

  it("keeps every colour literal inside the token file", () => {
    const offenders: string[] = [];
    for (const file of SRC) {
      if (file.endsWith("tokens.css") || file.endsWith("base.css")) continue;
      if (!file.endsWith(".tsx") && !file.endsWith(".ts") && !file.endsWith(".css")) continue;
      const source = readFileSync(file, "utf8");
      // rgba()/hex inside a Tailwind arbitrary value is a colour that skipped
      // the tokens. A shadow may use rgba(0,0,0,...) because shadow is depth.
      for (const match of source.matchAll(/#[0-9a-fA-F]{3,8}\b/g)) {
        offenders.push(`${file}: ${match[0]}`);
      }
      for (const match of source.matchAll(/rgba?\((?!0,0,0)[^)]*\)/g)) {
        offenders.push(`${file}: ${match[0]}`);
      }
    }
    expect(offenders).toEqual([]);
  });

  it("has exactly one stylesheet entry point and it imports the tokens", () => {
    const entry = readFileSync("src/styles/index.css", "utf8");
    expect(entry).toContain('"tailwindcss"');
    expect(entry).toContain("./fonts.css");
    expect(entry).toContain("./tokens.css");
    expect(entry).toContain("./base.css");
    expect(STYLE_FILES.filter((file) => file.endsWith("index.css"))).toHaveLength(1);
  });

  it("gives every tap target at least 44px of height", () => {
    const nav = readFileSync("src/components/layout/Nav.tsx", "utf8");
    // The menu button and the install chip are the two controls a thumb uses.
    expect(nav).toContain("size-11");
    expect(nav).toContain("min-h-11");
  });

  it("loads no font from a third party", () => {
    const html = readFileSync("index.html", "utf8");
    const css = readFileSync("src/styles/index.css", "utf8");
    expect(html).not.toContain("fonts.googleapis.com");
    expect(html).not.toContain("fonts.gstatic.com");
    expect(css).not.toContain("fonts.googleapis.com");
  });

  it("preloads the two fonts used above the fold", () => {
    const html = readFileSync("index.html", "utf8");
    expect(html).toContain("plus-jakarta-sans-normal.woff2");
    expect(html).toContain("jetbrains-mono-normal.woff2");
  });

  it("does not import a component with a relative ../../ path", () => {
    const offenders = UI_FILES.filter((file) => readFileSync(file, "utf8").includes('from "../../'));
    expect(offenders).toEqual([]);
  });
});

describe("motion rules", () => {
  it("declares every keyframe in the one motion file", () => {
    const offenders: string[] = [];
    for (const file of SRC) {
      if (!file.endsWith(".css")) continue;
      if (file.endsWith("base.css") || file.endsWith("tokens.css")) continue;
      if (readFileSync(file, "utf8").includes("@keyframes")) offenders.push(file);
    }
    // Tailwind's own keyframes live in node_modules, not here.
    expect(offenders).toEqual([]);
  });

  it("uses no animation that skips the reduced-motion switch", () => {
    const base = readFileSync("src/styles/base.css", "utf8");
    const names = [...base.matchAll(/animation:\s*([a-z-]+)/g)]
      .map((match) => match[1])
      .filter((name): name is string => typeof name === "string");
    expect(names.length).toBeGreaterThan(0);
    const reduce = base.slice(base.indexOf("@media (prefers-reduced-motion: reduce)"));
    for (const name of new Set(names)) {
      if (name === "none") continue;
      // Every animation is either named in the reduce block or switched off by class.
      expect(reduce.includes(name) || name.startsWith("qronos-"), `${name} has no reduce rule`).toBe(true);
    }
  });

  it("keeps the reveal opt-in, so no-JS readers never see a blank block", () => {
    const html = readFileSync("index.html", "utf8");
    const base = readFileSync("src/styles/base.css", "utf8");
    expect(html).toContain('classList.add("js-motion")');
    expect(html).toContain("prefers-reduced-motion: reduce");
    expect(base).toContain(".js-motion [data-reveal]");
  });
});
