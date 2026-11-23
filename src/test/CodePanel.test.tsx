import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CodePanel } from "@/components/ui/CodePanel";

afterEach(() => {
  Reflect.deleteProperty(navigator, "clipboard");
  vi.restoreAllMocks();
});

describe("CodePanel", () => {
  it("draws every line of the code", () => {
    render(<CodePanel code={"qronos --provider openai\nqronos --model llama3"} label="shell" />);
    expect(screen.getByText("qronos --provider openai")).toBeInTheDocument();
    expect(screen.getByText("qronos --model llama3")).toBeInTheDocument();
  });

  it("shows its label in the top bar", () => {
    render(<CodePanel code="npx qronos-cli" label="first run" />);
    expect(screen.getByText("first run")).toBeInTheDocument();
  });

  it("copies the code with no trailing newline", async () => {
    const writeText = vi.fn(async () => {});
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } });

    render(<CodePanel code={"npx qronos-cli\n"} />);
    await userEvent.click(screen.getByRole("button", { name: /copy/i }));

    await waitFor(() => expect(writeText).toHaveBeenCalledWith("npx qronos-cli"));
  });

  it("keeps the code focusable so it can be scrolled from the keyboard", () => {
    render(<CodePanel code="npx qronos-cli" />);
    expect(screen.getByText("npx qronos-cli").closest("pre")).toHaveAttribute("tabindex", "0");
  });

  it("renders an empty line as a space, not a collapsed gap", () => {
    const { container } = render(<CodePanel code={"one\n\ntwo"} />);
    const lines = container.querySelectorAll("pre code > span");
    expect(lines).toHaveLength(3);
    expect(lines[1]?.textContent).toBe(" ");
  });
});
