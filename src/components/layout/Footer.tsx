import { Link } from "wouter";
import { MotionSwitch } from "@/components/layout/MotionSwitch";
import { Shell } from "@/components/layout/Shell";
import { FOOTER } from "@/lib/copy";
import { SITE } from "@/lib/site";

const EXTERNAL = /^https?:\/\//;

/** Four link columns and one honest legal line. */
export function Footer() {
  return (
    <footer className="border-t border-line py-14">
      <Shell>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(4,minmax(0,1fr))]">
          <div className="flex flex-col gap-3">
            <div className="flex items-baseline gap-2">
              <span className="text-[17px] font-extrabold tracking-[-0.05em]">{SITE.wordmark.lead}</span>
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-muted">
                {SITE.wordmark.trailing}
              </span>
            </div>
            <p className="max-w-[24ch] text-[13px] leading-relaxed text-muted">
              An AI coding agent for the terminal. MIT licensed.
            </p>
          </div>

          {FOOTER.columns.map((column) => (
            <nav key={column.title} aria-label={column.title} className="flex flex-col gap-3">
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-ink">{column.title}</p>
              <ul className="flex flex-col gap-2">
                {column.links.map((link) => (
                  <li key={link.label}>
                    {EXTERNAL.test(link.to) ? (
                      <a
                        href={link.to}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="text-[13px] text-muted transition-colors duration-[160ms] hover:text-ink"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.to}
                        className="text-[13px] text-muted transition-colors duration-[160ms] hover:text-ink"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
          <p className="font-mono text-[11px] text-muted">{FOOTER.legal}</p>
          <MotionSwitch />
        </div>
      </Shell>
    </footer>
  );
}
