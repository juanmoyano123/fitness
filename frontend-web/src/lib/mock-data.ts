// Mock Data para Demo Mode
// Estos datos se usarán hasta implementar el backend en Fase 3

export interface Client {
  id: string;
  name: string;
  email: string;
  gender?: "male" | "female" | "other" | "prefer-not-to-say";
  age?: number;
  goals?: string;
  avatar?: string;
  adherence: number; // 0-100%
  lastActivity: string;
  status: "active" | "archived";
  createdAt: Date;
  workoutsCompleted: number;
  workoutsAssigned: number;
}

export const MOCK_CLIENTS: Client[] = [
  {
    id: "client-1",
    name: "Laura Gómez",
    email: "laura@example.com",
    gender: "female",
    age: 28,
    goals: "Perder 5kg y ganar resistencia cardiovascular",
    adherence: 75,
    lastActivity: "Hace 2 horas",
    status: "active",
    createdAt: new Date("2025-10-15"),
    workoutsCompleted: 12,
    workoutsAssigned: 16,
  },
  {
    id: "client-2",
    name: "Juan Pérez",
    email: "juan@example.com",
    gender: "male",
    age: 35,
    goals: "Ganar masa muscular en tren superior",
    adherence: 88,
    lastActivity: "Hace 1 día",
    status: "active",
    createdAt: new Date("2025-09-20"),
    workoutsCompleted: 28,
    workoutsAssigned: 32,
  },
  {
    id: "client-3",
    name: "María López",
    email: "maria@example.com",
    gender: "female",
    age: 42,
    goals: "Mejorar movilidad y fuerza funcional",
    adherence: 92,
    lastActivity: "Hace 3 horas",
    status: "active",
    createdAt: new Date("2025-08-10"),
    workoutsCompleted: 45,
    workoutsAssigned: 48,
  },
  {
    id: "client-4",
    name: "Carlos Martínez",
    email: "carlos@example.com",
    gender: "male",
    age: 29,
    goals: "Preparación para maratón",
    adherence: 35,
    lastActivity: "Hace 7 días",
    status: "active",
    createdAt: new Date("2025-11-01"),
    workoutsCompleted: 4,
    workoutsAssigned: 12,
  },
  {
    id: "client-5",
    name: "Ana Silva",
    email: "ana@example.com",
    gender: "female",
    age: 31,
    goals: "Tonificar y mejorar postura",
    adherence: 65,
    lastActivity: "Hace 2 días",
    status: "active",
    createdAt: new Date("2025-10-25"),
    workoutsCompleted: 8,
    workoutsAssigned: 12,
  },
];

export interface Exercise {
  id: string;
  name: string;
  nameEs: string;
  category: "strength" | "cardio" | "flexibility" | "balance";
  muscleGroup: string;
  equipment: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  instructions: string;
  gifUrl?: string;
  videoUrl?: string;
}

export const MOCK_EXERCISES: Exercise[] = [
  {
    id: "ex-1",
    name: "Barbell Squat",
    nameEs: "Sentadilla con Barra",
    category: "strength",
    muscleGroup: "Piernas",
    equipment: ["Barra", "Discos"],
    difficulty: "intermediate",
    instructions:
      "Coloca la barra sobre los trapecios. Pies a ancho de hombros. Desciende hasta que muslos estén paralelos al suelo. Sube empujando con talones.",
    gifUrl: "https://api.exercisedb.io/image/example-squat",
  },
  {
    id: "ex-2",
    name: "Bench Press",
    nameEs: "Press de Banca",
    category: "strength",
    muscleGroup: "Pecho",
    equipment: ["Barra", "Banco"],
    difficulty: "intermediate",
    instructions:
      "Acostado en banco, baja la barra hasta el pecho. Empuja hacia arriba hasta extensión completa de brazos.",
    gifUrl: "https://api.exercisedb.io/image/example-bench",
  },
  {
    id: "ex-3",
    name: "Deadlift",
    nameEs: "Peso Muerto",
    category: "strength",
    muscleGroup: "Espalda",
    equipment: ["Barra", "Discos"],
    difficulty: "advanced",
    instructions:
      "Pies debajo de la barra. Agarre mixto o doble overhand. Espalda recta, levanta la barra pegada al cuerpo.",
    gifUrl: "https://api.exercisedb.io/image/example-deadlift",
  },
  {
    id: "ex-4",
    name: "Pull Up",
    nameEs: "Dominadas",
    category: "strength",
    muscleGroup: "Espalda",
    equipment: ["Barra de dominadas"],
    difficulty: "intermediate",
    instructions:
      "Agarre prono, manos más anchas que hombros. Sube hasta que barbilla pase la barra. Desciende con control.",
    gifUrl: "https://api.exercisedb.io/image/example-pullup",
  },
  {
    id: "ex-5",
    name: "Running",
    nameEs: "Correr",
    category: "cardio",
    muscleGroup: "Cardiovascular",
    equipment: ["Ninguno"],
    difficulty: "beginner",
    instructions: "Mantén ritmo constante. Respiración controlada. Postura erguida.",
    gifUrl: "https://api.exercisedb.io/image/example-running",
  },
  {
    id: "ex-6",
    name: "Plank",
    nameEs: "Plancha",
    category: "strength",
    muscleGroup: "Core",
    equipment: ["Ninguno"],
    difficulty: "beginner",
    instructions:
      "Apoya antebrazos y dedos de pies. Mantén cuerpo recto de cabeza a talones. Contrae abdomen.",
    gifUrl: "https://api.exercisedb.io/image/example-plank",
  },
];

export interface WorkoutExercise {
  exerciseId: string;
  sets: number;
  reps: number;
  weight?: number;
  rest: number; // seconds
  notes?: string;
}

export interface Workout {
  id: string;
  name: string;
  description: string;
  category: "strength" | "cardio" | "hybrid" | "flexibility";
  difficulty: "beginner" | "intermediate" | "advanced";
  duration: number; // minutes
  exercises: WorkoutExercise[];
  createdAt: Date;
  createdBy: string; // trainer ID
}

export const MOCK_WORKOUTS: Workout[] = [
  {
    id: "workout-1",
    name: "Full Body A",
    description: "Rutina de fuerza full body para principiantes",
    category: "strength",
    difficulty: "beginner",
    duration: 60,
    exercises: [
      { exerciseId: "ex-1", sets: 3, reps: 10, weight: 40, rest: 90 },
      { exerciseId: "ex-2", sets: 3, reps: 8, weight: 50, rest: 90 },
      { exerciseId: "ex-6", sets: 3, reps: 30, rest: 60, notes: "Segundos" },
    ],
    createdAt: new Date("2025-11-10"),
    createdBy: "trainer-1",
  },
  {
    id: "workout-2",
    name: "Upper Body Strength",
    description: "Entrenamiento de tren superior con énfasis en pecho y espalda",
    category: "strength",
    difficulty: "intermediate",
    duration: 75,
    exercises: [
      { exerciseId: "ex-2", sets: 4, reps: 8, weight: 60, rest: 120 },
      { exerciseId: "ex-4", sets: 4, reps: 6, rest: 120 },
    ],
    createdAt: new Date("2025-11-12"),
    createdBy: "trainer-1",
  },
];
