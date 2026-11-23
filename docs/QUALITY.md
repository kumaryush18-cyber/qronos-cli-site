# Local quality gate

Two scripts, both run against `npm run preview` on port 4173. They are sequential
on purpose: this project is developed in a small Codespace, and three Chromium
contexts at once is how a "high CPU" warning happens.

```bash
npm run build
npm run preview &
node scripts/check.mjs     # accessibility, layout shift, sideways scroll
node scripts/shoot.mjs     # screenshots at 390 / 820 / 1440, console errors
```

## What `check.mjs` proves

- **axe-core**, WCAG 2.1 A + AA and best practice, on four routes at 390px and
  1440px. Only `serious` and `critical` findings fail the run.
- **Layout shift** (`layout-shift` entries) stays under 0.05 on every route.
- **No sideways scroll**: `scrollWidth` equals `clientWidth` at both widths.

A11y is not a one-off: two real bugs were found this way and both are now fixed.

1. The wordmark is two spans with a flex gap, so its text was `QronosCLI`. An
   `aria-label` of "Qronos CLI home" did not contain the visible text and axe
   flagged `label-content-name-mismatch`. Fixed by putting the space in a
   screen-reader-only span and dropping the label.
2. The mobile comparison table used a negative margin and made the whole page
   scroll sideways. It is now a card layout below 640px.

## Lighthouse, measured

| Mode | Performance | Accessibility | Best practices | SEO |
| :--- | :--- | :--- | :--- | :--- |
| Desktop | **100** | **100** | **100** | **100** |
| Mobile (4x CPU, slow 4G) | 86–91 | **100** | **100** | **100** |

Mobile performance sits below the 95 target, and the honest reason is **React
hydration**: the page ships ~97 kB of JavaScript (gzip), and evaluating it under a
4x CPU throttle costs 290–390 ms of total blocking time. Everything cheap has
already been done:

- fonts are self-hosted and deduplicated (292 kB → 104 kB), latin subset only;
- the stylesheet is **inlined** at build time, so the first paint needs no second
  round trip (this alone took FCP from 1.8 s to 1.5 s);
- the two above-the-fold fonts are preloaded with matched fallback metrics, so
  CLS is 0.

Getting to 95 on mobile means shipping less JavaScript, and the only way to do
that meaningfully is to stop hydrating static sections — a real architecture
change, not a tweak. That decision belongs in P4, with the numbers above on the
table.

## Docs bundle (P3)

Adding thirteen MDX pages raised the single bundle from 97 kB to 131 kB gzip, so
the docs routes were split out with `React.lazy`:

| Chunk | Size (gzip) | Loaded when |
| :--- | :--- | :--- |
| `index` (home, nav, footer) | **96 kB** | every visit |
| `DocsSidebar` (all MDX bodies + search index) | 33 kB | a docs page only |
| `DocPage` | 2.4 kB | a docs page only |
| `Changelog` | 1.8 kB | changelog only |

So the landing page pays nothing for the documentation.

## The gate

`node scripts/check.mjs` walks **17 routes at two widths** (390 px and 1440 px) and
fails on:

- a serious or critical axe violation (WCAG 2.1 A/AA + best practice);
- a layout shift above 0.05;
- any sideways scroll;
- any in-page link pointing at an id the page does not have.

Current result: **a11y clean, layout shift under 0.05, no sideways scroll**, 17
routes × 2 widths. Tests: **137 in 16 files**.

## Prerender and motion (P4)

Every route is now a real HTML file: `dist/docs/workflows/index.html` holds the
article text, not an empty `<div id="root">`. `npm run build` runs the client
build, an SSR build of the same `<App />`, then `scripts/prerender.mjs`, which
writes 17 routes plus `404.html`, `sitemap.xml` and `robots.txt`, and puts the
per-route title, description, canonical, OG and Twitter tags in the head.

### The hydration trap, and how it was found

Three separate mistakes each made React throw the prerendered tree away:

1. **A Suspense boundary that existed on only one side.** Lazy docs pages left
   boundary markers and a small bootstrap script in the file; the client rendered
   a boundary the file did not describe. Fix: route chunks are held in a small
   registry that `main.tsx` fills *before* hydration, and the same registry is
   filled by the server entry. No Suspense, no markers.
2. **A custom property in an inline style.** React serialises `--reveal-i:0` on
   the server and `--reveal-i: 0;` in the browser, and that difference alone was
   a mismatch. Fix: the stagger is a `data-i` attribute read by CSS.
3. **`vite preview` is an SPA server.** It rewrites `/docs` to the root
   `index.html`, so the page hydrated against the *home* markup. Every local check
   was green for the wrong reason. Fix: `scripts/serve-static.mjs` resolves paths
   the way a static host does — directory index, then `.html`, then `404.html` —
   and `npm run preview` uses it.

A fourth cause is guarded in the build: if a route suspends during prerender,
`scripts/prerender.mjs` fails instead of writing an HTML file that cannot hydrate.

### Motion

Six animations, all documented in `docs/design/brand.md` and all cancelled by
`prefers-reduced-motion: reduce`:

| Animation | Where | Length |
| :--- | :--- | :--- |
| shimmer | wordmark, working line | 3000 ms loop |
| cursor | terminal | 1 s step-end |
| reveal | sections, cards, lists | 620 ms once |
| drift | one glow behind the hero | 26 s alternate |
| pulse | a running agent dot | 1.8 s loop |
| underline | nav links | 160 ms |

`scripts/check-motion.mjs` proves three things in a real browser: the animations
run, reduced motion stops all of them and shows everything at once, and a page
with JavaScript switched off is still readable.

Two bugs came out of that check:

- **The reduced-motion block was declared before the animations it cancels**, so
  a later `.shimmer` rule won. It now sits at the end of the stylesheet.
- **The 520 px glow made a 390 px page scroll sideways by 46 px.** It is clipped
  by its wrapper now.

### Measuring LCP honestly

The hero headline must never start at `opacity: 0`: that moves the
largest-contentful-paint time to the end of the animation. The hero now rises with
a translate only, and the terminal card has no entrance animation at all — a
translate on a block that large is counted as a layout shift (CLS 0.10 before it
was removed).

Fonts use `font-display: optional` rather than `swap`: the fallback metrics were
close but not equal at display sizes, and the swap re-wrapped the headline by 47 px
(CLS 0.10). With `optional` the first visit may paint in the fallback and the
second uses the real face; CLS went 0.10 → **0.0001**.

### The measured numbers

| Profile | Performance | Accessibility | Best practices | SEO |
| :--- | :--- | :--- | :--- | :--- |
| Desktop | **99–100** | **100** | **100** | **100** |
| Mobile (4x CPU, simulated slow 4G) | **70–77** | **100** | **100** | **100** |

Mobile: TBT 265–530 ms, LCP 3.5–3.65 s, CLS 0.0001. This machine has **two cores**
and the agent itself uses a third of one, so repeated runs vary by several points;
the range, not the best run, is what is written down. The gap to 95 is hydration
of a React tree plus a 96 kB gzip bundle, and the next honest step is not a tweak —
it is measuring on a stable CI runner and then deciding whether to drop hydration
for the static sections.

### The gates

| Command | What it proves |
| :--- | :--- |
| `npm test` | 145 tests in 17 files |
| `npm run build` | client build, SSR build, 17 prerendered routes, sitemap, robots |
| `npm run preview` | the built site, served like a static host |
| `node scripts/check.mjs` | 17 routes × 2 widths: axe, CLS < 0.05, no sideways scroll, no dead anchor |
| `node scripts/check-motion.mjs` | animations run, reduced motion stops them, no-JS stays readable |

Last run: a11y clean, layout shift under 0.05, no sideways scroll, motion correct,
no console errors.
