/**
 * Every string on the site, in one file.
 *
 * Source of truth: docs/design/copy.md. A sentence that is not in the copy deck
 * does not ship — write it in the deck first, then here.
 */
import type { TerminalLine } from "./terminal";

export interface Feature {
  readonly id: string;
  readonly title: string;
  readonly body: string;
}

export interface FaqItem {
  readonly question: string;
  readonly answer: string;
}

/** A comparison cell: how sure are we, and is there a caveat. */
export type CompareCell = { readonly state: "yes" | "no" | "partial"; readonly note?: string };

export interface CompareRow {
  readonly label: string;
  readonly qronos: CompareCell;
  readonly claudeCode: CompareCell;
  readonly aider: CompareCell;
  readonly opencode: CompareCell;
}

export interface QuickStep {
  readonly title: string;
  readonly detail: string;
}

export const HERO = {
  eyebrow: "MIT LICENSED · v1.0.27 · NODE 22.19+",
  headline: { before: "A terminal that thinks in ", accent: "workflows", after: "." },
  sub: "Reads your files, runs your shell, edits in place. When the job is big, one word — ultracode — turns it into a workflow with subagents, a live panel and a bill you can read.",
  installNote: "or npm install -g qronos-cli, then run qronos",
  secondary: "Read the docs",
  tertiary: "Star on GitHub",
} as const;

/** The hero terminal: a real capture of the test suite finishing. */
export const HERO_TERMINAL: readonly TerminalLine[] = [
  { kind: "step", text: "Run the test suite", seconds: 2, status: "ok" },
  { kind: "command", text: "npm test -- --watch=false" },
  { kind: "output", text: "Test Files  148 passed (148)" },
  { kind: "output", text: "     Tests  2469 passed (2469)" },
  { kind: "output", text: "" },
  { kind: "summary", text: "Churned for 2m 30s · 14.2k tokens" },
  { kind: "prompt", text: "" },
];

export const PROOF: readonly { readonly icon: "tick" | "clock" | "key" | "terminal"; readonly text: string }[] = [
  { icon: "tick", text: "2 469 tests, 3 operating systems" },
  { icon: "tick", text: "MIT licence, no account required for BYOK" },
  { icon: "clock", text: "10-minute workflow cap, reported, never silent" },
  { icon: "key", text: "Sign in, or bring your own key" },
];

export const FEATURES: readonly Feature[] = [
  {
    id: "01",
    title: "Workflows, not one-shot answers",
    body: "Say ultracode. The model writes a small JavaScript script that fans the job out to subagents and returns only the answer, so a 30-agent audit does not flood your chat.",
  },
  {
    id: "02",
    title: "A bill you can read",
    body: "Tokens per agent and per phase, a bright green tick or a dark red cross, and a replay that costs nothing because it never calls the model again.",
  },
  {
    id: "03",
    title: "It names its steps",
    body: 'Every shell call carries a short sentence — "List files in current directory" — above the command, so you know why before you know what.',
  },
  {
    id: "04",
    title: "Memory that survives the session",
    body: "Notes are journaled per project, folded into a small document, and injected as capped hints next time. Local, redacted, never duplicated across repos.",
  },
  {
    id: "05",
    title: "Reads code, not guesses",
    body: "Write a file and the language server checks it in the same turn. A bundled TypeScript server means you install nothing to get diagnostics.",
  },
  {
    id: "06",
    title: "Your permissions, your door",
    body: "Auto, edit-automatically, manual, plan, or skip-all. A subagent can never be more permissive than you are, and every tool call passes the same door.",
  },
];

export const WORKFLOWS = {
  eyebrow: "WORKFLOWS",
  headline: { before: "One word, and the ", accent: "plan", after: " becomes work." },
  body: "Type ultracode and the chat asks for a script instead of a paragraph. The script has five calls — agent, parallel, pipeline, phase, log — no disk, no network, no process. Its subagents have your tools and your permission door.",
  bullets: [
    {
      title: "Capped, and it says so.",
      body: "Ten minutes of wall clock, 1 000 agents, 16 running at once. Every cap is reported in the result, never applied in silence.",
    },
    {
      title: "Pausable.",
      body: "A pause lets work already paid for finish. Resume replays from the journal; a replayed agent is marked as replay and costs nothing.",
    },
    {
      title: "Fixable.",
      body: "Rerun one agent, rerun a whole phase, or retry only the red crosses. Each asks first, with the price.",
    },
  ],
  panelHint: "p pause · x stop · s save · a rerun · f failed · enter view · esc close",
  panel: [
    { phase: "Scout", agents: "3/3", tokens: "6.1k", note: "done" },
    { phase: "Read", agents: "4/4", tokens: "11.8k", note: "done" },
    { phase: "Report", agents: "1/1", tokens: "3.2k", note: "writing" },
  ],
} as const;

export const COMPARISON: {
  readonly rows: readonly CompareRow[];
  readonly footnote: string;
} = {
  rows: [
    {
      label: "Open source",
      qronos: { state: "yes", note: "MIT" },
      claudeCode: { state: "no" },
      aider: { state: "yes", note: "Apache-2.0" },
      opencode: { state: "yes", note: "MIT" },
    },
    {
      label: "Runs in your terminal",
      qronos: { state: "yes" },
      claudeCode: { state: "yes" },
      aider: { state: "yes" },
      opencode: { state: "yes" },
    },
    {
      label: "Workflow script with subagents",
      qronos: { state: "yes" },
      claudeCode: { state: "partial", note: "subagents, no script" },
      aider: { state: "no" },
      opencode: { state: "partial", note: "subagents, no script" },
    },
    {
      label: "Step name above each shell call",
      qronos: { state: "yes" },
      claudeCode: { state: "yes" },
      aider: { state: "no" },
      opencode: { state: "no" },
    },
    {
      label: "Pause, resume or replay a run",
      qronos: { state: "yes" },
      claudeCode: { state: "no" },
      aider: { state: "no" },
      opencode: { state: "no" },
    },
    {
      label: "Local model through Ollama",
      qronos: { state: "yes" },
      claudeCode: { state: "no" },
      aider: { state: "yes" },
      opencode: { state: "yes" },
    },
    {
      label: "Any OpenAI- or Anthropic-wire provider",
      qronos: { state: "yes" },
      claudeCode: { state: "partial", note: "first-party, Bedrock, Vertex" },
      aider: { state: "yes" },
      opencode: { state: "yes" },
    },
  ],
  footnote:
    "Checked 2026-11. These are the project's own features, not benchmarks. If a row is wrong, open an issue and we will fix it the same day.",
};

export const QUICKSTART = {
  headline: { before: "Running in ", accent: "one", after: " command." },
  body: "No key needed to start: sign in with GitHub and inference is sponsored by the project. Prefer your own key? Point it at any OpenAI- or Anthropic-compatible endpoint.",
  steps: [
    { title: "Install", detail: "npx qronos-cli — or npm install -g qronos-cli for the shorter qronos" },
    { title: "Choose", detail: "Sign in, or use my own API key" },
    { title: "Ask", detail: "explain this repo, then fix the failing test" },
  ] satisfies readonly QuickStep[],
  byok: [
    'qronos --provider openai --api-key "$OPENAI_API_KEY"',
    "qronos --base-url http://localhost:11434/v1 --model llama3",
  ],
  keyNote:
    "Your key is not saved by default: it stays in memory and is read from the environment next time. Storing it inline is an explicit opt-in.",
} as const;

export const FAQ: readonly FaqItem[] = [
  {
    question: "Is it really free?",
    answer:
      "The hosted gateway is sponsored, so you can start without a key or a card. You can also bring your own key and pay your provider directly. There is no paid tier of the CLI itself.",
  },
  {
    question: "Which models can I use?",
    answer:
      "Anything OpenAI- or Anthropic-compatible: OpenAI, Anthropic, DeepSeek, Groq, OpenRouter, Ollama, or your own server. Sign in and you get the hosted catalogue.",
  },
  {
    question: "Does it work on Windows?",
    answer:
      "Yes — Windows, macOS and Linux. CI runs the full suite on all three. On Windows the shell tool speaks PowerShell as well as bash.",
  },
  {
    question: "What does it do with my code?",
    answer:
      "Files stay on your machine. Memory and workflow journals are written under ~/.qronos, redacted for secrets. Nothing is sent anywhere except the model calls you asked for.",
  },
  {
    question: "Why does a shell command show a sentence above it?",
    answer:
      "Because the model wrote it. It is an optional field on the tool call — a five-word reason — so you can decide whether to read the command at all. Turn it off with QRONOS_TOOL_DESCRIPTIONS=0.",
  },
  {
    question: "What happens if a workflow agent fails?",
    answer:
      "It becomes an error row, not a dead run. The rest finish, the report shows which one failed and why, and f retries only the failures.",
  },
  {
    question: "Can I stop it mid-run?",
    answer:
      "Yes. x stops the run, k stops one agent. A stopped agent is amber, not red: you decided it, so it is not a failure.",
  },
  {
    question: "Do I need Node?",
    answer: "Node 22.19 or newer. One command, no build step, no daemon.",
  },
];

export const CLOSING = {
  eyebrow: "FREE TO START",
  headline: { before: "Open a terminal. Type ", accent: "ultracode", after: "." },
  micro: "MIT · Node 22.19+ · Windows, macOS, Linux",
} as const;

export const FOOTER = {
  columns: [
    {
      title: "Product",
      links: [
        { label: "Features", to: "/#features" },
        { label: "Workflows", to: "/#workflows" },
        { label: "Changelog", to: "/changelog" },
        { label: "GitHub", to: "https://github.com/kumaryush18-cyber/qronos-cli" },
      ],
    },
    {
      title: "Docs",
      links: [
        { label: "Getting started", to: "/docs/getting-started" },
        { label: "Commands", to: "/docs/commands" },
        { label: "Environment", to: "/docs/environment" },
        { label: "Troubleshooting", to: "/docs/troubleshooting" },
      ],
    },
    {
      title: "Project",
      links: [
        { label: "Licence (MIT)", to: "https://github.com/kumaryush18-cyber/qronos-cli/blob/main/LICENSE" },
        { label: "Privacy", to: "/docs/privacy" },
        { label: "Security", to: "https://github.com/kumaryush18-cyber/qronos-cli/security" },
        { label: "Contributing", to: "https://github.com/kumaryush18-cyber/qronos-cli/blob/main/NOTICE" },
      ],
    },
    {
      title: "Elsewhere",
      links: [
        { label: "npm", to: "https://www.npmjs.com/package/qronos-cli" },
        { label: "Qronos AI", to: "https://qronos.me" },
      ],
    },
  ],
  legal: "© 2026 Qronos · Built in the terminal it ships.",
} as const;

export const NOT_FOUND = {
  headline: { before: "That page ", accent: "left", after: " the session." },
  body: "The link is old or the file moved. Try the docs, or open an issue and tell us where you came from.",
} as const;
