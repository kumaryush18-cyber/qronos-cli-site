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
