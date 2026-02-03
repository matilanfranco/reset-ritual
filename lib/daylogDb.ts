import type { DayLog } from "@/lib/types";
import { getSupabaseClient } from "@/lib/supabaseClient";

type DbRow = {
  day_key: string;
  completed_task_ids: string[];
  form_answers: any;
  reflection_answers: any;
  checklist_answers: any;
  created_at: string;
  updated_at: string;
};

function rowToDayLog(row: DbRow): DayLog {
  return {
    dayKey: row.day_key,
    completedTaskIds: row.completed_task_ids ?? [],
    activeTimer: null, // NO lo traemos de DB
    formAnswers: row.form_answers ?? {},
    reflectionAnswers: row.reflection_answers ?? {},
    checklistAnswers: row.checklist_answers ?? {},
    createdAt: Date.parse(row.created_at),
    updatedAt: Date.parse(row.updated_at),
  };
}

export async function loadOrCreateDayLog(dayKey: string): Promise<DayLog | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  // 1) intentar leer
  const { data: existing, error: selErr } = await supabase
    .from("focus_day_logs")
    .select("day_key, completed_task_ids, form_answers, reflection_answers, checklist_answers, created_at, updated_at")
    .eq("user_id", user.id)
    .eq("day_key", dayKey)
    .maybeSingle();

  if (selErr) {
    console.error("[loadOrCreateDayLog] select error:", selErr);
    return null;
  }

  if (existing) return rowToDayLog(existing as any);

  // 2) si no existe, crear
  const { data: created, error: insErr } = await supabase
    .from("focus_day_logs")
    .insert({
      user_id: user.id,
      day_key: dayKey,
      completed_task_ids: [],
      form_answers: {},
      reflection_answers: {},
      checklist_answers: {},
    })
    .select("day_key, completed_task_ids, form_answers, reflection_answers, checklist_answers, created_at, updated_at")
    .single();

  if (insErr) {
    console.error("[loadOrCreateDayLog] insert error:", insErr);
    return null;
  }

  return rowToDayLog(created as any);
}

export async function saveDayLogToDb(log: DayLog): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) return;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  // Guardamos SOLO lo que te importa en DB
  const payload = {
    user_id: user.id,
    day_key: log.dayKey,
    completed_task_ids: log.completedTaskIds ?? [],
    form_answers: log.formAnswers ?? {},
    reflection_answers: log.reflectionAnswers ?? {},
    checklist_answers: log.checklistAnswers ?? {},
  };

  const { error } = await supabase
    .from("focus_day_logs")
    .upsert(payload, { onConflict: "user_id,day_key" });

  if (error) console.error("[saveDayLogToDb] upsert error:", error);
}