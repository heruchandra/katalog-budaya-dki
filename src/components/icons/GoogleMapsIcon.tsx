"use client";

import { useId } from "react";

/**
 * Google Maps pin (current logo): rainbow ring of blurred colour wedges (red, purple, blue, teal, green, yellow)
 * clipped to a pin with a round hole, which shows white as in the official mark. Shared by every Maps icon on the
 * site (sanggar contact tile, footer address). The clip/filter ids come from useId, so pins rendered on the same
 * page never point at each other's <defs>.
 *
 * The pin only fills ~60% of its 24px box, so give it one size step more than neighbouring icons.
 */
export default function GoogleMapsIcon({ className = "w-6 h-6" }: { className?: string }) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const clipId = `gmaps-pin-clip-${uid}`;
  const blurId = `gmaps-pin-blur-${uid}`;
  return (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <clipPath id={clipId}>
          <path
            clipRule="evenodd"
            d="M12 2.5a7 7 0 0 0-7 7c0 3.2 2.6 6 4.5 8.4 1 1.3 1.7 2.6 2 3.6a.55.55 0 0 0 1 0c.3-1 1-2.3 2-3.6 1.9-2.4 4.5-5.2 4.5-8.4a7 7 0 0 0-7-7ZM12 6.8a2.7 2.7 0 1 1 0 5.4 2.7 2.7 0 1 1 0-5.4Z"
          />
        </clipPath>
        <filter id={blurId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.3" />
        </filter>
      </defs>
      {/* white behind the hole, so it reads white on any background */}
      <circle cx="12" cy="9.5" r="3" fill="#FFFFFF" />
      <g clipPath={`url(#${clipId})`}>
        <g filter={`url(#${blurId})`}>
          <path fill="#A56CE8" d="M12 9.5L1.72 -2.76A16 16 0 0 1 12.00 -6.50Z" />
          <path fill="#4285F4" d="M12 9.5L12.00 -6.50A16 16 0 0 1 23.31 -1.81Z" />
          <path fill="#12A4B6" d="M12 9.5L23.31 -1.81A16 16 0 0 1 27.76 6.72Z" />
          <path fill="#14B35A" d="M12 9.5L27.76 6.72A16 16 0 0 1 2.82 22.61Z" />
          <path fill="#F6C21B" d="M12 9.5L2.82 22.61A16 16 0 0 1 -2.50 16.26Z" />
          <path fill="#EA4335" d="M12 9.5L-2.50 16.26A16 16 0 0 1 1.72 -2.76Z" />
        </g>
      </g>
    </svg>
  );
}
