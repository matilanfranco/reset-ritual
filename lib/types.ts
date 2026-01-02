export type Slot = "morning" | "day" | "night";

export type CategoryId = string;

export type Category = {
  id: CategoryId;
  title: string;
  order: number;
  optional?: boolean;
  img?: string; // 👈 clave
};

export type TaskType = "timer" | "check" | "form";

export type Task = {
  id: string;
  categoryId: CategoryId;
  slot: Slot;

  title: string;
  tip?: string;

  type: TaskType;
  durationSec?: number; // solo si type === "timer"

  // solo si type === "form"
  formKind?: "alcohol";

  order: number;
  enabled: boolean;
};

export type ActiveTimer = {
  taskId: string;
  startedAt: number;
  endsAt: number;
};

export type DayLog = {
  dayKey: string;
  completedTaskIds: string[];
  activeTimer: ActiveTimer | null;

  // respuestas de forms (por taskId)
  formAnswers?: Record<string, unknown>;

  createdAt: number;
  updatedAt: number;
};