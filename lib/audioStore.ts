import { create } from "zustand";

type AudioState = {
  audio: HTMLAudioElement | null;
  isMuted: boolean;
  currentTrackIndex: number | null;
  

  // interno para cortar fades anteriores
  fadeTimer: number | null;

  // acciones
  startRandomTrack: (tracks: string[]) => Promise<void>;
  toggleMute: () => Promise<void>;
  stopAudio: () => void;
};

function fadeVolume(
  audio: HTMLAudioElement,
  from: number,
  to: number,
  ms: number,
  onDone?: () => void
) {
  const steps = 20;
  const stepTime = Math.max(10, Math.floor(ms / steps));
  const stepSize = (to - from) / steps;

  audio.volume = from;

  let step = 0;
  const id = window.setInterval(() => {
    step++;
    audio.volume = Math.max(0, Math.min(1, from + stepSize * step));

    if (step >= steps) {
      window.clearInterval(id);
      audio.volume = to;
      onDone?.();
    }
  }, stepTime);

  return id;
}

export const useAudioStore = create<AudioState>((set, get) => ({
  audio: null,
  isMuted: false,
  currentTrackIndex: null,
  fadeTimer: null,

  startRandomTrack: async (tracks) => {
    if (tracks.length === 0) return;

    // 1) crear audio si no existe
    let audio = get().audio;
    if (!audio) {
      audio = new Audio();
      audio.loop = true;
      audio.preload = "auto";
      audio.volume = 0; // arranca en 0 y hacemos fade
      set({ audio });
    }

    // 2) elegir random
    const randomIndex = Math.floor(Math.random() * tracks.length);
    set({ currentTrackIndex: randomIndex });

    // 3) cortar fade anterior si existía
    const oldTimer = get().fadeTimer;
    if (oldTimer) window.clearInterval(oldTimer);

    // 4) setear el track
    const newSrc = tracks[randomIndex];
    if (audio.src !== newSrc) {
      audio.src = newSrc;
    }

    // 5) si está muteado, no reproducimos (queda listo)
    if (get().isMuted) {
      audio.pause();
      audio.currentTime = 0;
      audio.volume = 0;
      set({ fadeTimer: null });
      return;
    }

    // 6) reproducir (esto funciona porque viene de un click: Start Focus)
    await audio.play();

    // 7) fade in a volumen objetivo
    const target = 0.18; // ajustalo a gusto (0.12 a 0.22 suele estar bien)
    const timerId = fadeVolume(audio, 0, target, 600);
    set({ fadeTimer: timerId });
  },

  toggleMute: async () => {
    const audio = get().audio;
    if (!audio) {
      // si nunca se inició audio, solo cambiamos estado
      set({ isMuted: !get().isMuted });
      return;
    }

    const oldTimer = get().fadeTimer;
    if (oldTimer) window.clearInterval(oldTimer);

    const currentlyMuted = get().isMuted;

    if (!currentlyMuted) {
      // MUTE: fade down y luego pause
      set({ isMuted: true });

      const timerId = fadeVolume(audio, audio.volume, 0, 500, () => {
        audio.pause();
      });

      set({ fadeTimer: timerId });
      return;
    }

    // UNMUTE: play y fade up
    set({ isMuted: false });

    try {
      await audio.play();
    } catch {
      // si el navegador bloquea, no pasa nada (pero normalmente no lo va a bloquear
      // porque el toggle se hace con click)
    }

    const target = 0.18;
    const timerId = fadeVolume(audio, audio.volume, target, 500);
    set({ fadeTimer: timerId });
  },
  stopAudio: () => {
  const audio = get().audio;
  if (!audio) return;

  const oldTimer = get().fadeTimer;
  if (oldTimer) window.clearInterval(oldTimer);

  // fade down y pause
  const timerId = fadeVolume(audio, audio.volume, 0, 500, () => {
    audio.pause();
    audio.currentTime = 0;
  });

  set({ fadeTimer: timerId, currentTrackIndex: null });
},
}));