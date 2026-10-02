"use client";

import { useCallback, useEffect, useMemo, useRef, useState, CSSProperties } from 'react';
import { getImageProps } from 'next/image';
import './DriftWall.css';

export interface DriftWallItem {
  image: string;
  title?: string;
  href?: string;
}

export interface DriftWallProps {
  items?: DriftWallItem[];
  /** `sizes` for the tile photos: a 210px tile is drawn up to ~290px wide (plane scale 1.25 + hover scale) */
  imageSizes?: string;
  columnData?: (string[] | DriftWallItem[])[];
  columns?: number;
  tileWidth?: number;
  tileHeight?: number;
  gap?: number;
  radius?: number;
  tilt?: number;
  turn?: number;
  roll?: number;
  perspective?: number;
  depth?: number;
  speed?: number;
  direction?: 'up' | 'down';
  variance?: number;
  parallax?: number;
  pauseOnHover?: boolean;
  lift?: number;
  fade?: number;
  dim?: number;
  grayscale?: boolean;
  overlayColor?: string;
  className?: string;
  style?: CSSProperties;
}

const DEFAULT_ITEMS: DriftWallItem[] = [
  { image: '/dinamis-sanggar-1.webp', title: 'Seni Tari Betawi' },
  { image: '/dinamis-sanggar-2.webp', title: 'Pentas Kreasi Budaya' },
  { image: '/dinamis-sanggar-3.webp', title: 'Harmoni Nusantara' },
  { image: '/dinamis-sanggar-4.webp', title: 'Pusaka Tradisi Jakarta' },
  { image: '/dinamis-sanggar-5.webp', title: 'Ekspresi Panggung Budaya' },
  { image: '/dinamis-sanggar-6.webp', title: 'Koreografi Tari Kolosal' }
];

const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const columnFactor = (index: number, variance: number): number => {
  const pseudo = ((index * 0.6180339887 + 0.35) % 1) * 2 - 1;
  return 1 + variance * pseudo;
};

const DriftWall = ({
  items = DEFAULT_ITEMS,
  imageSizes = '300px',
  columnData,
  columns = 6,
  tileWidth = 210,
  tileHeight = 140,
  gap = 18,
  radius = 0,
  tilt = 14,
  turn = -12,
  roll = 0,
  perspective = 1200,
  depth = 80,
  speed = 38,
  direction = 'up',
  variance = 0.4,
  parallax = 0.5,
  pauseOnHover = false,
  lift = 54,
  fade = 0.5,
  dim = 1.0,
  grayscale = false,
  overlayColor = '#060010',
  className = '',
  style
}: DriftWallProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const planeRef = useRef<HTMLDivElement | null>(null);
  const trackRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rafRef = useRef<number | null>(null);

  const offsetsRef = useRef<number[]>([]);
  const velocitiesRef = useRef<number[]>([]);
  const hoveredColRef = useRef<number>(-1);
  const wallHoveredRef = useRef<boolean>(false);
  const pointerRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const pointerDampedRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const lastTsRef = useRef<number | null>(null);

  // Default to 400px to prevent any zero-height calculation during initial render & hydration
  const [containerHeight, setContainerHeight] = useState<number>(400);
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeIdRef = useRef<string | null>(null);
  const [reduced, setReduced] = useState<boolean>(false);

  useEffect(() => {
    setReduced(prefersReducedMotion());
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const columnItems = useMemo(() => {
    if (columnData && columnData.length > 0) {
      return columnData.map(col =>
        col.map(item => (typeof item === 'string' ? { image: item } : item))
      );
    }
    const validItems = items && items.length > 0 ? items : DEFAULT_ITEMS;
    return Array.from({ length: columns }, (_, colIdx) => {
      // Assign image i to column i (modulo validItems.length), repeating the exact same image vertically within its respective column track
      const assignedItem = validItems[colIdx % validItems.length];
      return [assignedItem];
    });
  }, [items, columns, columnData]);

  // Right-sized variants from the Next image optimizer, computed once per photo (each one is repeated in many
  // tiles). The originals are 1920×1080 and up to ~1 MB; a tile needs ~300px. Remote URLs are used as given.
  const imagePropsBySrc = useMemo(() => {
    const map = new Map<string, { src: string; srcSet?: string; sizes?: string }>();
    for (const col of columnItems) {
      for (const item of col) {
        if (map.has(item.image)) continue;
        if (item.image.startsWith('/')) {
          const { props } = getImageProps({ src: item.image, alt: '', fill: true, sizes: imageSizes });
          map.set(item.image, { src: props.src, srcSet: props.srcSet, sizes: props.sizes });
        } else {
          map.set(item.image, { src: item.image });
        }
      }
    }
    return map;
  }, [columnItems, imageSizes]);

  const columnMeta = useMemo(() => {
    const unit = tileHeight + gap;
    const effectiveHeight = Math.max(containerHeight, 400);
    return columnItems.map(col => {
      const copyHeight = Math.max(unit, col.length * unit);
      const copies = Math.max(4, Math.ceil((effectiveHeight * 2.5) / copyHeight) + 2);
      return { copyHeight, copies };
    });
  }, [columnItems, tileHeight, gap, containerHeight]);

  // Safe client-side height detection preventing zero-height
  useEffect(() => {
    if (!containerRef.current) return;
    const update = () => {
      if (!containerRef.current) return;
      const h = containerRef.current.clientHeight || containerRef.current.offsetHeight || 0;
      if (h > 50) {
        setContainerHeight(h);
      }
    };
    update();
    const ro = new ResizeObserver(([entry]) => {
      const h = entry?.contentRect?.height || 0;
      if (h > 50) {
        setContainerHeight(h);
      }
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const baseVelocities = useMemo(() => {
    const dirSign = direction === 'up' ? 1 : -1;
    return columnItems.map((_, c) => {
      const altSign = c % 2 === 0 ? 1 : -1;
      return speed * columnFactor(c, variance) * dirSign * altSign;
    });
  }, [columnItems, speed, direction, variance]);

  const applyPlaneTransform = useCallback(
    (px: number, py: number) => {
      const plane = planeRef.current;
      if (!plane) return;
      plane.style.transform =
        `translate(-50%, -50%) scale(1.25) ` +
        `rotateX(${tilt + py}deg) rotateY(${turn + px}deg) rotateZ(${roll}deg) ` +
        `translateZ(${-depth}px)`;
    },
    [tilt, turn, roll, depth]
  );

  // Ensure initial plane transform on mount
  useEffect(() => {
    applyPlaneTransform(0, 0);
  }, [applyPlaneTransform]);

  // Initialize track positions and velocities immediately
  useEffect(() => {
    offsetsRef.current = columnMeta.map((meta, c) => meta.copyHeight * ((c * 0.37) % 1));
    velocitiesRef.current = columnItems.map((_, c) => baseVelocities[c] || 38);
    for (let c = 0; c < trackRefs.current.length; c++) {
      const el = trackRefs.current[c];
      const offset = offsetsRef.current[c];
      if (el && offset !== undefined) {
        el.style.transform = `translate3d(0, ${-offset}px, 0)`;
      }
    }
  }, [columnMeta, columnItems, baseVelocities]);

  useEffect(() => {
    const animate = (ts: number) => {
      if (lastTsRef.current === null) lastTsRef.current = ts;
      const dt = Math.min(0.05, Math.max(0, ts - lastTsRef.current) / 1000);
      lastTsRef.current = ts;

      const maxTilt = parallax * 8;
      const targetX = pointerRef.current.x * maxTilt;
      const targetY = -pointerRef.current.y * maxTilt;
      const damp = 1 - Math.exp(-dt / 0.12);
      pointerDampedRef.current.x += (targetX - pointerDampedRef.current.x) * damp;
      pointerDampedRef.current.y += (targetY - pointerDampedRef.current.y) * damp;
      applyPlaneTransform(pointerDampedRef.current.x, pointerDampedRef.current.y);

      if (!reduced) {
        for (let c = 0; c < trackRefs.current.length; c++) {
          const meta = columnMeta[c];
          if (!meta) continue;
          const paused = wallHoveredRef.current && pauseOnHover;
          const factor = paused || hoveredColRef.current === c ? 0 : 1;
          const target = baseVelocities[c] * factor;

          const ease = 1 - Math.exp(-dt / (target === 0 ? 0.16 : 0.28));
          velocitiesRef.current[c] += (target - (velocitiesRef.current[c] ?? 0)) * ease;
          let next = (offsetsRef.current[c] ?? 0) + velocitiesRef.current[c] * dt;
          next = ((next % meta.copyHeight) + meta.copyHeight) % meta.copyHeight;
          offsetsRef.current[c] = next;

          const el = trackRefs.current[c];
          if (el) el.style.transform = `translate3d(0, ${-next}px, 0)`;
        }
      } else {
        for (let c = 0; c < trackRefs.current.length; c++) {
          const el = trackRefs.current[c];
          const meta = columnMeta[c];
          if (el && meta) el.style.transform = `translate3d(0, ${-(offsetsRef.current[c] ?? 0)}px, 0)`;
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTsRef.current = null;
    };
  }, [baseVelocities, columnMeta, pauseOnHover, parallax, reduced, applyPlaneTransform]);

  const activate = useCallback((id: string, index: number) => {
    activeIdRef.current = id;
    hoveredColRef.current = index;
    setActiveId(id);
  }, []);
  const release = useCallback(() => {
    activeIdRef.current = null;
    hoveredColRef.current = -1;
    setActiveId(null);
  }, []);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      if (parallax > 0 && !reduced) {
        pointerRef.current = {
          x: (e.clientX - rect.left) / rect.width - 0.5,
          y: (e.clientY - rect.top) / rect.height - 0.5
        };
      }
      const hit = document.elementFromPoint(e.clientX, e.clientY);
      const tile = (hit && hit.closest ? hit.closest('[data-tile-id]') : null) as HTMLElement | null;
      if (!tile) return;
      const id = tile.dataset.tileId;
      if (!id || id === activeIdRef.current) return;
      activeIdRef.current = id;
      hoveredColRef.current = Number(tile.dataset.col);
      setActiveId(id);
    },
    [parallax, reduced]
  );

  const handlePointerLeaveWall = useCallback(() => {
    wallHoveredRef.current = false;
    pointerRef.current = { x: 0, y: 0 };
    release();
  }, [release]);

  const cssVars = useMemo(
    () => ({
      '--dw-tile-w': `${tileWidth}px`,
      '--dw-tile-h': `${tileHeight}px`,
      '--dw-gap': `${gap}px`,
      '--dw-radius': `${radius}px`,
      '--dw-perspective': `${perspective}px`,
      '--dw-lift': `${lift}px`,
      '--dw-dim': dim,
      '--dw-gray': grayscale ? 1 : 0,
      '--dw-overlay': overlayColor,
      '--dw-edge': `${Math.max(0, (1 - fade) * 100)}%`,
      ...style
    } as CSSProperties),
    [tileWidth, tileHeight, gap, radius, perspective, lift, dim, grayscale, overlayColor, fade, style]
  );

  const renderTile = (item: DriftWallItem, id: string, colIndex: number) => {
    const imageProps = imagePropsBySrc.get(item.image) ?? { src: item.image };
    const inner = (
      <span className="drift-wall__inner border-none outline-none ring-0 focus:ring-0">
        <img
          src={imageProps.src}
          srcSet={imageProps.srcSet}
          sizes={imageProps.sizes}
          alt={item.title ?? ''}
          loading="eager"
          // decorative background: don't compete with the page's content images
          fetchPriority="low"
          decoding="async"
          draggable={false}
          className="w-full h-full object-cover object-center border-none outline-none ring-0"
        />
        <span className="drift-wall__overlay border-none outline-none ring-0" aria-hidden="true" />
      </span>
    );
    const commonProps = {
      className: `drift-wall__tile border-none outline-none ring-0 focus:ring-0${activeId === id ? ' is-active' : ''}`,
      'data-tile-id': id,
      'data-col': colIndex,
      onMouseEnter: () => activate(id, colIndex),
      onMouseLeave: release,
      onFocus: () => activate(id, colIndex),
      onBlur: release
    };
    if (item.href) {
      return (
        <a key={id} href={item.href} target="_blank" rel="noreferrer noopener" {...commonProps}>
          {inner}
        </a>
      );
    }
    return (
      <div key={id} tabIndex={0} role="button" aria-label={item.title ?? 'tile'} {...commonProps}>
        {inner}
      </div>
    );
  };

  const rootClass = ['drift-wall', reduced ? 'drift-wall--reduced' : '', className].filter(Boolean).join(' ');

  return (
    <div
      ref={containerRef}
      className={rootClass}
      style={cssVars}
      onPointerMove={handlePointerMove}
      onPointerEnter={() => {
        wallHoveredRef.current = true;
      }}
      onPointerLeave={handlePointerLeaveWall}
      role="group"
      aria-label="Drifting wall of tiles"
    >
      <div ref={planeRef} className="drift-wall__plane">
        {columnItems.map((col, c) => {
          const meta = columnMeta[c];
          const copies = Array.from({ length: meta.copies });
          return (
            <div className="drift-wall__col" key={`col-${c}`}>
              <div className="drift-wall__track" ref={el => { trackRefs.current[c] = el; }}>
                {copies.map((_, copyIndex) =>
                  col.map((item, itemIndex) => renderTile(item, `${c}-${copyIndex}-${itemIndex}`, c))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DriftWall;
