import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { App } from "@/App";
import { DOC_PAGES } from "@/content/docs/manifest";

/** A route change in this app is a history change plus a re-render. */
function renderAt(path: string) {
  window.history.pushState({}, "", path);
  return render(<App />);
}

describe("App routes", () => {
  it("renders the home page with the real headline and install command", () => {
    renderAt("/");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("A terminal that thinks in workflows.");
    expect(screen.getAllByText("npx qronos-cli").length).toBeGreaterThan(0);
    expect(screen.getByRole("navigation", { name: "Main" })).toBeInTheDocument();
  });

  it("gives the wordmark a name a screen reader can read as two words", () => {
    renderAt("/");
    const home = screen.getByRole("link", { name: /Qronos\s*CLI/ });
    expect(home).toHaveAttribute("href", "/");
  });

  it("renders the docs index with every page linked", () => {
    renderAt("/docs");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Everything the CLI does");
    for (const page of DOC_PAGES) {
      expect(screen.getAllByRole("link", { name: new RegExp(page.title) }).length).toBeGreaterThan(0);
    }
  });

  it("renders one docs page with its neighbours", () => {
    renderAt("/docs/workflows");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Workflows");
    expect(screen.getByRole("link", { name: /Previous/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Next/ })).toBeInTheDocument();
  });

  it("renders the 404 page for an unknown path", () => {
    renderAt("/does-not-exist");
    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("That page left the session.");
  });

  it("renders the changelog with the released version first", () => {
    renderAt("/changelog");
    expect(screen.getByText("v1.0.27")).toBeInTheDocument();
    expect(screen.getByText("latest")).toBeInTheDocument();
  });

  it("sets the document title for the route", () => {
    renderAt("/changelog");
    expect(document.title).toBe("Changelog — Qronos CLI");
  });
});
