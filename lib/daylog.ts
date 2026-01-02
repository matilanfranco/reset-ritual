import type { DayLog } from "@/lib/types";

const KEY_TODAY = "jawreset_today";
const KEY_ARCHIVE = "jawreset_archive";

// Devuelve el día "YYYY-MM-DD" en zona horaria Chicago,
// pero el "día" empieza a las 04:00 AM (Chicago).
export function getTodayKeyChicago() {
  // 1) Tomamos "ahora" pero convertido a hora Chicago
  const now = new Date();
  const chicagoNow = new Date(
    now.toLocaleString("en-US", { timeZone: "America/Chicago" })
  );

  // 2) Si antes de las 4 AM, contamos como "día anterior"
  if (chicagoNow.getHours() < 4) {
    chicagoNow.setDate(chicagoNow.getDate() - 1);
  }

  // 3) Formato YYYY-MM-DD
  const year = chicagoNow.getFullYear();
  const month = String(chicagoNow.getMonth() + 1).padStart(2, "0");
  const day = String(chicagoNow.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
/* =========================
   Storage (localStorage)
   ========================= */

export function readTodayLog(): DayLog | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem(KEY_TODAY);
  if (!raw) return null;

  return JSON.parse(raw) as DayLog;
}

export function saveTodayLog(log: DayLog) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY_TODAY, JSON.stringify(log));
}

export function addToArchive(log: DayLog) {
  if (typeof window === "undefined") return;

  const raw = localStorage.getItem(KEY_ARCHIVE);
  const archive = raw ? (JSON.parse(raw) as DayLog[]) : [];

  archive.push(log);

  localStorage.setItem(KEY_ARCHIVE, JSON.stringify(archive));
}

export function readArchive(): DayLog[] {
  if (typeof window === "undefined") return [];

  const raw = localStorage.getItem(KEY_ARCHIVE);
  return raw ? (JSON.parse(raw) as DayLog[]) : [];
}

/* =========================
   Daily reset (ensure today)
   ========================= */

export function ensureTodayDayLog(): DayLog {
  const todayKey = getTodayKeyChicago();
  const existing = readTodayLog();

  // Caso 1: no existe nada
  if (!existing) {
    const fresh: DayLog = {
        dayKey: todayKey,
        completedTaskIds: [],
        activeTimer: null,
        formAnswers: {},
        createdAt: Date.now(),
        updatedAt: Date.now(),
    };
    saveTodayLog(fresh);
    return fresh;
  }

  // Caso 2: existe pero es de otro día
  if (existing.dayKey !== todayKey) {
    addToArchive(existing);

    const fresh: DayLog = {
        dayKey: todayKey,
        completedTaskIds: [],
        activeTimer: null,
        formAnswers: {},
        createdAt: Date.now(),
        updatedAt: Date.now(),
        };
    saveTodayLog(fresh);
    return fresh;
  }

  // Caso 3: es el mismo día
  return existing;
}