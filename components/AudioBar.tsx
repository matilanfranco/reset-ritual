"use client";

import { useAudioStore } from "@/lib/audioStore";

export default function AudioBar() {
  const isMuted = useAudioStore((s) => s.isMuted);
  const toggleMute = useAudioStore((s) => s.toggleMute);

  return (
      <button
        onClick={toggleMute}
        className="rounded-xl bg-[#111824] border border-white/10 px-3 py-1.5 text-xs font-semibold text-white"
      >
        {isMuted ? "🔇 Audio" : "🔊 Audio"}
      </button>
  );
}