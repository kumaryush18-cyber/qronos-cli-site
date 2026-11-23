import { useState } from "react";

/**
 * A switch that can only stop motion.
 *
 * The system setting is respected by default and this never overrides it — it
 * adds a stop, not a force. Someone who wants the page still can say so here
 * without changing their whole computer.
 */
export function MotionSwitch() {
  const [off, setOff] = useState(
    () => typeof document !== "undefined" && document.documentElement.dataset.motion === "off",
  );

  function toggle() {
    const next = !off;
    setOff(next);
    if (next) {
      document.documentElement.dataset.motion = "off";
      try {
        localStorage.setItem("qronos-motion", "off");
      } catch {
        // A browser that refuses storage still gets the still page this visit.
      }
    } else {
      delete document.documentElement.dataset.motion;
      try {
        localStorage.removeItem("qronos-motion");
      } catch {
        // Nothing to clean up.
      }
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={off}
      className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted transition-colors duration-[160ms] hover:text-ink"
    >
      Motion: {off ? "off" : "on"}
    </button>
  );
}
