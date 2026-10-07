"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";

/**
 * next/image (fill) that degrades gracefully: when `src` fails to load (e.g. the file hasn't been uploaded yet) it
 * tries `fallbackSrc`, and when that fails too (or there is none) it renders `placeholder` instead of a broken image.
 * Give it a `key` of the src when the same instance shows different photos (e.g. slides), so the state resets.
 */
export default function FallbackImage({
  src,
  fallbackSrc,
  alt,
  sizes,
  className,
  placeholder,
}: {
  src?: string;
  fallbackSrc?: string;
  alt: string;
  sizes: string;
  className?: string;
  placeholder: ReactNode;
}) {
  const sources = [src, fallbackSrc].filter((s): s is string => !!s);
  const [attempt, setAttempt] = useState(0);
  const current = sources[attempt];
  if (!current) return <>{placeholder}</>;
  return (
    <Image
      key={current}
      src={current}
      alt={alt}
      fill
      sizes={sizes}
      className={className}
      onError={() => setAttempt((a) => a + 1)}
    />
  );
}
