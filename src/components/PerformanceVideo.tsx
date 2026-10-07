"use client";

import { useState, type ReactNode } from "react";
import { getImageProps } from "next/image";
import { PlayCircle } from "lucide-react";
import { isVideoFile, youTubeId } from "@/lib/video";

/**
 * "Video Penampilan" media box, shared by the sanggar and seniman musik detail pages:
 * - a video file → native HTML5 player (controls, metadata-only preload, poster thumbnail)
 * - a YouTube link → privacy-enhanced embed
 * - nothing, or a file that can't be loaded (e.g. not uploaded yet) → the "not available yet" placeholder,
 *   with any `placeholderActions` (documentation / channel links) under it
 * Always a 16:9 box, so it lines up with the gallery cover next to it; the player letterboxes portrait videos
 * instead of cropping them.
 */
export default function PerformanceVideo({
  videoUrl,
  poster,
  title,
  isEn,
  placeholderActions,
}: {
  videoUrl?: string | null;
  /** Poster thumbnail for a video file (a site path is served through the image optimizer) */
  poster?: string | null;
  /** Accessible name of the player, e.g. "Video penampilan Sinar Norray" */
  title: string;
  isEn: boolean;
  placeholderActions?: ReactNode;
}) {
  const [fileFailed, setFileFailed] = useState(false);
  // The section sits below the fold: the file is attached only once the player nears the viewport, so a page view
  // that never scrolls there downloads nothing but the poster (preload="metadata" then fetches just the header)
  const [nearViewport, setNearViewport] = useState(false);
  const ytId = youTubeId(videoUrl);
  const file = !ytId && isVideoFile(videoUrl) ? videoUrl! : null;

  if (file && !fileFailed) {
    const posterSrc = poster?.startsWith("/")
      ? getImageProps({ src: poster, alt: "", width: 600, height: 338, quality: 75 }).props.src
      : poster || undefined;
    return (
      <video
        key={file}
        ref={(el) => {
          if (!el || nearViewport) return;
          const io = new IntersectionObserver(
            ([entry]) => {
              if (entry?.isIntersecting) {
                setNearViewport(true);
                io.disconnect();
              }
            },
            { rootMargin: "300px 0px" }
          );
          io.observe(el);
          return () => io.disconnect();
        }}
        src={nearViewport ? file : undefined}
        poster={posterSrc}
        controls
        preload="metadata"
        playsInline
        onError={() => setFileFailed(true)}
        aria-label={title}
        className="w-full aspect-video rounded-xl object-contain shadow-sm bg-black"
      >
        {isEn ? "Your browser can't play this video." : "Browser Anda tidak dapat memutar video ini."}
      </video>
    );
  }

  if (ytId) {
    return (
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black">
        <iframe
          title={title}
          src={`https://www.youtube-nocookie.com/embed/${ytId}`}
          className="absolute inset-0 w-full h-full"
          loading="lazy"
          allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3 aspect-video rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-6 text-center">
      <PlayCircle className="w-10 h-10 text-zinc-300" aria-hidden="true" />
      <p className="text-sm text-zinc-500">{isEn ? "A performance video is not available yet." : "Video penampilan belum tersedia."}</p>
      {placeholderActions}
    </div>
  );
}
