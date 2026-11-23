import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useEffect, useRef, useMemo, Children, isValidElement, useLayoutEffect, StrictMode } from "react";
import { renderToPipeableStream } from "react-dom/server";
import { useLocation, Link, Switch, Route, Router } from "wouter";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Search, ArrowLeft, ArrowRight, X, Menu, Check, Minus, MoveRight, Terminal, KeyRound, Timer, Workflow, ReceiptText, TextQuote, Brain, Code2, ShieldCheck } from "lucide-react";
import GithubSlugger from "github-slugger";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
function Eyebrow({ children, dot = false, className }) {
  return /* @__PURE__ */ jsxs("p", { className: cn("eyebrow", className), children: [
    dot ? /* @__PURE__ */ jsx("span", { "aria-hidden": true, className: "size-1.5 rounded-full bg-orange" }) : null,
    children
  ] });
}
function Shell({ children, className }) {
  return /* @__PURE__ */ jsx("div", { className: cn("mx-auto w-full max-w-[1220px] px-[22px] sm:px-7", className), children });
}
function Section({ children, id, spacing = "normal", className, labelledBy }) {
  return /* @__PURE__ */ jsx(
    "section",
    {
      id,
      "aria-labelledby": labelledBy,
      className: cn(
        spacing === "normal" ? "py-[64px] sm:py-[80px]" : "py-12 sm:py-16",
        "scroll-mt-[96px]",
        className
      ),
      children: /* @__PURE__ */ jsx(Shell, { children })
    }
  );
}
const TONES$1 = {
  neutral: "border-line text-muted",
  orange: "border-orange-line bg-orange-soft text-orange",
  ok: "border-ok/30 text-ok"
};
function Badge({ children, className, tone = "neutral" }) {
  return /* @__PURE__ */ jsx(
    "span",
    {
      className: cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[11px] uppercase tracking-[0.14em]",
        TONES$1[tone],
        className
      ),
      children
    }
  );
}
const RELEASES = [
  {
    version: "1.0.27",
    date: "2026-11-23",
    summary: "A shell call now says what it is doing.",
    notes: [
      "Every Bash call carries an optional `description` — “List files in current directory” — and the transcript prints it above the command.",
      "The sentence is cleaned and cut at 90 characters; a description that only repeats the command is dropped.",
      "Without one, the old `Bash(command)` line is drawn, so old sessions and workflow agents keep working.",
      "QRONOS_TOOL_DESCRIPTIONS=0 removes the field from the schema and the line from the display.",
      "Proved on claude-haiku-5.5: 11 checks, and the model filled the field on 2 of 2 calls unprompted."
    ]
  },
  {
    version: "1.0.26",
    date: "2026-11-22",
    summary: "A workflow that stopped before it started, fixed.",
    notes: [
      "Every run died with “ctx.tools is not iterable”, so no agent ever ran a tool.",
      "Cause: the permission door copied the host context, and a copy loses fields kept behind a getter.",
      "The door now forwards the context instead of copying it; a context with no tool list gives an empty list.",
      "The test harness now has the host's shape, so the same bug cannot pass a test again."
    ]
  },
  {
    version: "1.0.25",
    date: "2026-11-22",
    summary: "Only the agents that failed run again.",
    notes: [
      "`f` in the panel, or /workflows retry <id>, picks the red crosses and leaves every good answer alone.",
      "It asks first, with the count, the names and what the first attempt spent.",
      "A stopped agent is not a failed one, and the answer says so.",
      "The schema now travels with the record, so a retried agent cannot pass a schema it failed the first time."
    ]
  },
  {
    version: "1.0.24",
    date: "2026-11-21",
    summary: "A whole phase can be run again.",
    notes: [
      "`a` in the panel, or /workflows rerun <id> <phase>, runs every agent of that phase, one at a time.",
      "It asks first, with the phase, the agent count and the earlier spend.",
      "It is new work, not a replay: tokens rise and every row says it ran again.",
      "One agent that cannot run does not stop the rest."
    ]
  },
  {
    version: "1.0.23",
    date: "2026-11-20",
    summary: "Stop one agent without stopping the run.",
    notes: [
      "`k` in the panel, or /workflows stop <id> <agent>, stops the agent you are looking at.",
      "A word that matches two agents is refused with the list: stopping the wrong agent spends money on the wrong work.",
      "A stopped agent is amber, never red: you decided it, so it is not a failure.",
      "A stop saves the rest of a call, never the call; what was already spent stays on the bill."
    ]
  }
];
function Changelog() {
  return /* @__PURE__ */ jsxs(Shell, { children: [
    /* @__PURE__ */ jsxs("div", { className: "flex max-w-[760px] flex-col gap-4 py-14", children: [
      /* @__PURE__ */ jsx(Eyebrow, { children: "Changelog" }),
      /* @__PURE__ */ jsx("h1", { className: "heading", children: "Every release, newest first." }),
      /* @__PURE__ */ jsx("p", { className: "lead", children: "What changed and why. The long version, including every test that proved it, lives in the CLI repository." })
    ] }),
    /* @__PURE__ */ jsx("ol", { className: "flex flex-col gap-10 pb-16", children: RELEASES.map((release, index) => /* @__PURE__ */ jsxs(
      "li",
      {
        className: "grid gap-4 border-t border-line pt-8 lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-10",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxs("h2", { className: "font-mono text-[15px] font-bold text-ink", children: [
                "v",
                release.version
              ] }),
              index === 0 ? /* @__PURE__ */ jsx(Badge, { tone: "orange", children: "latest" }) : null
            ] }),
            /* @__PURE__ */ jsx("time", { className: "font-mono text-[11px] uppercase tracking-[0.14em] text-muted", children: release.date })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex min-w-0 flex-col gap-3", children: [
            /* @__PURE__ */ jsx("p", { className: "text-[15px] font-bold text-ink", children: release.summary }),
            /* @__PURE__ */ jsx("ul", { className: "flex flex-col gap-2", children: release.notes.map((note) => /* @__PURE__ */ jsxs("li", { className: "flex gap-2.5 text-[13.5px] leading-[1.75] text-muted", children: [
              /* @__PURE__ */ jsx("span", { "aria-hidden": true, className: "mt-[9px] size-1 shrink-0 rounded-full bg-orange" }),
              note
            ] }, note)) })
          ] })
        ]
      },
      release.version
    )) })
  ] });
}
const Changelog$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Changelog
}, Symbol.toStringTag, { value: "Module" }));
function DocToc({ headings, className }) {
  const [activeId, setActiveId] = useState(headings[0]?.id ?? "");
  useEffect(() => {
    if (headings.length === 0) return;
    if (typeof IntersectionObserver !== "function") return;
    const elements = headings.map((heading) => document.getElementById(heading.id)).filter((element) => element !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible?.target.id) setActiveId(visible.target.id);
      },
      { rootMargin: "-96px 0px -70% 0px", threshold: 0 }
    );
    for (const element of elements) observer.observe(element);
    return () => observer.disconnect();
  }, [headings]);
  if (headings.length === 0) return null;
  return /* @__PURE__ */ jsxs("nav", { "aria-label": "On this page", className: cn("flex flex-col gap-2", className), children: [
    /* @__PURE__ */ jsx("p", { className: "font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-muted", children: "On this page" }),
    /* @__PURE__ */ jsx("ul", { className: "flex flex-col gap-1 border-l border-line", children: headings.map((heading) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
      "a",
      {
        href: `#${heading.id}`,
        "aria-current": activeId === heading.id ? "location" : void 0,
        className: cn(
          "-ml-px block border-l-2 py-1 text-[12px] leading-snug transition-colors duration-[160ms]",
          heading.depth === 2 ? "pl-3" : "pl-5",
          activeId === heading.id ? "border-orange text-orange" : "border-transparent text-muted hover:text-ink"
        ),
        children: heading.text
      }
    ) }, heading.id)) })
  ] });
}
const DOC_GROUPS = ["Start here", "The agent", "Deep dives", "Operate"];
const DOC_PAGES = [
  {
    slug: "getting-started",
    title: "Getting started",
    intro: "From nothing to a first edit in two minutes.",
    group: "Start here"
  },
  {
    slug: "install",
    title: "Install",
    intro: "npx, global, or a pinned version; what each one does.",
    group: "Start here"
  },
  {
    slug: "commands",
    title: "Commands",
    intro: "Every slash command, what it does, and what it costs.",
    group: "The agent"
  },
  {
    slug: "workflows",
    title: "Workflows",
    intro: "The script API, the caps, and how to steer a run that is already going.",
    group: "Deep dives"
  },
  {
    slug: "memory",
    title: "Memory",
    intro: "What is remembered, where it is stored, and how to make it forget.",
    group: "Deep dives"
  },
  {
    slug: "compaction",
    title: "Compaction",
    intro: "How a long session is summarised without losing the facts that matter.",
    group: "Deep dives"
  },
  {
    slug: "hashline-lsp",
    title: "Hashline & LSP",
    intro: "Tags that make edits safe, and diagnostics without installing a server.",
    group: "Deep dives"
  },
  {
    slug: "agent-hub",
    title: "Agent Hub",
    intro: "Watch subagents work, and chat with one while the others run.",
    group: "Deep dives"
  },
  {
    slug: "step-names",
    title: "Step names",
    intro: "The optional sentence above a shell call, and why it is optional.",
    group: "Deep dives"
  },
  {
    slug: "retry-stop-rerun",
    title: "Retry, stop, rerun",
    intro: "Three keys that fix a run without starting over.",
    group: "Operate"
  },
  {
    slug: "environment",
    title: "Environment",
    intro: "Every QRONOS_* variable, its default, and its clamp.",
    group: "Operate"
  },
  {
    slug: "troubleshooting",
    title: "Troubleshooting",
    intro: "The errors people actually hit, and the one-line fix.",
    group: "Operate"
  },
  {
    slug: "privacy",
    title: "Privacy",
    intro: "What is stored on your machine, and what is never sent anywhere.",
    group: "Operate"
  }
];
function groupedDocs(pages2 = DOC_PAGES) {
  return DOC_GROUPS.map((group) => ({
    group,
    pages: pages2.filter((page) => page.group === group)
  })).filter((entry) => entry.pages.length > 0);
}
function findDoc(slug) {
  return DOC_PAGES.find((page) => page.slug === slug);
}
function docNeighbours(slug) {
  const index = DOC_PAGES.findIndex((page) => page.slug === slug);
  if (index < 0) return {};
  const prev = index > 0 ? DOC_PAGES[index - 1] : void 0;
  const next = index < DOC_PAGES.length - 1 ? DOC_PAGES[index + 1] : void 0;
  return { ...prev ? { prev } : {}, ...next ? { next } : {} };
}
function _createMdxContent$c(props) {
  const _components = {
    code: "code",
    h2: "h2",
    li: "li",
    p: "p",
    pre: "pre",
    table: "table",
    tbody: "tbody",
    td: "td",
    th: "th",
    thead: "thead",
    tr: "tr",
    ul: "ul",
    ...props.components
  };
  return jsxs(Fragment, {
    children: [jsx(_components.p, {
      children: "The hub is where subagents become visible: who is working, on what, with which\nmodel, and what it has cost so far."
    }), "\n", jsx(_components.h2, {
      id: "the-roster",
      children: "The roster"
    }), "\n", jsx(_components.p, {
      children: "A floating panel, centred, never in the footer. Each row is one agent:"
    }), "\n", jsx(_components.pre, {
      children: jsx(_components.code, {
        children: "✓ check-auth        sonnet-5.5   4.2k   1m 02s\n✗ check-uploads     sonnet-5.5   3.1k   0m 48s\n⊘ check-logging     sonnet-5.5   2.6k   0m 39s\n↺ check-secrets     sonnet-5.5   0      0m 00s\n"
      })
    }), "\n", jsxs(_components.ul, {
      children: ["\n", jsx(_components.li, {
        children: "the glyph says the state, and the word beside it says it again;"
      }), "\n", jsx(_components.li, {
        children: "the model column is the model that agent actually used;"
      }), "\n", jsxs(_components.li, {
        children: [jsx(_components.code, {
          children: "↺"
        }), " means replayed from the journal — already paid for, so the tokens are zero."]
      }), "\n"]
    }), "\n", jsx(_components.h2, {
      id: "typed-results",
      children: "Typed results"
    }), "\n", jsx(_components.p, {
      children: "An agent can be asked for a shape:"
    }), "\n", jsx(_components.pre, {
      children: jsx(_components.code, {
        className: "language-js",
        children: 'const audit = await agent("List the risks with a severity", {\n  schema: {\n    type: "object",\n    properties: {\n      risks: {\n        type: "array",\n        items: {\n          type: "object",\n          properties: { title: { type: "string" }, severity: { enum: ["low", "high"] } },\n          required: ["title", "severity"],\n        },\n      },\n    },\n    required: ["risks"],\n  },\n});\n'
      })
    }), "\n", jsxs(_components.p, {
      children: ["You get ", jsx(_components.code, {
        children: "audit.data"
      }), " when the answer matches, and ", jsx(_components.code, {
        children: "audit.ok === false"
      }), " with an error\nwhen it does not. The schema travels with the record, so a retried agent is checked\nagainst the same shape — a green tick can never be given to words nobody validated."]
    }), "\n", jsx(_components.h2, {
      id: "chat-with-one-agent",
      children: "Chat with one agent"
    }), "\n", jsx(_components.p, {
      children: "Open an agent to read its full transcript. You can send it one more instruction\nwithout starting a new run. The other agents keep working while you do."
    }), "\n", jsx(_components.h2, {
      id: "retry-one-agent-at-a-time",
      children: "Retry, one agent at a time"
    }), "\n", jsx(_components.p, {
      children: "A failed agent is a row, not a dead run. Retrying runs that one agent, with the\nschema, the model and the label it had before. The tokens rise because it is new\nwork; the good answers are untouched."
    }), "\n", jsx(_components.h2, {
      id: "the-rules-the-hub-keeps",
      children: "The rules the hub keeps"
    }), "\n", jsxs(_components.table, {
      children: [jsx(_components.thead, {
        children: jsxs(_components.tr, {
          children: [jsx(_components.th, {
            style: {
              textAlign: "left"
            },
            children: "Rule"
          }), jsx(_components.th, {
            style: {
              textAlign: "left"
            },
            children: "Why"
          })]
        })
      }), jsxs(_components.tbody, {
        children: [jsxs(_components.tr, {
          children: [jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "a stopped agent is amber"
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "you decided it; a failure is red"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "a replayed agent is blue and free"
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "it did not call the model"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "queued agents are not in the detail list"
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "they have nothing to show yet"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "the panel only reads"
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "closing it never loses a run"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "every panel key is also a command"
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "a headless session can do the same thing"
          })]
        })]
      })]
    })]
  });
}
function MDXContent$c(props = {}) {
  const { wrapper: MDXLayout } = props.components || {};
  return MDXLayout ? jsx(MDXLayout, {
    ...props,
    children: jsx(_createMdxContent$c, {
      ...props
    })
  }) : _createMdxContent$c(props);
}
function _createMdxContent$b(props) {
  const _components = {
    code: "code",
    h2: "h2",
    p: "p",
    pre: "pre",
    strong: "strong",
    table: "table",
    tbody: "tbody",
    td: "td",
    th: "th",
    thead: "thead",
    tr: "tr",
    ...props.components
  };
  return jsxs(Fragment, {
    children: [jsx(_components.p, {
      children: "Two kinds of command: flags you type before Qronos starts, and slash commands you\ntype inside the session."
    }), "\n", jsx(_components.h2, {
      id: "flags",
      children: "Flags"
    }), "\n", jsx(_components.pre, {
      children: jsx(_components.code, {
        className: "language-bash",
        children: "qronos --provider openai --model gpt-4.1\nqronos --base-url http://localhost:11434/v1 --model llama3\nqronos --help\nqronos --version\n"
      })
    }), "\n", jsxs(_components.table, {
      children: [jsx(_components.thead, {
        children: jsxs(_components.tr, {
          children: [jsx(_components.th, {
            style: {
              textAlign: "left"
            },
            children: "Flag"
          }), jsx(_components.th, {
            style: {
              textAlign: "left"
            },
            children: "Meaning"
          })]
        })
      }), jsxs(_components.tbody, {
        children: [jsxs(_components.tr, {
          children: [jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: jsx(_components.code, {
              children: "--provider <name>"
            })
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "pick a saved provider"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: jsx(_components.code, {
              children: "--model <id>"
            })
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "override the model for this session"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: jsx(_components.code, {
              children: "--base-url <url>"
            })
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "any OpenAI-compatible endpoint"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: jsx(_components.code, {
              children: "--version"
            })
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "print the version and exit"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: jsx(_components.code, {
              children: "--help"
            })
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "print every flag and exit"
          })]
        })]
      })]
    }), "\n", jsx(_components.h2, {
      id: "slash-commands",
      children: "Slash commands"
    }), "\n", jsxs(_components.p, {
      children: ["Type ", jsx(_components.code, {
        children: "/"
      }), " in the prompt to see this list, filtered as you type."]
    }), "\n", jsxs(_components.table, {
      children: [jsx(_components.thead, {
        children: jsxs(_components.tr, {
          children: [jsx(_components.th, {
            style: {
              textAlign: "left"
            },
            children: "Command"
          }), jsx(_components.th, {
            style: {
              textAlign: "left"
            },
            children: "What it does"
          })]
        })
      }), jsxs(_components.tbody, {
        children: [jsxs(_components.tr, {
          children: [jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: jsx(_components.code, {
              children: "/help"
            })
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "keys, commands, and the current mode"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: jsx(_components.code, {
              children: "/init"
            })
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "write a project file describing this repository"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: jsx(_components.code, {
              children: "/mode"
            })
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "change how tool calls are approved"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: jsx(_components.code, {
              children: "/config"
            })
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "choose provider and model"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: jsx(_components.code, {
              children: "/clear"
            })
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "clear the screen, not the session"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: jsx(_components.code, {
              children: "/memory"
            })
          }), jsxs(_components.td, {
            style: {
              textAlign: "left"
            },
            children: ["show what is remembered; ", jsx(_components.code, {
              children: "/memory sync"
            }), " rewrites the document"]
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: jsx(_components.code, {
              children: "/compact"
            })
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "summarise the session now, keeping the facts"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: jsx(_components.code, {
              children: "/workflows"
            })
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "list runs, open the panel, stop, pause, save, retry"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: jsx(_components.code, {
              children: "/export"
            })
          }), jsxs(_components.td, {
            style: {
              textAlign: "left"
            },
            children: ["write the session as ", jsx(_components.code, {
              children: ".html"
            }), " or ", jsx(_components.code, {
              children: ".jsonl"
            })]
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: jsx(_components.code, {
              children: "/import"
            })
          }), jsxs(_components.td, {
            style: {
              textAlign: "left"
            },
            children: ["load a ", jsx(_components.code, {
              children: ".jsonl"
            }), " transcript back into the chat"]
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: jsx(_components.code, {
              children: "/buy-credits"
            })
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "top up when the free allowance is used"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: jsx(_components.code, {
              children: "/quit"
            })
          }), jsxs(_components.td, {
            style: {
              textAlign: "left"
            },
            children: ["leave (the item is labelled ", jsx(_components.strong, {
              children: "Quit"
            }), ")"]
          })]
        })]
      })]
    }), "\n", jsx(_components.h2, {
      id: "keys",
      children: "Keys"
    }), "\n", jsxs(_components.table, {
      children: [jsx(_components.thead, {
        children: jsxs(_components.tr, {
          children: [jsx(_components.th, {
            style: {
              textAlign: "left"
            },
            children: "Key"
          }), jsx(_components.th, {
            style: {
              textAlign: "left"
            },
            children: "Action"
          })]
        })
      }), jsxs(_components.tbody, {
        children: [jsxs(_components.tr, {
          children: [jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: jsx(_components.code, {
              children: "enter"
            })
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "send"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: jsx(_components.code, {
              children: "esc"
            })
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "interrupt the current turn"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: jsx(_components.code, {
              children: "ctrl+d"
            })
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "exit"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: jsx(_components.code, {
              children: "alt+w"
            })
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "open the workflow panel"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: jsx(_components.code, {
              children: "ctrl+c"
            })
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "not bound — it would kill a stream you paid for"
          })]
        })]
      })]
    }), "\n", jsxs(_components.h2, {
      id: "workflows-in-full",
      children: [jsx(_components.code, {
        children: "/workflows"
      }), " in full"]
    }), "\n", jsx(_components.pre, {
      children: jsx(_components.code, {
        children: "/workflows                  list runs\n/workflows <id>             one run in detail\n/workflows stop [<id>|all]  stop a run, or all of them\n/workflows stop <id> <agent> stop one agent\n/workflows pause <id>       finish in-flight work, then wait\n/workflows resume <id>      carry on from the journal\n/workflows saved            list saved scripts\n/workflows panel            open the live panel\n/workflows save [<id>]      save a run's script into the project\n/workflows restart [<id>] [<agent>]\n/workflows scripts          list scripts on disk\n/workflows run <name>       run a saved script\n/workflows edit <name>      open it in your editor\n/workflows rerun <id> <phase>\n/workflows retry <id>       retry only the failed agents\n"
      })
    }), "\n", jsx(_components.p, {
      children: "Every one of these is also a key in the panel. The panel only reads: closing it\nnever loses a run."
    })]
  });
}
function MDXContent$b(props = {}) {
  const { wrapper: MDXLayout } = props.components || {};
  return MDXLayout ? jsx(MDXLayout, {
    ...props,
    children: jsx(_createMdxContent$b, {
      ...props
    })
  }) : _createMdxContent$b(props);
}
function _createMdxContent$a(props) {
  const _components = {
    code: "code",
    h2: "h2",
    li: "li",
    p: "p",
    pre: "pre",
    strong: "strong",
    table: "table",
    tbody: "tbody",
    td: "td",
    th: "th",
    thead: "thead",
    tr: "tr",
    ul: "ul",
    ...props.components
  };
  return jsxs(Fragment, {
    children: [jsx(_components.p, {
      children: "A long session fills the context window. Compaction replaces the oldest part with a\nsummary that keeps the facts which matter: what changed, what failed, what you\ndecided."
    }), "\n", jsx(_components.h2, {
      id: "what-you-see",
      children: "What you see"
    }), "\n", jsx(_components.p, {
      children: "A note in the chat, never a silent edit:"
    }), "\n", jsx(_components.pre, {
      children: jsx(_components.code, {
        children: "Compacted 62 messages into 9 · kept 4 files, 2 decisions\n"
      })
    }), "\n", jsx(_components.p, {
      children: "The note is drawn for you. It is not sent to the model, so it costs nothing."
    }), "\n", jsx(_components.h2, {
      id: "when-it-runs",
      children: "When it runs"
    }), "\n", jsxs(_components.ul, {
      children: ["\n", jsx(_components.li, {
        children: "Automatically, when the session is close to the model's context limit."
      }), "\n", jsxs(_components.li, {
        children: ["On demand, with ", jsx(_components.code, {
          children: "/compact"
        }), "."]
      }), "\n"]
    }), "\n", jsxs(_components.p, {
      children: ["On by default. Turn it off with ", jsx(_components.code, {
        children: "QRONOS_COMPACT=0"
      }), "."]
    }), "\n", jsx(_components.h2, {
      id: "how-long-it-lasts",
      children: "How long it lasts"
    }), "\n", jsxs(_components.p, {
      children: ["A checkpoint is re-sent with ", jsx(_components.strong, {
        children: "every"
      }), " later prompt in the session, so the summary\nkeeps working rather than lasting one turn. It has a hard size cap and is redacted\nlike everything else."]
    }), "\n", jsx(_components.h2, {
      id: "if-in-doubt-it-gives-up",
      children: "If in doubt, it gives up"
    }), "\n", jsx(_components.p, {
      children: "This is the rule that matters most: when the summariser is uncertain, it returns an\nempty object and compaction is skipped. The session continues with the full history\ninstead."
    }), "\n", jsx(_components.p, {
      children: 'A broken summary is much worse than a long context: it can quietly delete the one\nfact that mattered. So the code is written to prefer "no compaction" over "maybe\nwrong compaction".'
    }), "\n", jsx(_components.h2, {
      id: "what-is-kept",
      children: "What is kept"
    }), "\n", jsxs(_components.table, {
      children: [jsx(_components.thead, {
        children: jsxs(_components.tr, {
          children: [jsx(_components.th, {
            style: {
              textAlign: "left"
            },
            children: "Kept"
          }), jsx(_components.th, {
            style: {
              textAlign: "left"
            },
            children: "Dropped"
          })]
        })
      }), jsxs(_components.tbody, {
        children: [jsxs(_components.tr, {
          children: [jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "file paths that were read or edited"
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "greetings and restated questions"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: 'decisions you made ("use Postgres, not SQLite")'
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "long command output already summarised"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "failures and their cause"
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "tool calls that succeeded on the first try"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "open questions and next steps"
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "duplicated text"
          })]
        })]
      })]
    }), "\n", jsx(_components.h2, {
      id: "reading-a-checkpoint",
      children: "Reading a checkpoint"
    }), "\n", jsxs(_components.p, {
      children: ["Checkpoints are saved with the session, so ", jsx(_components.code, {
        children: "/export"
      }), " includes them. A ", jsx(_components.code, {
        children: ".jsonl"
      }), "\ntranscript can be re-imported with ", jsx(_components.code, {
        children: "/import"
      }), " and the checkpoint comes back with it."]
    }), "\n", jsx(_components.h2, {
      id: "limits",
      children: "Limits"
    }), "\n", jsx(_components.p, {
      children: "Compaction summarises text; it does not re-read your files. If a fact lives only in\na file that was never opened, no summary can invent it. Ask again when you need it."
    })]
  });
}
function MDXContent$a(props = {}) {
  const { wrapper: MDXLayout } = props.components || {};
  return MDXLayout ? jsx(MDXLayout, {
    ...props,
    children: jsx(_createMdxContent$a, {
      ...props
    })
  }) : _createMdxContent$a(props);
}
function _createMdxContent$9(props) {
  const _components = {
    code: "code",
    h2: "h2",
    p: "p",
    pre: "pre",
    table: "table",
    tbody: "tbody",
    td: "td",
    th: "th",
    thead: "thead",
    tr: "tr",
    ...props.components
  };
  return jsxs(Fragment, {
    children: [jsx(_components.p, {
      children: "Every setting is one environment variable with a default that works. Nothing here is\nrequired."
    }), "\n", jsx(_components.h2, {
      id: "session-behaviour",
      children: "Session behaviour"
    }), "\n", jsxs(_components.table, {
      children: [jsx(_components.thead, {
        children: jsxs(_components.tr, {
          children: [jsx(_components.th, {
            style: {
              textAlign: "left"
            },
            children: "Variable"
          }), jsx(_components.th, {
            style: {
              textAlign: "left"
            },
            children: "Default"
          }), jsx(_components.th, {
            style: {
              textAlign: "left"
            },
            children: "Effect"
          })]
        })
      }), jsxs(_components.tbody, {
        children: [jsxs(_components.tr, {
          children: [jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: jsx(_components.code, {
              children: "QRONOS_MEMORY"
            })
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "on"
          }), jsxs(_components.td, {
            style: {
              textAlign: "left"
            },
            children: [jsx(_components.code, {
              children: "0"
            }), " turns memory off completely"]
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: jsx(_components.code, {
              children: "QRONOS_COMPACT"
            })
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "on"
          }), jsxs(_components.td, {
            style: {
              textAlign: "left"
            },
            children: [jsx(_components.code, {
              children: "0"
            }), " turns automatic compaction off"]
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: jsx(_components.code, {
              children: "QRONOS_TOOL_DESCRIPTIONS"
            })
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "on"
          }), jsxs(_components.td, {
            style: {
              textAlign: "left"
            },
            children: [jsx(_components.code, {
              children: "0"
            }), " removes the step-name field and its line"]
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: jsx(_components.code, {
              children: "QRONOS_ULTRATHINK"
            })
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "on"
          }), jsxs(_components.td, {
            style: {
              textAlign: "left"
            },
            children: [jsx(_components.code, {
              children: "0"
            }), " stops the ", jsx(_components.code, {
              children: "ultrathink"
            }), " keyword from changing reasoning"]
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: jsx(_components.code, {
              children: "QRONOS_HASHLINE"
            })
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "on"
          }), jsxs(_components.td, {
            style: {
              textAlign: "left"
            },
            children: [jsx(_components.code, {
              children: "0"
            }), " sends plain line numbers to the model"]
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: jsx(_components.code, {
              children: "QRONOS_LSP"
            })
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "on"
          }), jsxs(_components.td, {
            style: {
              textAlign: "left"
            },
            children: [jsx(_components.code, {
              children: "0"
            }), " skips the check after a write"]
          })]
        })]
      })]
    }), "\n", jsx(_components.h2, {
      id: "workflows",
      children: "Workflows"
    }), "\n", jsxs(_components.table, {
      children: [jsx(_components.thead, {
        children: jsxs(_components.tr, {
          children: [jsx(_components.th, {
            style: {
              textAlign: "left"
            },
            children: "Variable"
          }), jsx(_components.th, {
            style: {
              textAlign: "left"
            },
            children: "Default"
          }), jsx(_components.th, {
            style: {
              textAlign: "left"
            },
            children: "Clamp"
          })]
        })
      }), jsxs(_components.tbody, {
        children: [jsxs(_components.tr, {
          children: [jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: jsx(_components.code, {
              children: "QRONOS_WORKFLOW_WALL_CLOCK_MS"
            })
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: jsx(_components.code, {
              children: "600000"
            })
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "60 000 – 3 600 000"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: jsx(_components.code, {
              children: "QRONOS_WORKFLOW_MAX_AGENTS"
            })
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: jsx(_components.code, {
              children: "1000"
            })
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "1 – 2000"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: jsx(_components.code, {
              children: "QRONOS_WORKFLOW_CONCURRENCY"
            })
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: jsx(_components.code, {
              children: "16"
            })
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "1 – 32"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: jsx(_components.code, {
              children: "QRONOS_WORKFLOW_MAX_LOGS"
            })
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: jsx(_components.code, {
              children: "500"
            })
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "—"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: jsx(_components.code, {
              children: "QRONOS_WORKFLOW_MAX_RESULT_CHARS"
            })
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: jsx(_components.code, {
              children: "200000"
            })
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "—"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: jsx(_components.code, {
              children: "QRONOS_WORKFLOW_MAX_DEPTH"
            })
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: jsx(_components.code, {
              children: "2"
            })
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "1 – 3"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: jsx(_components.code, {
              children: "QRONOS_WORKFLOW_APPROVE"
            })
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: jsx(_components.code, {
              children: "ask"
            })
          }), jsxs(_components.td, {
            style: {
              textAlign: "left"
            },
            children: [jsx(_components.code, {
              children: "ask"
            }), ", ", jsx(_components.code, {
              children: "always"
            }), ", ", jsx(_components.code, {
              children: "0"
            })]
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: jsx(_components.code, {
              children: "QRONOS_WORKFLOW_TOOLS"
            })
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "on"
          }), jsxs(_components.td, {
            style: {
              textAlign: "left"
            },
            children: [jsx(_components.code, {
              children: "0"
            }), " gives subagents no tools"]
          })]
        })]
      })]
    }), "\n", jsx(_components.p, {
      children: "A clamp is applied, not an error: a value outside the range is pulled to the nearest\nend and the run reports what it used."
    }), "\n", jsx(_components.h2, {
      id: "debugging",
      children: "Debugging"
    }), "\n", jsxs(_components.table, {
      children: [jsx(_components.thead, {
        children: jsxs(_components.tr, {
          children: [jsx(_components.th, {
            style: {
              textAlign: "left"
            },
            children: "Variable"
          }), jsx(_components.th, {
            style: {
              textAlign: "left"
            },
            children: "Default"
          }), jsx(_components.th, {
            style: {
              textAlign: "left"
            },
            children: "Effect"
          })]
        })
      }), jsxs(_components.tbody, {
        children: [jsxs(_components.tr, {
          children: [jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: jsx(_components.code, {
              children: "QRONOS_DEBUG_WORKFLOW"
            })
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "off"
          }), jsxs(_components.td, {
            style: {
              textAlign: "left"
            },
            children: [jsx(_components.code, {
              children: "1"
            }), " writes the workflow event stream to stderr"]
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: jsx(_components.code, {
              children: "QRONOS_E2E_MODEL"
            })
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "—"
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "the model the end-to-end scripts use"
          })]
        })]
      })]
    }), "\n", jsx(_components.h2, {
      id: "providers",
      children: "Providers"
    }), "\n", jsxs(_components.table, {
      children: [jsx(_components.thead, {
        children: jsxs(_components.tr, {
          children: [jsx(_components.th, {
            style: {
              textAlign: "left"
            },
            children: "Variable"
          }), jsx(_components.th, {
            style: {
              textAlign: "left"
            },
            children: "Meaning"
          })]
        })
      }), jsxs(_components.tbody, {
        children: [jsxs(_components.tr, {
          children: [jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: jsx(_components.code, {
              children: "OPENAI_API_KEY"
            })
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "read when a provider points at OpenAI"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: jsx(_components.code, {
              children: "ANTHROPIC_API_KEY"
            })
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "read when a provider points at Anthropic"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: jsx(_components.code, {
              children: "<PROVIDER>_API_KEY"
            })
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "any other name you chose when saving a provider"
          })]
        })]
      })]
    }), "\n", jsx(_components.p, {
      children: "Keys are read from the environment at start. They are not written to disk unless you\nexplicitly ask for that, and they are never printed."
    }), "\n", jsx(_components.h2, {
      id: "choosing-values-per-project",
      children: "Choosing values per project"
    }), "\n", jsx(_components.p, {
      children: "A shell wrapper is enough:"
    }), "\n", jsx(_components.pre, {
      children: jsx(_components.code, {
        className: "language-bash",
        children: "# cheap mode: small model, two agents at once, no memory\nexport QRONOS_WORKFLOW_CONCURRENCY=2\nexport QRONOS_MEMORY=0\nqronos --model claude-haiku-5.5\n"
      })
    }), "\n", jsxs(_components.p, {
      children: ["Do not put keys in a file inside the repository. Environment variables, a secrets\nmanager, or the connection file under ", jsx(_components.code, {
        children: "~/.qronos"
      }), " (mode ", jsx(_components.code, {
        children: "0600"
      }), ") are the three safe\nplaces."]
    })]
  });
}
function MDXContent$9(props = {}) {
  const { wrapper: MDXLayout } = props.components || {};
  return MDXLayout ? jsx(MDXLayout, {
    ...props,
    children: jsx(_createMdxContent$9, {
      ...props
    })
  }) : _createMdxContent$9(props);
}
function _createMdxContent$8(props) {
  const _components = {
    a: "a",
    code: "code",
    h2: "h2",
    li: "li",
    p: "p",
    pre: "pre",
    strong: "strong",
    table: "table",
    tbody: "tbody",
    td: "td",
    th: "th",
    thead: "thead",
    tr: "tr",
    ul: "ul",
    ...props.components
  };
  return jsxs(Fragment, {
    children: [jsx(_components.p, {
      children: "Qronos CLI is an AI coding agent that runs in your terminal. It reads your files,\nruns your shell, edits in place, and can fan a big job out to subagents."
    }), "\n", jsx(_components.h2, {
      id: "you-need",
      children: "You need"
    }), "\n", jsxs(_components.ul, {
      children: ["\n", jsxs(_components.li, {
        children: [jsx(_components.strong, {
          children: "Node 22.19 or newer."
        }), " Check with ", jsx(_components.code, {
          children: "node --version"
        }), "."]
      }), "\n", jsx(_components.li, {
        children: "A terminal: bash, zsh, PowerShell or Windows Terminal."
      }), "\n", jsx(_components.li, {
        children: "Either a Qronos account (free to start) or a key for a provider you already use."
      }), "\n"]
    }), "\n", jsx(_components.h2, {
      id: "run-it",
      children: "Run it"
    }), "\n", jsx(_components.pre, {
      children: jsx(_components.code, {
        className: "language-bash",
        children: "npx qronos-cli\n"
      })
    }), "\n", jsxs(_components.p, {
      children: ["The first run asks one question: ", jsx(_components.strong, {
        children: "sign in"
      }), ", or ", jsx(_components.strong, {
        children: "use my own API key"
      }), ". Signing in\nsponsors your usage, so you do not need a card to try it."]
    }), "\n", jsx(_components.p, {
      children: "Prefer the shorter command? Install it once:"
    }), "\n", jsx(_components.pre, {
      children: jsx(_components.code, {
        className: "language-bash",
        children: "npm install -g qronos-cli\nqronos\n"
      })
    }), "\n", jsx(_components.h2, {
      id: "your-first-real-task",
      children: "Your first real task"
    }), "\n", jsx(_components.p, {
      children: "Ask for something you can check in ten seconds:"
    }), "\n", jsx(_components.pre, {
      children: jsx(_components.code, {
        children: "explain this repo, then fix the failing test\n"
      })
    }), "\n", jsx(_components.p, {
      children: "Qronos reads before it writes. You will see a step line with a short sentence, then\nthe command it ran, then the result:"
    }), "\n", jsx(_components.pre, {
      children: jsx(_components.code, {
        children: "● Find the failing test · 1s\n  ⎿ $ npm test -- --run\n    3 failed\n"
      })
    }), "\n", jsx(_components.h2, {
      id: "approve-or-refuse",
      children: "Approve or refuse"
    }), "\n", jsxs(_components.p, {
      children: ["Every tool call passes one door. Press ", jsx(_components.strong, {
        children: "enter"
      }), " to allow it once, or answer ", jsx(_components.strong, {
        children: "no"
      }), ".\nIf you want fewer questions, change the mode in the session with ", jsx(_components.code, {
        children: "/mode"
      }), ", or pick a\nlooser default in ", jsx(_components.code, {
        children: "/config"
      }), "."]
    }), "\n", jsxs(_components.table, {
      children: [jsx(_components.thead, {
        children: jsxs(_components.tr, {
          children: [jsx(_components.th, {
            style: {
              textAlign: "left"
            },
            children: "Mode"
          }), jsx(_components.th, {
            style: {
              textAlign: "left"
            },
            children: "What it allows"
          })]
        })
      }), jsxs(_components.tbody, {
        children: [jsxs(_components.tr, {
          children: [jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: jsx(_components.code, {
              children: "manual"
            })
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "asks before every write or shell call"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: jsx(_components.code, {
              children: "auto"
            })
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "asks only when a call looks risky"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: jsx(_components.code, {
              children: "edit-automatically"
            })
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "edits files without asking, still asks for shell"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: jsx(_components.code, {
              children: "plan"
            })
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "reads and plans, never writes"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: jsx(_components.code, {
              children: "skip-all"
            })
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "runs everything you asked for, including shell"
          })]
        })]
      })]
    }), "\n", jsxs(_components.p, {
      children: [jsx(_components.code, {
        children: "skip-all"
      }), " is the one to use inside a container, never on a laptop with your own keys."]
    }), "\n", jsx(_components.h2, {
      id: "where-things-live",
      children: "Where things live"
    }), "\n", jsx(_components.pre, {
      children: jsx(_components.code, {
        children: "~/.qronos/\n  connections.json      provider settings, mode 0600\n  agent/sessions/       your conversation history, one .jsonl per session\n  workflow-runs/        workflow journals\n"
      })
    }), "\n", jsxs(_components.p, {
      children: ["Your project can also hold ", jsx(_components.code, {
        children: ".qronos/workflows/"
      }), " for saved workflow scripts."]
    }), "\n", jsx(_components.h2, {
      id: "next",
      children: "Next"
    }), "\n", jsxs(_components.ul, {
      children: ["\n", jsxs(_components.li, {
        children: [jsx(_components.a, {
          href: "/docs/install",
          children: "Install"
        }), " — the three ways to install, and pinning a version."]
      }), "\n", jsxs(_components.li, {
        children: [jsx(_components.a, {
          href: "/docs/commands",
          children: "Commands"
        }), " — what every slash command does."]
      }), "\n", jsxs(_components.li, {
        children: [jsx(_components.a, {
          href: "/docs/workflows",
          children: "Workflows"
        }), " — the one feature that is not a chat."]
      }), "\n"]
    })]
  });
}
function MDXContent$8(props = {}) {
  const { wrapper: MDXLayout } = props.components || {};
  return MDXLayout ? jsx(MDXLayout, {
    ...props,
    children: jsx(_createMdxContent$8, {
      ...props
    })
  }) : _createMdxContent$8(props);
}
function _createMdxContent$7(props) {
  const _components = {
    code: "code",
    h2: "h2",
    p: "p",
    pre: "pre",
    strong: "strong",
    table: "table",
    tbody: "tbody",
    td: "td",
    th: "th",
    thead: "thead",
    tr: "tr",
    ...props.components
  };
  return jsxs(Fragment, {
    children: [jsx(_components.p, {
      children: "Two safety nets that work without you installing anything."
    }), "\n", jsx(_components.h2, {
      id: "hashline",
      children: "Hashline"
    }), "\n", jsx(_components.p, {
      children: "When Qronos reads a file, every line gets a short tag:"
    }), "\n", jsx(_components.pre, {
      children: jsx(_components.code, {
        children: "12ab|function total(items) {\n7c3d|  return items.reduce((sum, item) => sum + item.price, 0);\n91fe|}\n"
      })
    }), "\n", jsx(_components.p, {
      children: "An edit then names the tags instead of a line number:"
    }), "\n", jsx(_components.pre, {
      children: jsx(_components.code, {
        children: "replace 7c3d with:   return items.reduce((sum, item) => sum + item.price, 0) / 100;\n"
      })
    }), "\n", jsx(_components.p, {
      children: "Why: line numbers go stale the moment anything else edits the file. A tag does not.\nIf the tag is gone, the edit is refused instead of landing in the wrong place — the\ndifference between a rejected edit and a deleted function."
    }), "\n", jsx(_components.p, {
      children: "Tags are per read. Reading the file again refreshes them."
    }), "\n", jsx(_components.h2, {
      id: "language-server-bundled",
      children: "Language server, bundled"
    }), "\n", jsx(_components.p, {
      children: "Write a file and the language server checks it in the same turn:"
    }), "\n", jsx(_components.pre, {
      children: jsx(_components.code, {
        children: "● Check types after edit · 1s\n  ⎿ src/total.ts:7:12 error TS2322: Type 'string' is not assignable to type 'number'\n"
      })
    }), "\n", jsxs(_components.p, {
      children: ["The TypeScript server ships ", jsx(_components.strong, {
        children: "inside"
      }), " the package. You do not install ", jsx(_components.code, {
        children: "tsserver"
      }), ",\nyou do not run ", jsx(_components.code, {
        children: "npm i -D typescript"
      }), " for the checker, and the check works in a fresh\ncontainer with no network."]
    }), "\n", jsxs(_components.p, {
      children: ["For other languages Qronos uses a language server if one is already on your machine\n(", jsx(_components.code, {
        children: "pyright"
      }), ", ", jsx(_components.code, {
        children: "gopls"
      }), ", ", jsx(_components.code, {
        children: "rust-analyzer"
      }), "). If none is present, the check is skipped and\nsays so — it never pretends to have type-checked a file it did not."]
    }), "\n", jsx(_components.h2, {
      id: "diagnostics-go-to-the-model-not-just-to-you",
      children: "Diagnostics go to the model, not just to you"
    }), "\n", jsx(_components.p, {
      children: 'A type error after an edit is fed back once, so the next step can fix it. One retry,\nthen the error is reported and the turn continues. A loop of "try, fail, try" is how\na cheap mistake becomes an expensive one.'
    }), "\n", jsx(_components.h2, {
      id: "turning-it-off",
      children: "Turning it off"
    }), "\n", jsxs(_components.table, {
      children: [jsx(_components.thead, {
        children: jsxs(_components.tr, {
          children: [jsx(_components.th, {
            style: {
              textAlign: "left"
            },
            children: "Variable"
          }), jsx(_components.th, {
            style: {
              textAlign: "left"
            },
            children: "Default"
          }), jsx(_components.th, {
            style: {
              textAlign: "left"
            },
            children: "Effect"
          })]
        })
      }), jsxs(_components.tbody, {
        children: [jsxs(_components.tr, {
          children: [jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: jsx(_components.code, {
              children: "QRONOS_HASHLINE"
            })
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "on"
          }), jsxs(_components.td, {
            style: {
              textAlign: "left"
            },
            children: [jsx(_components.code, {
              children: "0"
            }), " sends plain line numbers"]
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: jsx(_components.code, {
              children: "QRONOS_LSP"
            })
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "on"
          }), jsxs(_components.td, {
            style: {
              textAlign: "left"
            },
            children: [jsx(_components.code, {
              children: "0"
            }), " skips the check after a write"]
          })]
        })]
      })]
    }), "\n", jsx(_components.p, {
      children: "Turn it off for a huge generated file where tags are noise, or when a language\nserver already runs in your editor and the two would fight over the same cache."
    })]
  });
}
function MDXContent$7(props = {}) {
  const { wrapper: MDXLayout } = props.components || {};
  return MDXLayout ? jsx(MDXLayout, {
    ...props,
    children: jsx(_createMdxContent$7, {
      ...props
    })
  }) : _createMdxContent$7(props);
}
function _createMdxContent$6(props) {
  const _components = {
    code: "code",
    h2: "h2",
    li: "li",
    p: "p",
    pre: "pre",
    table: "table",
    tbody: "tbody",
    td: "td",
    th: "th",
    thead: "thead",
    tr: "tr",
    ul: "ul",
    ...props.components
  };
  return jsxs(Fragment, {
    children: [jsx(_components.p, {
      children: "Qronos CLI is one Node package with two binaries. There is no daemon, no build\nstep and no global config to set up by hand."
    }), "\n", jsx(_components.h2, {
      id: "with-npx-nothing-installed",
      children: "With npx (nothing installed)"
    }), "\n", jsx(_components.pre, {
      children: jsx(_components.code, {
        className: "language-bash",
        children: "npx qronos-cli\n"
      })
    }), "\n", jsxs(_components.p, {
      children: [jsx(_components.code, {
        children: "npx"
      }), " downloads the package once, caches it, and runs it. Good for trying, bad for\ndaily use: it checks for a new version every time."]
    }), "\n", jsx(_components.h2, {
      id: "globally",
      children: "Globally"
    }), "\n", jsx(_components.pre, {
      children: jsx(_components.code, {
        className: "language-bash",
        children: "npm install -g qronos-cli\n"
      })
    }), "\n", jsx(_components.p, {
      children: "This gives you two names for the same program:"
    }), "\n", jsxs(_components.ul, {
      children: ["\n", jsx(_components.li, {
        children: jsx(_components.code, {
          children: "qronos-cli"
        })
      }), "\n", jsx(_components.li, {
        children: jsx(_components.code, {
          children: "qronos"
        })
      }), "\n"]
    }), "\n", jsx(_components.p, {
      children: "Both are exact aliases. Nothing else is installed beside them."
    }), "\n", jsx(_components.h2, {
      id: "a-pinned-version",
      children: "A pinned version"
    }), "\n", jsx(_components.pre, {
      children: jsx(_components.code, {
        className: "language-bash",
        children: "npx qronos-cli@1.0.27\n"
      })
    }), "\n", jsx(_components.p, {
      children: "Pin when a script or a demo must not change under you. Bump the pin on purpose."
    }), "\n", jsx(_components.h2, {
      id: "requirements",
      children: "Requirements"
    }), "\n", jsxs(_components.table, {
      children: [jsx(_components.thead, {
        children: jsxs(_components.tr, {
          children: [jsx(_components.th, {
            style: {
              textAlign: "left"
            },
            children: "Item"
          }), jsx(_components.th, {
            style: {
              textAlign: "left"
            },
            children: "Value"
          })]
        })
      }), jsxs(_components.tbody, {
        children: [jsxs(_components.tr, {
          children: [jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "Node"
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: jsx(_components.code, {
              children: ">= 22.19.0"
            })
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "Operating systems"
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "Windows, macOS, Linux"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "Disk"
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "about 40 MB, including the bundled TypeScript server"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "Licence"
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "MIT"
          })]
        })]
      })]
    }), "\n", jsx(_components.h2, {
      id: "updating",
      children: "Updating"
    }), "\n", jsx(_components.pre, {
      children: jsx(_components.code, {
        className: "language-bash",
        children: "npm install -g qronos-cli@latest\nqronos --version\n"
      })
    }), "\n", jsxs(_components.p, {
      children: ["If ", jsx(_components.code, {
        children: "--version"
      }), " prints an older number than you expected, you have two installs on\n", jsx(_components.code, {
        children: "PATH"
      }), ". Find them:"]
    }), "\n", jsx(_components.pre, {
      children: jsx(_components.code, {
        className: "language-bash",
        children: "which -a qronos\n"
      })
    }), "\n", jsx(_components.p, {
      children: "The first line wins. Remove the old one, or use the full path."
    }), "\n", jsx(_components.h2, {
      id: "uninstalling",
      children: "Uninstalling"
    }), "\n", jsx(_components.pre, {
      children: jsx(_components.code, {
        className: "language-bash",
        children: "npm uninstall -g qronos-cli\nrm -rf ~/.qronos      # only if you also want your sessions gone\n"
      })
    }), "\n", jsx(_components.p, {
      children: "Sessions are plain JSONL files. Copy the folder before deleting it if you might\nwant the history."
    })]
  });
}
function MDXContent$6(props = {}) {
  const { wrapper: MDXLayout } = props.components || {};
  return MDXLayout ? jsx(MDXLayout, {
    ...props,
    children: jsx(_createMdxContent$6, {
      ...props
    })
  }) : _createMdxContent$6(props);
}
function _createMdxContent$5(props) {
  const _components = {
    code: "code",
    h2: "h2",
    li: "li",
    ol: "ol",
    p: "p",
    pre: "pre",
    strong: "strong",
    table: "table",
    tbody: "tbody",
    td: "td",
    th: "th",
    thead: "thead",
    tr: "tr",
    ul: "ul",
    ...props.components
  };
  return jsxs(Fragment, {
    children: [jsx(_components.p, {
      children: "Memory is what Qronos knows about your project at the start of the next session.\nIt is local, small, and under your control."
    }), "\n", jsx(_components.h2, {
      id: "two-layers",
      children: "Two layers"
    }), "\n", jsxs(_components.ol, {
      children: ["\n", jsxs(_components.li, {
        children: [jsx(_components.strong, {
          children: "A project document."
        }), " A file at the root of the repository that you write and\nread like a README. Qronos reads it first."]
      }), "\n", jsxs(_components.li, {
        children: [jsx(_components.strong, {
          children: "A learned journal."
        }), " Notes Qronos writes after useful work: a command that\nfixed the tests, a convention you corrected, a path that is not where it looks."]
      }), "\n"]
    }), "\n", jsx(_components.p, {
      children: "The document is for rules. The journal is for facts discovered along the way."
    }), "\n", jsx(_components.h2, {
      id: "what-gets-written",
      children: "What gets written"
    }), "\n", jsx(_components.p, {
      children: "After a turn that changed something, a short note may be appended:"
    }), "\n", jsx(_components.pre, {
      children: jsx(_components.code, {
        className: "language-json",
        children: '{\n  "at": "2026-11-23T10:41:00Z",\n  "kind": "lesson",\n  "text": "tests fail unless DATABASE_URL is set; use `.env.test`",\n  "files": ["vitest.config.ts"]\n}\n'
      })
    }), "\n", jsx(_components.p, {
      children: "Then a consolidation step folds the journal into a small document with a hard size\ncap. Notes that have not helped are dropped rather than kept forever."
    }), "\n", jsx(_components.h2, {
      id: "what-is-injected",
      children: "What is injected"
    }), "\n", jsx(_components.p, {
      children: "At the start of a turn, Qronos injects a few capped hints — not the whole journal.\nThe prompt stays small, so you do not pay for old notes on every call."
    }), "\n", jsx(_components.h2, {
      id: "secrets-are-redacted",
      children: "Secrets are redacted"
    }), "\n", jsx(_components.p, {
      children: "Before a note is written, anything that looks like a key, token or password is\nreplaced with a placeholder. The redaction runs before the text is cut, so a cut\ncan never leave half a secret behind."
    }), "\n", jsx(_components.h2, {
      id: "commands",
      children: "Commands"
    }), "\n", jsxs(_components.table, {
      children: [jsx(_components.thead, {
        children: jsxs(_components.tr, {
          children: [jsx(_components.th, {
            style: {
              textAlign: "left"
            },
            children: "Command"
          }), jsx(_components.th, {
            style: {
              textAlign: "left"
            },
            children: "What it does"
          })]
        })
      }), jsxs(_components.tbody, {
        children: [jsxs(_components.tr, {
          children: [jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: jsx(_components.code, {
              children: "/memory"
            })
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "show the project document and the recent notes"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: jsx(_components.code, {
              children: "/memory sync"
            })
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "rewrite the document from the journal now"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: jsx(_components.code, {
              children: "/memory forget <id>"
            })
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "remove one note"
          })]
        })]
      })]
    }), "\n", jsx(_components.h2, {
      id: "where-it-lives",
      children: "Where it lives"
    }), "\n", jsx(_components.pre, {
      children: jsx(_components.code, {
        children: "~/.qronos/memory/<project-hash>/journal.jsonl\n~/.qronos/memory/<project-hash>/document.md\n"
      })
    }), "\n", jsxs(_components.p, {
      children: ["One folder per project path. Two checkouts of the same repo do not share notes,\nbecause a note about ", jsx(_components.code, {
        children: "~/work/api"
      }), " is often wrong in ", jsx(_components.code, {
        children: "~/scratch/api"
      }), "."]
    }), "\n", jsx(_components.h2, {
      id: "turn-it-off",
      children: "Turn it off"
    }), "\n", jsx(_components.pre, {
      children: jsx(_components.code, {
        className: "language-bash",
        children: "QRONOS_MEMORY=0 qronos\n"
      })
    }), "\n", jsx(_components.p, {
      children: "Memory is on by default because it makes the second session much better. It is also\nthe feature most likely to surprise you, so the switch is a plain environment\nvariable and nothing else depends on it."
    }), "\n", jsx(_components.h2, {
      id: "what-memory-is-not",
      children: "What memory is not"
    }), "\n", jsxs(_components.ul, {
      children: ["\n", jsx(_components.li, {
        children: "It is not a vector database and does not embed your repository."
      }), "\n", jsx(_components.li, {
        children: "It is not sent anywhere except as the small hint block at the top of a prompt."
      }), "\n", jsx(_components.li, {
        children: "It is not a backup. Sessions and journals are JSONL files; copy them if they matter."
      }), "\n"]
    })]
  });
}
function MDXContent$5(props = {}) {
  const { wrapper: MDXLayout } = props.components || {};
  return MDXLayout ? jsx(MDXLayout, {
    ...props,
    children: jsx(_createMdxContent$5, {
      ...props
    })
  }) : _createMdxContent$5(props);
}
function _createMdxContent$4(props) {
  const _components = {
    code: "code",
    h2: "h2",
    li: "li",
    p: "p",
    pre: "pre",
    ul: "ul",
    ...props.components
  };
  return jsxs(Fragment, {
    children: [jsx(_components.p, {
      children: "Short version: your code stays on your machine. The only bytes that leave are the\nprompts you asked for."
    }), "\n", jsx(_components.h2, {
      id: "what-is-stored-and-where",
      children: "What is stored, and where"
    }), "\n", jsx(_components.pre, {
      children: jsx(_components.code, {
        children: "~/.qronos/\n  connections.json        provider names, endpoints, model choices, mode 0600\n  agent/sessions/         one .jsonl per session\n  memory/<project>/       journal and document for one project path\n  workflow-runs/          one .jsonl journal per workflow run\n"
      })
    }), "\n", jsx(_components.p, {
      children: "All of it is plain text you can read, copy or delete. There is no hidden database."
    }), "\n", jsx(_components.h2, {
      id: "what-is-sent-to-a-model",
      children: "What is sent to a model"
    }), "\n", jsxs(_components.ul, {
      children: ["\n", jsx(_components.li, {
        children: "the conversation, as you would expect;"
      }), "\n", jsx(_components.li, {
        children: "file contents Qronos reads, cut to the parts it needs;"
      }), "\n", jsx(_components.li, {
        children: "the memory hint block, which is short and redacted;"
      }), "\n", jsx(_components.li, {
        children: "the tool calls it is about to make."
      }), "\n"]
    }), "\n", jsx(_components.p, {
      children: "Nothing else. No telemetry of file paths, no repository fingerprint, no usage profile."
    }), "\n", jsx(_components.h2, {
      id: "what-is-redacted-before-storage",
      children: "What is redacted before storage"
    }), "\n", jsxs(_components.p, {
      children: ["Anything that looks like a credential: ", jsx(_components.code, {
        children: "sk-…"
      }), ", ", jsx(_components.code, {
        children: "ghp_…"
      }), ", bearer tokens, long base64\nstrings next to words like ", jsx(_components.code, {
        children: "key"
      }), ", ", jsx(_components.code, {
        children: "token"
      }), ", ", jsx(_components.code, {
        children: "password"
      }), " or ", jsx(_components.code, {
        children: "secret"
      }), ". Redaction runs\nbefore any size cut, so a cut cannot leave half a secret behind."]
    }), "\n", jsx(_components.h2, {
      id: "keys",
      children: "Keys"
    }), "\n", jsxs(_components.ul, {
      children: ["\n", jsxs(_components.li, {
        children: ["Read from the environment at start, or from ", jsx(_components.code, {
          children: "~/.qronos/connections.json"
        }), " with mode\n", jsx(_components.code, {
          children: "0600"
        }), " if you explicitly saved one."]
      }), "\n", jsx(_components.li, {
        children: "Never printed in the chat, the log, an error message or an exported transcript."
      }), "\n", jsx(_components.li, {
        children: "Never sent to a provider other than the one you selected."
      }), "\n"]
    }), "\n", jsx(_components.h2, {
      id: "ads-on-the-free-tier",
      children: "Ads on the free tier"
    }), "\n", jsx(_components.p, {
      children: "The hosted gateway is sponsored. On the free tier a small ad line appears in the CLI,\nserved by the project's own ad service, and an impression is counted when it is drawn.\nAds are not fetched alongside your prompt and are not tied to your code."
    }), "\n", jsx(_components.h2, {
      id: "deleting-everything",
      children: "Deleting everything"
    }), "\n", jsx(_components.pre, {
      children: jsx(_components.code, {
        className: "language-bash",
        children: "rm -rf ~/.qronos\n"
      })
    }), "\n", jsxs(_components.p, {
      children: ["That removes sessions, memory, journals and saved provider settings. Your project\nfiles are untouched. ", jsx(_components.code, {
        children: ".qronos/workflows/"
      }), " inside a repository is not removed — delete\nit on purpose if you saved scripts you do not want."]
    }), "\n", jsx(_components.h2, {
      id: "what-this-page-cannot-promise",
      children: "What this page cannot promise"
    }), "\n", jsx(_components.p, {
      children: "Qronos does not control the provider you chose. Each provider has its own retention\npolicy for prompts. If that matters for your work, read theirs, or run a model on your\nown machine through an OpenAI-compatible server."
    })]
  });
}
function MDXContent$4(props = {}) {
  const { wrapper: MDXLayout } = props.components || {};
  return MDXLayout ? jsx(MDXLayout, {
    ...props,
    children: jsx(_createMdxContent$4, {
      ...props
    })
  }) : _createMdxContent$4(props);
}
function _createMdxContent$3(props) {
  const _components = {
    code: "code",
    h2: "h2",
    li: "li",
    p: "p",
    strong: "strong",
    table: "table",
    tbody: "tbody",
    td: "td",
    th: "th",
    thead: "thead",
    tr: "tr",
    ul: "ul",
    ...props.components
  };
  return jsxs(Fragment, {
    children: [jsx(_components.p, {
      children: 'Three keys fix a run that went wrong, without starting over. They exist because a\nworkflow can cost real money, and "run it again" is the most expensive answer.'
    }), "\n", jsxs(_components.h2, {
      id: "f--retry-what-failed",
      children: [jsx(_components.code, {
        children: "f"
      }), " — retry what failed"]
    }), "\n", jsx(_components.p, {
      children: "Runs only the agents with a dark red cross. Every good answer stays where it is."
    }), "\n", jsxs(_components.ul, {
      children: ["\n", jsx(_components.li, {
        children: "asks first: how many failed, their names, and what the first attempt spent;"
      }), "\n", jsx(_components.li, {
        children: "one at a time, so the bill stays readable;"
      }), "\n", jsx(_components.li, {
        children: "new work, not a replay: tokens rise and the rows say they ran again;"
      }), "\n", jsx(_components.li, {
        children: "the schema travels with the record, so a retried agent cannot pass a shape it\nfailed the first time."
      }), "\n"]
    }), "\n", jsxs(_components.p, {
      children: ["A ", jsx(_components.strong, {
        children: "stopped"
      }), ' agent is not retried. You stopped it on purpose. If the only\nunfinished agents are the ones you stopped, the answer says exactly that instead of\na flat "nothing failed".']
    }), "\n", jsxs(_components.h2, {
      id: "a--rerun-a-phase",
      children: [jsx(_components.code, {
        children: "a"
      }), " — rerun a phase"]
    }), "\n", jsx(_components.p, {
      children: "Runs every agent of one phase, in order. Use it when the code changed and every\nanswer in that phase is out of date."
    }), "\n", jsxs(_components.ul, {
      children: ["\n", jsx(_components.li, {
        children: "asks first, with the phase, the agent count and the earlier spend;"
      }), "\n", jsx(_components.li, {
        children: "new work, so the tokens rise;"
      }), "\n", jsx(_components.li, {
        children: "one agent that cannot run does not stop the rest, and the notice says which one\ndid not run and why."
      }), "\n"]
    }), "\n", jsxs(_components.h2, {
      id: "k-and-x--two-sizes-of-stop",
      children: [jsx(_components.code, {
        children: "k"
      }), " and ", jsx(_components.code, {
        children: "x"
      }), " — two sizes of stop"]
    }), "\n", jsxs(_components.table, {
      children: [jsx(_components.thead, {
        children: jsxs(_components.tr, {
          children: [jsx(_components.th, {
            style: {
              textAlign: "left"
            },
            children: "Key"
          }), jsx(_components.th, {
            style: {
              textAlign: "left"
            },
            children: "Scope"
          })]
        })
      }), jsxs(_components.tbody, {
        children: [jsxs(_components.tr, {
          children: [jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: jsx(_components.code, {
              children: "k"
            })
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "the one agent you are looking at"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: jsx(_components.code, {
              children: "x"
            })
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "the whole run"
          })]
        })]
      })]
    }), "\n", jsxs(_components.p, {
      children: ["A stop saves the rest of a call, never the call. What the agent already spent stays\non the bill, and it is labelled ", jsx(_components.strong, {
        children: "stopped by you"
      }), " in amber — never ", jsx(_components.code, {
        children: "failed"
      }), "."]
    }), "\n", jsxs(_components.p, {
      children: ["Stopping the wrong agent spends money on the wrong work, so the command refuses a\nword that matches two agents and lists them. ", jsx(_components.code, {
        children: "/workflows stop <id> <agent>"
      }), " accepts\nan id (", jsx(_components.code, {
        children: "#3"
      }), ", or ", jsx(_components.code, {
        children: "3"
      }), ") or part of a label."]
    }), "\n", jsxs(_components.h2, {
      id: "r--replay",
      children: [jsx(_components.code, {
        children: "r"
      }), " — replay"]
    }), "\n", jsxs(_components.p, {
      children: ["Replays an agent from the journal. It makes no model call, so it costs nothing, and\nit is drawn with a blue ", jsx(_components.code, {
        children: "↺"
      }), " rather than a green tick. A report must never pass old\nwork off as new."]
    }), "\n", jsxs(_components.p, {
      children: ["A ", jsx(_components.strong, {
        children: "restart"
      }), " is the opposite of a replay: new work, so the row says ", jsx(_components.code, {
        children: "Done · restarted"
      }), " and the tokens rise. A restart asks first, with an editable task, because\nusually it was the words that failed, not the model."]
    }), "\n", jsx(_components.h2, {
      id: "the-one-rule-behind-all-of-it",
      children: "The one rule behind all of it"
    }), "\n", jsx(_components.p, {
      children: "Every path that runs an agent applies the same schema, the same model routing and the\nsame permission door. A retry, a rerun and a restart are not special cases with their\nown code — that is how a green tick ended up on unvalidated words once already."
    })]
  });
}
function MDXContent$3(props = {}) {
  const { wrapper: MDXLayout } = props.components || {};
  return MDXLayout ? jsx(MDXLayout, {
    ...props,
    children: jsx(_createMdxContent$3, {
      ...props
    })
  }) : _createMdxContent$3(props);
}
function _createMdxContent$2(props) {
  const _components = {
    code: "code",
    em: "em",
    h2: "h2",
    li: "li",
    p: "p",
    pre: "pre",
    strong: "strong",
    ul: "ul",
    ...props.components
  };
  return jsxs(Fragment, {
    children: [jsx(_components.p, {
      children: "Every shell call carries an optional short sentence, written by the model, and the\ntranscript prints it above the command."
    }), "\n", jsx(_components.pre, {
      children: jsx(_components.code, {
        children: "● List files in current directory · 1s\n  ⎿ $ ls -la\n"
      })
    }), "\n", jsxs(_components.p, {
      children: ["The sentence is a real field on the tool call (", jsx(_components.code, {
        children: "description"
      }), "), not something\ngenerated from the command afterwards. That matters: a summary written after the\nfact can only repeat the command, while a sentence written before it can say ", jsx(_components.em, {
        children: "why"
      }), "."]
    }), "\n", jsx(_components.h2, {
      id: "what-the-model-is-asked-for",
      children: "What the model is asked for"
    }), "\n", jsx(_components.p, {
      children: "The field's own description teaches the rules, so nothing extra is spent:"
    }), "\n", jsxs(_components.ul, {
      children: ["\n", jsx(_components.li, {
        children: "active voice, five to ten words;"
      }), "\n", jsx(_components.li, {
        children: "say what the step achieves, not how;"
      }), "\n", jsx(_components.li, {
        children: 'never "run the command" or "complex" or "risky";'
      }), "\n", jsx(_components.li, {
        children: "no file paths, no secrets, no second line."
      }), "\n"]
    }), "\n", jsxs(_components.p, {
      children: ["Real examples from a neutral prompt: ", jsx(_components.strong, {
        children: '"List files in current directory"'
      }), " and\n", jsx(_components.strong, {
        children: '"Show current Git repository status"'
      }), ". The model filled the field on both calls\nwithout being told to."]
    }), "\n", jsx(_components.h2, {
      id: "when-there-is-no-sentence",
      children: "When there is no sentence"
    }), "\n", jsx(_components.p, {
      children: "The line falls back to the old form and nothing breaks:"
    }), "\n", jsx(_components.pre, {
      children: jsx(_components.code, {
        children: "● Bash(ls -la)\n"
      })
    }), "\n", jsx(_components.p, {
      children: "A resumed session, an old transcript, or a workflow agent can all arrive without a\ndescription. That is not an error, and it is never filled with an invented sentence."
    }), "\n", jsx(_components.h2, {
      id: "cleaning",
      children: "Cleaning"
    }), "\n", jsx(_components.p, {
      children: "The model's words are cut, never trusted:"
    }), "\n", jsxs(_components.ul, {
      children: ["\n", jsx(_components.li, {
        children: "colours, control characters and second lines are stripped;"
      }), "\n", jsx(_components.li, {
        children: "the title is cut at 90 characters, the command at 120;"
      }), "\n", jsx(_components.li, {
        children: "a description that only repeats the command is dropped, because saying it twice is\nnoise."
      }), "\n"]
    }), "\n", jsx(_components.h2, {
      id: "turning-it-off",
      children: "Turning it off"
    }), "\n", jsx(_components.pre, {
      children: jsx(_components.code, {
        className: "language-bash",
        children: "QRONOS_TOOL_DESCRIPTIONS=0 qronos\n"
      })
    }), "\n", jsxs(_components.p, {
      children: ["That one flag removes the field from the tool schema ", jsx(_components.strong, {
        children: "and"
      }), " the line from the\ndisplay, so nothing is asked for and nothing is spent. Schema and renderer read the\nsame setting; they cannot disagree."]
    }), "\n", jsx(_components.h2, {
      id: "what-did-not-change",
      children: "What did not change"
    }), "\n", jsxs(_components.p, {
      children: ["The tool is still called ", jsx(_components.code, {
        children: "bash"
      }), " (and ", jsx(_components.code, {
        children: "powershell"
      }), " on Windows). Approvals, plan mode,\nworkflow tool doors and the read-only fact check all work exactly as before. A step\nname is a label, not a permission."]
    })]
  });
}
function MDXContent$2(props = {}) {
  const { wrapper: MDXLayout } = props.components || {};
  return MDXLayout ? jsx(MDXLayout, {
    ...props,
    children: jsx(_createMdxContent$2, {
      ...props
    })
  }) : _createMdxContent$2(props);
}
function _createMdxContent$1(props) {
  const _components = {
    code: "code",
    h2: "h2",
    li: "li",
    p: "p",
    pre: "pre",
    strong: "strong",
    ul: "ul",
    ...props.components
  };
  return jsxs(Fragment, {
    children: [jsx(_components.p, {
      children: "These are the errors people actually hit. Each one has a one-line cause and a\none-line fix."
    }), "\n", jsx(_components.h2, {
      id: "the-selected-model-is-temporarily-unavailable-please-retry-shortly",
      children: jsx(_components.code, {
        children: "The selected model is temporarily unavailable. Please retry shortly."
      })
    }), "\n", jsxs(_components.p, {
      children: ["The gateway hides the real upstream status on purpose. Most often it is ", jsx(_components.strong, {
        children: "429"
      }), ": the\nprovider's rate limit, not a bad configuration."]
    }), "\n", jsxs(_components.ul, {
      children: ["\n", jsx(_components.li, {
        children: "Wait a minute and retry."
      }), "\n", jsxs(_components.li, {
        children: ["If you run workflows, set ", jsx(_components.code, {
          children: "QRONOS_WORKFLOW_CONCURRENCY=2"
        }), "."]
      }), "\n", jsx(_components.li, {
        children: "The real status is in the provider's own dashboard, not in your terminal."
      }), "\n"]
    }), "\n", jsx(_components.h2, {
      id: "qronos-ai-model-has-no-api-key-saved",
      children: jsx(_components.code, {
        children: "Qronos AI <model> has no API key saved"
      })
    }), "\n", jsxs(_components.p, {
      children: ["Nothing is configured for that model, and the gateway will not send a made-up key.\nAdd a credential for the model, or choose another model with ", jsx(_components.code, {
        children: "/config"
      }), "."]
    }), "\n", jsxs(_components.h2, {
      id: "ads_required-free-tier-only",
      children: [jsx(_components.code, {
        children: "ads_required"
      }), " (free tier only)"]
    }), "\n", jsxs(_components.p, {
      children: ["The free tier needs a real ad impression for the session. A request that never saw an\nad is paused. The fix is not a proxy: run the CLI normally, or use ", jsx(_components.code, {
        children: "/buy-credits"
      }), ", or\nbring your own provider key."]
    }), "\n", jsxs(_components.h2, {
      id: "a-shell-call-shows-bashcmd-and-no-sentence",
      children: ["A shell call shows ", jsx(_components.code, {
        children: "Bash(cmd)"
      }), " and no sentence"]
    }), "\n", jsx(_components.p, {
      children: "Your install is older than 1.0.27, or the model did not send the optional field."
    }), "\n", jsx(_components.pre, {
      children: jsx(_components.code, {
        className: "language-bash",
        children: "npm install -g qronos-cli@latest\nqronos --version     # expect 1.0.27 or newer\n"
      })
    }), "\n", jsx(_components.p, {
      children: "Old transcripts keep the old line. They are not rewritten."
    }), "\n", jsx(_components.h2, {
      id: "ctxtools-is-not-iterable",
      children: jsx(_components.code, {
        children: "ctx.tools is not iterable"
      })
    }), "\n", jsx(_components.p, {
      children: "A workflow bug fixed in 1.0.26. Update:"
    }), "\n", jsx(_components.pre, {
      children: jsx(_components.code, {
        className: "language-bash",
        children: "npm install -g qronos-cli@latest\n"
      })
    }), "\n", jsx(_components.h2, {
      id: "you-are-running-node--but-this-package-requires--22190",
      children: jsx(_components.code, {
        children: "You are running Node ... but this package requires >= 22.19.0"
      })
    }), "\n", jsxs(_components.p, {
      children: ["Use a newer Node (", jsx(_components.code, {
        children: "nvm install 22"
      }), ", or your system package manager). There is no\nsupported older Node: the terminal code needs the newer stream API."]
    }), "\n", jsxs(_components.h2, {
      id: "the-tab-title-or-quit-label-is-wrong",
      children: ["The tab title or ", jsx(_components.code, {
        children: "/quit"
      }), " label is wrong"]
    }), "\n", jsx(_components.p, {
      children: "Both were fixed in the same release as the step names. Update the global install and\nrestart the terminal, not just Qronos."
    }), "\n", jsx(_components.h2, {
      id: "nothing-paints-on-windows",
      children: "Nothing paints on Windows"
    }), "\n", jsxs(_components.p, {
      children: ["Windows PowerShell is supported as a shell tool, but the terminal must be a real\nWindows console (Windows Terminal, PowerShell 7, VS Code terminal). The old\n", jsx(_components.code, {
        children: "conhost"
      }), " window has no colour support."]
    }), "\n", jsx(_components.h2, {
      id: "ctrlc-did-nothing",
      children: "Ctrl+C did nothing"
    }), "\n", jsxs(_components.p, {
      children: ["Correct. ", jsx(_components.code, {
        children: "ctrl+c"
      }), " is not bound, because it would kill a stream you already paid for.\nUse ", jsx(_components.strong, {
        children: "esc"
      }), " to interrupt, ", jsx(_components.strong, {
        children: "ctrl+d"
      }), " to exit."]
    }), "\n", jsx(_components.h2, {
      id: "a-workflow-stopped-at-ten-minutes",
      children: "A workflow stopped at ten minutes"
    }), "\n", jsx(_components.p, {
      children: "That is the wall clock cap, and it says so in the result. Raise it up to one hour:"
    }), "\n", jsx(_components.pre, {
      children: jsx(_components.code, {
        className: "language-bash",
        children: "QRONOS_WORKFLOW_WALL_CLOCK_MS=1800000 qronos\n"
      })
    }), "\n", jsxs(_components.p, {
      children: ["Or split the job into phases and use ", jsx(_components.code, {
        children: "/workflows rerun <id> <phase>"
      }), "."]
    }), "\n", jsx(_components.h2, {
      id: "still-stuck",
      children: "Still stuck"
    }), "\n", jsxs(_components.p, {
      children: ["Open an issue with the exact error line, the version from ", jsx(_components.code, {
        children: "qronos --version"
      }), ", and your\noperating system. Do not paste a key or a token: redact anything that looks like a\nsecret before you send it."]
    })]
  });
}
function MDXContent$1(props = {}) {
  const { wrapper: MDXLayout } = props.components || {};
  return MDXLayout ? jsx(MDXLayout, {
    ...props,
    children: jsx(_createMdxContent$1, {
      ...props
    })
  }) : _createMdxContent$1(props);
}
function _createMdxContent(props) {
  const _components = {
    code: "code",
    h2: "h2",
    li: "li",
    p: "p",
    pre: "pre",
    strong: "strong",
    table: "table",
    tbody: "tbody",
    td: "td",
    th: "th",
    thead: "thead",
    tr: "tr",
    ul: "ul",
    ...props.components
  };
  return jsxs(Fragment, {
    children: [jsx(_components.p, {
      children: "A workflow is a small JavaScript script that the model writes for you. It calls\nsubagents, waits for them, and returns one answer. Your chat stays readable even\nwhen thirty agents did the work."
    }), "\n", jsx(_components.h2, {
      id: "how-a-run-starts",
      children: "How a run starts"
    }), "\n", jsxs(_components.p, {
      children: ["Type the word ", jsx(_components.strong, {
        children: "ultracode"
      }), " as its own word in a prompt:"]
    }), "\n", jsx(_components.pre, {
      children: jsx(_components.code, {
        children: "ultracode: audit this repo for unused exports and say which are safe to delete\n"
      })
    }), "\n", jsxs(_components.p, {
      children: [jsx(_components.code, {
        children: "ultrathink"
      }), " and ", jsx(_components.code, {
        children: "orchestrate"
      }), " are different: those ask for more reasoning, not for\na workflow. The match is strict — lowercase, standalone, never inside a code fence\nor a path."]
    }), "\n", jsx(_components.p, {
      children: "The chat then asks for a script instead of an essay. You see the script, and you\napprove it before anything runs."
    }), "\n", jsx(_components.h2, {
      id: "the-script-api",
      children: "The script API"
    }), "\n", jsx(_components.pre, {
      children: jsx(_components.code, {
        className: "language-js",
        children: 'export const meta = {\n  name: "unused-exports",\n  description: "find exports nothing imports",\n  phases: ["Scout", "Audit", "Report"],\n};\n\nphase("Scout");\nconst files = await agent("List the exported symbols in src/**/*.ts", { label: "exports" });\n\nphase("Audit");\nconst checks = await parallel(\n  files.data.symbols.map((name) => () =>\n    agent(`Does anything import ${name}? Answer in one sentence.`, { agent: "explorer" })\n  )\n);\n\nphase("Report");\nconst report = await agent("Write the report from these answers: " + JSON.stringify(checks));\nreturn report.text;\n'
      })
    }), "\n", jsxs(_components.table, {
      children: [jsx(_components.thead, {
        children: jsxs(_components.tr, {
          children: [jsx(_components.th, {
            style: {
              textAlign: "left"
            },
            children: "Call"
          }), jsx(_components.th, {
            style: {
              textAlign: "left"
            },
            children: "What it returns"
          })]
        })
      }), jsxs(_components.tbody, {
        children: [jsxs(_components.tr, {
          children: [jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: jsx(_components.code, {
              children: "agent(prompt, { label, schema, agent, model, phase })"
            })
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: jsx(_components.code, {
              children: "{ ok, text, data, error, usage, replayed?, stopped? }"
            })
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: jsx(_components.code, {
              children: "parallel([() => agent(...), ...])"
            })
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "an array of those results, in order"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: jsx(_components.code, {
              children: "pipeline(list, fn)"
            })
          }), jsxs(_components.td, {
            style: {
              textAlign: "left"
            },
            children: ["each item through ", jsx(_components.code, {
              children: "fn"
            }), ", one at a time"]
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: jsx(_components.code, {
              children: 'phase("Name")'
            })
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "sets the phase for later agents"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: jsx(_components.code, {
              children: 'log("message")'
            })
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "a line in the run log"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: jsx(_components.code, {
              children: "workflow(scriptString)"
            })
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "a child workflow, one level deep, shared budget"
          })]
        })]
      })]
    }), "\n", jsxs(_components.p, {
      children: [jsx(_components.code, {
        children: "args"
      }), " and ", jsx(_components.code, {
        children: "budget"
      }), " are read-only. ", jsx(_components.code, {
        children: "Math.random"
      }), " is seeded and the clock is frozen,\nso a replayed run takes the same path."]
    }), "\n", jsx(_components.h2, {
      id: "what-the-script-cannot-do",
      children: "What the script cannot do"
    }), "\n", jsxs(_components.p, {
      children: ["The script may not import, require, read files, run a shell, touch the network or\n", jsx(_components.code, {
        children: "process"
      }), ", or start timers. Those words are refused before the script runs. Only\nits ", jsx(_components.strong, {
        children: "subagents"
      }), " have tools, and they pass the same permission door you do."]
    }), "\n", jsxs(_components.p, {
      children: ["A ", jsx(_components.code, {
        children: "vm"
      }), " is a guardrail against accidents, not a security boundary. Read a script\nbefore you approve it, exactly as you would read a shell command."]
    }), "\n", jsx(_components.h2, {
      id: "caps-and-they-are-reported",
      children: "Caps, and they are reported"
    }), "\n", jsxs(_components.table, {
      children: [jsx(_components.thead, {
        children: jsxs(_components.tr, {
          children: [jsx(_components.th, {
            style: {
              textAlign: "left"
            },
            children: "Cap"
          }), jsx(_components.th, {
            style: {
              textAlign: "left"
            },
            children: "Default"
          }), jsx(_components.th, {
            style: {
              textAlign: "left"
            },
            children: "Range"
          })]
        })
      }), jsxs(_components.tbody, {
        children: [jsxs(_components.tr, {
          children: [jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "wall clock"
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "10 minutes"
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "1 min – 60 min"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "agents"
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "1 000"
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "1 – 2 000"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "running at once"
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "16"
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "1 – 32"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "log lines"
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "500"
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "—"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "result size"
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "200 000 chars"
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "—"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "nesting"
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "2 levels"
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "1 – 3"
          })]
        })]
      })]
    }), "\n", jsx(_components.p, {
      children: "When a cap is hit, the result says so. Nothing is truncated in silence."
    }), "\n", jsx(_components.h2, {
      id: "watching-a-run",
      children: "Watching a run"
    }), "\n", jsxs(_components.p, {
      children: [jsx(_components.code, {
        children: "alt+w"
      }), ", or ", jsx(_components.code, {
        children: "/workflows panel"
      }), ":"]
    }), "\n", jsx(_components.pre, {
      children: jsx(_components.code, {
        children: "Scout   ✓3        6.1k\nAudit   ✓1 ↺1 ✗1 ⊘1  11.8k\nReport  ·1        3.2k\n"
      })
    }), "\n", jsxs(_components.ul, {
      children: ["\n", jsxs(_components.li, {
        children: [jsx(_components.code, {
          children: "✓"
        }), " bright green: finished."]
      }), "\n", jsxs(_components.li, {
        children: [jsx(_components.code, {
          children: "✗"
        }), " dark red: failed, with the reason."]
      }), "\n", jsxs(_components.li, {
        children: [jsx(_components.code, {
          children: "⊘"
        }), " amber: ", jsx(_components.strong, {
          children: "you"
        }), " stopped it, so it is not a failure."]
      }), "\n", jsxs(_components.li, {
        children: [jsx(_components.code, {
          children: "↺"
        }), " blue: replayed from the journal, and it cost nothing."]
      }), "\n"]
    }), "\n", jsxs(_components.p, {
      children: ["Tokens are shown per agent and per phase. ", jsx(_components.code, {
        children: "tokens"
      }), " is fresh spend; ", jsx(_components.code, {
        children: "replayedTokens"
      }), "\nis work you already paid for."]
    }), "\n", jsx(_components.h2, {
      id: "steering-a-run-that-is-already-going",
      children: "Steering a run that is already going"
    }), "\n", jsxs(_components.table, {
      children: [jsx(_components.thead, {
        children: jsxs(_components.tr, {
          children: [jsx(_components.th, {
            style: {
              textAlign: "left"
            },
            children: "Key"
          }), jsx(_components.th, {
            style: {
              textAlign: "left"
            },
            children: "Effect"
          })]
        })
      }), jsxs(_components.tbody, {
        children: [jsxs(_components.tr, {
          children: [jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: jsx(_components.code, {
              children: "p"
            })
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "pause: in-flight agents finish, nothing new starts"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: jsx(_components.code, {
              children: "r"
            })
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "replay from the journal"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: jsx(_components.code, {
              children: "x"
            })
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "stop the whole run"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: jsx(_components.code, {
              children: "k"
            })
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "stop one agent, leave the rest alone"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: jsx(_components.code, {
              children: "s"
            })
          }), jsxs(_components.td, {
            style: {
              textAlign: "left"
            },
            children: ["save the script into ", jsx(_components.code, {
              children: ".qronos/workflows/"
            })]
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: jsx(_components.code, {
              children: "a"
            })
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "rerun one phase"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: jsx(_components.code, {
              children: "f"
            })
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "retry only the failed agents"
          })]
        })]
      })]
    }), "\n", jsx(_components.p, {
      children: "Pause exists because killing an agent throws away tokens you already paid for.\nReplay exists because re-reading a journal costs nothing."
    }), "\n", jsx(_components.h2, {
      id: "failure-is-a-row-not-a-dead-run",
      children: "Failure is a row, not a dead run"
    }), "\n", jsxs(_components.p, {
      children: ["If one agent fails, its result is ", jsx(_components.code, {
        children: "{ ok: false, error }"
      }), " and the run carries on.\n", jsx(_components.code, {
        children: "/workflows retry <id>"
      }), " runs only the red crosses. A retried agent is new work, so\nits tokens rise and its row says it ran again — a report can never pass yesterday's\nanswer off as today's."]
    }), "\n", jsx(_components.h2, {
      id: "saving-and-reusing",
      children: "Saving and reusing"
    }), "\n", jsx(_components.pre, {
      children: jsx(_components.code, {
        children: "/workflows save wf_9k2      # writes .qronos/workflows/unused-exports.js\n/workflows scripts          # list what is saved\n/workflows run unused-exports\n/workflows edit unused-exports\n"
      })
    }), "\n", jsxs(_components.p, {
      children: ["A saved script is never overwritten. A name collision becomes ", jsx(_components.code, {
        children: "-2"
      }), ", ", jsx(_components.code, {
        children: "-3"
      }), ", and so on.\nNames are forgiving in exactly one way: ", jsx(_components.code, {
        children: "review"
      }), ", ", jsx(_components.code, {
        children: "review.js"
      }), " and ", jsx(_components.code, {
        children: "Review"
      }), " are the\nsame script."]
    }), "\n", jsx(_components.h2, {
      id: "environment",
      children: "Environment"
    }), "\n", jsxs(_components.table, {
      children: [jsx(_components.thead, {
        children: jsxs(_components.tr, {
          children: [jsx(_components.th, {
            style: {
              textAlign: "left"
            },
            children: "Variable"
          }), jsx(_components.th, {
            style: {
              textAlign: "left"
            },
            children: "Default"
          }), jsx(_components.th, {
            style: {
              textAlign: "left"
            },
            children: "Clamp"
          })]
        })
      }), jsxs(_components.tbody, {
        children: [jsxs(_components.tr, {
          children: [jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: jsx(_components.code, {
              children: "QRONOS_WORKFLOW_WALL_CLOCK_MS"
            })
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "600000"
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "60 000 – 3 600 000"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: jsx(_components.code, {
              children: "QRONOS_WORKFLOW_MAX_AGENTS"
            })
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "1000"
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "1 – 2000"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: jsx(_components.code, {
              children: "QRONOS_WORKFLOW_CONCURRENCY"
            })
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "16"
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "1 – 32"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: jsx(_components.code, {
              children: "QRONOS_WORKFLOW_MAX_LOGS"
            })
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "500"
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "—"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: jsx(_components.code, {
              children: "QRONOS_WORKFLOW_MAX_RESULT_CHARS"
            })
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "200000"
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "—"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: jsx(_components.code, {
              children: "QRONOS_WORKFLOW_MAX_DEPTH"
            })
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "2"
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "1 – 3"
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: jsx(_components.code, {
              children: "QRONOS_WORKFLOW_APPROVE"
            })
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: jsx(_components.code, {
              children: "ask"
            })
          }), jsxs(_components.td, {
            style: {
              textAlign: "left"
            },
            children: [jsx(_components.code, {
              children: "ask"
            }), ", ", jsx(_components.code, {
              children: "always"
            }), ", ", jsx(_components.code, {
              children: "0"
            })]
          })]
        }), jsxs(_components.tr, {
          children: [jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: jsx(_components.code, {
              children: "QRONOS_WORKFLOW_TOOLS"
            })
          }), jsx(_components.td, {
            style: {
              textAlign: "left"
            },
            children: "on"
          }), jsxs(_components.td, {
            style: {
              textAlign: "left"
            },
            children: [jsx(_components.code, {
              children: "0"
            }), " turns subagent tools off"]
          })]
        })]
      })]
    }), "\n", jsxs(_components.p, {
      children: ["On a free shared limit, set ", jsx(_components.code, {
        children: "QRONOS_WORKFLOW_CONCURRENCY=2"
      }), ". Sixteen agents against a\nlimit of eight requests a minute mostly buys rate-limit errors."]
    })]
  });
}
function MDXContent(props = {}) {
  const { wrapper: MDXLayout } = props.components || {};
  return MDXLayout ? jsx(MDXLayout, {
    ...props,
    children: jsx(_createMdxContent, {
      ...props
    })
  }) : _createMdxContent(props);
}
const DOC_SOURCES$1 = {
  "agent-hub": 'The hub is where subagents become visible: who is working, on what, with which\nmodel, and what it has cost so far.\n\n## The roster\n\nA floating panel, centred, never in the footer. Each row is one agent:\n\n```\n✓ check-auth        sonnet-5.5   4.2k   1m 02s\n✗ check-uploads     sonnet-5.5   3.1k   0m 48s\n⊘ check-logging     sonnet-5.5   2.6k   0m 39s\n↺ check-secrets     sonnet-5.5   0      0m 00s\n```\n\n- the glyph says the state, and the word beside it says it again;\n- the model column is the model that agent actually used;\n- `↺` means replayed from the journal — already paid for, so the tokens are zero.\n\n## Typed results\n\nAn agent can be asked for a shape:\n\n```js\nconst audit = await agent("List the risks with a severity", {\n  schema: {\n    type: "object",\n    properties: {\n      risks: {\n        type: "array",\n        items: {\n          type: "object",\n          properties: { title: { type: "string" }, severity: { enum: ["low", "high"] } },\n          required: ["title", "severity"],\n        },\n      },\n    },\n    required: ["risks"],\n  },\n});\n```\n\nYou get `audit.data` when the answer matches, and `audit.ok === false` with an error\nwhen it does not. The schema travels with the record, so a retried agent is checked\nagainst the same shape — a green tick can never be given to words nobody validated.\n\n## Chat with one agent\n\nOpen an agent to read its full transcript. You can send it one more instruction\nwithout starting a new run. The other agents keep working while you do.\n\n## Retry, one agent at a time\n\nA failed agent is a row, not a dead run. Retrying runs that one agent, with the\nschema, the model and the label it had before. The tokens rise because it is new\nwork; the good answers are untouched.\n\n## The rules the hub keeps\n\n| Rule | Why |\n| :--- | :--- |\n| a stopped agent is amber | you decided it; a failure is red |\n| a replayed agent is blue and free | it did not call the model |\n| queued agents are not in the detail list | they have nothing to show yet |\n| the panel only reads | closing it never loses a run |\n| every panel key is also a command | a headless session can do the same thing |\n',
  "commands": "Two kinds of command: flags you type before Qronos starts, and slash commands you\ntype inside the session.\n\n## Flags\n\n```bash\nqronos --provider openai --model gpt-4.1\nqronos --base-url http://localhost:11434/v1 --model llama3\nqronos --help\nqronos --version\n```\n\n| Flag | Meaning |\n| :--- | :--- |\n| `--provider <name>` | pick a saved provider |\n| `--model <id>` | override the model for this session |\n| `--base-url <url>` | any OpenAI-compatible endpoint |\n| `--version` | print the version and exit |\n| `--help` | print every flag and exit |\n\n## Slash commands\n\nType `/` in the prompt to see this list, filtered as you type.\n\n| Command | What it does |\n| :--- | :--- |\n| `/help` | keys, commands, and the current mode |\n| `/init` | write a project file describing this repository |\n| `/mode` | change how tool calls are approved |\n| `/config` | choose provider and model |\n| `/clear` | clear the screen, not the session |\n| `/memory` | show what is remembered; `/memory sync` rewrites the document |\n| `/compact` | summarise the session now, keeping the facts |\n| `/workflows` | list runs, open the panel, stop, pause, save, retry |\n| `/export` | write the session as `.html` or `.jsonl` |\n| `/import` | load a `.jsonl` transcript back into the chat |\n| `/buy-credits` | top up when the free allowance is used |\n| `/quit` | leave (the item is labelled **Quit**) |\n\n## Keys\n\n| Key | Action |\n| :--- | :--- |\n| `enter` | send |\n| `esc` | interrupt the current turn |\n| `ctrl+d` | exit |\n| `alt+w` | open the workflow panel |\n| `ctrl+c` | not bound — it would kill a stream you paid for |\n\n## `/workflows` in full\n\n```\n/workflows                  list runs\n/workflows <id>             one run in detail\n/workflows stop [<id>|all]  stop a run, or all of them\n/workflows stop <id> <agent> stop one agent\n/workflows pause <id>       finish in-flight work, then wait\n/workflows resume <id>      carry on from the journal\n/workflows saved            list saved scripts\n/workflows panel            open the live panel\n/workflows save [<id>]      save a run's script into the project\n/workflows restart [<id>] [<agent>]\n/workflows scripts          list scripts on disk\n/workflows run <name>       run a saved script\n/workflows edit <name>      open it in your editor\n/workflows rerun <id> <phase>\n/workflows retry <id>       retry only the failed agents\n```\n\nEvery one of these is also a key in the panel. The panel only reads: closing it\nnever loses a run.\n",
  "compaction": 'A long session fills the context window. Compaction replaces the oldest part with a\nsummary that keeps the facts which matter: what changed, what failed, what you\ndecided.\n\n## What you see\n\nA note in the chat, never a silent edit:\n\n```\nCompacted 62 messages into 9 · kept 4 files, 2 decisions\n```\n\nThe note is drawn for you. It is not sent to the model, so it costs nothing.\n\n## When it runs\n\n- Automatically, when the session is close to the model\'s context limit.\n- On demand, with `/compact`.\n\nOn by default. Turn it off with `QRONOS_COMPACT=0`.\n\n## How long it lasts\n\nA checkpoint is re-sent with **every** later prompt in the session, so the summary\nkeeps working rather than lasting one turn. It has a hard size cap and is redacted\nlike everything else.\n\n## If in doubt, it gives up\n\nThis is the rule that matters most: when the summariser is uncertain, it returns an\nempty object and compaction is skipped. The session continues with the full history\ninstead.\n\nA broken summary is much worse than a long context: it can quietly delete the one\nfact that mattered. So the code is written to prefer "no compaction" over "maybe\nwrong compaction".\n\n## What is kept\n\n| Kept | Dropped |\n| :--- | :--- |\n| file paths that were read or edited | greetings and restated questions |\n| decisions you made ("use Postgres, not SQLite") | long command output already summarised |\n| failures and their cause | tool calls that succeeded on the first try |\n| open questions and next steps | duplicated text |\n\n## Reading a checkpoint\n\nCheckpoints are saved with the session, so `/export` includes them. A `.jsonl`\ntranscript can be re-imported with `/import` and the checkpoint comes back with it.\n\n## Limits\n\nCompaction summarises text; it does not re-read your files. If a fact lives only in\na file that was never opened, no summary can invent it. Ask again when you need it.\n',
  "environment": "Every setting is one environment variable with a default that works. Nothing here is\nrequired.\n\n## Session behaviour\n\n| Variable | Default | Effect |\n| :--- | :--- | :--- |\n| `QRONOS_MEMORY` | on | `0` turns memory off completely |\n| `QRONOS_COMPACT` | on | `0` turns automatic compaction off |\n| `QRONOS_TOOL_DESCRIPTIONS` | on | `0` removes the step-name field and its line |\n| `QRONOS_ULTRATHINK` | on | `0` stops the `ultrathink` keyword from changing reasoning |\n| `QRONOS_HASHLINE` | on | `0` sends plain line numbers to the model |\n| `QRONOS_LSP` | on | `0` skips the check after a write |\n\n## Workflows\n\n| Variable | Default | Clamp |\n| :--- | :--- | :--- |\n| `QRONOS_WORKFLOW_WALL_CLOCK_MS` | `600000` | 60 000 – 3 600 000 |\n| `QRONOS_WORKFLOW_MAX_AGENTS` | `1000` | 1 – 2000 |\n| `QRONOS_WORKFLOW_CONCURRENCY` | `16` | 1 – 32 |\n| `QRONOS_WORKFLOW_MAX_LOGS` | `500` | — |\n| `QRONOS_WORKFLOW_MAX_RESULT_CHARS` | `200000` | — |\n| `QRONOS_WORKFLOW_MAX_DEPTH` | `2` | 1 – 3 |\n| `QRONOS_WORKFLOW_APPROVE` | `ask` | `ask`, `always`, `0` |\n| `QRONOS_WORKFLOW_TOOLS` | on | `0` gives subagents no tools |\n\nA clamp is applied, not an error: a value outside the range is pulled to the nearest\nend and the run reports what it used.\n\n## Debugging\n\n| Variable | Default | Effect |\n| :--- | :--- | :--- |\n| `QRONOS_DEBUG_WORKFLOW` | off | `1` writes the workflow event stream to stderr |\n| `QRONOS_E2E_MODEL` | — | the model the end-to-end scripts use |\n\n## Providers\n\n| Variable | Meaning |\n| :--- | :--- |\n| `OPENAI_API_KEY` | read when a provider points at OpenAI |\n| `ANTHROPIC_API_KEY` | read when a provider points at Anthropic |\n| `<PROVIDER>_API_KEY` | any other name you chose when saving a provider |\n\nKeys are read from the environment at start. They are not written to disk unless you\nexplicitly ask for that, and they are never printed.\n\n## Choosing values per project\n\nA shell wrapper is enough:\n\n```bash\n# cheap mode: small model, two agents at once, no memory\nexport QRONOS_WORKFLOW_CONCURRENCY=2\nexport QRONOS_MEMORY=0\nqronos --model claude-haiku-5.5\n```\n\nDo not put keys in a file inside the repository. Environment variables, a secrets\nmanager, or the connection file under `~/.qronos` (mode `0600`) are the three safe\nplaces.\n",
  "getting-started": "Qronos CLI is an AI coding agent that runs in your terminal. It reads your files,\nruns your shell, edits in place, and can fan a big job out to subagents.\n\n## You need\n\n- **Node 22.19 or newer.** Check with `node --version`.\n- A terminal: bash, zsh, PowerShell or Windows Terminal.\n- Either a Qronos account (free to start) or a key for a provider you already use.\n\n## Run it\n\n```bash\nnpx qronos-cli\n```\n\nThe first run asks one question: **sign in**, or **use my own API key**. Signing in\nsponsors your usage, so you do not need a card to try it.\n\nPrefer the shorter command? Install it once:\n\n```bash\nnpm install -g qronos-cli\nqronos\n```\n\n## Your first real task\n\nAsk for something you can check in ten seconds:\n\n```\nexplain this repo, then fix the failing test\n```\n\nQronos reads before it writes. You will see a step line with a short sentence, then\nthe command it ran, then the result:\n\n```\n● Find the failing test · 1s\n  ⎿ $ npm test -- --run\n    3 failed\n```\n\n## Approve or refuse\n\nEvery tool call passes one door. Press **enter** to allow it once, or answer **no**.\nIf you want fewer questions, change the mode in the session with `/mode`, or pick a\nlooser default in `/config`.\n\n| Mode | What it allows |\n| :--- | :--- |\n| `manual` | asks before every write or shell call |\n| `auto` | asks only when a call looks risky |\n| `edit-automatically` | edits files without asking, still asks for shell |\n| `plan` | reads and plans, never writes |\n| `skip-all` | runs everything you asked for, including shell |\n\n`skip-all` is the one to use inside a container, never on a laptop with your own keys.\n\n## Where things live\n\n```\n~/.qronos/\n  connections.json      provider settings, mode 0600\n  agent/sessions/       your conversation history, one .jsonl per session\n  workflow-runs/        workflow journals\n```\n\nYour project can also hold `.qronos/workflows/` for saved workflow scripts.\n\n## Next\n\n- [Install](/docs/install) — the three ways to install, and pinning a version.\n- [Commands](/docs/commands) — what every slash command does.\n- [Workflows](/docs/workflows) — the one feature that is not a chat.\n",
  "hashline-lsp": "Two safety nets that work without you installing anything.\n\n## Hashline\n\nWhen Qronos reads a file, every line gets a short tag:\n\n```\n12ab|function total(items) {\n7c3d|  return items.reduce((sum, item) => sum + item.price, 0);\n91fe|}\n```\n\nAn edit then names the tags instead of a line number:\n\n```\nreplace 7c3d with:   return items.reduce((sum, item) => sum + item.price, 0) / 100;\n```\n\nWhy: line numbers go stale the moment anything else edits the file. A tag does not.\nIf the tag is gone, the edit is refused instead of landing in the wrong place — the\ndifference between a rejected edit and a deleted function.\n\nTags are per read. Reading the file again refreshes them.\n\n## Language server, bundled\n\nWrite a file and the language server checks it in the same turn:\n\n```\n● Check types after edit · 1s\n  ⎿ src/total.ts:7:12 error TS2322: Type 'string' is not assignable to type 'number'\n```\n\nThe TypeScript server ships **inside** the package. You do not install `tsserver`,\nyou do not run `npm i -D typescript` for the checker, and the check works in a fresh\ncontainer with no network.\n\nFor other languages Qronos uses a language server if one is already on your machine\n(`pyright`, `gopls`, `rust-analyzer`). If none is present, the check is skipped and\nsays so — it never pretends to have type-checked a file it did not.\n\n## Diagnostics go to the model, not just to you\n\nA type error after an edit is fed back once, so the next step can fix it. One retry,\nthen the error is reported and the turn continues. A loop of \"try, fail, try\" is how\na cheap mistake becomes an expensive one.\n\n## Turning it off\n\n| Variable | Default | Effect |\n| :--- | :--- | :--- |\n| `QRONOS_HASHLINE` | on | `0` sends plain line numbers |\n| `QRONOS_LSP` | on | `0` skips the check after a write |\n\nTurn it off for a huge generated file where tags are noise, or when a language\nserver already runs in your editor and the two would fight over the same cache.\n",
  "install": "Qronos CLI is one Node package with two binaries. There is no daemon, no build\nstep and no global config to set up by hand.\n\n## With npx (nothing installed)\n\n```bash\nnpx qronos-cli\n```\n\n`npx` downloads the package once, caches it, and runs it. Good for trying, bad for\ndaily use: it checks for a new version every time.\n\n## Globally\n\n```bash\nnpm install -g qronos-cli\n```\n\nThis gives you two names for the same program:\n\n- `qronos-cli`\n- `qronos`\n\nBoth are exact aliases. Nothing else is installed beside them.\n\n## A pinned version\n\n```bash\nnpx qronos-cli@1.0.27\n```\n\nPin when a script or a demo must not change under you. Bump the pin on purpose.\n\n## Requirements\n\n| Item | Value |\n| :--- | :--- |\n| Node | `>= 22.19.0` |\n| Operating systems | Windows, macOS, Linux |\n| Disk | about 40 MB, including the bundled TypeScript server |\n| Licence | MIT |\n\n## Updating\n\n```bash\nnpm install -g qronos-cli@latest\nqronos --version\n```\n\nIf `--version` prints an older number than you expected, you have two installs on\n`PATH`. Find them:\n\n```bash\nwhich -a qronos\n```\n\nThe first line wins. Remove the old one, or use the full path.\n\n## Uninstalling\n\n```bash\nnpm uninstall -g qronos-cli\nrm -rf ~/.qronos      # only if you also want your sessions gone\n```\n\nSessions are plain JSONL files. Copy the folder before deleting it if you might\nwant the history.\n",
  "memory": 'Memory is what Qronos knows about your project at the start of the next session.\nIt is local, small, and under your control.\n\n## Two layers\n\n1. **A project document.** A file at the root of the repository that you write and\n   read like a README. Qronos reads it first.\n2. **A learned journal.** Notes Qronos writes after useful work: a command that\n   fixed the tests, a convention you corrected, a path that is not where it looks.\n\nThe document is for rules. The journal is for facts discovered along the way.\n\n## What gets written\n\nAfter a turn that changed something, a short note may be appended:\n\n```json\n{\n  "at": "2026-11-23T10:41:00Z",\n  "kind": "lesson",\n  "text": "tests fail unless DATABASE_URL is set; use `.env.test`",\n  "files": ["vitest.config.ts"]\n}\n```\n\nThen a consolidation step folds the journal into a small document with a hard size\ncap. Notes that have not helped are dropped rather than kept forever.\n\n## What is injected\n\nAt the start of a turn, Qronos injects a few capped hints — not the whole journal.\nThe prompt stays small, so you do not pay for old notes on every call.\n\n## Secrets are redacted\n\nBefore a note is written, anything that looks like a key, token or password is\nreplaced with a placeholder. The redaction runs before the text is cut, so a cut\ncan never leave half a secret behind.\n\n## Commands\n\n| Command | What it does |\n| :--- | :--- |\n| `/memory` | show the project document and the recent notes |\n| `/memory sync` | rewrite the document from the journal now |\n| `/memory forget <id>` | remove one note |\n\n## Where it lives\n\n```\n~/.qronos/memory/<project-hash>/journal.jsonl\n~/.qronos/memory/<project-hash>/document.md\n```\n\nOne folder per project path. Two checkouts of the same repo do not share notes,\nbecause a note about `~/work/api` is often wrong in `~/scratch/api`.\n\n## Turn it off\n\n```bash\nQRONOS_MEMORY=0 qronos\n```\n\nMemory is on by default because it makes the second session much better. It is also\nthe feature most likely to surprise you, so the switch is a plain environment\nvariable and nothing else depends on it.\n\n## What memory is not\n\n- It is not a vector database and does not embed your repository.\n- It is not sent anywhere except as the small hint block at the top of a prompt.\n- It is not a backup. Sessions and journals are JSONL files; copy them if they matter.\n',
  "privacy": "Short version: your code stays on your machine. The only bytes that leave are the\nprompts you asked for.\n\n## What is stored, and where\n\n```\n~/.qronos/\n  connections.json        provider names, endpoints, model choices, mode 0600\n  agent/sessions/         one .jsonl per session\n  memory/<project>/       journal and document for one project path\n  workflow-runs/          one .jsonl journal per workflow run\n```\n\nAll of it is plain text you can read, copy or delete. There is no hidden database.\n\n## What is sent to a model\n\n- the conversation, as you would expect;\n- file contents Qronos reads, cut to the parts it needs;\n- the memory hint block, which is short and redacted;\n- the tool calls it is about to make.\n\nNothing else. No telemetry of file paths, no repository fingerprint, no usage profile.\n\n## What is redacted before storage\n\nAnything that looks like a credential: `sk-…`, `ghp_…`, bearer tokens, long base64\nstrings next to words like `key`, `token`, `password` or `secret`. Redaction runs\nbefore any size cut, so a cut cannot leave half a secret behind.\n\n## Keys\n\n- Read from the environment at start, or from `~/.qronos/connections.json` with mode\n  `0600` if you explicitly saved one.\n- Never printed in the chat, the log, an error message or an exported transcript.\n- Never sent to a provider other than the one you selected.\n\n## Ads on the free tier\n\nThe hosted gateway is sponsored. On the free tier a small ad line appears in the CLI,\nserved by the project's own ad service, and an impression is counted when it is drawn.\nAds are not fetched alongside your prompt and are not tied to your code.\n\n## Deleting everything\n\n```bash\nrm -rf ~/.qronos\n```\n\nThat removes sessions, memory, journals and saved provider settings. Your project\nfiles are untouched. `.qronos/workflows/` inside a repository is not removed — delete\nit on purpose if you saved scripts you do not want.\n\n## What this page cannot promise\n\nQronos does not control the provider you chose. Each provider has its own retention\npolicy for prompts. If that matters for your work, read theirs, or run a model on your\nown machine through an OpenAI-compatible server.\n",
  "retry-stop-rerun": 'Three keys fix a run that went wrong, without starting over. They exist because a\nworkflow can cost real money, and "run it again" is the most expensive answer.\n\n## `f` — retry what failed\n\nRuns only the agents with a dark red cross. Every good answer stays where it is.\n\n- asks first: how many failed, their names, and what the first attempt spent;\n- one at a time, so the bill stays readable;\n- new work, not a replay: tokens rise and the rows say they ran again;\n- the schema travels with the record, so a retried agent cannot pass a shape it\n  failed the first time.\n\nA **stopped** agent is not retried. You stopped it on purpose. If the only\nunfinished agents are the ones you stopped, the answer says exactly that instead of\na flat "nothing failed".\n\n## `a` — rerun a phase\n\nRuns every agent of one phase, in order. Use it when the code changed and every\nanswer in that phase is out of date.\n\n- asks first, with the phase, the agent count and the earlier spend;\n- new work, so the tokens rise;\n- one agent that cannot run does not stop the rest, and the notice says which one\n  did not run and why.\n\n## `k` and `x` — two sizes of stop\n\n| Key | Scope |\n| :--- | :--- |\n| `k` | the one agent you are looking at |\n| `x` | the whole run |\n\nA stop saves the rest of a call, never the call. What the agent already spent stays\non the bill, and it is labelled **stopped by you** in amber — never `failed`.\n\nStopping the wrong agent spends money on the wrong work, so the command refuses a\nword that matches two agents and lists them. `/workflows stop <id> <agent>` accepts\nan id (`#3`, or `3`) or part of a label.\n\n## `r` — replay\n\nReplays an agent from the journal. It makes no model call, so it costs nothing, and\nit is drawn with a blue `↺` rather than a green tick. A report must never pass old\nwork off as new.\n\nA **restart** is the opposite of a replay: new work, so the row says `Done ·\nrestarted` and the tokens rise. A restart asks first, with an editable task, because\nusually it was the words that failed, not the model.\n\n## The one rule behind all of it\n\nEvery path that runs an agent applies the same schema, the same model routing and the\nsame permission door. A retry, a rerun and a restart are not special cases with their\nown code — that is how a green tick ended up on unvalidated words once already.\n',
  "step-names": 'Every shell call carries an optional short sentence, written by the model, and the\ntranscript prints it above the command.\n\n```\n● List files in current directory · 1s\n  ⎿ $ ls -la\n```\n\nThe sentence is a real field on the tool call (`description`), not something\ngenerated from the command afterwards. That matters: a summary written after the\nfact can only repeat the command, while a sentence written before it can say *why*.\n\n## What the model is asked for\n\nThe field\'s own description teaches the rules, so nothing extra is spent:\n\n- active voice, five to ten words;\n- say what the step achieves, not how;\n- never "run the command" or "complex" or "risky";\n- no file paths, no secrets, no second line.\n\nReal examples from a neutral prompt: **"List files in current directory"** and\n**"Show current Git repository status"**. The model filled the field on both calls\nwithout being told to.\n\n## When there is no sentence\n\nThe line falls back to the old form and nothing breaks:\n\n```\n● Bash(ls -la)\n```\n\nA resumed session, an old transcript, or a workflow agent can all arrive without a\ndescription. That is not an error, and it is never filled with an invented sentence.\n\n## Cleaning\n\nThe model\'s words are cut, never trusted:\n\n- colours, control characters and second lines are stripped;\n- the title is cut at 90 characters, the command at 120;\n- a description that only repeats the command is dropped, because saying it twice is\n  noise.\n\n## Turning it off\n\n```bash\nQRONOS_TOOL_DESCRIPTIONS=0 qronos\n```\n\nThat one flag removes the field from the tool schema **and** the line from the\ndisplay, so nothing is asked for and nothing is spent. Schema and renderer read the\nsame setting; they cannot disagree.\n\n## What did not change\n\nThe tool is still called `bash` (and `powershell` on Windows). Approvals, plan mode,\nworkflow tool doors and the read-only fact check all work exactly as before. A step\nname is a label, not a permission.\n',
  "troubleshooting": "These are the errors people actually hit. Each one has a one-line cause and a\none-line fix.\n\n## `The selected model is temporarily unavailable. Please retry shortly.`\n\nThe gateway hides the real upstream status on purpose. Most often it is **429**: the\nprovider's rate limit, not a bad configuration.\n\n- Wait a minute and retry.\n- If you run workflows, set `QRONOS_WORKFLOW_CONCURRENCY=2`.\n- The real status is in the provider's own dashboard, not in your terminal.\n\n## `Qronos AI <model> has no API key saved`\n\nNothing is configured for that model, and the gateway will not send a made-up key.\nAdd a credential for the model, or choose another model with `/config`.\n\n## `ads_required` (free tier only)\n\nThe free tier needs a real ad impression for the session. A request that never saw an\nad is paused. The fix is not a proxy: run the CLI normally, or use `/buy-credits`, or\nbring your own provider key.\n\n## A shell call shows `Bash(cmd)` and no sentence\n\nYour install is older than 1.0.27, or the model did not send the optional field.\n\n```bash\nnpm install -g qronos-cli@latest\nqronos --version     # expect 1.0.27 or newer\n```\n\nOld transcripts keep the old line. They are not rewritten.\n\n## `ctx.tools is not iterable`\n\nA workflow bug fixed in 1.0.26. Update:\n\n```bash\nnpm install -g qronos-cli@latest\n```\n\n## `You are running Node ... but this package requires >= 22.19.0`\n\nUse a newer Node (`nvm install 22`, or your system package manager). There is no\nsupported older Node: the terminal code needs the newer stream API.\n\n## The tab title or `/quit` label is wrong\n\nBoth were fixed in the same release as the step names. Update the global install and\nrestart the terminal, not just Qronos.\n\n## Nothing paints on Windows\n\nWindows PowerShell is supported as a shell tool, but the terminal must be a real\nWindows console (Windows Terminal, PowerShell 7, VS Code terminal). The old\n`conhost` window has no colour support.\n\n## Ctrl+C did nothing\n\nCorrect. `ctrl+c` is not bound, because it would kill a stream you already paid for.\nUse **esc** to interrupt, **ctrl+d** to exit.\n\n## A workflow stopped at ten minutes\n\nThat is the wall clock cap, and it says so in the result. Raise it up to one hour:\n\n```bash\nQRONOS_WORKFLOW_WALL_CLOCK_MS=1800000 qronos\n```\n\nOr split the job into phases and use `/workflows rerun <id> <phase>`.\n\n## Still stuck\n\nOpen an issue with the exact error line, the version from `qronos --version`, and your\noperating system. Do not paste a key or a token: redact anything that looks like a\nsecret before you send it.\n",
  "workflows": 'A workflow is a small JavaScript script that the model writes for you. It calls\nsubagents, waits for them, and returns one answer. Your chat stays readable even\nwhen thirty agents did the work.\n\n## How a run starts\n\nType the word **ultracode** as its own word in a prompt:\n\n```\nultracode: audit this repo for unused exports and say which are safe to delete\n```\n\n`ultrathink` and `orchestrate` are different: those ask for more reasoning, not for\na workflow. The match is strict — lowercase, standalone, never inside a code fence\nor a path.\n\nThe chat then asks for a script instead of an essay. You see the script, and you\napprove it before anything runs.\n\n## The script API\n\n```js\nexport const meta = {\n  name: "unused-exports",\n  description: "find exports nothing imports",\n  phases: ["Scout", "Audit", "Report"],\n};\n\nphase("Scout");\nconst files = await agent("List the exported symbols in src/**/*.ts", { label: "exports" });\n\nphase("Audit");\nconst checks = await parallel(\n  files.data.symbols.map((name) => () =>\n    agent(`Does anything import ${name}? Answer in one sentence.`, { agent: "explorer" })\n  )\n);\n\nphase("Report");\nconst report = await agent("Write the report from these answers: " + JSON.stringify(checks));\nreturn report.text;\n```\n\n| Call | What it returns |\n| :--- | :--- |\n| `agent(prompt, { label, schema, agent, model, phase })` | `{ ok, text, data, error, usage, replayed?, stopped? }` |\n| `parallel([() => agent(...), ...])` | an array of those results, in order |\n| `pipeline(list, fn)` | each item through `fn`, one at a time |\n| `phase("Name")` | sets the phase for later agents |\n| `log("message")` | a line in the run log |\n| `workflow(scriptString)` | a child workflow, one level deep, shared budget |\n\n`args` and `budget` are read-only. `Math.random` is seeded and the clock is frozen,\nso a replayed run takes the same path.\n\n## What the script cannot do\n\nThe script may not import, require, read files, run a shell, touch the network or\n`process`, or start timers. Those words are refused before the script runs. Only\nits **subagents** have tools, and they pass the same permission door you do.\n\nA `vm` is a guardrail against accidents, not a security boundary. Read a script\nbefore you approve it, exactly as you would read a shell command.\n\n## Caps, and they are reported\n\n| Cap | Default | Range |\n| :--- | :--- | :--- |\n| wall clock | 10 minutes | 1 min – 60 min |\n| agents | 1 000 | 1 – 2 000 |\n| running at once | 16 | 1 – 32 |\n| log lines | 500 | — |\n| result size | 200 000 chars | — |\n| nesting | 2 levels | 1 – 3 |\n\nWhen a cap is hit, the result says so. Nothing is truncated in silence.\n\n## Watching a run\n\n`alt+w`, or `/workflows panel`:\n\n```\nScout   ✓3        6.1k\nAudit   ✓1 ↺1 ✗1 ⊘1  11.8k\nReport  ·1        3.2k\n```\n\n- `✓` bright green: finished.\n- `✗` dark red: failed, with the reason.\n- `⊘` amber: **you** stopped it, so it is not a failure.\n- `↺` blue: replayed from the journal, and it cost nothing.\n\nTokens are shown per agent and per phase. `tokens` is fresh spend; `replayedTokens`\nis work you already paid for.\n\n## Steering a run that is already going\n\n| Key | Effect |\n| :--- | :--- |\n| `p` | pause: in-flight agents finish, nothing new starts |\n| `r` | replay from the journal |\n| `x` | stop the whole run |\n| `k` | stop one agent, leave the rest alone |\n| `s` | save the script into `.qronos/workflows/` |\n| `a` | rerun one phase |\n| `f` | retry only the failed agents |\n\nPause exists because killing an agent throws away tokens you already paid for.\nReplay exists because re-reading a journal costs nothing.\n\n## Failure is a row, not a dead run\n\nIf one agent fails, its result is `{ ok: false, error }` and the run carries on.\n`/workflows retry <id>` runs only the red crosses. A retried agent is new work, so\nits tokens rise and its row says it ran again — a report can never pass yesterday\'s\nanswer off as today\'s.\n\n## Saving and reusing\n\n```\n/workflows save wf_9k2      # writes .qronos/workflows/unused-exports.js\n/workflows scripts          # list what is saved\n/workflows run unused-exports\n/workflows edit unused-exports\n```\n\nA saved script is never overwritten. A name collision becomes `-2`, `-3`, and so on.\nNames are forgiving in exactly one way: `review`, `review.js` and `Review` are the\nsame script.\n\n## Environment\n\n| Variable | Default | Clamp |\n| :--- | :--- | :--- |\n| `QRONOS_WORKFLOW_WALL_CLOCK_MS` | 600000 | 60 000 – 3 600 000 |\n| `QRONOS_WORKFLOW_MAX_AGENTS` | 1000 | 1 – 2000 |\n| `QRONOS_WORKFLOW_CONCURRENCY` | 16 | 1 – 32 |\n| `QRONOS_WORKFLOW_MAX_LOGS` | 500 | — |\n| `QRONOS_WORKFLOW_MAX_RESULT_CHARS` | 200000 | — |\n| `QRONOS_WORKFLOW_MAX_DEPTH` | 2 | 1 – 3 |\n| `QRONOS_WORKFLOW_APPROVE` | `ask` | `ask`, `always`, `0` |\n| `QRONOS_WORKFLOW_TOOLS` | on | `0` turns subagent tools off |\n\nOn a free shared limit, set `QRONOS_WORKFLOW_CONCURRENCY=2`. Sixteen agents against a\nlimit of eight requests a minute mostly buys rate-limit errors.\n'
};
function parseHeadings(source) {
  const slugger = new GithubSlugger();
  const headings = [];
  let inFence = false;
  for (const line of source.split("\n")) {
    const trimmed = line.trim();
    if (trimmed.startsWith("```") || trimmed.startsWith("~~~")) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const match = /^(#{2,3})\s+(.*)$/.exec(trimmed);
    if (!match) continue;
    const text = cleanInline((match[2] ?? "").trim());
    if (text.length === 0) continue;
    headings.push({ depth: match[1]?.length === 2 ? 2 : 3, text, id: slugger.slug(text) });
  }
  return headings;
}
function cleanInline(text) {
  return text.replace(/`([^`]*)`/g, "$1").replace(/\*\*([^*]*)\*\*/g, "$1").replace(/\*([^*]*)\*/g, "$1").replace(/\[([^\]]*)\]\([^)]*\)/g, "$1").trim();
}
const BODIES = {
  "agent-hub": MDXContent$c,
  commands: MDXContent$b,
  compaction: MDXContent$a,
  environment: MDXContent$9,
  "getting-started": MDXContent$8,
  "hashline-lsp": MDXContent$7,
  install: MDXContent$6,
  memory: MDXContent$5,
  privacy: MDXContent$4,
  "retry-stop-rerun": MDXContent$3,
  "step-names": MDXContent$2,
  troubleshooting: MDXContent$1,
  workflows: MDXContent
};
const DOC_SOURCES = DOC_SOURCES$1;
function docBody(slug) {
  return BODIES[slug];
}
function docHeadings(slug) {
  const source = DOC_SOURCES[slug];
  return typeof source === "string" && source.length > 0 ? parseHeadings(source) : [];
}
function buildIndex(pages2, sources) {
  return pages2.flatMap((page) => {
    const source = sources[page.slug] ?? "";
    if (source.length === 0) return [];
    const headings = parseHeadings(source).map((heading) => ({ text: heading.text, id: heading.id }));
    return [
      {
        slug: page.slug,
        title: page.title,
        group: page.group,
        intro: page.intro,
        headings,
        text: plain(source)
      }
    ];
  });
}
function plain(source) {
  return source.replace(/```[\s\S]*?```/g, " ").replace(/`([^`]*)`/g, "$1").replace(/\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/^#{1,6}\s+/gm, "").replace(/[*_>|]/g, " ").replace(/\s+/g, " ").trim();
}
function snippetAround(text, needle, radius = 60) {
  const at = text.toLowerCase().indexOf(needle);
  if (at < 0) return text.slice(0, 120);
  const start = Math.max(0, at - radius);
  const end = Math.min(text.length, at + needle.length + radius);
  return `${start > 0 ? "…" : ""}${text.slice(start, end).trim()}${end < text.length ? "…" : ""}`;
}
function searchEntries(entries, query, limit = 8) {
  const needle = query.trim().toLowerCase();
  if (needle.length < 2) return [];
  const hits = [];
  for (const entry of entries) {
    const title = entry.title.toLowerCase();
    const heading = entry.headings.find((item) => item.text.toLowerCase().includes(needle));
    const body = entry.text.toLowerCase().includes(needle);
    if (!title.includes(needle) && !heading && !body) continue;
    const score = title.startsWith(needle) ? 100 : title.includes(needle) ? 80 : heading ? 50 : 20;
    hits.push({
      slug: entry.slug,
      title: entry.title,
      ...heading && !title.includes(needle) ? { anchor: heading.id } : {},
      snippet: heading ? heading.text : snippetAround(entry.text, needle),
      score
    });
  }
  return hits.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title)).slice(0, limit);
}
const OPEN_EVENT = "qronos:search";
function DocSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const input = useRef(null);
  const [, navigate] = useLocation();
  const index = useMemo(() => buildIndex(DOC_PAGES, DOC_SOURCES), []);
  const hits = useMemo(() => searchEntries(index, query), [index, query]);
  useEffect(() => {
    function onKeyDown(event) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      }
      if (event.key === "Escape") setOpen(false);
    }
    function onOpenEvent() {
      setOpen(true);
    }
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener(OPEN_EVENT, onOpenEvent);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener(OPEN_EVENT, onOpenEvent);
    };
  }, []);
  useEffect(() => {
    if (open) {
      setQuery("");
      setCursor(0);
      const frame = requestAnimationFrame(() => input.current?.focus());
      return () => cancelAnimationFrame(frame);
    }
    return;
  }, [open]);
  function go(hit) {
    setOpen(false);
    navigate(`/docs/${hit.slug}${hit.anchor ? `#${hit.anchor}` : ""}`);
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(
      "button",
      {
        type: "button",
        onClick: () => setOpen(true),
        className: "flex min-h-11 w-full items-center gap-2 rounded-[9px] border border-line bg-card px-3 text-left text-[12px] text-muted transition-colors duration-[160ms] hover:border-orange-line hover:text-ink",
        children: [
          /* @__PURE__ */ jsx(Search, { size: 14, "aria-hidden": true }),
          "Search docs",
          /* @__PURE__ */ jsx("kbd", { className: "ml-auto rounded border border-line px-1.5 py-0.5 font-mono text-[11px] text-muted", children: "⌘K" })
        ]
      }
    ),
    open ? /* @__PURE__ */ jsx(
      "div",
      {
        className: "fixed inset-0 z-[70] flex items-start justify-center bg-paper/80 px-4 pt-[12vh] backdrop-blur-sm",
        role: "dialog",
        "aria-modal": "true",
        "aria-label": "Search documentation",
        onClick: (event) => {
          if (event.target === event.currentTarget) setOpen(false);
        },
        children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-[560px] overflow-hidden rounded-panel border border-line bg-card shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)]", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 border-b border-line px-4", children: [
            /* @__PURE__ */ jsx(Search, { size: 15, "aria-hidden": true, className: "text-muted" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                ref: input,
                value: query,
                onChange: (event) => {
                  setQuery(event.target.value);
                  setCursor(0);
                },
                onKeyDown: (event) => {
                  if (event.key === "ArrowDown") {
                    event.preventDefault();
                    setCursor((value) => Math.min(value + 1, Math.max(0, hits.length - 1)));
                  } else if (event.key === "ArrowUp") {
                    event.preventDefault();
                    setCursor((value) => Math.max(0, value - 1));
                  } else if (event.key === "Enter") {
                    const hit = hits[cursor];
                    if (hit) go(hit);
                  }
                },
                placeholder: "Search the docs…",
                "aria-label": "Search query",
                className: "h-12 w-full bg-transparent text-[14px] text-ink outline-none placeholder:text-muted"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => setOpen(false),
                className: "font-mono text-[11px] text-muted hover:text-ink",
                children: "esc"
              }
            )
          ] }),
          /* @__PURE__ */ jsx("ul", { className: "max-h-[52vh] overflow-y-auto p-2", children: query.trim().length < 2 ? /* @__PURE__ */ jsx("li", { className: "px-3 py-6 text-center text-[12.5px] text-muted", children: "Type two letters to search." }) : hits.length === 0 ? /* @__PURE__ */ jsxs("li", { className: "px-3 py-6 text-center text-[12.5px] text-muted", children: [
            "Nothing found for “",
            query.trim(),
            "”."
          ] }) : hits.map((hit, index2) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => go(hit),
              onMouseEnter: () => setCursor(index2),
              className: cn(
                "flex w-full flex-col gap-0.5 rounded-[7px] px-3 py-2 text-left",
                index2 === cursor ? "bg-orange-soft" : "hover:bg-paper"
              ),
              children: [
                /* @__PURE__ */ jsx("span", { className: "text-[13px] font-bold text-ink", children: hit.title }),
                /* @__PURE__ */ jsx("span", { className: "truncate font-mono text-[11px] text-muted", children: hit.snippet })
              ]
            }
          ) }, `${hit.slug}-${hit.anchor ?? "top"}`)) })
        ] })
      }
    ) : null
  ] });
}
function DocsSidebar({ className }) {
  const [pathname] = useLocation();
  return /* @__PURE__ */ jsxs("nav", { "aria-label": "Documentation", className: cn("flex flex-col gap-6", className), children: [
    /* @__PURE__ */ jsx(DocSearch, {}),
    groupedDocs().map(({ group, pages: pages2 }) => /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
      /* @__PURE__ */ jsx("p", { className: "font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-muted", children: group }),
      /* @__PURE__ */ jsx("ul", { className: "flex flex-col gap-0.5", children: pages2.map((page) => {
        const active = pathname === `/docs/${page.slug}`;
        return /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
          Link,
          {
            href: `/docs/${page.slug}`,
            "aria-current": active ? "page" : void 0,
            className: cn(
              "block rounded-[7px] px-2 py-1.5 text-[12.5px] transition-colors duration-[160ms]",
              active ? "bg-orange-soft text-orange" : "text-muted hover:bg-card hover:text-ink"
            ),
            children: page.title
          }
        ) }, page.slug);
      }) })
    ] }, group))
  ] });
}
const TONES = {
  note: { border: "border-l-orange", label: "Note", title: "Note" },
  warning: { border: "border-l-fail", label: "Careful", title: "Careful" },
  honest: { border: "border-l-orange-pale", label: "The limit", title: "The limit" }
};
function Callout({ children, tone = "note", title, className }) {
  const spec = TONES[tone];
  return /* @__PURE__ */ jsxs(
    "aside",
    {
      className: cn("rounded-r-[9px] border-l-2 bg-orange-soft/40 px-4 py-3 text-[13px] leading-relaxed", spec.border, className),
      children: [
        /* @__PURE__ */ jsx("p", { className: "mb-1 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-ink", children: title ?? spec.title }),
        /* @__PURE__ */ jsx("div", { className: "text-muted [&_a]:text-orange [&_a]:underline [&_code]:text-ink", children })
      ]
    }
  );
}
async function copyText(text, target) {
  const source = typeof navigator === "undefined" ? void 0 : navigator.clipboard;
  const write = source?.writeText;
  if (!write) return false;
  try {
    await write.call(source, text);
    return true;
  } catch {
    return false;
  }
}
const RESET_MS = 1500;
function CopyButton({
  text,
  label = "Copy",
  copiedLabel = "Copied",
  className,
  live = true
}) {
  const [state, setState] = useState("idle");
  const timer = useRef(null);
  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);
  async function onClick() {
    const ok = await copyText(text);
    setState(ok ? "copied" : "failed");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setState("idle"), RESET_MS);
  }
  const shown = state === "copied" ? copiedLabel : state === "failed" ? "Copy failed" : label;
  return /* @__PURE__ */ jsxs(
    "button",
    {
      type: "button",
      onClick,
      "data-state": state,
      className: cn(
        "inline-flex items-center justify-center gap-2 rounded-[9px] border border-line px-3.5 py-2",
        "font-mono text-[11px] font-medium tracking-wide text-muted",
        "transition-colors duration-[160ms] hover:border-orange-line hover:text-ink",
        state === "copied" && "border-orange-line text-orange",
        state === "failed" && "border-fail/40 text-fail",
        className
      ),
      children: [
        shown,
        live ? /* @__PURE__ */ jsx("span", { className: "sr-only", role: "status", "aria-live": "polite", children: state === "copied" ? "Copied to clipboard" : state === "failed" ? "Copy failed" : "" }) : null
      ]
    }
  );
}
function CodePanel({ code, label = "shell", className }) {
  const text = code.replace(/\n+$/, "");
  const lines = text.split("\n");
  return /* @__PURE__ */ jsxs("div", { className: cn("overflow-hidden rounded-card border border-line bg-card", className), children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 border-b border-line px-4 py-2", children: [
      /* @__PURE__ */ jsx("span", { className: "font-mono text-[11px] uppercase tracking-[0.16em] text-muted", children: label }),
      /* @__PURE__ */ jsx(CopyButton, { text, label: "Copy", className: "ml-auto border-transparent px-2 py-1" })
    ] }),
    /* @__PURE__ */ jsx(
      "pre",
      {
        className: "overflow-x-auto px-4 py-3.5 font-mono text-[12px] leading-[1.9] text-ink whitespace-pre-wrap break-words sm:whitespace-pre sm:break-normal",
        tabIndex: 0,
        children: /* @__PURE__ */ jsx("code", { children: lines.map((line, index) => /* @__PURE__ */ jsx("span", { className: "block", children: line === "" ? " " : line }, index)) })
      }
    )
  ] });
}
function textOf(node) {
  if (node === null || node === void 0 || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (isValidElement(node)) {
    const element = node;
    return textOf(element.props.children);
  }
  return "";
}
function CodeBlock({ children }) {
  const text = textOf(children).replace(/\n+$/, "");
  const child = Children.toArray(children)[0];
  const language = isValidElement(child) && typeof child.props === "object" && child.props !== null ? (child.props.className ?? "").replace("language-", "") : "";
  return /* @__PURE__ */ jsx(CodePanel, { code: text, label: language || "shell", className: "my-5" });
}
function Anchor({ href = "", children }) {
  const external = /^https?:\/\//.test(href);
  const plain2 = cn("text-orange underline underline-offset-4 hover:text-orange-pale");
  if (external) {
    return /* @__PURE__ */ jsx("a", { href, target: "_blank", rel: "noreferrer noopener", className: plain2, children });
  }
  if (href.startsWith("/")) {
    return /* @__PURE__ */ jsx(Link, { href, className: plain2, children });
  }
  return /* @__PURE__ */ jsx("a", { href, className: plain2, children });
}
const mdxComponents = {
  h1: ({ children }) => /* @__PURE__ */ jsx("h1", { className: "mt-10 mb-4 text-[clamp(28px,3.4vw,38px)] leading-[1.08] tracking-[-0.05em] first:mt-0", children }),
  h2: ({ children, id }) => /* @__PURE__ */ jsx(
    "h2",
    {
      id,
      className: "mt-12 mb-3 scroll-mt-[100px] border-t border-line pt-8 text-[clamp(21px,2.4vw,26px)] tracking-[-0.04em] first:mt-0 first:border-0 first:pt-0",
      children
    }
  ),
  h3: ({ children, id }) => /* @__PURE__ */ jsx("h3", { id, className: "mt-8 mb-2 scroll-mt-[100px] text-[17px] tracking-[-0.03em]", children }),
  p: ({ children }) => /* @__PURE__ */ jsx("p", { className: "my-4 text-[14px] leading-[1.8] text-muted", children }),
  ul: ({ children }) => /* @__PURE__ */ jsx("ul", { className: "my-4 flex list-disc flex-col gap-2 pl-5 text-[14px] leading-[1.8] text-muted marker:text-orange", children }),
  ol: ({ children }) => /* @__PURE__ */ jsx("ol", { className: "my-4 flex list-decimal flex-col gap-2 pl-5 text-[14px] leading-[1.8] text-muted marker:text-orange", children }),
  li: ({ children }) => /* @__PURE__ */ jsx("li", { className: "pl-1", children }),
  strong: ({ children }) => /* @__PURE__ */ jsx("strong", { className: "font-bold text-ink", children }),
  em: ({ children }) => /* @__PURE__ */ jsx("em", { className: "font-serif italic text-orange-pale", children }),
  a: Anchor,
  code: ({ children }) => /* @__PURE__ */ jsx("code", { className: "rounded-[5px] border border-line bg-card px-1.5 py-0.5 font-mono text-[12px] text-ink", children }),
  pre: CodeBlock,
  hr: () => /* @__PURE__ */ jsx("hr", { className: "my-10 border-line" }),
  blockquote: ({ children }) => /* @__PURE__ */ jsx(Callout, { tone: "note", children }),
  table: ({ children }) => /* @__PURE__ */ jsx(
    "div",
    {
      className: "my-6 overflow-x-auto rounded-card border border-line",
      tabIndex: 0,
      role: "group",
      children: /* @__PURE__ */ jsx("table", { className: "w-full border-collapse text-left text-[13px]", children })
    }
  ),
  thead: ({ children }) => /* @__PURE__ */ jsx("thead", { className: "bg-card", children }),
  th: ({ children }) => /* @__PURE__ */ jsx("th", { className: "border-b border-line px-3 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-muted", children }),
  td: ({ children }) => /* @__PURE__ */ jsx("td", { className: "border-b border-line/70 px-3 py-2 align-top text-muted", children })
};
function Reveal({ children, index = 0, as: Tag = "div", className }) {
  return /* @__PURE__ */ jsx(
    Tag,
    {
      "data-reveal": "",
      "data-i": String(Math.min(index, 8)),
      className: cn(className),
      children
    }
  );
}
const useBeforePaint = typeof window === "undefined" ? useEffect : useLayoutEffect;
function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);
  useBeforePaint(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
    const list = window.matchMedia(query);
    setMatches(list.matches);
    const onChange = (event) => setMatches(event.matches);
    list.addEventListener("change", onChange);
    return () => list.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}
const BASE = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[9px] font-extrabold transition-[transform,background-color,border-color,box-shadow] duration-[160ms] ease-[var(--ease-out)] active:scale-[0.97]";
const VARIANTS = {
  primary: cn(
    "border border-orange-line bg-orange-soft text-orange",
    "hover:border-orange hover:shadow-[0_0_28px_var(--orange-glow)] hover:-translate-y-px"
  ),
  ghost: "border border-transparent text-muted hover:text-ink hover:underline underline-offset-4"
};
const SIZES = {
  md: "px-5 py-3 text-[13px]",
  lg: "px-6 py-3.5 text-[14px]"
};
function Button({
  children,
  href,
  onClick,
  variant = "primary",
  size = "md",
  className,
  external = false
}) {
  const classes = cn(BASE, VARIANTS[variant], SIZES[size], className);
  if (!href) {
    return /* @__PURE__ */ jsx("button", { type: "button", onClick, className: classes, children });
  }
  const isPlainAnchor = external || href.includes("#") || href.startsWith("http") || href.startsWith("mailto:");
  if (isPlainAnchor) {
    const rel = external || href.startsWith("http") ? "noreferrer noopener" : void 0;
    const target = external || href.startsWith("http") ? "_blank" : void 0;
    return /* @__PURE__ */ jsx("a", { href, className: classes, ...rel ? { rel } : {}, ...target ? { target } : {}, children });
  }
  return /* @__PURE__ */ jsx(Link, { href, className: classes, children });
}
const HERO = {
  eyebrow: "MIT LICENSED · v1.0.27 · NODE 22.19+",
  headline: { before: "A terminal that thinks in ", accent: "workflows", after: "." },
  sub: "Reads your files, runs your shell, edits in place. When the job is big, one word — ultracode — turns it into a workflow with subagents, a live panel and a bill you can read.",
  installNote: "or npm install -g qronos-cli, then run qronos"
};
const HERO_TERMINAL = [
  { kind: "step", text: "Run the test suite", seconds: 2, status: "ok" },
  { kind: "command", text: "npm test -- --watch=false" },
  { kind: "output", text: "Test Files  148 passed (148)" },
  { kind: "output", text: "     Tests  2469 passed (2469)" },
  { kind: "output", text: "" },
  { kind: "summary", text: "Churned for 2m 30s · 14.2k tokens" },
  { kind: "prompt", text: "" }
];
const PROOF = [
  { icon: "tick", text: "2 469 tests, 3 operating systems" },
  { icon: "tick", text: "MIT licence, no account required for BYOK" },
  { icon: "clock", text: "10-minute workflow cap, reported, never silent" },
  { icon: "key", text: "Sign in, or bring your own key" }
];
const FEATURES = [
  {
    id: "01",
    title: "Workflows, not one-shot answers",
    body: "Say ultracode. The model writes a small JavaScript script that fans the job out to subagents and returns only the answer, so a 30-agent audit does not flood your chat."
  },
  {
    id: "02",
    title: "A bill you can read",
    body: "Tokens per agent and per phase, a bright green tick or a dark red cross, and a replay that costs nothing because it never calls the model again."
  },
  {
    id: "03",
    title: "It names its steps",
    body: 'Every shell call carries a short sentence — "List files in current directory" — above the command, so you know why before you know what.'
  },
  {
    id: "04",
    title: "Memory that survives the session",
    body: "Notes are journaled per project, folded into a small document, and injected as capped hints next time. Local, redacted, never duplicated across repos."
  },
  {
    id: "05",
    title: "Reads code, not guesses",
    body: "Write a file and the language server checks it in the same turn. A bundled TypeScript server means you install nothing to get diagnostics."
  },
  {
    id: "06",
    title: "Your permissions, your door",
    body: "Auto, edit-automatically, manual, plan, or skip-all. A subagent can never be more permissive than you are, and every tool call passes the same door."
  }
];
const WORKFLOWS = {
  eyebrow: "WORKFLOWS",
  headline: { before: "One word, and the ", accent: "plan", after: " becomes work." },
  body: "Type ultracode and the chat asks for a script instead of a paragraph. The script has five calls — agent, parallel, pipeline, phase, log — no disk, no network, no process. Its subagents have your tools and your permission door.",
  bullets: [
    {
      title: "Capped, and it says so.",
      body: "Ten minutes of wall clock, 1 000 agents, 16 running at once. Every cap is reported in the result, never applied in silence."
    },
    {
      title: "Pausable.",
      body: "A pause lets work already paid for finish. Resume replays from the journal; a replayed agent is marked as replay and costs nothing."
    },
    {
      title: "Fixable.",
      body: "Rerun one agent, rerun a whole phase, or retry only the red crosses. Each asks first, with the price."
    }
  ],
  panelHint: "p pause · x stop · s save · a rerun · f failed · enter view · esc close",
  panelHintShort: "p pause · x stop · esc close"
};
const WORKFLOW_DEMO = {
  id: "wf_9k2",
  elapsed: "2m 41s",
  phases: [
    {
      id: "scout",
      name: "Scout",
      tokens: "6.1k",
      agents: [
        { name: "trace-imports", model: "haiku-5.5", tokens: "2.4k", seconds: "0m 21s", state: "done" },
        { name: "find-tests", model: "haiku-5.5", tokens: "1.9k", seconds: "0m 18s", state: "done" },
        { name: "read-config", model: "haiku-5.5", tokens: "1.8k", seconds: "0m 14s", state: "done" }
      ]
    },
    {
      id: "audit",
      name: "Audit",
      tokens: "11.8k",
      agents: [
        { name: "check-auth", model: "sonnet-5.5", tokens: "4.2k", seconds: "1m 02s", state: "done" },
        { name: "check-uploads", model: "sonnet-5.5", tokens: "3.1k", seconds: "0m 48s", state: "failed" },
        { name: "check-logging", model: "sonnet-5.5", tokens: "2.6k", seconds: "0m 39s", state: "stopped" },
        { name: "check-secrets", model: "sonnet-5.5", tokens: "0", seconds: "0m 00s", state: "replayed" }
      ]
    },
    {
      id: "report",
      name: "Report",
      tokens: "3.2k",
      agents: [{ name: "write-report", model: "opus-5.5", tokens: "3.2k", seconds: "0m 51s", state: "running" }]
    }
  ]
};
const COMPARISON = {
  rows: [
    {
      label: "Open source",
      qronos: { state: "yes", note: "MIT" },
      claudeCode: { state: "no" },
      aider: { state: "yes", note: "Apache-2.0" },
      opencode: { state: "yes", note: "MIT" }
    },
    {
      label: "Runs in your terminal",
      qronos: { state: "yes" },
      claudeCode: { state: "yes" },
      aider: { state: "yes" },
      opencode: { state: "yes" }
    },
    {
      label: "Workflow script with subagents",
      qronos: { state: "yes" },
      claudeCode: { state: "partial", note: "subagents, no script" },
      aider: { state: "no" },
      opencode: { state: "partial", note: "subagents, no script" }
    },
    {
      label: "Step name above each shell call",
      qronos: { state: "yes" },
      claudeCode: { state: "yes" },
      aider: { state: "no" },
      opencode: { state: "no" }
    },
    {
      label: "Pause, resume or replay a run",
      qronos: { state: "yes" },
      claudeCode: { state: "no" },
      aider: { state: "no" },
      opencode: { state: "no" }
    },
    {
      label: "Local model through Ollama",
      qronos: { state: "yes" },
      claudeCode: { state: "no" },
      aider: { state: "yes" },
      opencode: { state: "yes" }
    },
    {
      label: "Any OpenAI- or Anthropic-wire provider",
      qronos: { state: "yes" },
      claudeCode: { state: "partial", note: "first-party, Bedrock, Vertex" },
      aider: { state: "yes" },
      opencode: { state: "yes" }
    }
  ],
  footnote: "Checked 2026-11. These are the project's own features, not benchmarks. If a row is wrong, open an issue and we will fix it the same day."
};
const QUICKSTART = {
  headline: { before: "Running in ", accent: "one", after: " command." },
  body: "No key needed to start: sign in with GitHub and inference is sponsored by the project. Prefer your own key? Point it at any OpenAI- or Anthropic-compatible endpoint.",
  steps: [
    { title: "Install", detail: "npx qronos-cli — or npm install -g qronos-cli for the shorter qronos" },
    { title: "Choose", detail: "Sign in, or use my own API key" },
    { title: "Ask", detail: "explain this repo, then fix the failing test" }
  ],
  byok: [
    'qronos --provider openai --api-key "$OPENAI_API_KEY"',
    "qronos --base-url http://localhost:11434/v1 --model llama3"
  ],
  keyNote: "Your key is not saved by default: it stays in memory and is read from the environment next time. Storing it inline is an explicit opt-in."
};
const FAQ = [
  {
    question: "Is it really free?",
    answer: "The hosted gateway is sponsored, so you can start without a key or a card. You can also bring your own key and pay your provider directly. There is no paid tier of the CLI itself."
  },
  {
    question: "Which models can I use?",
    answer: "Anything OpenAI- or Anthropic-compatible: OpenAI, Anthropic, DeepSeek, Groq, OpenRouter, Ollama, or your own server. Sign in and you get the hosted catalogue."
  },
  {
    question: "Does it work on Windows?",
    answer: "Yes — Windows, macOS and Linux. CI runs the full suite on all three. On Windows the shell tool speaks PowerShell as well as bash."
  },
  {
    question: "What does it do with my code?",
    answer: "Files stay on your machine. Memory and workflow journals are written under ~/.qronos, redacted for secrets. Nothing is sent anywhere except the model calls you asked for."
  },
  {
    question: "Why does a shell command show a sentence above it?",
    answer: "Because the model wrote it. It is an optional field on the tool call — a five-word reason — so you can decide whether to read the command at all. Turn it off with QRONOS_TOOL_DESCRIPTIONS=0."
  },
  {
    question: "What happens if a workflow agent fails?",
    answer: "It becomes an error row, not a dead run. The rest finish, the report shows which one failed and why, and f retries only the failures."
  },
  {
    question: "Can I stop it mid-run?",
    answer: "Yes. x stops the run, k stops one agent. A stopped agent is amber, not red: you decided it, so it is not a failure."
  },
  {
    question: "Do I need Node?",
    answer: "Node 22.19 or newer. One command, no build step, no daemon."
  }
];
const CLOSING = {
  eyebrow: "FREE TO START",
  headline: { before: "Open a terminal. Type ", accent: "ultracode", after: "." },
  micro: "MIT · Node 22.19+ · Windows, macOS, Linux"
};
const FOOTER = {
  columns: [
    {
      title: "Product",
      links: [
        { label: "Features", to: "/#features" },
        { label: "Workflows", to: "/#workflows" },
        { label: "Changelog", to: "/changelog" },
        { label: "GitHub", to: "https://github.com/kumaryush18-cyber/qronos-cli" }
      ]
    },
    {
      title: "Docs",
      links: [
        { label: "Getting started", to: "/docs/getting-started" },
        { label: "Commands", to: "/docs/commands" },
        { label: "Environment", to: "/docs/environment" },
        { label: "Troubleshooting", to: "/docs/troubleshooting" }
      ]
    },
    {
      title: "Project",
      links: [
        { label: "Licence (MIT)", to: "https://github.com/kumaryush18-cyber/qronos-cli/blob/main/LICENSE" },
        { label: "Privacy", to: "/docs/privacy" },
        { label: "Security", to: "https://github.com/kumaryush18-cyber/qronos-cli/security" },
        { label: "Contributing", to: "https://github.com/kumaryush18-cyber/qronos-cli/blob/main/NOTICE" }
      ]
    },
    {
      title: "Elsewhere",
      links: [
        { label: "npm", to: "https://www.npmjs.com/package/qronos-cli" },
        { label: "Qronos AI", to: "https://qronos.me" }
      ]
    }
  ],
  legal: "© 2026 Qronos · Built in the terminal it ships."
};
const NOT_FOUND = {
  headline: { before: "That page ", accent: "left", after: " the session." },
  body: "The link is old or the file moved. Try the docs, or open an issue and tell us where you came from."
};
function NotFound() {
  return /* @__PURE__ */ jsx(Shell, { children: /* @__PURE__ */ jsxs("div", { className: "flex max-w-[640px] flex-col items-start gap-5 py-24 sm:py-32", children: [
    /* @__PURE__ */ jsx("p", { className: "font-mono text-[11px] uppercase tracking-[0.16em] text-orange", children: "404" }),
    /* @__PURE__ */ jsxs("h1", { className: "heading", children: [
      NOT_FOUND.headline.before,
      /* @__PURE__ */ jsx("em", { className: "serif-accent", children: NOT_FOUND.headline.accent }),
      NOT_FOUND.headline.after
    ] }),
    /* @__PURE__ */ jsx("p", { className: "lead", children: NOT_FOUND.body }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-3", children: [
      /* @__PURE__ */ jsx(Button, { href: "/docs", children: "Docs" }),
      /* @__PURE__ */ jsx(Button, { href: "/", variant: "ghost", children: "Home" })
    ] })
  ] }) });
}
function DocPage({ slug }) {
  const page = findDoc(slug);
  const Body = docBody(slug);
  if (!page || !Body) return /* @__PURE__ */ jsx(NotFound, {});
  const headings = docHeadings(slug);
  const { prev, next } = docNeighbours(slug);
  const wide = useMediaQuery("(min-width: 1280px)");
  const large = useMediaQuery("(min-width: 1024px)");
  return /* @__PURE__ */ jsx(Shell, { children: /* @__PURE__ */ jsxs("div", { className: "grid gap-10 py-12 lg:grid-cols-[180px_minmax(0,1fr)] lg:gap-12 xl:grid-cols-[180px_minmax(0,1fr)_170px]", children: [
    /* @__PURE__ */ jsx("aside", { className: "lg:sticky lg:top-[102px] lg:self-start", children: large ? /* @__PURE__ */ jsx(DocsSidebar, {}) : /* @__PURE__ */ jsxs("details", { className: "rounded-card border border-line bg-card p-3", children: [
      /* @__PURE__ */ jsx("summary", { className: "flex min-h-11 cursor-pointer items-center font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-muted", children: "Browse all docs" }),
      /* @__PURE__ */ jsx(DocsSidebar, { className: "mt-2" })
    ] }) }),
    /* @__PURE__ */ jsxs("article", { className: "flex min-w-0 max-w-[735px] flex-col", children: [
      /* @__PURE__ */ jsxs(Reveal, { as: "header", className: "flex flex-col gap-3 border-b border-line pb-6", children: [
        /* @__PURE__ */ jsx("p", { className: "font-mono text-[11px] uppercase tracking-[0.16em] text-muted", children: page.group }),
        /* @__PURE__ */ jsx("h1", { className: "text-[clamp(30px,4vw,42px)] leading-[1.06] tracking-[-0.06em]", children: page.title }),
        /* @__PURE__ */ jsx("p", { className: "text-[14px] leading-relaxed text-muted", children: page.intro })
      ] }),
      headings.length > 0 && !wide ? /* @__PURE__ */ jsxs("details", { className: "my-6 rounded-card border border-line bg-card p-3", children: [
        /* @__PURE__ */ jsx("summary", { className: "cursor-pointer font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-muted", children: "On this page" }),
        /* @__PURE__ */ jsx(DocToc, { headings, className: "mt-3" })
      ] }) : null,
      /* @__PURE__ */ jsx(Reveal, { index: 1, className: "min-w-0 pt-6", children: /* @__PURE__ */ jsx(Body, { components: mdxComponents }) }),
      /* @__PURE__ */ jsx(Callout, { tone: "honest", title: "Found a mistake?", children: "This page is generated from the CLI repository. If something here does not match what the tool does, open an issue — the wording is checked against the code, not written from memory." }),
      /* @__PURE__ */ jsxs("nav", { "aria-label": "Pagination", className: "mt-8 flex items-stretch justify-between gap-3 border-t border-line pt-6", children: [
        prev ? /* @__PURE__ */ jsxs(
          Link,
          {
            href: `/docs/${prev.slug}`,
            className: "group flex min-w-0 flex-col gap-1 text-[12.5px] text-muted hover:text-ink",
            children: [
              /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.16em]", children: [
                /* @__PURE__ */ jsx(ArrowLeft, { size: 12, "aria-hidden": true }),
                " Previous"
              ] }),
              /* @__PURE__ */ jsx("span", { className: "truncate font-bold", children: prev.title })
            ]
          }
        ) : /* @__PURE__ */ jsx("span", {}),
        next ? /* @__PURE__ */ jsxs(
          Link,
          {
            href: `/docs/${next.slug}`,
            className: "group flex min-w-0 flex-col items-end gap-1 text-right text-[12.5px] text-muted hover:text-ink",
            children: [
              /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.16em]", children: [
                "Next ",
                /* @__PURE__ */ jsx(ArrowRight, { size: 12, "aria-hidden": true })
              ] }),
              /* @__PURE__ */ jsx("span", { className: "truncate font-bold", children: next.title })
            ]
          }
        ) : /* @__PURE__ */ jsx("span", {})
      ] })
    ] }),
    /* @__PURE__ */ jsx("aside", { className: "hidden xl:sticky xl:top-[102px] xl:block xl:self-start", children: wide ? /* @__PURE__ */ jsx(DocToc, { headings }) : null })
  ] }) });
}
const DocPage$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DocPage
}, Symbol.toStringTag, { value: "Module" }));
function Docs() {
  return /* @__PURE__ */ jsx(Shell, { children: /* @__PURE__ */ jsxs("div", { className: "grid gap-10 py-14 lg:grid-cols-[190px_minmax(0,1fr)] lg:gap-14", children: [
    /* @__PURE__ */ jsx("aside", { className: "lg:sticky lg:top-[102px] lg:self-start", children: /* @__PURE__ */ jsx(DocsSidebar, {}) }),
    /* @__PURE__ */ jsxs("div", { className: "flex min-w-0 flex-col gap-8", children: [
      /* @__PURE__ */ jsxs("header", { className: "flex flex-col gap-4", children: [
        /* @__PURE__ */ jsx(Eyebrow, { children: "Documentation" }),
        /* @__PURE__ */ jsx("h1", { className: "heading", children: "Everything the CLI does, written down." }),
        /* @__PURE__ */ jsx("p", { className: "lead", children: "Thirteen pages, no marketing. Each one says what the feature does, what it costs and where it stops." })
      ] }),
      groupedDocs().map(({ group, pages: pages2 }, groupIndex) => /* @__PURE__ */ jsxs(Reveal, { index: groupIndex, as: "section", className: "flex flex-col gap-3", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-muted", children: group }),
        /* @__PURE__ */ jsx("ul", { className: "grid gap-3 sm:grid-cols-2", children: pages2.map((page) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(
          Link,
          {
            href: `/docs/${page.slug}`,
            className: "group flex h-full flex-col gap-1.5 rounded-card border border-line bg-card p-4 transition-colors duration-[160ms] hover:border-orange-line",
            children: [
              /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2 text-[14px] font-bold text-ink", children: [
                page.title,
                /* @__PURE__ */ jsx(
                  ArrowRight,
                  {
                    size: 13,
                    "aria-hidden": true,
                    className: "opacity-0 transition-opacity duration-[160ms] group-hover:opacity-100"
                  }
                )
              ] }),
              /* @__PURE__ */ jsx("span", { className: "text-[12.5px] leading-relaxed text-muted", children: page.intro })
            ]
          }
        ) }, page.slug)) })
      ] }, group))
    ] })
  ] }) });
}
const Docs$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Docs
}, Symbol.toStringTag, { value: "Module" }));
const SITE = {
  wordmark: { lead: "Qronos", trailing: "CLI" },
  url: "https://cli.qronos.me",
  repo: "https://github.com/kumaryush18-cyber/qronos-cli",
  install: "npx qronos-cli",
  description: "An AI coding agent in your terminal. Real tools, real edits, a 10-minute workflow engine, memory that survives the session. Free to start, MIT licensed."
};
const NAV_LINKS = [
  { label: "Features", to: "/#features" },
  { label: "Workflows", to: "/#workflows" },
  { label: "Docs", to: "/docs" },
  { label: "Changelog", to: "/changelog" }
];
const EXTERNAL = /^https?:\/\//;
function Footer() {
  return /* @__PURE__ */ jsx("footer", { className: "border-t border-line py-14", children: /* @__PURE__ */ jsxs(Shell, { children: [
    /* @__PURE__ */ jsxs("div", { className: "grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(4,minmax(0,1fr))]", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-baseline gap-2", children: [
          /* @__PURE__ */ jsx("span", { className: "text-[17px] font-extrabold tracking-[-0.05em]", children: SITE.wordmark.lead }),
          /* @__PURE__ */ jsx("span", { className: "font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-muted", children: SITE.wordmark.trailing })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "max-w-[24ch] text-[13px] leading-relaxed text-muted", children: "An AI coding agent for the terminal. MIT licensed." })
      ] }),
      FOOTER.columns.map((column) => /* @__PURE__ */ jsxs("nav", { "aria-label": column.title, className: "flex flex-col gap-3", children: [
        /* @__PURE__ */ jsx("p", { className: "font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-ink", children: column.title }),
        /* @__PURE__ */ jsx("ul", { className: "flex flex-col gap-2", children: column.links.map((link) => /* @__PURE__ */ jsx("li", { children: EXTERNAL.test(link.to) ? /* @__PURE__ */ jsx(
          "a",
          {
            href: link.to,
            target: "_blank",
            rel: "noreferrer noopener",
            className: "text-[13px] text-muted transition-colors duration-[160ms] hover:text-ink",
            children: link.label
          }
        ) : /* @__PURE__ */ jsx(
          Link,
          {
            href: link.to,
            className: "text-[13px] text-muted transition-colors duration-[160ms] hover:text-ink",
            children: link.label
          }
        ) }, link.label)) })
      ] }, column.title))
    ] }),
    /* @__PURE__ */ jsx("p", { className: "mt-12 border-t border-line pt-6 font-mono text-[11px] text-muted", children: FOOTER.legal })
  ] }) });
}
function Nav() {
  const [open, setOpen] = useState(false);
  const [pathname] = useLocation();
  return /* @__PURE__ */ jsxs("header", { className: "sticky top-0 z-50 border-b border-line bg-paper/80 backdrop-blur-xl", children: [
    /* @__PURE__ */ jsxs("nav", { "aria-label": "Main", className: "mx-auto flex h-[78px] w-full max-w-[1220px] items-center gap-8 px-[22px] sm:px-7", children: [
      /* @__PURE__ */ jsxs(Link, { href: "/", className: "flex items-baseline gap-2", children: [
        /* @__PURE__ */ jsxs("span", { className: "shimmer text-[19px] font-extrabold tracking-[-0.05em]", children: [
          "Qronos",
          /* @__PURE__ */ jsx("span", { className: "sr-only", children: " " })
        ] }),
        /* @__PURE__ */ jsx("span", { className: "font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-muted", children: "CLI" })
      ] }),
      /* @__PURE__ */ jsx("ul", { className: "ml-4 hidden items-center gap-7 lg:flex", children: NAV_LINKS.map((link) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
        "a",
        {
          href: link.to,
          className: cn(
            "nav-link font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-muted",
            "transition-colors duration-[160ms] hover:text-ink",
            pathname === link.to && "text-ink"
          ),
          children: link.label
        }
      ) }, link.label)) }),
      /* @__PURE__ */ jsxs("div", { className: "ml-auto flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(
          "a",
          {
            href: SITE.repo,
            target: "_blank",
            rel: "noreferrer noopener",
            className: "hidden font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-muted transition-colors hover:text-ink sm:inline",
            children: "GitHub"
          }
        ),
        /* @__PURE__ */ jsx(
          CopyButton,
          {
            text: SITE.install,
            label: "Install",
            className: "min-h-11 border-orange-line bg-orange-soft px-3 text-orange hover:text-orange-pale",
            live: false
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => setOpen((value) => !value),
            "aria-expanded": open,
            "aria-controls": "mobile-menu",
            "aria-label": open ? "Close menu" : "Open menu",
            className: "grid size-11 place-items-center rounded-[9px] border border-line text-muted lg:hidden",
            children: open ? /* @__PURE__ */ jsx(X, { size: 16, "aria-hidden": true }) : /* @__PURE__ */ jsx(Menu, { size: 16, "aria-hidden": true })
          }
        )
      ] })
    ] }),
    open ? /* @__PURE__ */ jsx("div", { id: "mobile-menu", className: "border-t border-line bg-paper px-[22px] py-4 lg:hidden", children: /* @__PURE__ */ jsxs("ul", { className: "flex flex-col gap-1", children: [
      NAV_LINKS.map((link) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
        "a",
        {
          href: link.to,
          onClick: () => setOpen(false),
          className: "block rounded-[9px] px-2 py-2.5 font-mono text-[12px] uppercase tracking-[0.14em] text-muted hover:bg-card hover:text-ink",
          children: link.label
        }
      ) }, link.label)),
      /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
        "a",
        {
          href: SITE.repo,
          target: "_blank",
          rel: "noreferrer noopener",
          className: "block rounded-[9px] px-2 py-2.5 font-mono text-[12px] uppercase tracking-[0.14em] text-muted hover:bg-card hover:text-ink",
          children: "GitHub"
        }
      ) })
    ] }) }) : null
  ] });
}
const DEFAULT_META = {
  title: "Qronos CLI — the terminal that thinks in workflows",
  description: SITE.description,
  canonical: SITE.url
};
const STATIC = {
  "/": DEFAULT_META,
  "/docs": {
    title: "Qronos CLI documentation",
    description: "Install, commands, workflows, memory, compaction and every environment variable, in one place.",
    canonical: `${SITE.url}/docs`
  },
  "/changelog": {
    title: "Changelog — Qronos CLI",
    description: "Every release, newest first, with what changed and why.",
    canonical: `${SITE.url}/changelog`
  },
  "/404": {
    title: "Page not found — Qronos CLI",
    description: "That page left the session. Try the docs.",
    canonical: `${SITE.url}/404`
  }
};
function canonicalFor(path) {
  const clean = path.split("?")[0]?.split("#")[0] ?? "/";
  if (clean === "/" || clean === "") return SITE.url;
  return `${SITE.url}${clean.replace(/\/+$/, "")}`;
}
function metaFor(path) {
  const clean = (path.split("?")[0] ?? "/").split("#")[0] ?? "/";
  const fixed = STATIC[clean];
  if (fixed) return fixed;
  const docSlug = /^\/docs\/([^/]+)\/?$/.exec(clean)?.[1];
  if (docSlug) {
    const page = findDoc(docSlug);
    if (page) {
      return {
        title: `${page.title} — Qronos CLI`,
        description: page.intro,
        canonical: canonicalFor(clean)
      };
    }
  }
  return STATIC["/404"] ?? DEFAULT_META;
}
function setMetaTag(doc, key, value, content) {
  let tag = doc.head.querySelector(`meta[${key}="${value}"]`);
  if (!tag) {
    tag = doc.createElement("meta");
    tag.setAttribute(key, value);
    doc.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}
function setLinkTag(doc, rel, href) {
  let tag = doc.head.querySelector(`link[rel="${rel}"]`);
  if (!tag) {
    tag = doc.createElement("link");
    tag.rel = rel;
    doc.head.appendChild(tag);
  }
  tag.href = href;
}
function applyMeta(meta, doc = document) {
  doc.title = meta.title;
  setMetaTag(doc, "name", "description", meta.description);
  setLinkTag(doc, "canonical", meta.canonical);
  setMetaTag(doc, "property", "og:type", "website");
  setMetaTag(doc, "property", "og:title", meta.title);
  setMetaTag(doc, "property", "og:description", meta.description);
  setMetaTag(doc, "property", "og:url", meta.canonical);
  setMetaTag(doc, "name", "twitter:card", "summary_large_image");
}
function Seo({ path }) {
  useEffect(() => {
    applyMeta(metaFor(path));
  }, [path]);
  return null;
}
const TERMINAL_MAX_CHARS = 96;
function fitLine(text, max = TERMINAL_MAX_CHARS) {
  if (max <= 3) return ".".repeat(Math.max(0, max));
  if (text.length <= max) return text;
  return `${text.slice(0, max - 3).trimEnd()}...`;
}
function dotRole(status) {
  if (status === "ok") return "ok";
  if (status === "fail") return "fail";
  return "muted";
}
const QUERY = "(prefers-reduced-motion: reduce)";
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() => readPreference());
  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
    const media = window.matchMedia(QUERY);
    const listener = (event) => setReduced(event.matches);
    setReduced(media.matches);
    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", listener);
      return () => media.removeEventListener("change", listener);
    }
    media.addListener(listener);
    return () => media.removeListener(listener);
  }, []);
  return reduced;
}
function readPreference() {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
  return window.matchMedia(QUERY).matches;
}
const DEFAULT_REVEAL = {
  charMs: 16,
  beforeCommandMs: 180,
  lineMs: 85,
  beforePromptMs: 200
};
function buildRevealTimeline(lines, options = {}) {
  const config = { ...DEFAULT_REVEAL, ...options };
  const events = [];
  let at = 0;
  lines.forEach((line, index) => {
    if (line.kind === "command") {
      at += config.beforeCommandMs;
      for (let chars = 1; chars <= line.text.length; chars += 1) {
        events.push({ atMs: at, line: index, chars });
        at += config.charMs;
      }
      return;
    }
    if (line.kind === "prompt") at += config.beforePromptMs;
    else if (index > 0) at += config.lineMs;
    events.push({ atMs: at, line: index, chars: line.text.length });
  });
  return events;
}
function revealStateAfter(events, count, lineCount) {
  const applied = events.slice(0, Math.max(0, count));
  const commandChars = /* @__PURE__ */ new Map();
  let visible = 0;
  for (const event of applied) {
    visible = Math.max(visible, event.line + 1);
    commandChars.set(event.line, event.chars);
  }
  return { visible, commandChars, done: count >= events.length || visible >= lineCount };
}
function useTerminalReveal(lines, { animate }) {
  const events = useRef([]);
  const [index, setIndex] = useState(0);
  if (events.current.length === 0) {
    events.current = buildRevealTimeline(lines);
  }
  useEffect(() => {
    if (!animate) {
      setIndex(events.current.length);
      return;
    }
    setIndex(0);
    let current = 0;
    let timer;
    const step = () => {
      current += 1;
      setIndex(current);
      if (current >= events.current.length) return;
      const previous = events.current[current - 1]?.atMs ?? 0;
      const next = events.current[current]?.atMs ?? previous;
      timer = setTimeout(step, Math.max(0, next - previous));
    };
    const first = events.current[0]?.atMs ?? 0;
    timer = setTimeout(step, Math.max(0, first));
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [animate, lines]);
  const state = revealStateAfter(events.current, index, lines.length);
  return { visible: state.visible, commandChars: state.commandChars, done: state.done };
}
const DOT = {
  ok: "bg-ok",
  fail: "bg-fail",
  muted: "bg-muted"
};
function TerminalMock({ lines, title = "qronos", className, animate = false }) {
  const reduced = usePrefersReducedMotion();
  const { visible, commandChars, done } = useTerminalReveal(lines, { animate: animate && !reduced });
  return /* @__PURE__ */ jsxs(
    "figure",
    {
      "aria-busy": animate && !done ? true : void 0,
      className: cn(
        "overflow-hidden rounded-card border border-line bg-card text-left shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)]",
        className
      ),
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 border-b border-line px-4 py-2.5", children: [
          /* @__PURE__ */ jsx("span", { className: "shimmer font-mono text-[11px] font-bold tracking-[-0.02em]", children: title }),
          /* @__PURE__ */ jsx("span", { className: "ml-auto font-mono text-[11px] uppercase tracking-[0.16em] text-muted", children: "zsh" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "min-h-[236px] px-4 py-4 font-mono text-[12px] leading-[1.85] sm:text-[12.5px]", children: lines.slice(0, visible).map((line, index) => /* @__PURE__ */ jsx(TerminalRow, { line, shownChars: commandChars.get(index) }, `${line.kind}-${index}`)) }),
        /* @__PURE__ */ jsxs("figcaption", { className: "sr-only", children: [
          /* @__PURE__ */ jsx("span", { children: "A terminal running Qronos CLI." }),
          lines.map((line, index) => /* @__PURE__ */ jsx("span", { children: ` ${line.text}` }, `sr-${line.kind}-${index}`))
        ] })
      ]
    }
  );
}
function TerminalRow({ line, shownChars }) {
  switch (line.kind) {
    case "step": {
      const role = dotRole(line.status);
      return /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2", children: [
        /* @__PURE__ */ jsx("span", { "aria-hidden": true, className: cn("mt-[7px] size-1.5 shrink-0 rounded-full", DOT[role]) }),
        /* @__PURE__ */ jsxs("span", { className: "text-ink", children: [
          fitLine(line.text),
          line.seconds === void 0 ? null : /* @__PURE__ */ jsx("span", { className: "text-muted", children: ` · ${line.seconds}s` })
        ] })
      ] });
    }
    case "command": {
      const text = shownChars === void 0 ? line.text : line.text.slice(0, shownChars);
      const typing = shownChars !== void 0 && shownChars < line.text.length;
      return /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2 pl-[14px]", children: [
        /* @__PURE__ */ jsx("span", { "aria-hidden": true, className: "text-muted", children: "⎿" }),
        /* @__PURE__ */ jsxs("span", { className: "text-muted", children: [
          /* @__PURE__ */ jsx("span", { className: "text-orange", children: "$" }),
          " ",
          /* @__PURE__ */ jsx("span", { className: "text-ink", children: fitLine(text) }),
          typing ? /* @__PURE__ */ jsx("span", { className: "cursor ml-0.5 align-middle", "aria-hidden": true }) : null
        ] })
      ] });
    }
    case "output":
      return /* @__PURE__ */ jsx("div", { className: "whitespace-pre pl-[28px] text-muted", children: fitLine(line.text) });
    case "summary":
      return /* @__PURE__ */ jsxs("div", { className: "mt-1 text-muted", children: [
        /* @__PURE__ */ jsxs("span", { "aria-hidden": true, className: "text-orange-pale", children: [
          "✻",
          " "
        ] }),
        fitLine(line.text)
      ] });
    case "prompt":
      return /* @__PURE__ */ jsxs("div", { className: "mt-1 flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("span", { "aria-hidden": true, className: "text-orange", children: "›" }),
        /* @__PURE__ */ jsx("span", { className: "cursor", "aria-hidden": true })
      ] });
  }
}
const PANEL_STATE = {
  done: { glyph: "✓", label: "done", tone: "text-ok" },
  failed: { glyph: "✗", label: "failed", tone: "text-fail" },
  stopped: { glyph: "⊘", label: "stopped by you", tone: "text-stop" },
  replayed: { glyph: "↺", label: "replayed · no tokens", tone: "text-info" },
  running: { glyph: "·", label: "running", tone: "text-orange" }
};
function countStates(agents) {
  const counts = { total: agents.length, done: 0, failed: 0, stopped: 0, replayed: 0, running: 0 };
  for (const agent of agents) counts[agent.state] += 1;
  return counts;
}
function summarizeCounts(counts) {
  const parts = [];
  if (counts.done) parts.push(`${counts.done} done`);
  if (counts.replayed) parts.push(`${counts.replayed} replayed`);
  if (counts.failed) parts.push(`${counts.failed} failed`);
  if (counts.stopped) parts.push(`${counts.stopped} stopped`);
  if (counts.running) parts.push(`${counts.running} running`);
  return parts.length > 0 ? parts.join(" · ") : "no agents";
}
function compactCounts(counts) {
  const order = ["done", "replayed", "failed", "stopped", "running"];
  return order.filter((state) => counts[state] > 0).map((state) => ({
    glyph: `${PANEL_STATE[state].glyph}${counts[state]}`,
    label: `${counts[state]} ${PANEL_STATE[state].label}`
  }));
}
function WorkflowPanelMock({ className }) {
  const [selectedId, setSelectedId] = useState(WORKFLOW_DEMO.phases[1]?.id ?? WORKFLOW_DEMO.phases[0]?.id);
  const selected = WORKFLOW_DEMO.phases.find((phase) => phase.id === selectedId) ?? WORKFLOW_DEMO.phases[0];
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn("overflow-hidden rounded-panel border border-line bg-card", className),
      role: "group",
      "aria-label": "Workflow panel example",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 border-b border-line px-4 py-2.5", children: [
          /* @__PURE__ */ jsxs("span", { className: "relative flex size-1.5", children: [
            /* @__PURE__ */ jsx("span", { className: "absolute inline-flex size-full animate-ping rounded-full bg-orange opacity-60" }),
            /* @__PURE__ */ jsx("span", { className: "relative inline-flex size-1.5 rounded-full bg-orange" })
          ] }),
          /* @__PURE__ */ jsx("span", { className: "font-mono text-[11px] text-ink", children: WORKFLOW_DEMO.id }),
          /* @__PURE__ */ jsx("span", { className: "font-mono text-[11px] text-muted", children: "· live" }),
          /* @__PURE__ */ jsx("span", { className: "ml-auto font-mono text-[11px] text-muted", children: WORKFLOW_DEMO.elapsed })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-0 sm:grid-cols-[0.85fr_1.15fr]", children: [
          /* @__PURE__ */ jsx("ul", { className: "flex flex-col border-b border-line sm:border-b-0 sm:border-r", children: WORKFLOW_DEMO.phases.map((phase) => /* @__PURE__ */ jsx(
            PhaseRow,
            {
              phase,
              active: phase.id === selected?.id,
              onSelect: () => setSelectedId(phase.id)
            },
            phase.id
          )) }),
          /* @__PURE__ */ jsx("div", { className: "p-3", children: selected ? /* @__PURE__ */ jsx(AgentList, { phase: selected }) : null })
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "border-t border-line px-4 py-2 font-mono text-[11px] leading-relaxed text-muted", children: [
          /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: WORKFLOWS.panelHint }),
          /* @__PURE__ */ jsx("span", { className: "sm:hidden", children: WORKFLOWS.panelHintShort })
        ] })
      ]
    }
  );
}
function PhaseRow({ phase, active, onSelect }) {
  const counts = countStates(phase.agents);
  return /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
    "button",
    {
      type: "button",
      onClick: onSelect,
      "aria-pressed": active,
      className: cn(
        "flex min-h-[52px] w-full flex-col items-start justify-center gap-0.5 px-4 py-2 text-left transition-colors duration-[160ms]",
        active ? "bg-orange-soft" : "hover:bg-paper"
      ),
      children: /* @__PURE__ */ jsxs("span", { className: "flex w-full items-center gap-2", children: [
        /* @__PURE__ */ jsx("span", { className: cn("min-w-0 truncate text-[12.5px] font-bold", active ? "text-orange" : "text-ink"), children: phase.name }),
        /* @__PURE__ */ jsx(
          "span",
          {
            "aria-hidden": true,
            className: "shrink-0 font-mono text-[11px] tracking-tight text-muted",
            children: compactCounts(counts).map((entry) => entry.glyph).join(" ")
          }
        ),
        /* @__PURE__ */ jsx("span", { className: "sr-only", children: summarizeCounts(counts) }),
        /* @__PURE__ */ jsx("span", { className: "ml-auto shrink-0 font-mono text-[11px] text-muted", children: phase.tokens })
      ] })
    }
  ) });
}
function AgentList({ phase }) {
  return /* @__PURE__ */ jsx("ul", { className: "flex flex-col divide-y divide-line/70", children: phase.agents.map((agent) => {
    const state = PANEL_STATE[agent.state];
    return /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2 py-2 first:pt-0 last:pb-0", children: [
      /* @__PURE__ */ jsx("span", { "aria-hidden": true, className: cn("w-3 shrink-0 text-center font-mono text-[12px]", state.tone), children: state.glyph }),
      /* @__PURE__ */ jsx("span", { className: "min-w-0 truncate text-[12px] text-ink", children: agent.name }),
      /* @__PURE__ */ jsx("span", { className: "ml-auto shrink-0 font-mono text-[11px] text-muted", children: agent.model }),
      /* @__PURE__ */ jsx("span", { className: "w-9 shrink-0 text-right font-mono text-[11px] text-muted", children: agent.tokens }),
      /* @__PURE__ */ jsx("span", { className: "sr-only", children: state.label })
    ] }, agent.name);
  }) });
}
const HEADERS = ["Qronos CLI", "Claude Code", "Aider", "opencode"];
function CellMark({ cell }) {
  const Icon = cell.state === "yes" ? Check : cell.state === "no" ? Minus : MoveRight;
  const word = cell.state === "yes" ? "Yes" : cell.state === "no" ? "No" : "Partly";
  const tone = cell.state === "yes" ? "text-ok" : cell.state === "no" ? "text-fail" : "text-orange-pale";
  return /* @__PURE__ */ jsxs("span", { className: "inline-flex flex-wrap items-center gap-1.5", children: [
    /* @__PURE__ */ jsx(Icon, { size: 15, strokeWidth: 2.5, "aria-hidden": true, className: tone }),
    /* @__PURE__ */ jsx("span", { className: "sr-only", children: word }),
    cell.note ? /* @__PURE__ */ jsx("span", { className: "font-mono text-[11px] text-muted", children: cell.note }) : null
  ] });
}
function CompareTable({ rows, footnote, className }) {
  return /* @__PURE__ */ jsxs("div", { className: cn("flex flex-col gap-4", className), children: [
    /* @__PURE__ */ jsxs("table", { className: "hidden w-full border-collapse text-left sm:table", children: [
      /* @__PURE__ */ jsx("caption", { className: "sr-only", children: "Feature comparison: Qronos CLI, Claude Code, Aider and opencode." }),
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "border-b border-line", children: [
        /* @__PURE__ */ jsx("th", { scope: "col", className: "py-3 pr-4 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-muted", children: "Feature" }),
        HEADERS.map((name) => /* @__PURE__ */ jsx(
          "th",
          {
            scope: "col",
            className: cn(
              "py-3 pr-4 font-mono text-[11px] font-bold uppercase tracking-[0.16em]",
              name === "Qronos CLI" ? "text-orange" : "text-muted"
            ),
            children: name
          },
          name
        ))
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { children: rows.map((row) => /* @__PURE__ */ jsxs("tr", { className: "border-b border-line/70", children: [
        /* @__PURE__ */ jsx("th", { scope: "row", className: "py-3.5 pr-4 text-[13px] font-medium text-ink", children: row.label }),
        /* @__PURE__ */ jsx("td", { className: "py-3.5 pr-4", children: /* @__PURE__ */ jsx(CellMark, { cell: row.qronos }) }),
        /* @__PURE__ */ jsx("td", { className: "py-3.5 pr-4", children: /* @__PURE__ */ jsx(CellMark, { cell: row.claudeCode }) }),
        /* @__PURE__ */ jsx("td", { className: "py-3.5 pr-4", children: /* @__PURE__ */ jsx(CellMark, { cell: row.aider }) }),
        /* @__PURE__ */ jsx("td", { className: "py-3.5 pr-4", children: /* @__PURE__ */ jsx(CellMark, { cell: row.opencode }) })
      ] }, row.label)) })
    ] }),
    /* @__PURE__ */ jsx("ul", { className: "flex flex-col gap-3 sm:hidden", children: rows.map((row) => /* @__PURE__ */ jsxs("li", { className: "rounded-card border border-line bg-card p-4", children: [
      /* @__PURE__ */ jsx("p", { className: "text-[13px] font-bold text-ink", children: row.label }),
      /* @__PURE__ */ jsx("dl", { className: "mt-3 grid grid-cols-2 gap-x-3 gap-y-2", children: [
        ["Qronos CLI", row.qronos],
        ["Claude Code", row.claudeCode],
        ["Aider", row.aider],
        ["opencode", row.opencode]
      ].map(([name, cell]) => /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-0.5", children: [
        /* @__PURE__ */ jsx("dt", { className: "font-mono text-[11px] uppercase tracking-[0.12em] text-muted", children: name }),
        /* @__PURE__ */ jsx("dd", { className: "text-[12px]", children: /* @__PURE__ */ jsx(CellMark, { cell }) })
      ] }, name)) })
    ] }, row.label)) }),
    /* @__PURE__ */ jsx("p", { className: "font-mono text-[11px] leading-relaxed text-muted", children: footnote })
  ] });
}
function FeatureCard({ step, title, body, icon: Icon, className }) {
  return /* @__PURE__ */ jsxs(
    "article",
    {
      className: cn(
        "group flex h-full flex-col gap-4 rounded-card border border-line bg-card p-6",
        "transition-[transform,border-color] duration-[160ms] ease-[var(--ease-out)]",
        "hover:-translate-y-[5px] hover:border-orange-line",
        className
      ),
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("span", { className: "grid size-[38px] place-items-center rounded-[10px] bg-orange-soft text-orange", children: /* @__PURE__ */ jsx(Icon, { size: 18, strokeWidth: 1.5, "aria-hidden": true }) }),
          /* @__PURE__ */ jsx("span", { className: "font-mono text-[11px] tracking-[0.16em] text-muted", children: step })
        ] }),
        /* @__PURE__ */ jsx("h3", { className: "text-[19px] leading-tight tracking-[-0.045em] sm:text-[20px]", children: title }),
        /* @__PURE__ */ jsx("p", { className: "text-[13.5px] leading-[1.75] text-muted", children: body })
      ]
    }
  );
}
function Tabs({ tabs, defaultId, label, className }) {
  const [activeId, setActiveId] = useState(defaultId ?? tabs[0]?.id ?? "");
  const buttons = useRef([]);
  const active = tabs.find((tab) => tab.id === activeId) ?? tabs[0];
  function onKeyDown(event) {
    const index = tabs.findIndex((tab) => tab.id === active?.id);
    const last = tabs.length - 1;
    let next = index;
    if (event.key === "ArrowRight") next = index >= last ? 0 : index + 1;
    else if (event.key === "ArrowLeft") next = index <= 0 ? last : index - 1;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = last;
    else return;
    event.preventDefault();
    const target = tabs[next];
    if (!target) return;
    setActiveId(target.id);
    buttons.current[next]?.focus();
  }
  return /* @__PURE__ */ jsxs("div", { className: cn("flex flex-col gap-3", className), children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        role: "tablist",
        "aria-label": label,
        onKeyDown,
        className: "flex gap-1 rounded-[9px] border border-line bg-card p-1",
        children: tabs.map((tab, index) => {
          const selected = tab.id === active?.id;
          return /* @__PURE__ */ jsx(
            "button",
            {
              ref: (node) => {
                buttons.current[index] = node;
              },
              type: "button",
              role: "tab",
              id: `tab-${tab.id}`,
              "aria-selected": selected,
              "aria-controls": `panel-${tab.id}`,
              tabIndex: selected ? 0 : -1,
              onClick: () => setActiveId(tab.id),
              className: cn(
                "min-h-9 flex-1 rounded-[7px] px-3 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors duration-[160ms]",
                selected ? "bg-orange-soft text-orange" : "text-muted hover:text-ink"
              ),
              children: tab.label
            },
            tab.id
          );
        })
      }
    ),
    active ? /* @__PURE__ */ jsx("div", { role: "tabpanel", id: `panel-${active.id}`, "aria-labelledby": `tab-${active.id}`, children: active.panel }) : null
  ] });
}
const FEATURE_ICONS = [Workflow, ReceiptText, TextQuote, Brain, Code2, ShieldCheck];
const PROOF_ICONS = { tick: Check, clock: Timer, key: KeyRound, terminal: Terminal };
function Headline({ headline, className }) {
  return /* @__PURE__ */ jsxs("h2", { className, children: [
    headline.before,
    /* @__PURE__ */ jsx("em", { children: headline.accent }),
    headline.after
  ] });
}
function Home() {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Shell, { children: /* @__PURE__ */ jsxs("div", { className: "relative grid items-start gap-12 pt-14 pb-10 lg:grid-cols-[1.03fr_0.97fr] lg:gap-[66px] lg:pt-20", children: [
      /* @__PURE__ */ jsx("div", { "aria-hidden": true, className: "pointer-events-none absolute inset-0 overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "glow-drift -top-[120px] left-[-90px] h-[520px] w-[520px] rounded-full opacity-70" }) }),
      /* @__PURE__ */ jsxs("div", { className: "hero-rise relative flex flex-col items-start gap-6", children: [
        /* @__PURE__ */ jsx(Eyebrow, { dot: true, children: HERO.eyebrow }),
        /* @__PURE__ */ jsxs("h1", { className: "display", children: [
          HERO.headline.before,
          /* @__PURE__ */ jsx("em", { children: HERO.headline.accent }),
          HERO.headline.after
        ] }),
        /* @__PURE__ */ jsx("p", { className: "lead", children: HERO.sub }),
        /* @__PURE__ */ jsxs("div", { className: "flex w-full max-w-[420px] flex-col gap-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 rounded-[9px] border border-line bg-card px-3 py-2", children: [
            /* @__PURE__ */ jsx("span", { "aria-hidden": true, className: "font-mono text-[12px] text-orange", children: "$" }),
            /* @__PURE__ */ jsx("code", { className: "font-mono text-[12.5px] text-ink", children: SITE.install }),
            /* @__PURE__ */ jsx(CopyButton, { text: SITE.install, className: "ml-auto border-transparent px-2 py-1", live: false })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "font-mono text-[11px] text-muted", children: HERO.installNote })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [
          /* @__PURE__ */ jsx(Button, { href: "/docs", children: "Read the docs →" }),
          /* @__PURE__ */ jsx(Button, { href: SITE.repo, variant: "ghost", external: true, children: "Star on GitHub" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "relative w-full", children: /* @__PURE__ */ jsx(TerminalMock, { lines: HERO_TERMINAL, className: "w-full", animate: true }) })
    ] }) }),
    /* @__PURE__ */ jsx(Shell, { children: /* @__PURE__ */ jsx("ul", { className: "grid gap-3 border-y border-line py-6 sm:grid-cols-2 lg:grid-cols-4", children: PROOF.map((item, index) => {
      const Icon = PROOF_ICONS[item.icon];
      return /* @__PURE__ */ jsxs(
        Reveal,
        {
          as: "li",
          index,
          className: "flex items-start gap-2.5 text-[12.5px] text-muted",
          children: [
            /* @__PURE__ */ jsx(Icon, { size: 15, strokeWidth: 2, "aria-hidden": true, className: "mt-[2px] shrink-0 text-orange" }),
            item.text
          ]
        },
        item.text
      );
    }) }) }),
    /* @__PURE__ */ jsxs(Section, { id: "features", labelledBy: "features-heading", children: [
      /* @__PURE__ */ jsxs(Reveal, { className: "flex flex-col gap-4", children: [
        /* @__PURE__ */ jsx(Eyebrow, { children: "What it does" }),
        /* @__PURE__ */ jsxs("h2", { id: "features-heading", className: "heading", children: [
          "Six things you can watch it ",
          /* @__PURE__ */ jsx("em", { className: "serif-accent", children: "do" }),
          "."
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-10 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3", children: FEATURES.map((feature, index) => /* @__PURE__ */ jsx(Reveal, { index: index % 3, className: "h-full", children: /* @__PURE__ */ jsx(
        FeatureCard,
        {
          step: feature.id,
          title: feature.title,
          body: feature.body,
          icon: FEATURE_ICONS[index] ?? Workflow
        }
      ) }, feature.id)) })
    ] }),
    /* @__PURE__ */ jsx(Section, { id: "workflows", labelledBy: "workflows-heading", className: "border-t border-line", children: /* @__PURE__ */ jsxs("div", { className: "grid gap-12 lg:grid-cols-[1fr_0.85fr] lg:gap-[66px]", children: [
      /* @__PURE__ */ jsxs(Reveal, { className: "flex min-w-0 flex-col gap-5", children: [
        /* @__PURE__ */ jsx(Eyebrow, { children: WORKFLOWS.eyebrow }),
        /* @__PURE__ */ jsx(Headline, { headline: WORKFLOWS.headline, className: "heading" }),
        /* @__PURE__ */ jsx("p", { className: "lead", children: WORKFLOWS.body }),
        /* @__PURE__ */ jsx("ul", { className: "mt-2 flex flex-col gap-5", children: WORKFLOWS.bullets.map((bullet) => /* @__PURE__ */ jsxs("li", { className: "border-l border-line pl-4", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[14px] font-bold text-ink", children: bullet.title }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 text-[13.5px] leading-relaxed text-muted", children: bullet.body })
        ] }, bullet.title)) })
      ] }),
      /* @__PURE__ */ jsx(Reveal, { index: 1, children: /* @__PURE__ */ jsx(WorkflowPanelMock, { className: "self-start" }) })
    ] }) }),
    /* @__PURE__ */ jsxs(Section, { labelledBy: "compare-heading", className: "border-t border-line", children: [
      /* @__PURE__ */ jsxs(Reveal, { className: "flex flex-col gap-4", children: [
        /* @__PURE__ */ jsx(Eyebrow, { children: "How it compares" }),
        /* @__PURE__ */ jsxs("h2", { id: "compare-heading", className: "heading", children: [
          "Different in ",
          /* @__PURE__ */ jsx("em", { className: "serif-accent", children: "four" }),
          " ways that matter."
        ] })
      ] }),
      /* @__PURE__ */ jsx(Reveal, { index: 1, children: /* @__PURE__ */ jsx(CompareTable, { rows: COMPARISON.rows, footnote: COMPARISON.footnote, className: "mt-10" }) })
    ] }),
    /* @__PURE__ */ jsx(Section, { labelledBy: "quickstart-heading", className: "border-t border-line", children: /* @__PURE__ */ jsxs("div", { className: "grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-[66px]", children: [
      /* @__PURE__ */ jsxs(Reveal, { className: "flex min-w-0 flex-col gap-5", children: [
        /* @__PURE__ */ jsx(Eyebrow, { children: "Quickstart" }),
        /* @__PURE__ */ jsx(Headline, { headline: QUICKSTART.headline, className: "heading" }),
        /* @__PURE__ */ jsx("p", { className: "lead", children: QUICKSTART.body }),
        /* @__PURE__ */ jsx("ol", { className: "mt-2 flex flex-col gap-4", children: QUICKSTART.steps.map((step, index) => /* @__PURE__ */ jsxs("li", { className: "flex gap-3", children: [
          /* @__PURE__ */ jsx("span", { className: "mt-[1px] grid size-6 shrink-0 place-items-center rounded-full border border-orange-line font-mono text-[11px] text-orange", children: index + 1 }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-[13.5px] font-bold text-ink", children: step.title }),
            /* @__PURE__ */ jsx("p", { className: "font-mono text-[11.5px] leading-relaxed break-words text-muted", children: step.detail })
          ] })
        ] }, step.title)) })
      ] }),
      /* @__PURE__ */ jsxs(Reveal, { index: 1, className: "flex min-w-0 flex-col gap-4", children: [
        /* @__PURE__ */ jsx(
          Tabs,
          {
            label: "How to start",
            tabs: [
              {
                id: "first-run",
                label: "First run",
                panel: /* @__PURE__ */ jsx(CodePanel, { code: SITE.install, label: "shell" })
              },
              {
                id: "byok",
                label: "Bring your own key",
                panel: /* @__PURE__ */ jsx(CodePanel, { code: QUICKSTART.byok.join("\n"), label: "providers" })
              }
            ]
          }
        ),
        /* @__PURE__ */ jsx(Callout, { tone: "honest", children: QUICKSTART.keyNote })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs(Section, { labelledBy: "faq-heading", className: "border-t border-line", children: [
      /* @__PURE__ */ jsxs(Reveal, { className: "flex flex-col gap-4", children: [
        /* @__PURE__ */ jsx(Eyebrow, { children: "Questions" }),
        /* @__PURE__ */ jsxs("h2", { id: "faq-heading", className: "heading", children: [
          "The things people ",
          /* @__PURE__ */ jsx("em", { className: "serif-accent", children: "ask" }),
          "."
        ] })
      ] }),
      /* @__PURE__ */ jsx(Reveal, { index: 1, as: "div", className: "mt-10 flex flex-col divide-y divide-line border-y border-line", children: FAQ.map((item) => /* @__PURE__ */ jsxs("details", { className: "group py-4", children: [
        /* @__PURE__ */ jsxs("summary", { className: "flex min-h-11 cursor-pointer items-center gap-3 py-1 text-[14.5px] font-bold text-ink marker:content-none", children: [
          /* @__PURE__ */ jsx(
            "span",
            {
              "aria-hidden": true,
              className: "font-mono text-[13px] leading-none text-orange transition-transform duration-[160ms] group-open:rotate-45",
              children: "+"
            }
          ),
          item.question
        ] }),
        /* @__PURE__ */ jsx("p", { className: "mt-3 max-w-[68ch] pl-6 text-[13.5px] leading-[1.75] text-muted", children: item.answer })
      ] }, item.question)) })
    ] }),
    /* @__PURE__ */ jsx(Section, { className: "border-t border-line", spacing: "tight", children: /* @__PURE__ */ jsxs(Reveal, { className: "flex flex-col items-center gap-5 py-8 text-center", children: [
      /* @__PURE__ */ jsxs("div", { "aria-hidden": true, className: "flex gap-1.5", children: [
        /* @__PURE__ */ jsx("span", { className: "size-1.5 rounded-full bg-orange-pale/90" }),
        /* @__PURE__ */ jsx("span", { className: "size-1.5 rounded-full bg-orange-pale/60" }),
        /* @__PURE__ */ jsx("span", { className: "size-1.5 rounded-full bg-orange-pale/30" })
      ] }),
      /* @__PURE__ */ jsx(Eyebrow, { children: CLOSING.eyebrow }),
      /* @__PURE__ */ jsx(Headline, { headline: CLOSING.headline, className: "heading max-w-[18ch]" }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-center gap-3", children: [
        /* @__PURE__ */ jsx(
          CopyButton,
          {
            text: SITE.install,
            label: "Install Qronos CLI",
            className: "border-orange-line bg-orange-soft px-6 py-3.5 text-[13px] font-extrabold text-orange hover:text-orange-pale",
            live: false
          }
        ),
        /* @__PURE__ */ jsx(Button, { href: "/docs", variant: "ghost", children: "Read the docs" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "font-mono text-[11px] text-muted", children: CLOSING.micro })
    ] }) })
  ] });
}
function useReveal(path) {
  useEffect(() => {
    if (typeof IntersectionObserver !== "function") return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        }
      },
      // Start a little before the element is fully on screen, so the motion
      // finishes as it settles rather than after the reader has arrived.
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );
    const watch = (root) => {
      for (const element of root.querySelectorAll("[data-reveal]:not(.is-in)")) {
        observer.observe(element);
      }
    };
    watch(document);
    const mutations = new MutationObserver((records) => {
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (node.nodeType !== Node.ELEMENT_NODE) continue;
          const element = node;
          if (element.matches("[data-reveal]")) observer.observe(element);
          watch(element);
        }
      }
    });
    mutations.observe(document.body, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      mutations.disconnect();
    };
  }, [path]);
}
const pages = {};
const listeners = /* @__PURE__ */ new Set();
function publish(next) {
  Object.assign(pages, next);
  for (const listener of listeners) listener();
}
function modulesFor(path) {
  if (path.startsWith("/docs/")) return ["DocPage"];
  if (path.startsWith("/docs")) return ["Docs"];
  if (path.startsWith("/changelog")) return ["Changelog"];
  return [];
}
function missingFor(path) {
  return modulesFor(path).some((key) => pages[key] === void 0);
}
async function preloadRoute(path) {
  const key = modulesFor(path)[0];
  if (!key || pages[key]) return;
  if (key === "DocPage") {
    const module = await Promise.resolve().then(() => DocPage$1);
    publish({ DocPage: module.DocPage });
  } else if (key === "Docs") {
    const module = await Promise.resolve().then(() => Docs$1);
    publish({ Docs: module.Docs });
  } else {
    const module = await Promise.resolve().then(() => Changelog$1);
    publish({ Changelog: module.Changelog });
  }
}
function registerPages(next) {
  publish(next);
}
function RouteFallback() {
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-[62vh] items-center justify-center", "aria-busy": "true", "aria-live": "polite", children: /* @__PURE__ */ jsx("p", { className: "font-mono text-[11px] uppercase tracking-[0.16em] text-muted", children: "Loading…" }) });
}
function useScrollReset(path) {
  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "");
    if (!hash) {
      window.scrollTo({ top: 0, behavior: "auto" });
      return;
    }
    const frame = requestAnimationFrame(() => {
      const target = document.getElementById(hash);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    return () => cancelAnimationFrame(frame);
  }, [path]);
}
function Site() {
  const [path] = useLocation();
  const [, rerender] = useState(0);
  useScrollReset(path);
  useReveal(path);
  useEffect(() => {
    const notify = () => rerender((value) => value + 1);
    listeners.add(notify);
    if (missingFor(path)) void preloadRoute(path);
    return () => {
      listeners.delete(notify);
    };
  }, [path]);
  const { Docs: Docs2, DocPage: DocPage2, Changelog: Changelog2 } = pages;
  return /* @__PURE__ */ jsxs("div", { className: "flex min-h-screen flex-col", children: [
    /* @__PURE__ */ jsx(
      "a",
      {
        href: "#main",
        className: "sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-[7px] focus:bg-card focus:px-3 focus:py-2 focus:font-mono focus:text-[11px]",
        children: "Skip to content"
      }
    ),
    /* @__PURE__ */ jsx(Seo, { path }),
    /* @__PURE__ */ jsx(Nav, {}),
    /* @__PURE__ */ jsx("main", { id: "main", className: "flex-1", children: /* @__PURE__ */ jsxs(Switch, { children: [
      /* @__PURE__ */ jsx(Route, { path: "/", component: Home }),
      /* @__PURE__ */ jsx(Route, { path: "/docs", children: Docs2 ? /* @__PURE__ */ jsx(Docs2, {}) : /* @__PURE__ */ jsx(RouteFallback, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/docs/:slug", children: (params) => DocPage2 ? /* @__PURE__ */ jsx(DocPage2, { slug: params.slug }) : /* @__PURE__ */ jsx(RouteFallback, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/changelog", children: Changelog2 ? /* @__PURE__ */ jsx(Changelog2, {}) : /* @__PURE__ */ jsx(RouteFallback, {}) }),
      /* @__PURE__ */ jsx(Route, { component: NotFound })
    ] }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
function App() {
  return /* @__PURE__ */ jsx(Site, {});
}
function escapeHtml(value) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function headTags(path) {
  const meta = metaFor(path);
  return [
    `<title>${escapeHtml(meta.title)}</title>`,
    `<meta name="description" content="${escapeHtml(meta.description)}" />`,
    `<link rel="canonical" href="${escapeHtml(meta.canonical)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="Qronos CLI" />`,
    `<meta property="og:title" content="${escapeHtml(meta.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(meta.description)}" />`,
    `<meta property="og:url" content="${escapeHtml(meta.canonical)}" />`,
    `<meta property="og:image" content="https://cli.qronos.me/og.png" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(meta.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(meta.description)}" />`,
    `<meta name="twitter:image" content="https://cli.qronos.me/og.png" />`
  ].join("\n    ");
}
function jsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Qronos CLI",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Windows, macOS, Linux",
    description: "An AI coding agent for the terminal, with a pausable workflow engine.",
    url: "https://cli.qronos.me",
    softwareVersion: "1.0.27",
    license: "https://opensource.org/licenses/MIT",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }
  };
  return `<script type="application/ld+json">${JSON.stringify(data)}<\/script>`;
}
registerPages({ Docs, DocPage, Changelog });
function render(path) {
  return new Promise((resolve, reject) => {
    let html = "";
    const stream = renderToPipeableStream(
      /* @__PURE__ */ jsx(StrictMode, { children: /* @__PURE__ */ jsx(Router, { ssrPath: path, children: /* @__PURE__ */ jsx(App, {}) }) }),
      {
        onAllReady() {
          stream.pipe({
            write(chunk) {
              html += typeof chunk === "string" ? chunk : new TextDecoder().decode(chunk);
              return true;
            },
            end() {
              resolve(html);
            },
            on() {
              return this;
            },
            once() {
              return this;
            },
            emit() {
              return true;
            }
          });
        },
        onError(error) {
          reject(error instanceof Error ? error : new Error(String(error)));
        }
      }
    );
  });
}
export {
  headTags,
  jsonLd,
  render
};
