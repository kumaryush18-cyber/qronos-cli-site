# Qronos CLI — brand and design system

Phase P0 artefact. Nothing here is implemented yet; this is the contract that P1–P4
build against. Every value below is either taken from the live Qronos AI site
(`qronos-ai/client/src/index.css`) or from the CLI itself (`src/shimmer.ts`,
`src/working-line.ts`), so the two products look like one family.

---

## 1. The idea

> **Qronos AI is a dark room with soft light. Qronos CLI is the same room, lit orange.**

The AI site is black, mono-typed and quiet. The CLI is black, mono-typed and **orange**,
because orange is what the product already is: the working line, the wordmark, the
shimmer. The site must not invent a second personality.

Three adjectives to test every screen against: **quiet, quick, honest.**

- **Quiet** — no gradients-as-decoration, no stock photos, no floating 3D blobs.
- **Quick** — the page is mostly HTML; motion is two effects, not twenty.
- **Honest** — no invented numbers. Every claim is a feature we can show in the terminal.

What we never do: hype words ("revolutionary", "10× faster"), fake logos of companies that
do not use it, fake testimonials, fake user counts.

---

## 2. Colour

Dark only. There is no light theme — orange on white fails both mood and contrast.

| Token | Hex | Use | Contrast |
| :--- | :--- | :--- | :--- |
| `--paper` | `#07070a` | page background | — |
| `--card` | `#0e0e12` | cards, code panels, nav (with blur) | — |
| `--line` | `rgba(255,255,255,0.09)` | every border, 1px | — |
| `--ink` | `#f7f8fc` | headings and body | 18.9 : 1 on paper |
| `--muted` | `#a8a8b6` | secondary text, captions | 8.6 : 1 |
| `--orange` | `#ff6b00` | accent, links, primary button, tick | 7.1 : 1 |
| `--orange-pale` | `#ffcd82` | **only** the wordmark and the shimmer band | 13.7 : 1 |
| `--orange-soft` | `rgba(255,107,0,0.12)` | icon tiles, chip backgrounds | — |
| `--ok` | `#2ee676` | finished, passed | 12.2 : 1 |
| `--fail` | `#ff5f6d` | failed, stopped is **not** red (see §6) | 6.8 : 1 |
| `--stop` | `#ffcd82` | a stopped agent — amber, never red | 13.7 : 1 |

Rules:

- Orange is an **accent**, never a background fill for large areas. The one exception is
  the primary button, which is orange text on a soft orange tint, not a solid block.
- Text on `--paper` never goes below `--muted` (8.6:1). No grey-on-grey.
- Colour never carries meaning alone: a tick and a cross also have a glyph and a word.

---

## 3. Type

| Role | Family | Size | Weight | Notes |
| :--- | :--- | :--- | :--- | :--- |
| Display | Plus Jakarta Sans | `clamp(48px, 5.2vw, 75px)` | 800 | `letter-spacing: -0.068em`, `line-height: 0.99` |
| Display italic | Playfair Display *italic* | same size | 500 | one word per headline, wrapped in `<em>` |
| Section heading | Plus Jakarta Sans | `clamp(37px, 4.2vw, 58px)` | 800 | `letter-spacing: -0.066em` |
| Card heading | Plus Jakarta Sans | 20–28px | 700 | `-0.045em` |
| Body | Plus Jakarta Sans | 13–16px | 400 | `line-height: 1.75`, colour `--muted` |
| UI label | JetBrains Mono | 9–11px | 700 | uppercase, `letter-spacing: 0.15em` |
| Code / terminal | JetBrains Mono | 11–13px | 400 | `line-height: 1.8` |
| Number | DM Mono | `clamp(46px, 7vw, 80px)` | 800 | `-0.09em`, for stats only |

- Fonts load from Google Fonts with `display=swap`; the four we actually use are
  Plus Jakarta Sans, JetBrains Mono, DM Mono and Playfair Display (italic only).
- Long copy breaks at 66 characters. Docs text column is 735px, never wider.
- No text is smaller than 11px anywhere, including the footer.

---

## 4. Layout

```
shell      1220px, padding 28px (22px under 820px)
nav        78px tall, blurred, 1px bottom border
hero       grid 1.03fr / 0.97fr, gap 66px
sections   padding 112px 28px (78px 22px on mobile)
grid gaps  14px between cards
radius     14px cards · 18px panels · 999px chips · 9px buttons
```

Spacing scale — only these numbers: `4 8 12 16 24 32 48 72 96 112`.

Breakpoints: `480`, `820`, `1100`. Every page must read at **320px** without horizontal
scroll. Cards in a grid always have equal heights.

---

## 5. Motion

Two animations. That is the whole budget.

1. **Shimmer** — a 4-cell band of `--orange-pale` travelling across the wordmark
   "Qronos" every **3000 ms**, taken from `src/shimmer.ts` (`SHIMMER_PERIOD_MS = 3_000`,
   `SHIMMER_BAND = 4`). Only ever on: the wordmark, the hero terminal's working line, and
   the primary button on hover.
2. **Cursor** — a block cursor blinking at `1s step-end`.

Plus, only on the terminal mock: typed characters appear at ~18 ms per character, tool rows
and output appear as whole blocks (never letter-by-letter — that is what a real terminal
does).

Easings: `cubic-bezier(0.22, 1, 0.36, 1)` (out), 160 ms for hover, 240 ms for panels.

`@media (prefers-reduced-motion: reduce)` turns the shimmer, the cursor and the typing into
static end states. The content is identical either way — motion never carries meaning.

---

## 6. Components

**Primary button** — orange text `#ff6b00` on `rgba(255,107,0,0.12)`, 1px orange border,
radius 9px, height 46px, weight 800. Hover: border brightens, lifts 1px, soft glow (one of
the three allowed glows). Active: `scale(0.97)`.

**Ghost button** — `--muted` text, no border, underline on hover.

**Code panel** — `--card` background, 1px `--line`, radius 14px, 42px top bar with a mono
label and a copy button, `JetBrains Mono` 11px, `line-height: 1.8`. The copy button says
`Copied` for 1.5 s and never says it if the clipboard call failed.

**Terminal mock** — the only "screenshot" on the site, and it is a **real capture**:

```
● Run the tests · 2s
  ⎿ $ npm test -- --watch=false
    ... 42 passed
✻ Churned for 2m 30s · 12.4k tokens
```

Dot is `--ok` when finished, `--fail` on error, `--muted` while running. The `⎿` line is
`--muted` for the glyph and `--ink` for the command. No window chrome, no traffic lights —
we are a terminal, not a Mac app.

**Feature card** — `--card`, 1px line, radius 14px, min-height 335px, mono number
(`01`…`06`) above the heading, icon tile 38px with `--orange-soft` background. Hover lifts
5px and the border takes `rgba(255,107,0,0.34)`.

**Table** — hairline rows, `JetBrains Mono` 11px for the first column, tick `--ok` / cross
`--fail` glyphs, no zebra stripes.

**Callout** — left 2px orange border, `--orange-soft` background at 40% opacity, 13px text.
Three kinds only: `note`, `warning`, `honest` (used when a claim has a limit).

**Focus** — 2px `--orange` outline, 2px offset, on every focusable element. Never removed.

---

## 7. Glow rules (non-negotiable)

Glow exists in exactly three places: the wordmark on hover, the working line in the
terminal mock, and the primary button on hover. Everything else is flat. This is the same
rule the CLI itself follows.

---

## 8. Iconography and images

- Icons: `lucide-react`, 1.5px stroke, 18–20px, `currentColor`.
- No photographs. No AI-generated art. Diagrams are SVG or code.
- Terminal captures must come from a demo project with no real token, path or secret.
  Anything that touches `~/.qronos`, an API key or a private repo is cropped or re-captured.

---

## 9. Voice

- Short sentences. Second person ("you"), never "we are excited".
- Say what it does, then what it costs, then the limit.
- Numbers only from the repo: version, test count, caps (`10 minutes`, `1000 agents`,
  `16 at once`). No marketing numbers.
- British spelling is fine if consistent; headings use sentence case.
