/**
 * Site changelog. One entry per released CLI version, newest first.
 *
 * The full, unbundled history lives in the CLI repo (`src/changelog.ts` and
 * CHANGELOG.md). This file is the short version a reader of the site needs:
 * what changed, in one line each. Keep the newest `version` equal to
 * qronos-cli's `package.json`.
 */
export interface ReleaseEntry {
  readonly version: string;
  readonly date: string;
  readonly summary: string;
  readonly notes: readonly string[];
}

export const RELEASES: readonly ReleaseEntry[] = [
  {
    version: "1.0.27",
    date: "2026-11-23",
    summary: "A shell call now says what it is doing.",
    notes: [
      "Every Bash call carries an optional `description` — “List files in current directory” — and the transcript prints it above the command.",
      "The sentence is cleaned and cut at 90 characters; a description that only repeats the command is dropped.",
      "Without one, the old `Bash(command)` line is drawn, so old sessions and workflow agents keep working.",
      "QRONOS_TOOL_DESCRIPTIONS=0 removes the field from the schema and the line from the display.",
      "Proved on claude-haiku-5.5: 11 checks, and the model filled the field on 2 of 2 calls unprompted.",
    ],
  },
  {
    version: "1.0.26",
    date: "2026-11-22",
    summary: "A workflow that stopped before it started, fixed.",
    notes: [
      "Every run died with “ctx.tools is not iterable”, so no agent ever ran a tool.",
      "Cause: the permission door copied the host context, and a copy loses fields kept behind a getter.",
      "The door now forwards the context instead of copying it; a context with no tool list gives an empty list.",
      "The test harness now has the host's shape, so the same bug cannot pass a test again.",
    ],
  },
  {
    version: "1.0.25",
    date: "2026-11-22",
    summary: "Only the agents that failed run again.",
    notes: [
      "`f` in the panel, or /workflows retry <id>, picks the red crosses and leaves every good answer alone.",
      "It asks first, with the count, the names and what the first attempt spent.",
      "A stopped agent is not a failed one, and the answer says so.",
      "The schema now travels with the record, so a retried agent cannot pass a schema it failed the first time.",
    ],
  },
  {
    version: "1.0.24",
    date: "2026-11-21",
    summary: "A whole phase can be run again.",
    notes: [
      "`a` in the panel, or /workflows rerun <id> <phase>, runs every agent of that phase, one at a time.",
      "It asks first, with the phase, the agent count and the earlier spend.",
      "It is new work, not a replay: tokens rise and every row says it ran again.",
      "One agent that cannot run does not stop the rest.",
    ],
  },
  {
    version: "1.0.23",
    date: "2026-11-20",
    summary: "Stop one agent without stopping the run.",
    notes: [
      "`k` in the panel, or /workflows stop <id> <agent>, stops the agent you are looking at.",
      "A word that matches two agents is refused with the list: stopping the wrong agent spends money on the wrong work.",
      "A stopped agent is amber, never red: you decided it, so it is not a failure.",
      "A stop saves the rest of a call, never the call; what was already spent stays on the bill.",
    ],
  },
];
