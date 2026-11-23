import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CopyButton } from "@/components/ui/CopyButton";

function stubClipboard(writeText: (text: string) => Promise<void>) {
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText: vi.fn(writeText) },
  });
}

afterEach(() => {
  Reflect.deleteProperty(navigator, "clipboard");
  vi.restoreAllMocks();
});

describe("CopyButton", () => {
  it("starts with the quiet label", () => {
    render(<CopyButton text="npx qronos-cli" />);
    expect(screen.getByRole("button", { name: /copy/i })).toHaveTextContent("Copy");
  });

  it("says Copied only after the clipboard resolves", async () => {
    stubClipboard(async () => {});
    render(<CopyButton text="npx qronos-cli" />);

    await userEvent.click(screen.getByRole("button"));

    await waitFor(() => expect(screen.getByRole("button")).toHaveTextContent("Copied"));
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("npx qronos-cli");
  });

  it("says Copy failed when the clipboard rejects, and never Copied", async () => {
    stubClipboard(async () => {
      throw new Error("denied");
    });
    render(<CopyButton text="npx qronos-cli" />);

    await userEvent.click(screen.getByRole("button"));

    await waitFor(() => expect(screen.getByRole("button")).toHaveTextContent("Copy failed"));
    expect(screen.getByRole("button")).not.toHaveTextContent("Copied");
  });

  it("tells a screen reader what happened", async () => {
    stubClipboard(async () => {});
    render(<CopyButton text="npx qronos-cli" />);

    await userEvent.click(screen.getByRole("button"));
    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("Copied to clipboard"));
  });

  it("can stay silent for a decorative chip", async () => {
    stubClipboard(async () => {});
    render(<CopyButton text="npx qronos-cli" live={false} />);

    await userEvent.click(screen.getByRole("button"));
    await waitFor(() => expect(screen.getByRole("button")).toHaveTextContent("Copied"));
    expect(screen.queryByRole("status")).toBeNull();
  });
});
