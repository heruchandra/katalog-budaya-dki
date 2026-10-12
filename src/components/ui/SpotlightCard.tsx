"use client";

import { useRef, type MouseEvent, type ReactNode } from "react";

/**
 * Card with a soft radial glow that follows the mouse (after React Bits' SpotlightCard). The cursor position is
 * written to CSS variables on the card instead of React state, so moving the mouse doesn't re-render it; the glow
 * fades in on hover and out on leave. Without a mouse (touch) the card simply shows without the glow.
 */
export default function SpotlightCard({
  children,
  className = "",
  spotlightColor = "rgba(245, 158, 11, 0.15)",
}: {
  children: ReactNode;
  className?: string;
  /** Colour at the centre of the glow */
  spotlightColor?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const track = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
  };

  return (
    <div
      ref={ref}
      onMouseEnter={track}
      onMouseMove={track}
      className={`relative rounded-2xl border border-amber-200/80 bg-white/90 backdrop-blur-xs p-6 sm:p-8 overflow-hidden shadow-xs hover:border-amber-400/80 transition-all duration-300 group ${className}`}
    >
      {/* the glow: hidden until hover, then follows the cursor */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(600px circle at var(--spot-x, 50%) var(--spot-y, 50%), ${spotlightColor}, transparent 40%)`,
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
