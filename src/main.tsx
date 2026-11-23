import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { App, preloadRoute } from "./App";
import "./styles/index.css";

const root = document.getElementById("root");
if (!root) throw new Error("#root is missing from index.html");

const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// Prerendered pages arrive with real markup: hydrate it instead of throwing it
// away and repainting. A blank root (the dev server) still gets a mount.
if (root.childElementCount > 0) {
  preloadRoute(window.location.pathname)
    .catch(() => undefined)
    .then(() => hydrateRoot(root, app));
} else {
  createRoot(root).render(app);
}
