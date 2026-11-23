import { CopyButton } from "@/components/ui/CopyButton";
import { cn } from "@/lib/cn";

export interface CodePanelProps {
  readonly code: string;
  /** Mono label in the top bar, e.g. "shell" or "providers". */
  readonly label?: string;
  readonly className?: string;
}

/**
 * A code block with one honest copy button. Lines are rendered as text, never
 * with dangerouslySetInnerHTML, so a copy of the code is also a copy of what is
 * on screen.
 */
export function CodePanel({ code, label = "shell", className }: CodePanelProps) {
  // The copy must match the screen: a trailing newline in the source would end
  // up pasted into a shell, which is harmless, but a test caught us copying the
  // untrimmed string while the panel drew the trimmed one.
  const text = code.replace(/\n+$/, "");
  const lines = text.split("\n");

  return (
    <div className={cn("overflow-hidden rounded-card border border-line bg-card", className)}>
      <div className="flex items-center gap-3 border-b border-line px-4 py-2">
        <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">{label}</span>
        <CopyButton text={text} label="Copy" className="ml-auto border-transparent px-2 py-1" />
      </div>

      <pre className="overflow-x-auto px-4 py-3.5 font-mono text-[12px] leading-[1.9] text-ink" tabIndex={0}>
        <code>
          {lines.map((line, index) => (
            <span key={index} className="block">
              {line === "" ? " " : line}
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}
