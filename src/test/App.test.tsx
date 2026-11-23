import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { App } from "@/App";
import { DOC_PAGES } from "@/content/docs/manifest";

/** A route change in this app is a history change plus a re-render. */
function renderAt(path: string) {
  window.history.pushState({}, "", path);
  return render(<App />);
}

/**
 * Docs and changelog routes are lazy: their chunk resolves after the first paint,
 * so these tests wait for the real heading instead of assuming it is already there.
 */
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

  it("renders the docs index with every page linked", async () => {
    renderAt("/docs");
    expect(await screen.findByRole("heading", { level: 1 }, { timeout: 5000 })).toHaveTextContent("Everything the CLI does");
    for (const page of DOC_PAGES) {
      expect(screen.getAllByRole("link", { name: new RegExp(page.title) }).length).toBeGreaterThan(0);
    }
  });

  it("renders one docs page with its neighbours and its sections", async () => {
    renderAt("/docs/workflows");
    expect(await screen.findByRole("heading", { level: 1 }, { timeout: 5000 })).toHaveTextContent("Workflows");
    expect(screen.getByRole("link", { name: /Previous/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Next/ })).toBeInTheDocument();
    // The table of contents is built from the MDX, so a real section must be there.
    expect(screen.getByRole("navigation", { name: "On this page" })).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 2 }).length).toBeGreaterThan(2);
  });

  it("renders the 404 page for an unknown path", () => {
    renderAt("/does-not-exist");
    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("That page left the session.");
  });

  it("renders the 404 page for a docs slug with no body", async () => {
    renderAt("/docs/not-a-page");
    expect(await screen.findByText("404", undefined, { timeout: 5000 })).toBeInTheDocument();
  });

  it("renders the changelog with the released version first", async () => {
    renderAt("/changelog");
    expect(await screen.findByText("v1.0.27", undefined, { timeout: 5000 })).toBeInTheDocument();
    expect(screen.getByText("latest")).toBeInTheDocument();
  });

  it("sets the document title for the route", () => {
    renderAt("/changelog");
    expect(document.title).toBe("Changelog — Qronos CLI");
  });
});
