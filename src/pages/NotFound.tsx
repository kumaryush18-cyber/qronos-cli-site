import { Shell } from "@/components/layout/Shell";
import { Button } from "@/components/ui/Button";
import { NOT_FOUND } from "@/lib/copy";

export function NotFound() {
  return (
    <Shell>
      <div className="flex max-w-[640px] flex-col items-start gap-5 py-24 sm:py-32">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-orange">404</p>
        <h1 className="heading">
          {NOT_FOUND.headline.before}
          <em className="serif-accent">{NOT_FOUND.headline.accent}</em>
          {NOT_FOUND.headline.after}
        </h1>
        <p className="lead">{NOT_FOUND.body}</p>
        <div className="flex flex-wrap gap-3">
          <Button href="/docs">Docs</Button>
          <Button href="/" variant="ghost">
            Home
          </Button>
        </div>
      </div>
    </Shell>
  );
}
