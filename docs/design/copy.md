# Qronos CLI — copy deck

Phase P0 artefact. Every string on the site comes from this file. If a sentence is not
here, it does not ship. Facts are from `qronos-cli` at **1.0.27**: Node `>=22.19.0`, MIT,
bins `qronos-cli` and `qronos`.

Rule for all copy: **say what it does, then what it costs, then the limit.** No hype.

---

## 1. Meta tags

| Page | `<title>` | `description` |
| :--- | :--- | :--- |
| `/` | Qronos CLI — the terminal that thinks in workflows | An AI coding agent in your terminal. Real tools, real edits, a 10-minute workflow engine, memory that survives the session. Free to start, MIT licensed. |
| `/docs` | Qronos CLI documentation | Install, commands, workflows, memory, compaction and every environment variable, in one place. |
| `/docs/workflows` | Workflows — Qronos CLI | Type `ultracode` and the model writes a script that fans work out to subagents. Pause, resume, replay, rerun a phase, retry only the failed agents. |
| `/docs/commands` | Commands — Qronos CLI | Every slash command and CLI flag Qronos understands. |
| `/docs/environment` | Environment variables — Qronos CLI | Every `QRONOS_*` setting with its default and its cap. |
| `/changelog` | Changelog — Qronos CLI | Every release, newest first, with what changed and why. |

---

## 2. Navigation

Left: wordmark **Qronos** `CLI` (the word CLI in mono, muted, 11px uppercase).
Links: `Features` · `Workflows` · `Docs` · `Changelog`
Right: `GitHub` (ghost) · **`Install`** (primary, copies `npx qronos-cli`)

---

## 3. Hero

**Eyebrow** (mono, uppercase, with a blinking dot):
`MIT LICENSED · v1.0.27 · NODE 22.19+`

**Headline — three options:**

1. **A terminal that thinks in *workflows*.**
2. **Your codebase, from the *terminal*.**
3. **Ship with an agent that *remembers*.**

**Chosen: option 1.** Reason: it is the one thing competitors do not have, and the italic
word carries the brand. Options 2 and 3 are kept here in case we A/B them later.

**Sub-headline** (max 2 lines, `--muted`, 16px):
`Reads your files, runs your shell, edits in place. When the job is big, one word — ultracode — turns it into a workflow with subagents, a live panel and a bill you can read.`

**Install block:**

```bash
npx qronos-cli
```

with a `Copy` button, and under it, mono 11px `--muted`:
`or npm install -g qronos-cli, then run qronos`

**Secondary CTA:** `Read the docs →` · **Tertiary:** `Star on GitHub`

**Hero visual:** terminal mock, real capture, in this order:

```
● Run the test suite · 2s
  ⎿ $ npm test -- --watch=false
    Test Files  148 passed (148)
         Tests  2469 passed (2469)

✻ Churned for 2m 30s · 14.2k tokens
> _
```

The wordmark **Qronos** in the mock header shimmers every 3 s (band of `--orange-pale`).

---

## 4. Proof strip (real facts only)

| Chip | Text |
| :--- | :--- |
| tick | `2 469 tests, 3 operating systems` |
| tick | `MIT licence, no telemetry required` |
| terminal | `npx qronos-cli` |
| clock | `10-minute workflow cap, reported, never silent` |
| key | `Sign in, or bring your own key` |

---

## 5. Features — six cards

Number, heading, two lines. Sentence case.

**01 — Workflows, not one-shot answers**
`Say ultracode. The model writes a small JavaScript script that fans the job out to subagents and returns only the answer, so a 30-agent audit does not flood your chat.`

**02 — A bill you can read**
`Tokens per agent and per phase, a bright green tick or a dark red cross, and a replay that costs nothing because it never calls the model again.`

**03 — It names its steps**
`Every shell call carries a short sentence — "List files in current directory" — above the command, so you know why before you know what.`

**04 — Memory that survives the session**
`Notes are journaled per project, folded into a small document, and injected as capped hints next time. Local, redacted, never duplicated across repos.`

**05 — Reads code, not guesses**
`Write a file and the language server checks it in the same turn. A bundled TypeScript server means you install nothing to get diagnostics.`

**06 — Your permissions, your door**
`Auto, edit-automatically, manual, plan, or skip-all. A subagent can never be more permissive than you are, and every tool call passes the same door.`

---

## 6. Workflows section

**Eyebrow:** `WORKFLOWS`
**Heading:** `One word, and the *plan* becomes work.`
**Body:**
`Type ultracode and the chat asks for a script instead of a paragraph. The script has five calls — agent, parallel, pipeline, phase, log — no disk, no network, no process. Its subagents have your tools and your permission door.`

**Three proof bullets:**

- `Capped, and it says so.` Ten minutes of wall clock, 1 000 agents, 16 running at once. Every cap is reported in the result, never applied in silence.
- `Pausable.` A pause lets work already paid for finish. Resume replays from the journal; a replayed agent is marked as replay and costs nothing.
- `Fixable.` Rerun one agent, rerun a whole phase, or retry only the red crosses. Each asks first, with the price.

**Panel mock** (two columns, mono): phases left with counts, agents right with model,
tokens, time; `p pause · x stop · s save · a rerun · f failed · enter view · esc close`.

---

## 7. Comparison (honest)

| | Qronos CLI | Claude Code | Aider | opencode |
| :--- | :--- | :--- | :--- | :--- |
| Open source | ✅ MIT | ❌ | ✅ Apache-2.0 | ✅ MIT |
| Runs in your terminal | ✅ | ✅ | ✅ | ✅ |
| Workflow script with subagents | ✅ | ⚠️ subagents, no script API | ❌ | ❌ |
| Step name above each shell call | ✅ | ✅ | ❌ | ❌ |
| Pause / resume / replay a run | ✅ | ❌ | ❌ | ❌ |
| Bring your own provider | ✅ | ⚠️ | ✅ | ✅ |
| Bundled language server | ✅ | ❌ | ❌ | ❌ |

Footnote, mono 11px `--muted`:
`Checked 2026-11. If a row is wrong, open an issue and we will fix it the same day.`

---

## 8. Quickstart

**Heading:** `Running in *one* command.`
**Body:** `No key needed to start: sign in with GitHub and inference is sponsored by the project. Prefer your own key? Point it at any OpenAI- or Anthropic-compatible endpoint.`

Three steps:

1. `npx qronos-cli` — or `npm install -g qronos-cli` for the shorter `qronos`
2. Choose **Sign in** or **Use my own API key**
3. Ask for something real: `explain this repo, then fix the failing test`

Code panel (second tab) for BYOK:

```bash
qronos --provider openai --api-key "$OPENAI_API_KEY"
qronos --base-url http://localhost:11434/v1 --model llama3
```

Note under it, `honest` callout:
`Your key is not saved by default: it stays in memory and is read from the environment next time. Storing it inline is an explicit opt-in.`

---

## 9. FAQ

**Is it really free?**
`The hosted gateway is sponsored, so you can start without a key or a card. You can also bring your own key and pay your provider directly. There is no paid tier of the CLI itself.`

**Which models can I use?**
`Anything OpenAI- or Anthropic-compatible: OpenAI, Anthropic, DeepSeek, Groq, OpenRouter, Ollama, or your own server. Sign in and you get the hosted catalogue.`

**Does it work on Windows?**
`Yes — Windows, macOS and Linux. CI runs the full suite on all three. On Windows the shell tool speaks PowerShell as well as bash.`

**What does it do with my code?**
`Files stay on your machine. Memory and workflow journals are written under ~/.qronos, redacted for secrets. Nothing is sent anywhere except the model calls you asked for.`

**Why does a shell command show a sentence above it?**
`Because the model wrote it. It is an optional field on the tool call — a five-word reason — so you can decide whether to read the command at all. Turn it off with QRONOS_TOOL_DESCRIPTIONS=0.`

**What happens if a workflow agent fails?**
`It becomes an error row, not a dead run. The rest finish, the report shows which one failed and why, and f retries only the failures.`

**Can I stop it mid-run?**
`Yes. x stops the run, k stops one agent. A stopped agent is amber, not red: you decided it, so it is not a failure.`

**Do I need Node?**
`Node 22.19 or newer. One command, no build step, no daemon.`

---

## 10. Closing CTA

Pulse dots (three, `--orange-pale`, decreasing opacity).
**Eyebrow:** `FREE TO START`
**Heading:** `Open a terminal. Type *ultracode*.`
**Buttons:** `Install Qronos CLI` (copies `npx qronos-cli`) · `Read the docs`
**Micro line:** `MIT · Node 22.19+ · Windows, macOS, Linux`

---

## 11. Footer

Columns:

- **Product** — Features · Workflows · Changelog · GitHub
- **Docs** — Getting started · Commands · Environment · Troubleshooting
- **Project** — Licence (MIT) · Privacy · Security · Contributing
- **Elsewhere** — npm · Qronos AI

Bottom line, mono 11px:
`© 2026 Qronos · Built in the terminal it ships.`

---

## 12. Docs page openings (one sentence each)

- **Getting started** — `From nothing to a first edit in two minutes.`
- **Install** — `npx, global, or a pinned version; what each one does.`
- **Commands** — `Every slash command, what it does, and what it costs.`
- **Workflows** — `The script API, the caps, and how to steer a run that is already going.`
- **Memory** — `What is remembered, where it is stored, and how to make it forget.`
- **Compaction** — `How a long session is summarised without losing the facts that matter.`
- **Hashline & LSP** — `Tags that make edits safe, and diagnostics without installing a server.`
- **Agent Hub** — `Watch subagents work, and chat with one while the others run.`
- **Step names** — `The optional sentence above a shell call, and why it is optional.`
- **Retry, stop, rerun** — `Three keys that fix a run without starting over.`
- **Environment** — `Every QRONOS_* variable, its default, and its clamp.`
- **Troubleshooting** — `The errors people actually hit, and the one-line fix.`

---

## 13. 404

**Heading:** `That page *left* the session.`
**Body:** `The link is old or the file moved. Try the docs, or open an issue and tell us where you came from.`
**Buttons:** `Docs` · `Home`
