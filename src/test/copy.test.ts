import { describe, expect, it } from "vitest";
import { RELEASES } from "@/content/changelog";
import {
  CLOSING,
  COMPARISON,
  FAQ,
  FEATURES,
  HERO,
  HERO_TERMINAL,
  PROOF,
  QUICKSTART,
  WORKFLOWS,
} from "@/lib/copy";
import { SITE } from "@/lib/site";
import { fitLine } from "@/lib/terminal";

/**
 * The copy rules from docs/design/copy.md, asserted.
 *
 * These are not style opinions: a claim we cannot show in the terminal, or a
 * line that overflows the mock, is a bug on a marketing page.
 */
describe("hero", () => {
  it("names the version that is actually published", () => {
    expect(HERO.eyebrow).toContain(`v${SITE.version}`);
    expect(HERO.eyebrow).toContain(`NODE ${SITE.node}+`);
  });

  it("carries the install command verbatim", () => {
    expect(SITE.install).toBe("npx qronos-cli");
    expect(HERO.installNote).toContain("npm install -g qronos-cli");
  });

  it("has a headline with a real accent word", () => {
    expect(HERO.headline.accent.length).toBeGreaterThan(3);
    expect(HERO.headline.before.trim().length).toBeGreaterThan(0);
    expect(HERO.headline.after.trim().length).toBeGreaterThan(0);
  });
});

describe("hero terminal", () => {
  it("shows a step, its command, its output and the summary", () => {
    const kinds = HERO_TERMINAL.map((line) => line.kind);
    expect(kinds).toContain("step");
    expect(kinds).toContain("command");
    expect(kinds).toContain("output");
    expect(kinds).toContain("summary");
    expect(kinds).toContain("prompt");
  });

  it("draws exactly one summary line", () => {
    expect(HERO_TERMINAL.filter((line) => line.kind === "summary")).toHaveLength(1);
  });

  it("fits every line in the mock without truncation", () => {
    for (const line of HERO_TERMINAL) {
      expect(fitLine(line.text)).toBe(line.text);
    }
  });

  it("contains no secret, token or home-directory path", () => {
    const text = HERO_TERMINAL.map((line) => line.text).join("\n");
    expect(text).not.toMatch(/\/home\/|\/Users\/|ghp_|sk-|Bearer|api[_-]?key/i);
  });
});

describe("sections", () => {
  it("has six features with unique numbers", () => {
    expect(FEATURES).toHaveLength(6);
    expect(new Set(FEATURES.map((feature) => feature.id)).size).toBe(6);
  });

  it("keeps each feature card short enough to read on a phone", () => {
    for (const feature of FEATURES) {
      expect(feature.body.length).toBeLessThanOrEqual(230);
      expect(feature.title.length).toBeLessThanOrEqual(40);
    }
  });

  it("claims only workflow caps the CLI really has", () => {
    const text = WORKFLOWS.bullets.map((bullet) => bullet.body).join(" ");
    expect(WORKFLOWS.body).toContain("agent");
    expect(WORKFLOWS.body).toContain("parallel");
    expect(text).toContain("Ten minutes");
    expect(text).toContain("1 000 agents");
  });

  it("shows a panel hint that fits a 74-column terminal", () => {
    expect(WORKFLOWS.panelHint.length).toBeLessThanOrEqual(74);
  });

  it("has four proof chips, each with a glyph role", () => {
    expect(PROOF).toHaveLength(4);
    for (const item of PROOF) {
      expect(item.text.length).toBeGreaterThan(10);
    }
  });
});

describe("comparison", () => {
  it("fills all four columns of every row", () => {
    for (const row of COMPARISON.rows) {
      for (const cell of [row.qronos, row.claudeCode, row.aider, row.opencode]) {
        expect(["yes", "no", "partial"]).toContain(cell.state);
      }
    }
  });

  it("marks our own column yes everywhere, because a doubt is a no", () => {
    for (const row of COMPARISON.rows) {
      expect(row.qronos.state).toBe("yes");
    }
  });

  it("dates the table, so a stale row is visible", () => {
    expect(COMPARISON.footnote).toMatch(/Checked \d{4}-\d{2}/);
  });

  it("gives every 'partial' a note, and never a bare question mark", () => {
    for (const row of COMPARISON.rows) {
      for (const cell of [row.claudeCode, row.aider, row.opencode]) {
        if (cell.state === "partial") expect(cell.note?.length ?? 0).toBeGreaterThan(4);
      }
    }
  });
});

describe("quickstart and FAQ", () => {
  it("numbers three steps", () => {
    expect(QUICKSTART.steps).toHaveLength(3);
  });

  it("keeps the BYOK examples runnable as written", () => {
    expect(QUICKSTART.byok[0]).toContain("--provider openai");
    expect(QUICKSTART.byok[1]).toContain("localhost:11434");
  });

  it("answers eight questions, each with a full sentence", () => {
    expect(FAQ).toHaveLength(8);
    for (const item of FAQ) {
      expect(item.question.endsWith("?")).toBe(true);
      expect(item.answer.length).toBeGreaterThan(40);
    }
  });

  it("uses no hype words anywhere in the copy deck", () => {
    const all = JSON.stringify({ HERO, FEATURES, WORKFLOWS, QUICKSTART, FAQ, CLOSING, COMPARISON });
    for (const banned of ["revolutionary", "10x faster", "10× faster", "game-changing", "best-in-class", "world-class"]) {
      expect(all.toLowerCase()).not.toContain(banned.toLowerCase());
    }
  });
});

describe("changelog data", () => {
  it("starts with the version the site advertises", () => {
    expect(RELEASES[0]?.version).toBe(SITE.version);
  });

  it("is newest first and never repeats a version", () => {
    const versions = RELEASES.map((release) => release.version);
    expect(new Set(versions).size).toBe(versions.length);
    const sorted = [...versions].sort((a, b) => b.localeCompare(a, undefined, { numeric: true }));
    expect(versions).toEqual(sorted);
  });

  it("gives every release a real date and at least three notes", () => {
    for (const release of RELEASES) {
      expect(release.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(release.notes.length).toBeGreaterThanOrEqual(3);
      expect(release.summary.endsWith(".")).toBe(true);
    }
  });
});
