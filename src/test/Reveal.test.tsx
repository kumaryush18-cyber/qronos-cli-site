import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { MotionSwitch } from "@/components/layout/MotionSwitch";
import { Reveal } from "@/components/ui/Reveal";

afterEach(() => {
  delete document.documentElement.dataset.motion;
  localStorage.clear();
});

describe("Reveal", () => {
  it("marks the block for the observer and keeps the text readable", () => {
    render(<Reveal>Some text</Reveal>);
    const block = screen.getByText("Some text");
    expect(block).toHaveAttribute("data-reveal");
    expect(block).toHaveAttribute("data-i", "0");
  });

  it("writes the stagger as a data attribute, never as an inline style", () => {
    render(<Reveal index={3}>Third</Reveal>);
    const block = screen.getByText("Third");
    expect(block).toHaveAttribute("data-i", "3");
    // A custom property in `style` serialises differently on the server, and that
    // difference alone failed hydration once.
    expect(block.getAttribute("style")).toBeNull();
  });

  it("caps the stagger so a long list does not wait a second", () => {
    render(<Reveal index={42}>Late</Reveal>);
    expect(screen.getByText("Late")).toHaveAttribute("data-i", "8");
  });

  it("can render as a list item without nesting a div in a ul", () => {
    render(
      <ul>
        <Reveal as="li" index={1}>
          Item
        </Reveal>
      </ul>,
    );
    expect(screen.getByRole("listitem")).toHaveTextContent("Item");
  });
});

describe("the motion switch", () => {
  it("starts on when nothing was stored", () => {
    render(<MotionSwitch />);
    expect(screen.getByRole("button").textContent).toBe("Motion: on");
    expect(screen.getByRole("button").getAttribute("aria-pressed")).toBe("false");
  });

  it("stops motion and remembers it", async () => {
    render(<MotionSwitch />);
    await userEvent.click(screen.getByRole("button"));
    expect(document.documentElement.dataset.motion).toBe("off");
    expect(localStorage.getItem("qronos-motion")).toBe("off");
    expect(screen.getByRole("button").textContent).toBe("Motion: off");
    expect(screen.getByRole("button").getAttribute("aria-pressed")).toBe("true");
  });
});
