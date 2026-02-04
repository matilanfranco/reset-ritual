"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabaseClient";
import { ROUTINE } from "@/data/routine";
import type { Slot } from "@/lib/types";

type DetailDay = {
  day_key: string;
  completed_task_ids: string[];
  form_answers: any;
  reflection_answers: any;
  checklist_answers: any;
  created_at: string | null;
  updated_at: string | null;
};

// ---------- Helpers ----------
function formatDateShort(dayKey: string) {
  const [, m, d] = dayKey.split("-");
  return `${d}/${m}`;
}

function parseDayKeyLocal(dayKey: string) {
  const [y, m, d] = dayKey.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

function getDateRange(fromKey: string, toKey: string) {
  const out: string[] = [];
  const from = parseDayKeyLocal(fromKey);
  const to = parseDayKeyLocal(toKey);
  if (isNaN(from.getTime()) || isNaN(to.getTime())) return out;

  const dt = new Date(from);
  while (dt <= to) {
    const y = dt.getFullYear();
    const m = String(dt.getMonth() + 1).padStart(2, "0");
    const d = String(dt.getDate()).padStart(2, "0");
    out.push(`${y}-${m}-${d}`);
    dt.setDate(dt.getDate() + 1);
  }
  return out;
}

// rating simple (sin magia)
function ratingToWord(v: any) {
  if (v == null || v === "") return null;
  if (typeof v === "number") {
    if (v === 1) return "Muy mal 😖"
    if (v === 2) return "Mal 😣";
    if (v === 3) return "Regular 😐";
    if (v === 4) return "Bien 🙂";
    if (v === 5) return "Muy bien 😌";
    return String(v);
  }
  if (typeof v === "boolean") return v ? "sí" : "no";
  return String(v);
}

function sleepTimeToPhrase(v: any) {
  if (v == null || v === "") return "Sin información";
  if (v === "00_01") return "Entre las 12 y la 1 de la mañana"
  if (v === "01_02") return "Entre la 1 y las 2 de la mañana";
  if (v === "02_03") return "Entre las 2 y las 3 de la mañana";
  if (v === "03_04") return "Entre las 3 y las 4 de la mañana";
  if (v === "after_04") return "Despues de las 4 de la mañana";
    return String(v);
}

function getTime(v: any) {
  if (typeof v === "number") {
    const hour = Math.floor(v);
    const decimal = v % 1; 
    let minutes = 0;
    if(decimal === 0) {
      minutes = 0
    }
    if(decimal === 0.25) {
      minutes = 15
    }
    if(decimal === 0.50) {
      minutes = 30
    }
    if (decimal === 0.75) {
      minutes = 45
    }
    const finalTime = hour + ":" + minutes;

    return finalTime;
  }else{
    return "Sin informacion"
  }
}


// function renderKeyValueList(obj: any) {
//   if (!obj || typeof obj !== "object" || Object.keys(obj).length === 0) {
//     return <div className="text-xs text-[#9AA7B8]">No hay información.</div>;
//   }

//   return (
//     <div className="space-y-2">
//       {Object.entries(obj).map(([key, value]) => {
//         if (value == null || value === "") return null;

//         let text = "";
//         if (typeof value === "string") text = value.trim();
//         else if (typeof value === "number" || typeof value === "boolean")
//           text = String(value);
//         else text = JSON.stringify(value, null, 2);

//         if (!text) return null;

//         return (
//           <div
//             key={key}
//             className="rounded-xl bg-[#0B0F14] border border-[#1F2937] px-3 py-2"
//           >
//             <div className="text-[10px] uppercase tracking-wider text-[#9AA7B8]">
//               {key}
//             </div>
//             <div className="mt-1 text-xs text-[#E6EDF7] whitespace-pre-wrap">
//               {text}
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// }

// function renderChecklist(obj: any) {
//   if (!obj || typeof obj !== "object" || Object.keys(obj).length === 0) {
//     return <div className="text-xs text-[#9AA7B8]">No hay información.</div>;
//   }

//   return (
//     <div className="space-y-2">
//       {Object.entries(obj).map(([key, value]) => {
//         const items = Array.isArray(value)
//           ? value.map((x) => String(x)).filter(Boolean)
//           : value == null || value === ""
//           ? []
//           : [typeof value === "string" ? value.trim() : String(value)];

//         if (items.length === 0) return null;

//         return (
//           <div
//             key={key}
//             className="rounded-xl bg-[#0B0F14] border border-[#1F2937] px-3 py-2"
//           >
//             <div className="text-[10px] uppercase tracking-wider text-[#9AA7B8]">
//               {key}
//             </div>

//             <div className="mt-2 flex flex-wrap gap-2">
//               {items.map((it, idx) => (
//                 <span
//                   key={idx}
//                   className="rounded-full bg-[#162033] border border-white/10 px-3 py-1 text-xs text-[#E6EDF7]"
//                 >
//                   {it}
//                 </span>
//               ))}
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// }

export default function HistoryPage() {
  const router = useRouter();

  const [days, setDays] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [detailDay, setDetailDay] = useState<DetailDay | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [openDayKey, setOpenDayKey] = useState<string | null>(null);

  const tasksEnabled = useMemo(() => {
    return ROUTINE.flatMap((c) => c.tasks).filter((t) => t.enabled);
  }, []);

  const totalBySlot: Record<Slot, number> = useMemo(() => {
    return {
      morning: tasksEnabled.filter((t) => t.slot === "morning").length,
      day: tasksEnabled.filter((t) => t.slot === "day").length,
      night: tasksEnabled.filter((t) => t.slot === "night").length,
    };
  }, [tasksEnabled]);

  const totalAll = totalBySlot.morning + totalBySlot.day + totalBySlot.night;

  useEffect(() => {
    (async () => {
      const supabase = getSupabaseClient();
      if (!supabase) return;

      const { data: userRes } = await supabase.auth.getUser();
      if (!userRes?.user) {
        router.replace("/login");
        return;
      }

      setLoading(true);

      const { data, error } = await supabase
        .from("focus_day_logs")
        .select("day_key, completed_task_ids")
        .eq("user_id", userRes.user.id)
        .order("day_key", { ascending: true });

      if (error || !data || data.length === 0) {
        console.error(error);
        setDays([]);
        setLoading(false);
        return;
      }

      const realDays = data.map((r) => r.day_key).sort();
      const first = realDays[0];
      const last = realDays[realDays.length - 1];

      const fullRange = getDateRange(first, last);

      const filled = fullRange.map((k) => {
        const found = data.find((r) => r.day_key === k);
        return found ? found : { day_key: k, completed_task_ids: [] };
      });

      setDays(filled.reverse());
      setLoading(false);
    })();
  }, [router]);

  async function loadDayDetails(selectedDayKey: string) {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    if (openDayKey === selectedDayKey) {
      setOpenDayKey(null);
      setDetailDay(null);
      return;
    }

    setOpenDayKey(selectedDayKey);
    setDetailLoading(true);
    setDetailDay(null);

    const { data: userRes } = await supabase.auth.getUser();
    const user = userRes?.user;
    if (!user) {
      setDetailLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("focus_day_logs")
      .select("*")
      .eq("user_id", user.id)
      .eq("day_key", selectedDayKey)
      .maybeSingle();

    if (error) {
      console.error("[History] detail error:", error);
      setDetailLoading(false);
      return;
    }

    if (data) setDetailDay(data as DetailDay);
    setDetailLoading(false);
  }

  return (
    <main className="min-h-screen px-5 py-6">
      <div className="mx-auto max-w-md">
        {/* Header */}
        <div className="flex items-end justify-between">
          <h1 className="text-2xl font-semibold">Historial</h1>
          <button
            onClick={() => router.push("/")}
            className="rounded-xl bg-[#162033] border border-white/10 px-3 py-2 text-sm font-semibold"
          >
            Volver
          </button>
        </div>

        {/* Loading list */}
        {loading && (
          <div className="mt-6 p-4 text-sm text-[#9AA7B8] bg-[#111824] rounded-xl border border-white/5">
            Cargando...
          </div>
        )}

        {/* Empty */}
        {!loading && days.length === 0 && (
          <div className="mt-6 p-4 text-sm text-[#9AA7B8] bg-[#111824] rounded-xl border border-white/5">
            No hay días aún.
          </div>
        )}

        {/* List */}
        <div className="mt-6 space-y-3">
          {days.map((dayRow) => {
            const completedIds: string[] = dayRow.completed_task_ids ?? [];

            const doneMorning = tasksEnabled.filter(
              (t) => t.slot === "morning" && completedIds.includes(t.id)
            ).length;

            const doneDay = tasksEnabled.filter(
              (t) => t.slot === "day" && completedIds.includes(t.id)
            ).length;

            const doneNight = tasksEnabled.filter(
              (t) => t.slot === "night" && completedIds.includes(t.id)
            ).length;

            const doneTotal = doneMorning + doneDay + doneNight;
            const pct = totalAll === 0 ? 0 : Math.round((doneTotal / totalAll) * 100);

            const isOpen = openDayKey === dayRow.day_key;

            return (
              <div
                key={dayRow.day_key}
                className="rounded-xl bg-[#111824] border border-white/5 p-4"
              >
                {/* Línea principal */}
                <div
                  className="flex items-center justify-between text-sm text-[#E6EDF7] cursor-pointer"
                  onClick={() => loadDayDetails(dayRow.day_key)}
                >
                  <span className="font-semibold">
                    {formatDateShort(dayRow.day_key)}
                  </span>
                  <span>🌅 {doneMorning}/{totalBySlot.morning}</span>
                  <span>☀️ {doneDay}/{totalBySlot.day}</span>
                  <span>🌙 {doneNight}/{totalBySlot.night}</span>
                  <span className="font-semibold">{pct}%</span>
                </div>

                {/* Detalle */}
                {isOpen && (
                  <div className="mt-4 space-y-3">
                    {detailLoading && (
                      <div className="text-xs text-[#9AA7B8]">
                        Cargando detalle...
                      </div>
                    )}

                    {!detailLoading &&
                      detailDay &&
                      detailDay.day_key === dayRow.day_key &&
                      (() => {
                        const forms = detailDay.form_answers ?? {};
                        console.log(forms)
                        const reflections = detailDay.reflection_answers ?? {};
                        console.log(reflections)
                        const checklists = detailDay.checklist_answers ?? {};
                        console.log(checklists)

                        const allVitamins = ["Vitamina C 🍊 - 500–1000 mg", "Vitamina D 🌞 - 1000–2000 UI", "Magnesio 💤 - 300–400 mg", "Omega 3 🧠 - 1000–1500 mg", "Zinc 🔋 - 15–30 mg", "Colágeno 🦴 - 10 g"]
                        const checklistVitaminsDb = checklists?.supl_checklist;
                        const vitaminsNotTaken = allVitamins.filter(item => !checklistVitaminsDb.includes(item));
                        console.log(vitaminsNotTaken)


                        return (
                          <>
                            {/* Reflection (mostrar contenido) */}
                            <div className="rounded-2xl bg-[#0B0F14] border border-[#1F2937] p-4">
                              <div className="text-xs font-semibold text-[#E6EDF7] pb-3">
                                📝 Respuestas:
                              </div>
                              <div
                                className="rounded-xl bg-[#0B0F14] border border-[#1F2937] px-3 py-2 mb-2"
                              >
                                <div className="text-[10px] tracking-wider text-[#9AA7B8]">
                                  😶 Como se encontraba tu mandíbula al despertar?
                                </div>
                                <div className="mb-2 mt-1 text-xs text-[#E6EDF7] whitespace-pre-wrap">
                                  {ratingToWord(reflections?.m_questionJaw.rank)}
                                </div>
                                <div className="text-[10px] tracking-wider text-[#9AA7B8]">
                                  Descripción:
                                </div>
                                <div className="mb-2 mt-1 text-xs text-[#E6EDF7] whitespace-pre-wrap">
                                  {reflections?.m_questionJaw.note}
                                </div>
                              </div>
                              <div
                                className="rounded-xl bg-[#0B0F14] border border-[#1F2937] px-3 py-2 mb-2"
                              >
                                <div className="text-[10px] tracking-wider text-[#9AA7B8]">
                                  💤 Como dormiste la noche anterior?
                                </div>
                                <div className="mb-2 mt-1 text-xs text-[#E6EDF7] whitespace-pre-wrap">
                                  {ratingToWord(reflections?.m_questionRest.rank)}
                                </div>
                                <div className="text-[10px] tracking-wider text-[#9AA7B8]">
                                  Descripción:
                                </div>
                                <div className="mb-2 mt-1 text-xs text-[#E6EDF7] whitespace-pre-wrap">
                                  {reflections?.m_questionRest.note}
                                </div>
                                <div className="text-[10px] tracking-wider text-[#9AA7B8]">
                                  Horas dormidas?
                                </div>
                                <div className="mb-2 mt-1 text-xs text-[#E6EDF7] whitespace-pre-wrap">
                                  {getTime(reflections?.m_questionRestTime.sleepHours)}
                                </div>
                                <div className="text-[10px] tracking-wider text-[#9AA7B8]">
                                  Rango horario en el que te fuiste a dormir?
                                </div>
                                <div className="mb-2 mt-1 text-xs text-[#E6EDF7] whitespace-pre-wrap">
                                  {sleepTimeToPhrase(reflections?.m_questionRestTime.sleepTime)}
                                </div>
                              </div>
                              <div
                                className="rounded-xl bg-[#0B0F14] border border-[#1F2937] px-3 py-2 mb-2"
                              >
                                <div className="text-[10px] tracking-wider text-[#9AA7B8]">
                                  🍷 Consumiste alcohol?
                                </div>
                                <div className="mb-2 mt-1 text-xs text-[#E6EDF7] whitespace-pre-wrap">
                                  {forms?.n_alcohol_check?.drank ? 'Si' : 'No'}
                                </div>
                                {forms?.n_alcohol_check?.drank && (
                                  <>
                                    <div className="text-[10px] tracking-wider text-[#9AA7B8]">
                                      Cuantas copas?
                                    </div>
                                    <div className="mb-2 mt-1 text-xs text-[#E6EDF7] whitespace-pre-wrap">
                                      {forms?.n_alcohol_check.drinks}
                                    </div>
                                  </>
                                )}
                              </div>
                              <div
                                className="rounded-xl bg-[#0B0F14] border border-[#1F2937] px-3 py-2 mb-2"
                              >
                                <div className="text-[10px] tracking-wider text-[#9AA7B8]">
                                  ❌ Checklist de vitaminas que no tomaste:
                                </div>
                                {vitaminsNotTaken.length === 0 
                                  ?  <div className="mb-2 mt-1 text-xs text-[#E6EDF7] whitespace-pre-wrap">
                                        No hay ninguna en la lista.
                                     </div>
                                  : (
                                  <ul className="mb-2 mt-1 text-xs text-[#E6EDF7] whitespace-pre-wrap">
                                  {vitaminsNotTaken.map((item, i) => (
                                    <li key={i}>- {item}</li>
                                  ))}
                                </ul>)}
                              </div>
                              {/* <div className="mt-3">{renderKeyValueList(reflections)}</div> */}
                            </div>
                          </>
                        );
                      })()}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}