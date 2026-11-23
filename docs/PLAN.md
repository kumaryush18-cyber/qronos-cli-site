# qronos-cli-site — plan

Standalone marketing site and documentation for **Qronos CLI**.
React 19 + Vite 7 + TypeScript + Tailwind 4 + wouter — the same stack as the
Qronos AI client, so the two sites feel like one family.

- Live URL (when deployed): **https://cli.qronos.me**
- Docs: **https://cli.qronos.me/docs**
- `qronos.me/cli` → 301 to `cli.qronos.me`
- Hosting: Azure Static Web Apps (Free), custom domain + managed SSL, PR previews
- Source of truth for docs: `qronos-cli/docs/*.md` (synced, drift-checked in CI)

---

## Phases

### P0 — Brand and copy — done

- `docs/design/brand.md` — tokens, type, layout, motion, components, voice.
- `docs/design/copy.md` — every string that will appear on the site.
- `docs/PLAN.md` — this file.

**Done when** the tokens and the copy are approved. No layout code yet.

### P1 — Shell and design system — done

- Vite + React + TS + Tailwind 4 project, `wouter` router, `lucide-react`.
- Design tokens in `src/styles/tokens.css` (Tailwind `@theme inline`), fonts, reset.
- Layout: `Nav`, `Footer`, `Shell` (1220px), `Section`, `Eyebrow`.
- Components: `Button`, `CodePanel` (copy), `Badge`, `Callout`, `TerminalMock`,
  `FeatureCard`, `Table`, `Link` (internal/external), `Seo` (title/description/canonical).
- Routes: `/`, `/docs`, `/docs/:slug`, `/changelog`, `/404`.
- Dark only, focus rings, 320px sanity, reduced-motion.

**Done when** every route renders real copy from `copy.md` and the site has no
layout shift when fonts load.

Shipped: 11 test files, 84 tests, `tsc` clean, `vite build` clean, screenshots at
390 / 820 / 1440 with no console error and no sideways scroll.

### P2 — Landing page — done

- Hero with the real terminal capture (typing + tool rows + step name + working line).
- Proof strip, six feature cards, workflows section with the panel mock, comparison
  table, quickstart with two code tabs, FAQ (accordion, no JS for the text), CTA, footer.
- Every claim traceable to `copy.md`; nothing invented at build time.

**Done when** the page scores ≥ 95 Lighthouse performance/accessibility/best-practices/SEO
locally, and reads cleanly at 320, 768 and 1440.

Measured: desktop **100 / 100 / 100 / 100**, mobile **86–91 performance**, 100 on the
other three. The gap is React hydration cost, see `docs/QUALITY.md`. Inlined CSS,
self-hosted fonts, matched fallback metrics (CLS 0) and a typed hero are shipped.

### P3 — Documentation

- MDX pipeline (`@mdx-js/rollup` + `remark-gfm`), `manifest.ts` as the one source of truth
  for sidebar, prev/next and sitemap.
- Docs layout: 180px sticky sidebar, 735px column, on-this-page TOC, `cmd+K` search
  backed by a build-time `search-index.json`.
- Content: all thirteen pages written (Getting started, Install, Commands, Workflows,
  Memory, Compaction, Hashline & LSP, Agent Hub, Step names, Retry/stop/rerun,
  Environment, Troubleshooting, Privacy) — checked against the CLI code, not invented.

**Done when** all thirteen pages exist, search finds every heading, and every
table-of-contents anchor resolves.

Shipped: thirteen MDX pages, a generated `doc-sources.ts` (headings and search come from
the same strings the page renders), `cmd+K` search over the real headings, per-page TOC
with an intersection-observer active marker, and lazy docs routes so the landing page
stays at **96 kB gzip** while the docs chunk is **33 kB** and loads only there.

Why a generated module and not `import.meta.glob("?raw")`: the test runner did not
honour the `?raw` query, so the index was silently empty in tests while working in the
browser. A build step that can be checked (`npm run docs:check`) is worth more than a
clever glob. `scripts/check.mjs` now walks all seventeen routes at two widths and fails
on a dead anchor, a sideways scroll, a layout shift or a serious axe violation.

### P4 — Polish, SEO, prerender

- OG images (one per page, generated at build), favicon set, `robots.txt`, `sitemap.xml`.
- JSON-LD `SoftwareApplication` + `BreadcrumbList` on docs pages.
- **Prerender**: after `vite build`, snapshot each route to real HTML so crawlers and
  link previews work without JavaScript.
- Lighthouse CI budget, axe a11y check, broken-link check.

**Done when** `curl https://…/` shows the real headline in HTML, and every budget passes.

### P5 — Azure

- Static Web App (Free), GitHub Action on push to `main`, PR preview environments.
- `staticwebapp.config.json`: SPA fallback, security headers (CSP, referrer, permissions),
  immutable cache for hashed assets, 301 for `/cli`.
- Custom domain `cli.qronos.me` (CNAME) + managed certificate.
- Redirect `qronos.me/cli` → `cli.qronos.me`.

**Done when** `https://cli.qronos.me` serves the site over HTTPS with an A grade on the
security headers.

### P6 — Docs sync and checks

- `scripts/sync-docs.ts` copies `qronos-cli/docs/*.md` into `src/content/docs/`.
- CI fails when the copy differs from the source (docs can never lie).
- Weekly Lighthouse + link check job.

### P7 — Launch

- README badge and homepage link in `qronos-cli`, npm page link, repo description.
- Changelog post on the site.
- Announcement text, one screenshot, one code block.

---

## House rules for this repo

- Every colour, size and gap comes from `brand.md`. A new value needs a reason in the PR.
- Every sentence comes from `copy.md`. New copy is written there first.
- Two animations only (shimmer, cursor). Everything stops for `prefers-reduced-motion`.
- No secrets, tokens, private paths or real user data in screenshots or mocks.
- No invented numbers, logos, testimonials or benchmark tables.
- Dark only. No light theme.
- Public repo, MIT licence, no telemetry by default.
