"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import RotatingText from "@/components/RotatingText";

export interface HeroHeadlineProps {
  /** Text before the rotating word ("Temukan" / "Discover") */
  lead: string;
  /** The rotating words; the first one is what the static headline shows before this loads */
  words: string[];
  /** className of the script font used for the rotating word */
  scriptClassName: string;
}

/**
 * Animated hero headline (rotating word + ondel-ondel accent). The homepage loads this module only after the page
 * has finished loading, so motion stays out of the initial JavaScript; until then it shows a static copy with the
 * same markup and the first word (StaticHeroHeadline in src/app/page.tsx).
 */
export default function HeroHeadline({ lead, words, scriptClassName }: HeroHeadlineProps) {
  const [wordIndex, setWordIndex] = useState(0);
  const word = words[wordIndex] ?? words[0];

  return (
    <motion.h1
      layout
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="text-white text-3xl md:text-5xl font-light tracking-wide drop-shadow-md flex flex-wrap items-center justify-center gap-x-3"
    >
      <span>{lead}</span>
      <span className={`relative inline-flex items-center ${scriptClassName} text-5xl md:text-7xl font-medium text-orange-500 pr-2`}>
        <RotatingText
          texts={words}
          mainClassName={`inline-flex ${scriptClassName} text-orange-500`}
          splitLevelClassName={scriptClassName}
          elementLevelClassName={scriptClassName}
          staggerDuration={0.03}
          staggerFrom="first"
          rotationInterval={3000}
          onNext={(index) => setWordIndex(index)}
        />
        <AnimatePresence mode="wait">
          <motion.div
            key={word}
            initial={{ opacity: 0, scale: 0.8, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 5 }}
            transition={{ duration: 0.3, delay: 0.4, ease: "easeInOut" }}
            className={`absolute z-10 ${word === 'Seniman Musik' || word === 'Music Artists' ? '-top-12 md:-top-16 -right-6 md:-right-8' : '-top-8 md:-top-12 -right-8 md:-right-10'}`}
          >
            <Image
              src="/ondel-ondel.webp"
              alt="Aksen Ondel-ondel"
              width={80}
              height={80}
              className="w-12 h-12 md:w-20 md:h-20 object-contain rotate-12 scale-75 md:scale-100 drop-shadow-md hover:scale-110 pointer-events-none transition-transform duration-300"
            />
          </motion.div>
        </AnimatePresence>
      </span>
    </motion.h1>
  );
}
