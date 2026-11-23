import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CompareTable } from "@/components/ui/CompareTable";
import { COMPARISON } from "@/lib/copy";

describe("CompareTable", () => {
  it("names all four products in both layouts", () => {
    render(<CompareTable rows={COMPARISON.rows} footnote={COMPARISON.footnote} />);
    for (const name of ["Qronos CLI", "Claude Code", "Aider", "opencode"]) {
      expect(screen.getAllByText(name).length).toBeGreaterThanOrEqual(2);
    }
  });

  it("draws one row per feature in the table layout", () => {
    const { container } = render(<CompareTable rows={COMPARISON.rows} footnote={COMPARISON.footnote} />);
    expect(container.querySelectorAll("table tbody tr")).toHaveLength(COMPARISON.rows.length);
    expect(container.querySelectorAll("ul > li")).toHaveLength(COMPARISON.rows.length);
  });

  it("never relies on a colour alone: every cell has a word for a screen reader", () => {
    const { container } = render(<CompareTable rows={COMPARISON.rows} footnote={COMPARISON.footnote} />);
    const srWords = [...container.querySelectorAll("table td .sr-only")].map((node) => node.textContent);
    expect(srWords.length).toBe(COMPARISON.rows.length * 4);
    for (const word of srWords) expect(["Yes", "No", "Partly"]).toContain(word);
  });

  it("shows the date of the check", () => {
    render(<CompareTable rows={COMPARISON.rows} footnote={COMPARISON.footnote} />);
    expect(screen.getByText(/Checked \d{4}-\d{2}/)).toBeInTheDocument();
  });

  it("does not use a negative margin, which made the page scroll sideways on a phone", () => {
    const { container } = render(<CompareTable rows={COMPARISON.rows} footnote={COMPARISON.footnote} />);
    expect(container.innerHTML).not.toContain("-mx-");
  });
});
