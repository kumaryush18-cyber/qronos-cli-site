import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Reveal } from "@/components/ui/Reveal";

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
