import { Dancing_Script } from "next/font/google";

// Font definitions shared by several modules. Each next/font call is its own font instance with its own CSS, so a
// font used in more than one place is defined once here (see "Using a font definitions file" in the next/font docs).
// The homepage used to create a second Dancing Script instance: that gave it a page-only stylesheet, which Next
// preloads whenever another page prefetches "/", and the browser then warned that the preload went unused.

/** Script/cursive heading font: `.className`, or `var(--font-script)` (the `font-script` utility) via the layout */
export const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-script",
  display: "swap",
});
