import { useEffect } from "react";
import { metaFor, type PageMeta } from "@/lib/seo";

function setMetaTag(doc: Document, key: "name" | "property", value: string, content: string) {
  let tag = doc.head.querySelector<HTMLMetaElement>(`meta[${key}="${value}"]`);
  if (!tag) {
    tag = doc.createElement("meta");
    tag.setAttribute(key, value);
    doc.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

function setLinkTag(doc: Document, rel: string, href: string) {
  let tag = doc.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!tag) {
    tag = doc.createElement("link");
    tag.rel = rel;
    doc.head.appendChild(tag);
  }
  tag.href = href;
}

/** Write one page's metadata into a document. Pure enough to unit test. */
export function applyMeta(meta: PageMeta, doc: Document = document) {
  doc.title = meta.title;
  setMetaTag(doc, "name", "description", meta.description);
  setLinkTag(doc, "canonical", meta.canonical);
  setMetaTag(doc, "property", "og:type", "website");
  setMetaTag(doc, "property", "og:title", meta.title);
  setMetaTag(doc, "property", "og:description", meta.description);
  setMetaTag(doc, "property", "og:url", meta.canonical);
  setMetaTag(doc, "name", "twitter:card", "summary_large_image");
}

export interface SeoProps {
  /** Current path. The component derives everything else from it. */
  readonly path: string;
}

/**
 * Keeps the document head in step with the route. In P4 the prerender step runs
 * the same `applyMeta` against a real DOM, so there is one implementation of the
 * metadata, not two that can drift.
 */
export function Seo({ path }: SeoProps) {
  useEffect(() => {
    applyMeta(metaFor(path));
  }, [path]);

  return null;
}
