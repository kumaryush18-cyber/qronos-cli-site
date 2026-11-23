import { metaFor } from "./seo";

/** Escape text for an HTML attribute or a text node. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * The head tags for one route, as HTML.
 *
 * The app writes the same values from `Seo` after hydration; this function is
 * what the prerender step puts in the file, so a crawler or a link preview sees
 * a real title and a real description without running any JavaScript.
 */
export function headTags(path: string): string {
  const meta = metaFor(path);
  return [
    `<title>${escapeHtml(meta.title)}</title>`,
    `<meta name="description" content="${escapeHtml(meta.description)}" />`,
    `<link rel="canonical" href="${escapeHtml(meta.canonical)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="Qronos CLI" />`,
    `<meta property="og:title" content="${escapeHtml(meta.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(meta.description)}" />`,
    `<meta property="og:url" content="${escapeHtml(meta.canonical)}" />`,
    `<meta property="og:image" content="https://cli.qronos.me/og.png" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(meta.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(meta.description)}" />`,
    `<meta name="twitter:image" content="https://cli.qronos.me/og.png" />`,
  ].join("\n    ");
}

/** A small JSON-LD block describing the product. Injected once per page. */
export function jsonLd(): string {
  const data = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Qronos CLI",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Windows, macOS, Linux",
    description: "An AI coding agent for the terminal, with a pausable workflow engine.",
    url: "https://cli.qronos.me",
    softwareVersion: "1.0.27",
    license: "https://opensource.org/licenses/MIT",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };
  return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
}
