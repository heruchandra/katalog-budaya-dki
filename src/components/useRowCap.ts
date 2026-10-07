"use client";

import { useLayoutEffect, useRef, useState } from "react";

/**
 * Caps a list at its first `visible` rows: returns a ref for the list (which must be `position: relative`) and the
 * max height that shows exactly those rows, measured so rows that wrap still show whole. `null` until measured
 * (or when the list is short enough not to scroll): use a fixed fallback cap until then.
 */
export function useRowCap<T extends HTMLElement>(visible: number, enabled: boolean) {
  const ref = useRef<T>(null);
  const [maxHeight, setMaxHeight] = useState<number | null>(null);

  useLayoutEffect(() => {
    const list = ref.current;
    if (!enabled || !list) return;
    // offsetTop is measured from the list's top edge (it is `relative`) and isn't affected by scrolling.
    // ResizeObserver calls back once on observe, then on every resize (wrapping text changes the height).
    const ro = new ResizeObserver(() => {
      const last = list.children[visible - 1] as HTMLElement | undefined;
      if (last) setMaxHeight(last.offsetTop + last.offsetHeight);
    });
    ro.observe(list);
    return () => ro.disconnect();
  }, [visible, enabled]);

  return { ref, maxHeight };
}
