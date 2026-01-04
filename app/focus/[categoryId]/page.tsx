"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAudioStore } from "@/lib/audioStore";
import { useSearchParams } from "next/navigation";
import type { Slot } from "@/lib/types";

import { ROUTINE } from "@/data/routine";
import { ensureTodayDayLog, saveTodayLog } from "@/lib/daylog";
import type { CategoryId, DayLog, Task } from "@/lib/types";
import AudioBar from "@/components/AudioBar";

/* ===== helpers simples ===== */

function nowMs() {
  return Date.now();
}

function formatMMSS(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

// Sonido simple (sin ramps, sin compatibilidad vieja)
function playSoftSound(pitch: number) {
  const ctx = new AudioContext();

  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.value = pitch; // grave suave

  const gain = ctx.createGain();
  gain.gain.value = 0.04; // bajito

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.25); // duración
}

/* ===== componente ===== */

export default function FocusPage() {
  const router = useRouter();
  const params = useParams();
  const stopAudio = useAudioStore((s) => s.stopAudio);
  const searchParams = useSearchParams();
  const slot = (searchParams.get("slot") as Slot) || "morning";

  // categoryId viene de la URL: /focus/massage, /focus/breath, etc.
  const categoryId = (params?.categoryId as string) as CategoryId;

  // log del día (completados, timer, etc.)
  const [dayLog, setDayLog] = useState<DayLog | null>(null);

  // reloj para refrescar UI del timer
  const [clock, setClock] = useState(0);

  const [alcoholDrank, setAlcoholDrank] = useState<null | boolean>(null);
  const [alcoholDrinks, setAlcoholDrinks] = useState<number>(0);  

  // buscar categoría
  const category = ROUTINE.find((c) => c.id === categoryId) || null;

  // tareas de esta categoría
  const tasks =
            category?.tasks
                .filter((t) => t.enabled && t.slot === slot)
                .sort((a, b) => a.order - b.order) ?? [];

  // cargar log del día al entrar
  useEffect(() => {
    const log = ensureTodayDayLog();
    setDayLog(log);
  }, []);

  useEffect(() => {
  if (!dayLog) return;

  // Si ya existe respuesta guardada para el alcohol, precargamos
  const answers = dayLog.formAnswers as Record<string, any> | undefined;
  const saved = answers?.["n_alcohol_check"];

  if (saved && typeof saved === "object") {
    if (typeof saved.drank === "boolean") setAlcoholDrank(saved.drank);
    if (typeof saved.drinks === "number") setAlcoholDrinks(saved.drinks);
  }
}, [dayLog]);

  // refrescar UI cada 250ms (para ver el timer bajar)
  useEffect(() => {
    const id = window.setInterval(() => setClock((c) => c + 1), 250);
    return () => window.clearInterval(id);
  }, []);

  if (!dayLog) return null;

    const currentDayLog = dayLog;

  if (!category) {
    return (
      <main className="min-h-screen px-5 py-6">
        <div className="max-w-md mx-auto">Categoría no encontrada.</div>
      </main>
    );
  }

  // próxima tarea pendiente
  const nextTask =
    tasks.find((t) => !dayLog.completedTaskIds.includes(t.id)) || null;

  // guardar log (estado + localStorage)
  function save(updated: DayLog) {
    updated.updatedAt = nowMs();
    setDayLog(updated);
    saveTodayLog(updated);
  }

    function markDone(task: Task, withSound: boolean) {
    if (withSound) playSoftSound(300);

    const updated: DayLog = {
        ...currentDayLog,
        completedTaskIds: Array.from(
        new Set([...currentDayLog.completedTaskIds, task.id])
        ),
        activeTimer: null,
    };

    save(updated);
    }

    function saveAlcoholForm() {
        if (!nextTask) return;

        const drank = alcoholDrank ?? false;
        const drinks = drank ? Math.max(0, Math.floor(alcoholDrinks)) : 0;

        const updated: DayLog = {
            ...currentDayLog,
            formAnswers: {
            ...(currentDayLog.formAnswers ?? {}),
            [nextTask.id]: { drank, drinks },
            },
            completedTaskIds: Array.from(
            new Set([...currentDayLog.completedTaskIds, nextTask.id])
            ),
            activeTimer: null,
        };

        save(updated);
        playSoftSound(300);
        }

  function startTimer(task: Task) {
    playSoftSound(600)
  const seconds = task.durationSec ?? 0;

  const updated: DayLog = {
    ...currentDayLog,
    activeTimer: {
      taskId: task.id,
      startedAt: nowMs(),
      endsAt: nowMs() + seconds * 1000,
    },
  };

  save(updated);
}

  function stopTimer() {
  const updated: DayLog = {
    ...currentDayLog,
    activeTimer: null,
  };

  save(updated);
}

  // Auto-finish: si el timer activo ya terminó -> vibra + sonido + done
  // (Esto corre en cada render pero NO rompe hooks)
  if (nextTask && dayLog.activeTimer?.taskId === nextTask.id) {
    const remainingMs = dayLog.activeTimer.endsAt - nowMs();
    if (remainingMs <= 0) {
      try {
        navigator.vibrate?.([120, 60, 120]);
      } catch {}

      playSoftSound(300); // suena al terminar

      // marcar done SIN sonido extra (ya sonó)
      markDone(nextTask, false);
    }
  }

  // Usamos clock solo para refrescar render del timer
  void clock;

  // FIN: ya no hay tareas
  if (!nextTask) {
    return (
      <main className="min-h-screen px-5 py-6">
        <div className="max-w-md mx-auto min-h-[80vh] flex flex-col justify-center">
          <div className="text-sm text-[#9AA7B8] mb-2">{category.title}</div>
          <h1 className="text-3xl font-semibold">Listo.</h1>
          <p className="text-sm text-[#9AA7B8] mt-2">
            Volvé al dashboard y seguí con la próxima tarjeta.
          </p>
          <button
          className="mt-5 rounded-2xl bg-[#162033] border border-white/10 px-5 py-3 font-semibold"
          onClick={() => {
              router.push("/block/" + slot);
              stopAudio()
           }}

          >
              Volver al Bloque
          </button>
        </div>
      </main>
    );
  }

  // UI timer
  const isTimer = nextTask.type === "timer";
  const isActiveTimer = dayLog.activeTimer?.taskId === nextTask.id;

  let remainingSec = 0;
  let progress = 0;

  if (isTimer) {
    const totalSec = nextTask.durationSec ?? 0;

    if (isActiveTimer) {
      const rem = Math.max(
        0,
        Math.ceil((dayLog.activeTimer!.endsAt - nowMs()) / 1000)
      );
      remainingSec = rem;
      progress = totalSec > 0 ? 1 - rem / totalSec : 0;
    } else {
      remainingSec = totalSec;
      progress = 0;
    }
  }

  const stepIndex = tasks.findIndex((t) => t.id === nextTask.id) + 1;

  return (
    <main className="min-h-screen px-5 py-6">
      <div className="max-w-md mx-auto min-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-[#9AA7B8]">{category.title}</div>
            <div className="text-sm text-[#9AA7B8]">
              Paso {stepIndex} de {tasks.length}
            </div>
          </div>
          <div>
            <AudioBar />
          </div>
        </div>

        {/* Centro */}
        <div className="flex-1 flex flex-col justify-center">
          <h1 className="text-3xl font-semibold">{nextTask.title}</h1>

          {nextTask.description && (
            <p className="mt-3 text-sm text-[#9AA7B8]"><strong>🧠 Trabaja: </strong>{nextTask.description}</p>
          )}

          {nextTask.tip && (
            <p className="mt-3 text-sm text-[#9AA7B8]"><strong>▶️ Instrucciones: </strong>{nextTask.tip}</p>
          )}

          {nextTask.goal && (
            <p className="mt-3 text-sm text-[#9AA7B8]"><strong>🎯 Objetivo: </strong> {nextTask.goal}</p>
          )}

          {/* TIMER */}
          {nextTask.type === "timer" ? (
  // TIMER
  <div className="mt-10">
    <div className="rounded-3xl bg-[#111824] border border-white/5 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="text-xs text-[#9AA7B8]">Tiempo</div>
        <div className="text-lg font-semibold">{formatMMSS(remainingSec)}</div>
      </div>

      <div className="h-2 rounded-full bg-black/30 overflow-hidden">
        <div
          className="h-full rounded-full bg-[#4DD6C5]/80 transition-[width]"
          style={{
            width: `${Math.max(0, Math.min(1, progress)) * 100}%`,
          }}
        />
      </div>

      <div className="mt-6 flex gap-3">
        {!isActiveTimer ? (
          <button
            className="flex-1 rounded-2xl bg-[#162033] border border-white/10 px-5 py-3 font-semibold"
            onClick={() => startTimer(nextTask)}
          >
            Start
          </button>
        ) : (
          <button
            className="flex-1 rounded-2xl bg-[#162033] border border-white/10 px-5 py-3 font-semibold"
            onClick={stopTimer}
          >
            Stop
          </button>
        )}

        <button
          className="rounded-2xl border border-white/10 px-5 py-3 font-semibold"
          onClick={() => markDone(nextTask, true)}
          title="Si ya lo hiciste o querés saltear"
        >
          Done
        </button>
      </div>

      <div className="flex justify-center">
        <button
          className="mt-5 rounded-2xl bg-[#162033] border border-white/10 px-5 py-3 font-semibold"
          onClick={() => {
            router.push("/block/" + slot);
            stopAudio();
          }}
        >
          Volver al Bloque
        </button>
      </div>
    </div>
  </div>
            ) : nextTask.type === "check" ? (
            // CHECK
            <div className="mt-10">
                <button
                className="w-full rounded-2xl bg-[#162033] border border-white/10 px-5 py-4 font-semibold text-lg"
                onClick={() => markDone(nextTask, true)}
                >
                Done
                </button>
            </div>
            ) : (
            // FORM (ALCOHOL)
            <div className="mt-10">
                <div className="rounded-3xl bg-[#111824] border border-white/5 p-6">
                <div className="text-xs text-[#9AA7B8] mb-2">Checkeo</div>
                <div className="text-xl font-semibold">¿Tomaste alcohol hoy?</div>

                <div className="mt-4 flex gap-3">
                    <button
                    className={`flex-1 rounded-2xl border px-4 py-3 font-semibold ${
                        alcoholDrank === false
                        ? "bg-[#162033] border-white/20"
                        : "bg-transparent border-white/10"
                    }`}
                    onClick={() => {
                        setAlcoholDrank(false);
                        setAlcoholDrinks(0);
                    }}
                    >
                    No
                    </button>

                    <button
                    className={`flex-1 rounded-2xl border px-4 py-3 font-semibold ${
                        alcoholDrank === true
                        ? "bg-[#162033] border-white/20"
                        : "bg-transparent border-white/10"
                    }`}
                    onClick={() => setAlcoholDrank(true)}
                    >
                    Sí
                    </button>
                </div>

                {alcoholDrank === true && (
                    <div className="mt-6">
                    <div className="text-sm text-[#9AA7B8] mb-2">¿Cuántas copas?</div>

                    <div className="flex items-center justify-between rounded-2xl bg-black/20 border border-white/10 px-4 py-3">
                        <button
                        className="rounded-xl px-4 py-2 border border-white/10"
                        onClick={() => setAlcoholDrinks((n) => Math.max(0, n - 1))}
                        >
                        -
                        </button>

                        <div className="text-2xl font-semibold">{alcoholDrinks}</div>

                        <button
                        className="rounded-xl px-4 py-2 border border-white/10"
                        onClick={() => setAlcoholDrinks((n) => n + 1)}
                        >
                        +
                        </button>
                    </div>
                    </div>
                )}

                <button
                    className="mt-6 w-full rounded-2xl bg-[#162033] border border-white/10 px-5 py-4 font-semibold text-lg"
                    onClick={saveAlcoholForm}
                >
                    Guardar
                </button>

                <button
                    className="mt-4 w-full text-sm text-[#9AA7B8] underline underline-offset-4"
                    onClick={() => {
                    router.push("/block/" + slot);
                    stopAudio();
                    }}
                >
                    Volver al Bloque
                </button>
                </div>
            </div>
            )}
        </div>

        {/* Footer */}
        <div className="pb-2 text-center text-xs text-[#9AA7B8]">
          Baja luz · un paso a la vez · foco total
        </div>
      </div>
    </main>
  );
}