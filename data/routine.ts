import type { Category, Task } from "@/lib/types";

export type RoutineCategory = Category & {
  tasks: Task[];
};

export const ROUTINE: RoutineCategory[] = [
  {
    id: "massage",
    title: "Masajes",
    order: 1,
    img: "massage.png",
    tasks: [
      // 🌅 MORNING
      {
        id: "m_massage_temples",
        categoryId: "massage",
        slot: "morning",
        title: "Sienes (ambas manos)",
        type: "timer",
        durationSec: 120,
        tip: "Círculos suaves. Sin dolor. No presiones fuerte.",
        order: 1,
        enabled: true,
      },
      {
        id: "m_massage_masseters",
        categoryId: "massage",
        slot: "morning",
        title: "Maseteros (ambas manos)",
        type: "timer",
        durationSec: 120,
        tip: "Mandíbula floja. Respiración nasal.",
        order: 2,
        enabled: true,
      },
      {
        id: "m_massage_neck",
        categoryId: "massage",
        slot: "morning",
        title: "Cuello / base del cráneo",
        type: "timer",
        durationSec: 120,
        tip: "Exhalá largo. Aflojá trapecios.",
        order: 3,
        enabled: true,
      },

      // ☀️ DAY
      {
        id: "d_massage_neck_90",
        categoryId: "massage",
        slot: "day",
        title: "Cuello suave (90s)",
        type: "timer",
        durationSec: 90,
        tip: "Sin estirar fuerte. Solo aflojar.",
        order: 1,
        enabled: true,
      },

      // 🌙 NIGHT
      {
        id: "n_massage_masseters",
        categoryId: "massage",
        slot: "night",
        title: "Maseteros (ambas manos) suave",
        type: "timer",
        durationSec: 120,
        tip: "Suave. Si duele, bajá intensidad.",
        order: 1,
        enabled: true,
      },
    ],
  },

  {
    id: "breath",
    title: "Respiración",
    order: 2,
    img: "breath.png",
    tasks: [
      // 🌅 MORNING
      {
        id: "m_breath_46",
        categoryId: "breath",
        slot: "morning",
        title: "Respiración nasal (in 4 / out 6)",
        type: "timer",
        durationSec: 120,
        tip: "Exhalación larga = bajás el sistema.",
        order: 1,
        enabled: true,
      },

      // ☀️ DAY
      {
        id: "d_breath_60",
        categoryId: "breath",
        slot: "day",
        title: "Respiración nasal 60s",
        type: "timer",
        durationSec: 60,
        tip: "Inhalá suave, exhalá más largo.",
        order: 1,
        enabled: true,
      },

      // 🌙 NIGHT
      {
        id: "n_breath_downshift",
        categoryId: "breath",
        slot: "night",
        title: "Respiración lenta (3 min)",
        type: "timer",
        durationSec: 180,
        tip: "Exhalación larga. Nariz.",
        order: 1,
        enabled: true,
      },
    ],
  },

  {
    id: "heat",
    title: "Calor",
    order: 3,
    optional: true,
    img: "heat.png",
    tasks: [
      // 🌅 MORNING
      {
        id: "m_heat_warm",
        categoryId: "heat",
        slot: "morning",
        title: "Compresa tibia (sien/mandíbula)",
        type: "timer",
        durationSec: 300,
        tip: "Calor suave. No quemar.",
        order: 1,
        enabled: true,
      },
    ],
  },

  {
    id: "checks",
    title: "Chequeos",
    order: 4,
    img: "checks.png",
    tasks: [
      // 🌅 MORNING
      {
        id: "m_check_jaw",
        categoryId: "checks",
        slot: "morning",
        title: "Postura mandíbula (labios juntos, dientes separados)",
        type: "check",
        tip: "Lengua suave en el paladar.",
        order: 1,
        enabled: true,
      },
      {
        id: "m_check_water",
        categoryId: "checks",
        slot: "morning",
        title: "Tomar agua (1 vaso)",
        type: "check",
        order: 2,
        enabled: true,
      },

      // ☀️ DAY
      {
        id: "d_check_jaw_reset",
        categoryId: "checks",
        slot: "day",
        title: "Jaw reset (10s)",
        type: "check",
        tip: "Labios juntos, dientes separados, lengua suave. Soltá hombros.",
        order: 1,
        enabled: true,
      },
      {
        id: "d_check_eyes",
        categoryId: "checks",
        slot: "day",
        title: "Pantallas: 20-20-20",
        type: "check",
        tip: "20s mirando lejos cada tanto.",
        order: 2,
        enabled: true,
      },
      {
        id: "d_check_water",
        categoryId: "checks",
        slot: "day",
        title: "Hidratación",
        type: "check",
        order: 3,
        enabled: true,
      },
    ],
  },

  {
    id: "night-checks",
    title: "ChequeosNocturnos",
    order: 5,
    img: "nightchecks.png",
    tasks: [
      {
        id: "n_check_tongue",
        categoryId: "night-checks",
        slot: "night",
        title: "Lengua suave / mandíbula suelta",
        type: "check",
        order: 1,
        enabled: true,
      },
      {
        id: "n_check_splint",
        categoryId: "night-checks",
        slot: "night",
        title: "Placa puesta",
        type: "check",
        order: 2,
        enabled: true,
      },
    ],
  },

  // Las dejé creadas para que existan, pero sin tasks por ahora (no rompe nada)
  {
    id: "alcohol",
    title: "Alcohol",
    order: 6,
    img: "alcohol.png",
    tasks: [
      {
        id: "n_alcohol_check",
        categoryId: "alcohol",
        slot: "night",
        title: "Alcohol (hoy)",
        tip: "Checkeo interno, sin culpa. Solo datos.",
        type: "form",
        formKind: "alcohol",
        order: 1,
        enabled: true,
      },
    ],
  },
];