import { Children, isValidElement, type ComponentType, type ReactElement, type ReactNode } from "react";
import { Link } from "wouter";
import { Callout } from "@/components/ui/Callout";
import { CodePanel } from "@/components/ui/CodePanel";
import { cn } from "@/lib/cn";

/**
 * The MDX component map.
 *
 * Content files may use markdown only: headings, paragraphs, lists, tables,
 * fences, links and blockquotes. Each one is mapped to a styled component here,
 * so a page can look right without a single className in the content.
 */

/** Pull the plain text out of a React tree, for the code panel's copy button. */
export function textOf(node: ReactNode): string {
  if (node === null || node === undefined || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (isValidElement(node)) {
    const element = node as ReactElement<{ children?: ReactNode }>;
    return textOf(element.props.children);
  }
  return "";
}

function CodeBlock({ children }: { children?: ReactNode }) {
  const text = textOf(children).replace(/\n+$/, "");
  const child = Children.toArray(children)[0];
  const language =
    isValidElement(child) && typeof child.props === "object" && child.props !== null
      ? ((child.props as { className?: string }).className ?? "").replace("language-", "")
      : "";

  return <CodePanel code={text} label={language || "shell"} className="my-5" />;
}

function Anchor({ href = "", children }: { href?: string; children?: ReactNode }) {
  const external = /^https?:\/\//.test(href);
  const plain = cn("text-orange underline underline-offset-4 hover:text-orange-pale");

  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer noopener" className={plain}>
        {children}
      </a>
    );
  }

  if (href.startsWith("/")) {
    return (
      <Link href={href} className={plain}>
        {children}
      </Link>
    );
  }

  // Same-page anchor: let the browser scroll, keep our styling.
  return (
    <a href={href} className={plain}>
      {children}
    </a>
  );
}

export const mdxComponents: Record<string, ComponentType<Record<string, unknown>>> = {
  h1: ({ children }) => (
    <h1 className="mt-10 mb-4 text-[clamp(28px,3.4vw,38px)] leading-[1.08] tracking-[-0.05em] first:mt-0">
      {children as ReactNode}
    </h1>
  ),
  h2: ({ children, id }) => (
    <h2
      id={id as string | undefined}
      className="mt-12 mb-3 scroll-mt-[100px] border-t border-line pt-8 text-[clamp(21px,2.4vw,26px)] tracking-[-0.04em] first:mt-0 first:border-0 first:pt-0"
    >
      {children as ReactNode}
    </h2>
  ),
  h3: ({ children, id }) => (
    <h3 id={id as string | undefined} className="mt-8 mb-2 scroll-mt-[100px] text-[17px] tracking-[-0.03em]">
      {children as ReactNode}
    </h3>
  ),
  p: ({ children }) => <p className="my-4 text-[14px] leading-[1.8] text-muted">{children as ReactNode}</p>,
  ul: ({ children }) => (
    <ul className="my-4 flex list-disc flex-col gap-2 pl-5 text-[14px] leading-[1.8] text-muted marker:text-orange">
      {children as ReactNode}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="my-4 flex list-decimal flex-col gap-2 pl-5 text-[14px] leading-[1.8] text-muted marker:text-orange">
      {children as ReactNode}
    </ol>
  ),
  li: ({ children }) => <li className="pl-1">{children as ReactNode}</li>,
  strong: ({ children }) => <strong className="font-bold text-ink">{children as ReactNode}</strong>,
  em: ({ children }) => <em className="font-serif italic text-orange-pale">{children as ReactNode}</em>,
  a: Anchor as ComponentType<Record<string, unknown>>,
  code: ({ children }) => (
    <code className="rounded-[5px] border border-line bg-card px-1.5 py-0.5 font-mono text-[12px] text-ink">
      {children as ReactNode}
    </code>
  ),
  pre: CodeBlock,
  hr: () => <hr className="my-10 border-line" />,
  blockquote: ({ children }) => <Callout tone="note">{children as ReactNode}</Callout>,
  table: ({ children }) => (
    <div
      className="my-6 overflow-x-auto rounded-card border border-line"
      // A sideways-scrolling region must be reachable from the keyboard.
      tabIndex={0}
      role="group"
    >
      <table className="w-full border-collapse text-left text-[13px]">{children as ReactNode}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-card">{children as ReactNode}</thead>,
  th: ({ children }) => (
    <th className="border-b border-line px-3 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-muted">
      {children as ReactNode}
    </th>
  ),
  td: ({ children }) => <td className="border-b border-line/70 px-3 py-2 align-top text-muted">{children as ReactNode}</td>,
};
