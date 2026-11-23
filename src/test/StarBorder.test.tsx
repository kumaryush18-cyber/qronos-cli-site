import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { StarBorder } from "@/components/ui/StarBorder";

/** jsdom reports every box as 0x0, so the measurement is faked here. */
function withBox(width: number, height: number) {
  const spyWidth = vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockReturnValue(width);
  const spyHeight = vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockReturnValue(height);
  return () => {
    spyWidth.mockRestore();
    spyHeight.mockRestore();
  };
}

describe("StarBorder", () => {
  it("renders the children whether or not it can measure itself", () => {
    const { getByText } = render(
      <StarBorder>
        <p>inside</p>
      </StarBorder>,
    );
    expect(getByText("inside")).toBeInTheDocument();
  });

  it("draws the light once it knows the size of the box", () => {
    const restore = withBox(320, 200);
    const { container } = render(
      <StarBorder duration={5} width={120}>
        <p>inside</p>
      </StarBorder>,
    );
    restore();

    const wrapper = container.firstElementChild as HTMLElement;
    // The path is real pixels, because offset-path cannot guess them.
    expect(wrapper.style.getPropertyValue("--star-path")).toContain("M 0 0 H 320 V 200 H 0 V 0");
    expect(wrapper.style.getPropertyValue("--star-duration")).toBe("5");
    expect(wrapper.style.getPropertyValue("--star-width")).toBe("120px");
    expect(wrapper.querySelector(".star-light")).not.toBeNull();
  });

  it("says nothing to a screen reader", () => {
    const restore = withBox(100, 100);
    const { container } = render(
      <StarBorder>
        <p>inside</p>
      </StarBorder>,
    );
    restore();
    expect(container.querySelector(".star-light")?.getAttribute("aria-hidden")).toBeTruthy();
  });
});
