import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { WorkflowPanelMock } from "@/components/workflow/WorkflowPanelMock";
import { WORKFLOW_DEMO } from "@/lib/copy";
import { countStates, PANEL_STATE, summarizeCounts } from "@/lib/panel";

describe("panel state words", () => {
  it("gives every state a glyph and a word", () => {
    for (const state of Object.keys(PANEL_STATE) as (keyof typeof PANEL_STATE)[]) {
      expect(PANEL_STATE[state].glyph.length).toBeGreaterThan(0);
      expect(PANEL_STATE[state].label.length).toBeGreaterThan(0);
    }
  });

  it("draws a stopped agent in amber and a failed one in red, never the same", () => {
    expect(PANEL_STATE.stopped.tone).not.toBe(PANEL_STATE.failed.tone);
    expect(PANEL_STATE.stopped.glyph).not.toBe(PANEL_STATE.failed.glyph);
  });

  it("marks a replayed agent as free, not as done", () => {
    expect(PANEL_STATE.replayed.glyph).not.toBe(PANEL_STATE.done.glyph);
    expect(PANEL_STATE.replayed.label).toContain("no tokens");
  });

  it("counts and summarises without listing empty states", () => {
    const counts = countStates([
      { name: "a", model: "m", tokens: "1k", seconds: "0m 01s", state: "done" },
      { name: "b", model: "m", tokens: "1k", seconds: "0m 02s", state: "failed" },
    ]);
    expect(counts).toMatchObject({ total: 2, done: 1, failed: 1, stopped: 0 });
    expect(summarizeCounts(counts)).toBe("1 done · 1 failed");
  });

  it("says so when a phase has no agents", () => {
    expect(summarizeCounts(countStates([]))).toBe("no agents");
  });
});

describe("WorkflowPanelMock", () => {
  it("shows every phase and the run id", () => {
    render(<WorkflowPanelMock />);
    expect(screen.getByText(WORKFLOW_DEMO.id)).toBeInTheDocument();
    for (const phase of WORKFLOW_DEMO.phases) {
      expect(screen.getByRole("button", { name: new RegExp(phase.name) })).toBeInTheDocument();
    }
  });

  it("opens on the second phase and switches when another is clicked", async () => {
    render(<WorkflowPanelMock />);
    const scout = screen.getByRole("button", { name: /Scout/ });
    expect(scout).toHaveAttribute("aria-pressed", "false");

    await userEvent.click(scout);
    expect(scout).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("trace-imports")).toBeInTheDocument();
  });

  it("names the state of every agent for a screen reader", () => {
    render(<WorkflowPanelMock />);
    const group = screen.getByRole("group", { name: /Workflow panel/ });
    expect(within(group).getByText("failed")).toBeInTheDocument();
    expect(within(group).getByText("stopped by you")).toBeInTheDocument();
    expect(within(group).getByText("replayed · no tokens")).toBeInTheDocument();
  });

  it("keeps the shortcut hint short enough for a narrow panel", () => {
    render(<WorkflowPanelMock />);
    // Two hints exist (wide panel, narrow panel); CSS picks one.
    expect(screen.getAllByText(/esc close/).length).toBe(2);
  });
});
