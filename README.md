# qronos-cli-site

Marketing site and documentation for [Qronos CLI](https://github.com/kumaryush18-cyber/qronos-cli).

**Status: phase P1 done.** The shell, tokens, components and all five routes exist
and render the real copy. The landing page gets its polish in P2 and the docs bodies
arrive in P3.

- Stack (planned): React 19 · Vite 7 · TypeScript · Tailwind 4 · wouter
- Target URL: https://cli.qronos.me (docs under `/docs`)
- Hosting: Azure Static Web Apps (Free plan)

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # 84 tests
npm run lint     # tsc --noEmit
npm run build    # dist/ — plain files for Azure
node scripts/shoot.mjs   # screenshots + overflow check (needs `npm run preview`)
```

## Read first

- [`docs/PLAN.md`](docs/PLAN.md) — phases P0–P7 and the house rules
- [`docs/design/brand.md`](docs/design/brand.md) — colour, type, layout, motion, components
- [`docs/design/copy.md`](docs/design/copy.md) — every string that will appear on the site

## Rules

Every colour, gap and animation comes from `brand.md`. Every sentence comes from `copy.md`.
Nothing is invented: numbers, logos and testimonials must be real or absent.
