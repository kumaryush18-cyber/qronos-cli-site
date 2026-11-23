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

  it("does not import a component with a relative ../../ path", () => {
    const offenders = UI_FILES.filter((file) => readFileSync(file, "utf8").includes('from "../../'));
    expect(offenders).toEqual([]);
  });
});
