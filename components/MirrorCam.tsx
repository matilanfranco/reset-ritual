"use client";

import { useEffect, useRef, useState } from "react";

export default function MirrorCam() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [on, setOn] = useState(false);

  async function start() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // iOS a veces necesita este combo
        videoRef.current.muted = true;
        videoRef.current.playsInline = true;
        await videoRef.current.play();
      }

      setOn(true);
    } catch (e) {
      console.error(e);
      alert("No se pudo abrir la cámara. (permiso / https)");
    }
  }

  function stop() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
    }

    setOn(false);
  }

  useEffect(() => {
    return () => stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full rounded-2xl bg-[#111824] border border-white/10 p-4">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold">🪞 Espejo</div>

        {!on ? (
          <button
            onClick={start}
            className="rounded-xl bg-[#162033] border border-white/10 px-3 py-1 text-xs font-semibold"
          >
            ON
          </button>
        ) : (
          <button
            onClick={stop}
            className="rounded-xl bg-[#162033] border border-white/10 px-3 py-1 text-xs font-semibold"
          >
            OFF
          </button>
        )}
      </div>

      {/* el video SIEMPRE existe, pero se esconde cuando off */}
      <div
        className={[
          "mt-3 w-full aspect-video overflow-hidden rounded-xl border border-white/10 bg-black",
          !on && "hidden",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
          style={{ transform: "scaleX(-1)" }}
        />
      </div>
    </div>
  );
}