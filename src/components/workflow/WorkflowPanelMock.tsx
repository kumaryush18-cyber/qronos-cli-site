import { useState } from "react";
import { WORKFLOW_DEMO, WORKFLOWS, type PanelPhase } from "@/lib/copy";
import { cn } from "@/lib/cn";
import { compactCounts, countStates, PANEL_STATE, summarizeCounts } from "@/lib/panel";

/**
 * The workflow panel, drawn from data.
 *
 * Two columns, like the real panel: phases on the left, the selected phase's
 * agents on the right. Clicking a phase is a real button with `aria-pressed`,
 * so the demo works with a keyboard and says which phase is selected.
 */
export function WorkflowPanelMock({ className }: { className?: string }) {
  const [selectedId, setSelectedId] = useState(WORKFLOW_DEMO.phases[1]?.id ?? WORKFLOW_DEMO.phases[0]?.id);
  const selected = WORKFLOW_DEMO.phases.find((phase) => phase.id === selectedId) ?? WORKFLOW_DEMO.phases[0];

  return (
    <div
      className={cn("overflow-hidden rounded-panel border border-line bg-card", className)}
      // The whole block is a picture of a screen, not a real control panel.
      role="group"
      aria-label="Workflow panel example"
    >
      <div className="flex items-center gap-2 border-b border-line px-4 py-2.5">
        <span className="relative flex size-1.5">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-orange opacity-60" />
          <span className="relative inline-flex size-1.5 rounded-full bg-orange" />
        </span>
        <span className="font-mono text-[11px] text-ink">{WORKFLOW_DEMO.id}</span>
        <span className="font-mono text-[11px] text-muted">· live</span>
        <span className="ml-auto font-mono text-[11px] text-muted">{WORKFLOW_DEMO.elapsed}</span>
      </div>

      <div className="grid gap-0 sm:grid-cols-[0.85fr_1.15fr]">
        <ul className="flex flex-col border-b border-line sm:border-b-0 sm:border-r">
          {WORKFLOW_DEMO.phases.map((phase) => (
            <PhaseRow
              key={phase.id}
              phase={phase}
              active={phase.id === selected?.id}
              onSelect={() => setSelectedId(phase.id)}
            />
          ))}
        </ul>

        <div className="p-3">
          {selected ? <AgentList phase={selected} /> : null}
        </div>
      </div>

      <p className="border-t border-line px-4 py-2 font-mono text-[11px] leading-relaxed text-muted">
        <span className="hidden sm:inline">{WORKFLOWS.panelHint}</span>
        <span className="sm:hidden">{WORKFLOWS.panelHintShort}</span>
      </p>
    </div>
  );
}

function PhaseRow({ phase, active, onSelect }: { phase: PanelPhase; active: boolean; onSelect: () => void }) {
  const counts = countStates(phase.agents);

  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={active}
        className={cn(
          "flex min-h-[52px] w-full flex-col items-start justify-center gap-0.5 px-4 py-2 text-left transition-colors duration-[160ms]",
          active ? "bg-orange-soft" : "hover:bg-paper",
        )}
      >
        <span className="flex w-full items-center gap-2">
          <span className={cn("min-w-0 truncate text-[12.5px] font-bold", active ? "text-orange" : "text-ink")}>
            {phase.name}
          </span>
          <span
            aria-hidden
            className="shrink-0 font-mono text-[11px] tracking-tight text-muted"
          >
            {compactCounts(counts)
              .map((entry) => entry.glyph)
              .join(" ")}
          </span>
          <span className="sr-only">{summarizeCounts(counts)}</span>
          <span className="ml-auto shrink-0 font-mono text-[11px] text-muted">{phase.tokens}</span>
        </span>
      </button>
    </li>
  );
}

function AgentList({ phase }: { phase: PanelPhase }) {
  return (
    <ul className="flex flex-col divide-y divide-line/70">
      {phase.agents.map((agent) => {
        const state = PANEL_STATE[agent.state];
        return (
          <li key={agent.name} className="flex items-center gap-2 py-2 first:pt-0 last:pb-0">
            <span aria-hidden className={cn("w-3 shrink-0 text-center font-mono text-[12px]", state.tone)}>
              {state.glyph}
            </span>
            <span className="min-w-0 truncate text-[12px] text-ink">{agent.name}</span>
            <span className="ml-auto shrink-0 font-mono text-[11px] text-muted">{agent.model}</span>
            <span className="w-9 shrink-0 text-right font-mono text-[11px] text-muted">{agent.tokens}</span>
            <span className="sr-only">{state.label}</span>
          </li>
        );
      })}
    </ul>
  );
}
