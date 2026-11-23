// A tiny static file server for local checks.
//
// `vite preview` is an SPA server: it rewrites every unknown path to the root
// index.html, which hides the whole point of prerendering and makes a docs page
// hydrate against the home page's markup. This server resolves paths the way a
// static host does — directory index, then `.html`, then the 404 page — so what
// we check locally is what Azure Static Web Apps will serve.
//
// Usage: node scripts/serve-static.mjs [dir] [port]

import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";

const DIR = process.argv[2] ?? "dist";
const PORT = Number(process.argv[3] ?? 4173);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
};

/** The file a static host would serve for this URL, or undefined. */
function resolve(urlPath) {
  const clean = normalize(decodeURIComponent(urlPath.split("?")[0])).replace(/^(\.\.[/\\])+/, "");
  const candidates = [
    join(DIR, clean),
    join(DIR, clean, "index.html"),
    join(DIR, `${clean}.html`),
  ];

  for (const candidate of candidates) {
    if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;
  }
  return undefined;
}

createServer((request, response) => {
  const file = resolve(request.url ?? "/");
  const notFound = join(DIR, "404.html");

  if (!file) {
    response.writeHead(404, { "content-type": TYPES[".html"], "cache-control": "no-store" });
    if (existsSync(notFound)) createReadStream(notFound).pipe(response);
    else response.end("Not found");
    return;
  }

  response.writeHead(200, {
    "content-type": TYPES[extname(file)] ?? "application/octet-stream",
    "cache-control": "no-store",
  });
  createReadStream(file).pipe(response);
}).listen(PORT, () => {
  console.log(`Serving ${DIR} on http://localhost:${PORT}`);
});
