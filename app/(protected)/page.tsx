"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ensureTodayDayLog } from "@/lib/daylog";
import Image from "next/image";
import { motion } from "framer-motion";


import { ROUTINE } from "@/data/routine";
import type { DayLog, Slot } from "@/lib/types";

function slotTitle(slot: Slot) {
  if (slot === "morning") return "🌅 Inicio del día";
  if (slot === "day") return "☀️ Durante el día";
  return "🌙 Final del día";
}

function slotSubtitle(slot: Slot) {
  if (slot === "morning") return "Empezá el día soltando tensión y llevando atención al cuerpo.";
  if (slot === "day") return "Pequeños chequeos para sostener el cuerpo mientras el día avanza.";
  return "Cerrar. Aflojar. Descansar.";
}

export default function Page() {
  const router = useRouter();
  const [dayLog, setDayLog] = useState<DayLog | null>(null);

  useEffect(() => {
    const log = ensureTodayDayLog();
    setDayLog(log);
  }, []);

  if (!dayLog) return null;

  const slots: Slot[] = ["morning", "day", "night"]; 

  return (
      <motion.main
      initial={{ scale: 0.97, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.98, opacity: 0 }}
      className="min-h-screen px-5 py-6"
    >
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-semibold tracking-tight">Reset Ritual</h1>
        <p className="text-sm text-[#9AA7B8] mt-1">
          Un ritual diario para soltar tensión, tomar conciencia y construir hábitos más saludables.
        </p>

        <div className="mt-6 grid gap-4">
          {slots.map((slot) => {
            const tasks = ROUTINE.flatMap((c) => c.tasks).filter(
              (t) => t.enabled && t.slot === slot
            );

            const total = tasks.length;
            const done = tasks.filter((t) =>
              dayLog.completedTaskIds.includes(t.id)
            ).length;

            const status =
              done === 0 ? "Pendiente" : done < total ? "En progreso" : "Terminado";

            const percent = total === 0 ? 0 : (done / total) * 100;

            return (
              <button
                key={slot}
                className="text-left rounded-2xl bg-[#111824] border border-white/5 p-4"
                onClick={() => router.push(`/block/${slot}`)}
              >
                <div className="mb-3">
                  <Image
                    src={`/images/${slot}.png`}
                    alt={slot}
                    width={640}
                    height={360}
                    className="w-full rounded-xl opacity-90"
                    priority
                  />
               </div>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-lg font-medium">{slotTitle(slot)}</div>
                    <div className="text-sm pt-2 pb-2 text-[#9AA7B8]">
                      {slotSubtitle(slot)}
                    </div>
                    <div className="text-sm text-[#9AA7B8] mt-1">
                      {status} · {done}/{total}
                    </div>
                  </div>

                  <div className="rounded-xl px-3 py-2 text-sm font-semibold bg-[#162033] border border-white/10">
                    Abrir
                  </div>
                </div>

                <div className="mt-3 h-2 rounded-full bg-black/30 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#4DD6C5]/80"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </motion.main>
  );
}