/** Site-wide facts. Numbers here must be verifiable in the CLI repo. */
export const SITE = {
  name: "Qronos CLI",
  wordmark: { lead: "Qronos", trailing: "CLI" },
  url: "https://cli.qronos.me",
  repo: "https://github.com/kumaryush18-cyber/qronos-cli",
  npm: "https://www.npmjs.com/package/qronos-cli",
  aiSite: "https://qronos.me",
  version: "1.0.27",
  node: "22.19",
  licence: "MIT",
  install: "npx qronos-cli",
  installGlobal: "npm install -g qronos-cli",
  alias: "qronos",
  description:
    "An AI coding agent in your terminal. Real tools, real edits, a 10-minute workflow engine, memory that survives the session. Free to start, MIT licensed.",
} as const;

/** Nav links, in order. `to` is a wouter path. */
export const NAV_LINKS = [
  { label: "Features", to: "/#features" },
  { label: "Workflows", to: "/#workflows" },
  { label: "Docs", to: "/docs" },
  { label: "Changelog", to: "/changelog" },
] as const;
