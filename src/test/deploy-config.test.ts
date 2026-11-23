import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(__dirname, "../..");
const html = readFileSync(resolve(root, "index.html"), "utf8");
const config = JSON.parse(readFileSync(resolve(root, "public/staticwebapp.config.json"), "utf8"));

/** The text between the one inline `<script>` tag in index.html. */
function inlineScript(): string {
  const match = /<script>([\s\S]*?)<\/script>/.exec(html);
  const body = match?.[1];
  if (body === undefined) throw new Error("index.html has no inline script");
  return body;
}

describe("staticwebapp.config.json", () => {
  it("is valid JSON with the headers a static host needs", () => {
    const headers = config.globalHeaders;
    expect(headers["X-Content-Type-Options"]).toBe("nosniff");
    expect(headers["Referrer-Policy"]).toBe("strict-origin-when-cross-origin");
    expect(headers["Permissions-Policy"]).toContain("camera=()");
    expect(headers["Content-Security-Policy"]).toContain("frame-ancestors 'none'");
  });

  it("allows scripts from the site and the one hashed inline script only", () => {
    const policy: string = config.globalHeaders["Content-Security-Policy"];
    const scriptSrc = policy
      .split(";")
      .map((part) => part.trim())
      .find((part) => part.startsWith("script-src"));
    expect(scriptSrc).toBeDefined();
    expect(scriptSrc).toContain("'self'");
    expect(scriptSrc).not.toContain("'unsafe-inline'");
    expect(scriptSrc).not.toContain("'unsafe-eval'");
    expect(scriptSrc).toContain("'sha256-");
  });

  it("the script hash matches the inline script that really ships", () => {
    const hash = createHash("sha256").update(inlineScript(), "utf8").digest("base64");
    const policy: string = config.globalHeaders["Content-Security-Policy"];
    // A mismatch means the browser blocks the script: motion silently stops and
    // no-JS readers see content, but the reveal class is never added.
    expect(policy).toContain(`'sha256-${hash}'`);
  });

  it("never allows a third-party origin to run in the page", () => {
    const policy: string = config.globalHeaders["Content-Security-Policy"];
    expect(policy).not.toMatch(/https?:\/\//);
    expect(policy).toContain("default-src 'self'");
    expect(policy).toContain("frame-ancestors 'none'");
  });

  it("caches hashed assets for a year and keeps HTML fresh", () => {
    const assets = config.routes.find((route: { route: string }) => route.route === "/assets/*");
    const docs = config.routes.find((route: { route: string }) => route.route === "/docs/*");
    expect(assets.headers["cache-control"]).toContain("immutable");
    expect(docs.headers["cache-control"]).toContain("must-revalidate");
  });

  it("answers an unknown path with the 404 page and a 404 status", () => {
    expect(config.responseOverrides["404"].rewrite).toBe("/404.html");
    expect(config.responseOverrides["404"].statusCode).toBe(404);
  });
});

describe("the share card", () => {
  it("exists at exactly the size link previews expect", () => {
    const png = readFileSync(resolve(root, "public/og.png"));
    // PNG: 8 signature bytes, then the IHDR chunk with width and height.
    expect(png.subarray(1, 4).toString("ascii")).toBe("PNG");
    expect(png.readUInt32BE(16)).toBe(1200);
    expect(png.readUInt32BE(20)).toBe(630);
    expect(png.byteLength).toBeGreaterThan(10_000);
  });

  it("is the image every page advertises", () => {
    expect(html).toBeTruthy();
    const tags = readFileSync(resolve(root, "src/lib/head-tags.ts"), "utf8");
    expect(tags).toContain("/og.png");
  });
});

describe("icons and manifest", () => {
  const manifest = JSON.parse(readFileSync(resolve(root, "public/site.webmanifest"), "utf8"));

  it("the manifest points at files that exist", () => {
    for (const icon of manifest.icons) {
      expect(() => readFileSync(resolve(root, "public", icon.src.replace(/^\//, "")))).not.toThrow();
    }
  });

  it("the page links the icon set a phone needs", () => {
    expect(html).toContain('rel="apple-touch-icon"');
    expect(html).toContain('rel="manifest"');
    expect(html).toContain('rel="icon"');
  });
});
