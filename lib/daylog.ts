import type { DayLog } from "@/lib/types";

const KEY_TODAY = "jawreset_today";
const KEY_ARCHIVE = "jawreset_archive";

// Devuelve el día "YYYY-MM-DD" pero en zona horaria Chicago
export function getTodayKeyChicago() {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Chicago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return formatter.format(new Date()); // ej: "2025-12-31"
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