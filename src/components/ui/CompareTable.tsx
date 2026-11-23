import { Check, Minus, MoveRight } from "lucide-react";
import type { CompareCell, CompareRow } from "@/lib/copy";
import { cn } from "@/lib/cn";

const HEADERS = ["Qronos CLI", "Claude Code", "Aider", "opencode"] as const;

function CellMark({ cell }: { cell: CompareCell }) {
  const Icon = cell.state === "yes" ? Check : cell.state === "no" ? Minus : MoveRight;
  const word = cell.state === "yes" ? "Yes" : cell.state === "no" ? "No" : "Partly";
  const tone = cell.state === "yes" ? "text-ok" : cell.state === "no" ? "text-fail" : "text-orange-pale";

  return (
    <span className="inline-flex flex-wrap items-center gap-1.5">
      <Icon size={15} strokeWidth={2.5} aria-hidden className={tone} />
      <span className="sr-only">{word}</span>
      {cell.note ? <span className="font-mono text-[11px] text-muted">{cell.note}</span> : null}
    </span>
  );
}

export interface CompareTableProps {
  readonly rows: readonly CompareRow[];
  readonly footnote: string;
  readonly className?: string;
}

/**
 * A feature table, not a benchmark.
 *
 * Two layouts, one data source: a real table from 640px up, and one card per
 * feature below that. On a phone a five-column table is unreadable, and letting
 * it scroll sideways made the whole page scroll sideways too.
 */
export function CompareTable({ rows, footnote, className }: CompareTableProps) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {/* Desktop: a table, so the columns can be compared by eye. */}
      <table className="hidden w-full border-collapse text-left sm:table">
        <caption className="sr-only">Feature comparison: Qronos CLI, Claude Code, Aider and opencode.</caption>
        <thead>
          <tr className="border-b border-line">
            <th scope="col" className="py-3 pr-4 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-muted">
              Feature
            </th>
            {HEADERS.map((name) => (
              <th
                key={name}
                scope="col"
                className={cn(
                  "py-3 pr-4 font-mono text-[11px] font-bold uppercase tracking-[0.16em]",
                  name === "Qronos CLI" ? "text-orange" : "text-muted",
                )}
              >
                {name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b border-line/70">
              <th scope="row" className="py-3.5 pr-4 text-[13px] font-medium text-ink">
                {row.label}
              </th>
              <td className="py-3.5 pr-4">
                <CellMark cell={row.qronos} />
              </td>
              <td className="py-3.5 pr-4">
                <CellMark cell={row.claudeCode} />
              </td>
              <td className="py-3.5 pr-4">
                <CellMark cell={row.aider} />
              </td>
              <td className="py-3.5 pr-4">
                <CellMark cell={row.opencode} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Phone: one card per feature, each product named next to its mark. */}
      <ul className="flex flex-col gap-3 sm:hidden">
        {rows.map((row) => (
          <li key={row.label} className="rounded-card border border-line bg-card p-4">
            <p className="text-[13px] font-bold text-ink">{row.label}</p>
            <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2">
              {[
                ["Qronos CLI", row.qronos],
                ["Claude Code", row.claudeCode],
                ["Aider", row.aider],
                ["opencode", row.opencode],
              ].map(([name, cell]) => (
                <div key={name as string} className="flex flex-col gap-0.5">
                  <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">{name as string}</dt>
                  <dd className="text-[12px]">
                    <CellMark cell={cell as CompareCell} />
                  </dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>

      <p className="font-mono text-[11px] leading-relaxed text-muted">{footnote}</p>
    </div>
  );
}
