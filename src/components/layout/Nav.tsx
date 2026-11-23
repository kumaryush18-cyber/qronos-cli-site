import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { CopyButton } from "@/components/ui/CopyButton";
import { cn } from "@/lib/cn";
import { NAV_LINKS, SITE } from "@/lib/site";

/**
 * Sticky, blurred navigation. 78px tall, one hairline border.
 *
 * Below 820px the links move into a panel. The panel is a real element with a
 * real close button, not a :hover menu, because a hover menu cannot be used on
 * a phone or by keyboard alone.
 */
export function Nav() {
  const [open, setOpen] = useState(false);
  const [pathname] = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/80 backdrop-blur-xl">
      <nav aria-label="Main" className="mx-auto flex h-[78px] w-full max-w-[1220px] items-center gap-8 px-[22px] sm:px-7">
        <Link href="/" className="flex items-baseline gap-2" aria-label={`${SITE.name} home`}>
          <span className="shimmer text-[19px] font-extrabold tracking-[-0.05em]">Qronos</span>
          <span className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-muted">CLI</span>
        </Link>

        <ul className="ml-4 hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.to}
                className={cn(
                  "font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-muted",
                  "transition-colors duration-[160ms] hover:text-ink",
                  pathname === link.to && "text-ink",
                )}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="ml-auto flex items-center gap-2">
          <a
            href={SITE.repo}
            target="_blank"
            rel="noreferrer noopener"
            className="hidden font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-muted transition-colors hover:text-ink sm:inline"
          >
            GitHub
          </a>
          <CopyButton
            text={SITE.install}
            label="Install"
            className="min-h-11 border-orange-line bg-orange-soft px-3 text-orange hover:text-orange-pale"
            live={false}
          />
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid size-11 place-items-center rounded-[9px] border border-line text-muted lg:hidden"
          >
            {open ? <X size={16} aria-hidden /> : <Menu size={16} aria-hidden />}
          </button>
        </div>
      </nav>

      {open ? (
        <div id="mobile-menu" className="border-t border-line bg-paper px-[22px] py-4 lg:hidden">
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.to}
                  onClick={() => setOpen(false)}
                  className="block rounded-[9px] px-2 py-2.5 font-mono text-[12px] uppercase tracking-[0.14em] text-muted hover:bg-card hover:text-ink"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href={SITE.repo}
                target="_blank"
                rel="noreferrer noopener"
                className="block rounded-[9px] px-2 py-2.5 font-mono text-[12px] uppercase tracking-[0.14em] text-muted hover:bg-card hover:text-ink"
              >
                GitHub
              </a>
            </li>
          </ul>
        </div>
      ) : null}
    </header>
  );
}
