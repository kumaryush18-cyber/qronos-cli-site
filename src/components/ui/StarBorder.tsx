import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * A light that travels around the border of the box it wraps.
 *
 * The path has to be measured: `offset-path: path()` needs real pixel numbers, so
 * this stays a client-only decoration. It renders nothing on the server, which is
 * also what keeps it out of the hydration comparison.
 *
 * The design is lifted from the Qronos AI landing page (a `StarBorderCard`), which
 * in turn is the usual "light orbiting a card" shape: a radial blob on an offset
 * path with a small blur.
 */
export function StarBorder({
  children,
  className,
  duration = 7,
  width = 170,
}: {
  children: ReactNode;
  className?: string;
  /** Seconds for one full lap. */
  duration?: number;
  /** Width of the light blob in pixels. */
  width?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [path, setPath] = useState("");

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const measure = () => {
      const { offsetWidth, offsetHeight } = element;
      if (offsetWidth > 0 && offsetHeight > 0) {
        setPath(`path('M 0 0 H ${offsetWidth} V ${offsetHeight} H 0 V 0')`);
      }
    };

    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn("relative rounded-[11px] p-px", className)}
      style={
        {
          "--star-path": path,
          "--star-duration": duration,
          "--star-width": `${width}px`,
        } as CSSProperties
      }
    >
      {path ? <span aria-hidden="true" className="star-light" /> : null}
      {children}
    </div>
  );
}
