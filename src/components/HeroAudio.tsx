"use client";

import { useState, useRef, useEffect } from 'react';
import { Music } from 'lucide-react';

export default function HeroAudio() {
  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const toggleAudio = () => {
    setIsMuted(!isMuted);
    if (audioRef.current && isMuted) {
      // Attempt to play if unmuting (browsers might block autoplay until interaction)
      // Browsers commonly block autoplay until the user interacts; that's expected, not an error
      audioRef.current.play().catch(() => {});
    }
  };

  return (
    <div className="fixed bottom-6 left-6 md:bottom-8 md:left-8 z-50">
      <button
        onClick={toggleAudio}
        type="button"
        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-black/50 backdrop-blur-md border border-white/20 text-white shadow-lg hover:bg-black/70 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer group"
        aria-label={isMuted ? "Unmute audio" : "Mute audio"}
      >
        {isMuted ? (
          <div className="relative flex items-center justify-center">
            <Music className="w-4 h-4 sm:w-5 sm:h-5 text-white opacity-70" />
            <div className="absolute top-1/2 left-1/2 w-5 sm:w-6 h-[1.5px] bg-white -translate-x-1/2 -translate-y-1/2 -rotate-45" />
          </div>
        ) : (
          <Music className="w-4 h-4 sm:w-5 sm:h-5 text-white group-hover:scale-110 transition-transform duration-300" />
        )}
      </button>

      {/* Hidden Audio Element: preload="none" so the 2 MB track is only downloaded once the visitor turns it on */}
      <audio
        ref={audioRef}
        loop
        muted
        preload="none"
        controls={false}
        className="hidden"
      >
        <source src="/audio/music-beranda.mp3" type="audio/mpeg" />
      </audio>
    </div>
  );
}
