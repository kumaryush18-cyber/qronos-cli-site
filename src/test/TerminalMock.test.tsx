import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TerminalMock } from "@/components/terminal/TerminalMock";
import { HERO_TERMINAL } from "@/lib/copy";
import type { TerminalLine } from "@/lib/terminal";

describe("TerminalMock", () => {
  it("draws the step, the command and the summary of the hero capture", () => {
    render(<TerminalMock lines={HERO_TERMINAL} />);
    // The figcaption repeats every line for screen readers, so each string can
    // appear twice: once drawn, once announced.
    expect(screen.getAllByText(/Run the test suite/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/npm test -- --watch=false/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Churned for 2m 30s/).length).toBeGreaterThan(0);
  });

  it("gives the block a text alternative with every line in it", () => {
    render(<TerminalMock lines={HERO_TERMINAL} />);
    const caption = screen.getByText(/A terminal running Qronos CLI/).closest("figcaption");
    expect(caption).toHaveTextContent("2469 passed");
  });

  it("cuts a line that is longer than the mock", () => {
    const long: TerminalLine[] = [{ kind: "output", text: "y".repeat(200) }];
    const { container } = render(<TerminalMock lines={long} />);
    const drawn = container.querySelector(".whitespace-pre")?.textContent ?? "";
    expect(drawn).toContain("...");
    expect(drawn.length).toBeLessThanOrEqual(96);
  });

  it("shows the seconds only when the step has them", () => {
    const { rerender } = render(<TerminalMock lines={[{ kind: "step", text: "Think" }]} />);
    expect(screen.queryByText(/·/)).toBeNull();

    rerender(<TerminalMock lines={[{ kind: "step", text: "Think", seconds: 4 }]} />);
    expect(screen.getByText("· 4s")).toBeInTheDocument();
  });

  it("colours the dot by state without relying on colour alone", () => {
    const { container } = render(<TerminalMock lines={[{ kind: "step", text: "Fail", status: "fail" }]} />);
    expect(container.querySelector(".bg-fail")).not.toBeNull();
    expect(screen.getAllByText("Fail").length).toBeGreaterThan(0);
  });
});
