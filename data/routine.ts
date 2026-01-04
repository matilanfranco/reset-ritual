import type { Category, Task } from "@/lib/types";

export type RoutineCategory = Category & {
  tasks: Task[];
};

export const ROUTINE: RoutineCategory[] = [
  {
    id: "massage",
    title: "Masajes ATM",
    order: 1,
    img: "massage.png",
    tasks: [
      // 🌅 MORNING
      {
        id: "m_massage_temples",
        categoryId: "massage",
        slot: "morning",
        title: "Masaje temporal (SIEN)",
        type: "timer",
        durationSec: 60,
        description: "Trabaja el músculo temporal. La zona se encuentra arriba del pómulo, costado de la cabeza.",
        tip: "Círculos suaves con las yemas de los dedos. Presión media (no dolor).",
        goal: "mejorar irrigación y soltar tensión crónica que inhibe crecimiento muscular.",
        order: 1,
        enabled: true,
      },
      {
        id: "m_massage_masseters",
        categoryId: "massage",
        slot: "morning",
        title: "Masaje ATM (delante del oído)",
        type: "timer",
        description: "Trabaja la descarga del bruxismo.",
        goal: "Bajar hiperactividad → permitir recuperación muscular simétrica.",
        durationSec: 60,
        tip: "Abrís y cerrás suavemente la boca mientras hacés círculos lentos con los dedos. Muy suave por la mañana.",
        order: 2,
        enabled: true,
      },
       {
        id: "m_massage_cheeck",
        categoryId: "massage",
        slot: "morning",
        title: "Masaje mejilla / cigomático",
        type: "timer",
        durationSec: 60,
        description: "Trabaja el volumen del pómulo. La zona es entre el masetero y la boca.",
        tip: "Deslizá dedos desde la comisura del labio hacia arriba y afuera. Movimiento lento y ascendente.",
        goal: "Estimular músculo, drenaje y soporte del pómulo.",
        order: 2,
        enabled: true,
      },
      // {
      //   id: "m_massage_neck",
      //   categoryId: "massage",
      //   slot: "morning",
      //   title: "Cuello / base del cráneo",
      //   type: "timer",
      //   durationSec: 60,
      //   tip: "Exhalá largo. Aflojá trapecios.",
      //   order: 3,
      //   enabled: true,
      // },
      {
        id: "m_massage_intraoral",
        categoryId: "massage",
        slot: "morning",
        title: "Masaje intraoral (cachete / buccinador)",
        type: "timer",
        description: "Trabaja músculo profundo del cachete (buccinador) y soporte del pómulo.",
        durationSec: 45,
        tip: "Colocar el pulgar dentro de la boca apoyado en el cachete. Colocar el índice por fuera de la mejilla (pinza suave). Aplicar presión suave a media. Realizar movimientos lentos y pequeños (circulares o de estiramiento)",
        goal: "Liberar tensión profunda, reactivar músculo inhibido y favorecer recuperación de volumen en mejilla y pómulo.",
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
    id: "facial-excercises",
    title: "Ejercicios Faciales",
    order: 2,
    img: "facial-exercises.png",
    tasks: [
        {
          id: "m_exercise_temples",
          categoryId: "facial-excercises",
          slot: "morning",
          title: "“O” grande (activación global)",
          goal: "Activa sien, mejilla y musculatura profunda.",
          tip: "Abre tu boca formando una O de manera exagerada por 15 segundos y luego relaja. Realizalo 3 veces.",
          type: "timer",
          durationSec: 60,
          order: 1,
          enabled: true
        },
        {
          id: "m_exercise_smile",
          categoryId: "facial-excercises",
          slot: "morning",
          title: "Sonrisa forzada sin abrir boca",
          goal: "Estimula directamente el músculo cigomático (volumen).",
          tip: "Mantener una sonrisa máxima elevando pómulos por 15 segundos y luego relajar. Repetir 5 veces.",
          type: "timer",
          durationSec: 90,
          order: 2,
          enabled: true
        },
        {
          id: "m_exercise_aperture",
          categoryId: "facial-excercises",
          slot: "morning",
          title: "Apertura lateral de mandíbula",
          description: "Trabaja la movilidad de ATM y equilibrio lateral",
          goal: "Estimula directamente el músculo cigomático (volumen).",
          tip: "Abre la boca y desplaza la mandíbula a la derecha. Vuelve al centro y repetitelo hacia la izquierda. Hazlo a un ritmo lento y controlado. Repetir 5 veces por lado.",
          type: "check",
          img: "",
          order: 3,
          enabled: true
        },
        {
          id: "m_exercise_circles",
          categoryId: "facial-excercises",
          slot: "morning",
          title: "Círculos mandibulares",
          description: "Trabaja la coordinación y descarga articular.",
          goal: "Lubrica la articulación y baja tensión matinal.",
          tip: "Abre la boca y dibuja círculos amplios con la mandíbula. Primero en un sentido, luego en el otro a un ritmo lento. Realizar 5 círculos por lado.",
          type: "check",
          img: "",
          order: 4,
          enabled: true
        },
        {
          id: "m_exercise_tongue",
          categoryId: "facial-excercises",
          slot: "morning",
          title: "Protrusión lingual (lengua afuera)",
          description: "Trabaja la lengua, el piso de boca y el control mandibular.",
          goal: "Mejora postura lingual y reduce bruxismo reflejo.",
          tip: "Saca la lengua lo más recta posible y mantener por unos 3 segundos. Volver a meter. Realizar 8 repeticiones.",
          type: "check",
          img: "",
          order: 5,
          enabled: true
        },
        {
          id: "m_exercise_chin",
          categoryId: "facial-excercises",
          slot: "morning",
          title: "Adelantar el mentón (protrusión mandibular)",
          description: "Trabaja el control mandibular anterior.",
          goal: "Reeduca posición mandibular y libera ATM.",
          tip: "Con la boca cerrada, adelantar el mentón suavemente, mantener por unos 3 segundos y volver a posición neutra. Realizar entre 5 y 8 repeticiones.",
          type: "check",
          img: "",
          order: 6,
          enabled: true
        }
      ]
  },

  {
    id: "breath",
    title: "Respiración",
    order: 3,
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
        goal: "Reeduca la posición natural de la mandíbula y alivia la presión constante sobre la articulación.",
        tip: "Coloca la punta de la lengua contra el paladar, justo detrás de los dientes superiores, y mantiene los dientes inferiores y superiores ligeramente separados (sin contacto). Respira por la nariz en esa posición relajada.",
        order: 1,
        enabled: true,
      },

      // ☀️ DAY
      {
        id: "d_breath_46",
        categoryId: "breath",
        slot: "day",
        title: "Respiración nasal (in 4 / out 6)",
        type: "timer",
        durationSec: 120,
        goal: "Reeduca la posición natural de la mandíbula y alivia la presión constante sobre la articulación.",
        tip: "Coloca la punta de la lengua contra el paladar, justo detrás de los dientes superiores, y mantiene los dientes inferiores y superiores ligeramente separados (sin contacto). Respira por la nariz en esa posición relajada.",
        order: 1,
        enabled: true,
      }
    ],
  },

  {
    id: "heat",
    title: "Calor",
    order: 4,
    optional: true,
    img: "heat.png",
    tasks: [
      // 🌅 NIGHT
      {
        id: "n_heat_warm",
        categoryId: "heat",
        slot: "night",
        title: "🔥 Compresa tibia",
        type: "timer",
        durationSec: 900,
        goal: "relajar la musculatura, mejorar la circulación local y facilitar la liberación de tensión antes de los masajes.",
        tip: "aplicar una compresa tibia o una cinta de calor sobre la zona de la sien y la articulación mandibular (ATM). Mantener una temperatura agradable, nunca caliente.",
        order: 1,
        enabled: true,
      },
    ],
  },

  {
    id: "checks",
    title: "Chequeos",
    order: 5,
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
    order: 6,
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
    order: 7,
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

  {
    id: "meditation",
    title: "Meditación",
    order: 8,
    img: "meditation.png",
    tasks: [
      {
        id: "n_meditation_10",
        categoryId: "meditation",
        slot: "night",
        title: "🌙 Meditación nocturna - relajación corporal",
        tip: "Hacer la meditacion acostado boca arriba. Primeros 3 minutos: respiración 4-4-4-4. Luego 3 minutos de conciencia corporal: Recorrer el cuerpo de pies a cabeza y darle atencion a los lugares que generan mas molestias y necesitan relajar. Dedicarle 2-3 minutos a la mandibula, relajar, concentrarse en la postura correcta de la lengua y dientes.",
        type: "timer",
        goal: "Relajar el cuerpo, calmar el sistema nervioso y reducir la tensión mandibular antes de dormir.",
        durationSec: 600,
        order: 1,
        enabled: true,
      },
    ],
  },
];