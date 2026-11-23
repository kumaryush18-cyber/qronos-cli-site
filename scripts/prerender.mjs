// Turns the client build into real HTML per route.
//
// Why: a single-page shell means a crawler, a link preview and a reader with
// JavaScript off all see an empty <div id="root">. This script runs the same
// <App /> on the server, writes dist/<route>/index.html, and injects the title,
// description, canonical and OG tags for that route.
//
// Usage: node scripts/prerender.mjs   (after `vite build` and the SSR build)

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";

const ROUTES = [
  "/",
  "/docs",
  "/changelog",
  "/docs/getting-started",
  "/docs/install",
  "/docs/commands",
  "/docs/workflows",
  "/docs/memory",
  "/docs/compaction",
  "/docs/hashline-lsp",
  "/docs/agent-hub",
  "/docs/step-names",
  "/docs/retry-stop-rerun",
  "/docs/environment",
  "/docs/troubleshooting",
  "/docs/privacy",
];

const OUT = process.env.PRERENDER_OUT ?? "dist";
const TEMPLATE = `${OUT}/index.html`;
const SSR_ENTRY = process.env.SSR_ENTRY ?? "dist-ssr/entry-server.js";

if (!existsSync(TEMPLATE) || !existsSync(SSR_ENTRY)) {
  console.error("Run the client build and the SSR build first.");
  process.exit(1);
}

const { render, headTags, jsonLd, breadcrumbJsonLd } = await import(new URL(`../${SSR_ENTRY}`, import.meta.url).href);
const template = readFileSync(TEMPLATE, "utf8");

/** Put one route's content and head into the built HTML. */
function pageHtml(route, body) {
  let html = template.replace('<div id="root"></div>', `<div id="root">${body}</div>`);

  // Replace, never append: two <title> tags is how a page ends up with the
  // wrong title in a search result.
  html = html.replace(/<title>[\s\S]*?<\/title>/, headTags(route));
  html = html.replace(/\s*<meta\s+name="description"[\s\S]*?\/>/, "");
  html = html.replace("</head>", `    ${jsonLd()}\n    ${breadcrumbJsonLd(route)}\n  </head>`);

  return html;
}

function outPath(route) {
  if (route === "/") return join(OUT, "index.html");
  return join(OUT, route.replace(/^\//, ""), "index.html");
}

let count = 0;
for (const route of ROUTES) {
  const body = await render(route);

  // Guards a whole class of broken files: a lazy component that suspended on the
  // server leaves a boundary marker and a bootstrap script in the HTML, and the
  // browser then hydrates a tree the file does not describe.
  if (body.includes("$RC(") || body.includes("<!--$-->")) {
    console.error(`Route ${route} suspended during prerender; the HTML would not hydrate.`);
    process.exit(1);
  }
  const file = outPath(route);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, pageHtml(route, body));
  count += 1;
}

// 404: Azure Static Web Apps serves this file for an unknown path.
const notFound = await render("/404");
writeFileSync(join(OUT, "404.html"), pageHtml("/404", notFound));
count += 1;

// robots.txt and sitemap.xml, generated from the same list of routes so a new
// page cannot be forgotten.
const today = new Date().toISOString().slice(0, 10);
// The sitemap must list the URL that answers 200, not the one that redirects:
// docs pages are directories, so they carry a trailing slash.
const urls = ROUTES.map((route) => {
  const bare = route.replace(/\/+$/, "");
  const dir = bare === "/" ? "" : bare;
  const path = dir === "" ? "/" : dir.startsWith("/docs") ? `${dir}/` : dir;
  return `  <url><loc>https://cli.qronos.me${path}</loc><lastmod>${today}</lastmod></url>`;
}).join("\n");

writeFileSync(
  `${OUT}/sitemap.xml`,
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
);
writeFileSync(`${OUT}/robots.txt`, `User-agent: *\nAllow: /\n\nSitemap: https://cli.qronos.me/sitemap.xml\n`);

console.log(`Prerendered ${count} routes, plus sitemap.xml and robots.txt.`);
