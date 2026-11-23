import { Eyebrow } from "@/components/layout/Eyebrow";
import { Shell } from "@/components/layout/Shell";
import { Badge } from "@/components/ui/Badge";
import { RELEASES } from "@/content/changelog";

export function Changelog() {
  return (
    <Shell>
      <div className="flex max-w-[760px] flex-col gap-4 py-14">
        <Eyebrow>Changelog</Eyebrow>
        <h1 className="heading">Every release, newest first.</h1>
        <p className="lead">
          What changed and why. The long version, including every test that proved it, lives in the CLI repository.
        </p>
      </div>

      <ol className="flex flex-col gap-10 pb-16">
        {RELEASES.map((release, index) => (
          <li
            key={release.version}
            className="grid gap-4 border-t border-line pt-8 lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-10"
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <h2 className="font-mono text-[15px] font-bold text-ink">v{release.version}</h2>
                {index === 0 ? <Badge tone="orange">latest</Badge> : null}
              </div>
              <time className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">{release.date}</time>
            </div>

            <div className="flex min-w-0 flex-col gap-3">
              <p className="text-[15px] font-bold text-ink">{release.summary}</p>
              <ul className="flex flex-col gap-2">
                {release.notes.map((note) => (
                  <li key={note} className="flex gap-2.5 text-[13.5px] leading-[1.75] text-muted">
                    <span aria-hidden className="mt-[9px] size-1 shrink-0 rounded-full bg-orange" />
                    {note}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </Shell>
  );
}
