import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Tabs } from "@/components/ui/Tabs";

const tabs = [
  { id: "one", label: "One", panel: <p>first panel</p> },
  { id: "two", label: "Two", panel: <p>second panel</p> },
  { id: "three", label: "Three", panel: <p>third panel</p> },
];

describe("Tabs", () => {
  it("opens the first tab by default and shows only its panel", () => {
    render(<Tabs tabs={tabs} label="Example" />);
    expect(screen.getByRole("tab", { name: "One" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("first panel")).toBeInTheDocument();
    expect(screen.queryByText("second panel")).toBeNull();
  });

  it("opens the tab that was clicked", async () => {
    render(<Tabs tabs={tabs} label="Example" />);
    await userEvent.click(screen.getByRole("tab", { name: "Two" }));
    expect(screen.getByText("second panel")).toBeInTheDocument();
    expect(screen.queryByText("first panel")).toBeNull();
  });

  it("moves with the arrow keys and wraps at the ends", async () => {
    render(<Tabs tabs={tabs} label="Example" />);
    const first = screen.getByRole("tab", { name: "One" });
    first.focus();

    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Two" })).toHaveAttribute("aria-selected", "true");

    await userEvent.keyboard("{ArrowLeft}");
    await userEvent.keyboard("{ArrowLeft}");
    expect(screen.getByRole("tab", { name: "Three" })).toHaveAttribute("aria-selected", "true");

    await userEvent.keyboard("{Home}");
    expect(screen.getByRole("tab", { name: "One" })).toHaveAttribute("aria-selected", "true");

    await userEvent.keyboard("{End}");
    expect(screen.getByRole("tab", { name: "Three" })).toHaveAttribute("aria-selected", "true");
  });

  it("keeps only the selected tab in the tab order", async () => {
    render(<Tabs tabs={tabs} label="Example" />);
    expect(screen.getByRole("tab", { name: "One" })).toHaveAttribute("tabindex", "0");
    expect(screen.getByRole("tab", { name: "Two" })).toHaveAttribute("tabindex", "-1");
  });

  it("links each tab to its panel", async () => {
    render(<Tabs tabs={tabs} label="Example" />);
    const tab = screen.getByRole("tab", { name: "One" });
    const panel = screen.getByRole("tabpanel");
    expect(tab).toHaveAttribute("aria-controls", panel.id);
    expect(panel).toHaveAttribute("aria-labelledby", tab.id);
  });

  it("honours a default tab", () => {
    render(<Tabs tabs={tabs} label="Example" defaultId="three" />);
    expect(screen.getByText("third panel")).toBeInTheDocument();
  });
});
