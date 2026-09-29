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
      audioRef.current.play().catch(e => console.log("Autoplay blocked:", e));
    }
  };

  return (
    <div className="fixed bottom-6 left-6 md:bottom-8 md:left-8 z-50">
      <button
        onClick={toggleAudio}
        className="flex items-center justify-center w-10 h-10 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-none border border-white/20 transition-all duration-300 shadow-lg group"
        aria-label={isMuted ? "Unmute audio" : "Mute audio"}
      >
        {isMuted ? (
          <div className="relative flex items-center justify-center">
            <Music className="w-4 h-4 text-white opacity-70" />
            <div className="absolute top-1/2 left-1/2 w-5 h-[1.5px] bg-white -translate-x-1/2 -translate-y-1/2 -rotate-45" />
          </div>
        ) : (
          <Music className="w-4 h-4 text-white group-hover:scale-110 transition-transform duration-300" />
        )}
      </button>

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        loop
        muted
        controls={false}
        className="hidden"
      >
        <source src="/audio/music-beranda.mp3" type="audio/mpeg" />
      </audio>
    </div>
  );
}
