"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";

import { ROUTINE } from "@/data/routine";
import { ensureTodayDayLog } from "@/lib/daylog";
import type { DayLog, Slot } from "@/lib/types";

import { useAudioStore } from "@/lib/audioStore";

const TRACKS = [
  "/audio/ambient1.mp3",
  "/audio/ambient2.mp3",
  "/audio/ambient3.mp3",
  "/audio/ambient4.mp3",
];

function slotTitle(slot: Slot) {
  if (slot === "morning") return "🌅 Inicio del día";
  if (slot === "day") return "☀️ Durante el día";
  return "🌙 Final del día";
}

function isSlot(x: any): x is Slot {
  return x === "morning" || x === "day" || x === "night";
}

export default function BlockPage() {
  const router = useRouter();
  const params = useParams();

  const slotParam = params?.slot;
  const slot: Slot = isSlot(slotParam) ? slotParam : "morning";

  const [dayLog, setDayLog] = useState<DayLog | null>(null);
  const [leaving, setLeaving] = useState(false);

  const startRandomTrack = useAudioStore((s) => s.startRandomTrack);

  useEffect(() => {
    const log = ensureTodayDayLog();
    setDayLog(log);
  }, []);

  if (!dayLog) return null;

  const categories = ROUTINE
    .map((cat) => {
      const tasks = cat.tasks
        .filter((t) => t.enabled && t.slot === slot)
        .sort((a, b) => a.order - b.order);
      return { cat, tasks };
    })
    .filter((x) => x.tasks.length > 0)
    .sort((a, b) => a.cat.order - b.cat.order);

  return (
    <motion.main
      initial={{ scale: 0.97, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.98, opacity: 0 }}
      className="min-h-screen px-5 py-6"
    >
      <div className="mx-auto max-w-md">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-semibold">{slotTitle(slot)}</h1>
        </div>

        {/* Cards */}
        <div className="mt-6 grid gap-4">
          {categories.map(({ cat, tasks }) => {
            const total = tasks.length;
            const done = tasks.filter((t) =>
              dayLog.completedTaskIds.includes(t.id)
            ).length;

            const status =
              done === 0 ? "Pending" : done < total ? "In progress" : "Done";

            const percent = total === 0 ? 0 : (done / total) * 100;

            return (
              <div
                key={cat.id}
                className="rounded-2xl bg-[#111824] border border-white/5 p-4"
              >
                {cat.img && (
                  <div className="mb-3">
                    <Image
                      src={`/images/${cat.img}`}
                      alt={cat.title}
                      width={640}
                      height={360}
                      className="w-full rounded-xl opacity-90"
                      priority
                    />
                  </div>
                )}

                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-lg font-medium">{cat.title}</div>
                    <div className="text-sm text-[#9AA7B8]">
                      {status} · {done}/{total}
                    </div>
                  </div>

                  <button
                    className="shrink-0 rounded-xl px-4 py-2 text-sm font-semibold bg-[#162033] border border-white/10"
                    onClick={() => {
                      void startRandomTrack(TRACKS);
                      router.push(`/focus/${cat.id}?slot=${slot}`);
                    }}
                  >
                    Start Focus
                  </button>
                </div>

                <div className="mt-3 h-2 rounded-full bg-black/30 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#4DD6C5]/80"
                    style={{ width: `${percent}%` }}
                  />
                </div>

                {cat.optional && (
                  <div className="mt-3 text-xs text-[#9AA7B8]">Opcional.</div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <button
          className="mt-8 w-full rounded-2xl bg-[#162033] border border-white/10 px-5 py-3 font-semibold"
          onClick={() => router.push("/")}
        >
          Volver al Dashboard
        </button>
      </div>
    </motion.main>
  );
}