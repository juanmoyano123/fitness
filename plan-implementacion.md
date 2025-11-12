# PLAN DE IMPLEMENTACIÓN - FitCompass Pro
## Estrategia: Front-End Completo → Backend Feature por Feature

---

## 📋 RESUMEN EJECUTIVO

### Enfoque Estratégico

**El cliente quiere:** Primero armar toda la arquitectura del front-end con todas las pantallas visuales, y luego ir agregando funcionalidades e integrando backend de a poco.

**Nuestra estrategia:**
1. **FASE 0:** Setup inicial del proyecto (2-3 días)
2. **FASE 1:** Front-End Completo con Mockdata (2 semanas)
   - Todas las pantallas navegables
   - UI/UX completa según design-system.md
   - Datos simulados en archivos TypeScript/JSON
3. **FASE 2:** Integración Backend Feature por Feature (8-10 semanas)
   - Según dependencias definidas en dependencias-features.md
   - Integrando Supabase, APIs y funcionalidades reales

**Ventajas de este enfoque:**
- ✅ Visualización temprana del producto completo
- ✅ Validación de UX/UI antes de invertir en backend
- ✅ Frontend y Backend pueden trabajar en paralelo después de FASE 1
- ✅ Demos y testing de usabilidad desde semana 2
- ✅ Iteración rápida sin tocar base de datos

---

## 📦 FASE 0: SETUP INICIAL
**Duración:** 2-3 días
**Objetivo:** Proyecto configurado y listo para desarrollo front-end

### Día 1: Setup Next.js + Tailwind + TypeScript

**Comandos exactos a ejecutar:**

```bash
# 1. Crear proyecto Next.js con TypeScript
cd /Users/jeroniki/Documents/Github/fitness
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*"

# Responder:
# ✓ Would you like to use TypeScript? → Yes
# ✓ Would you like to use ESLint? → Yes
# ✓ Would you like to use Tailwind CSS? → Yes
# ✓ Would you like to use `src/` directory? → No
# ✓ Would you like to use App Router? → Yes
# ✓ Would you like to customize the default import alias? → Yes (@/*)

# 2. Instalar dependencias core
npm install zustand @tanstack/react-query zod react-hook-form
npm install @hookform/resolvers clsx tailwind-merge class-variance-authority
npm install lucide-react @radix-ui/react-slot

# 3. Instalar shadcn/ui
npx shadcn-ui@latest init

# Responder:
# ✓ Which style would you like to use? → Default
# ✓ Which color would you like to use as base color? → Slate
# ✓ Would you like to use CSS variables for colors? → Yes

# 4. Instalar componentes shadcn/ui necesarios
npx shadcn-ui@latest add button input card badge table tabs dialog select avatar dropdown-menu

# 5. Instalar herramientas de desarrollo
npm install -D prettier eslint-config-prettier
npm install -D @typescript-eslint/parser @typescript-eslint/eslint-plugin

# 6. Instalar Framer Motion para animaciones
npm install framer-motion

# 7. Instalar Recharts para gráficos
npm install recharts
```

**Estructura de carpetas a crear:**

```bash
# Crear estructura de carpetas
mkdir -p app/\(public\)
mkdir -p app/\(auth\)
mkdir -p app/\(dashboard\)
mkdir -p components/ui
mkdir -p components/layout
mkdir -p components/dashboard
mkdir -p components/clients
mkdir -p components/exercises
mkdir -p components/workouts
mkdir -p lib/mockdata
mkdir -p hooks
mkdir -p types
mkdir -p styles
```

**Archivos de configuración:**

```bash
# Crear archivo de configuración de Prettier
cat > .prettierrc.json << 'EOF'
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80
}
EOF

# Actualizar tailwind.config.ts con design tokens
# (copiar configuración del design-system.md)
```

### Día 2: Configuración Design System

**1. Actualizar `tailwind.config.ts`:**

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Design system colors (del design-system.md)
        primary: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
        },
        secondary: {
          50: '#FAF5FF',
          100: '#F3E8FF',
          200: '#E9D5FF',
          300: '#D8B4FE',
          400: '#C084FC',
          500: '#A855F7',
          600: '#9333EA',
          700: '#7E22CE',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
```

**2. Crear archivo de fuentes `app/layout.tsx`:**

```typescript
// app/layout.tsx
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
```

**3. Actualizar `app/globals.css`:**

```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Colors */
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 239 84% 67%;
    --primary-foreground: 210 40% 98%;

    /* Spacing (4px grid) */
    --spacing-xs: 0.25rem; /* 4px */
    --spacing-sm: 0.5rem; /* 8px */
    --spacing-md: 1rem; /* 16px */
    --spacing-lg: 1.5rem; /* 24px */
    --spacing-xl: 2rem; /* 32px */

    /* Border Radius */
    --radius-sm: 0.25rem; /* 4px */
    --radius-md: 0.5rem; /* 8px */
    --radius-lg: 0.75rem; /* 12px */
    --radius-xl: 1rem; /* 16px */

    /* Shadows */
    --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
    --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
    --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
  }
}
```

### Día 3: Setup React Native + Expo (Mobile)

**Comandos exactos:**

```bash
# En carpeta separada para mobile
cd /Users/jeroniki/Documents/Github/fitness
npx create-expo-app@latest fitness-mobile --template blank-typescript

cd fitness-mobile

# Instalar dependencias core
npx expo install expo-router react-native-safe-area-context react-native-screens
npx expo install expo-image expo-font @expo/vector-icons
npx expo install @react-navigation/native @react-navigation/bottom-tabs

# Instalar state management
npm install zustand @tanstack/react-query

# Instalar UI components
npm install react-native-paper
npm install react-native-svg

# Configurar Expo Router
npx expo install expo-linking expo-constants expo-status-bar
```

**Estructura de carpetas mobile:**

```bash
mkdir -p app/\(tabs\)
mkdir -p components/common
mkdir -p components/workout
mkdir -p lib/mockdata
mkdir -p hooks
mkdir -p types
mkdir -p constants
```

---

## 🎨 FASE 1: FRONT-END COMPLETO CON MOCKDATA
**Duración:** 2 semanas (10 días hábiles)
**Objetivo:** Todas las pantallas navegables con UI completa pero sin backend real

---

## 1A: LANDING + AUTH UI (3-4 días)

### Día 1-2: Landing Page + Auth Web

**Pantallas a implementar:**

1. **Landing Page** (`app/(public)/page.tsx`)
   - Hero section con screenshot placeholder
   - Features grid (3 features principales)
   - Pricing cards (4 planes)
   - Testimonials carousel
   - CTA sections
   - Footer

2. **Login** (`app/(auth)/login/page.tsx`)
   - Formulario email/password
   - Botón Google OAuth (UI only)
   - Link a registro
   - Link "Olvidé contraseña"

3. **Registro** (`app/(auth)/register/page.tsx`)
   - Formulario nombre/email/password
   - Botón Google OAuth (UI only)
   - Link a login

**Mockdata necesaria:**

```typescript
// lib/mockdata/landing.ts
export const features = [
  {
    id: 1,
    icon: 'Users',
    title: 'Gestión de Clientes',
    description: 'Administra todos tus clientes en un solo lugar',
  },
  {
    id: 2,
    icon: 'Dumbbell',
    title: 'Constructor de Rutinas',
    description: 'Crea rutinas personalizadas en minutos',
  },
  {
    id: 3,
    icon: 'Smartphone',
    title: 'App Móvil para Clientes',
    description: 'Tus clientes ven rutinas en su celular',
  },
]

export const pricingPlans = [
  {
    id: 1,
    name: 'Free',
    price: 0,
    features: ['Hasta 5 clientes', 'Rutinas ilimitadas', 'Dashboard básico'],
  },
  {
    id: 2,
    name: 'Starter',
    price: 15,
    features: ['Hasta 20 clientes', 'Todo de Free', 'App móvil'],
  },
  // ... más planes
]

export const testimonials = [
  {
    id: 1,
    name: 'Juan Pérez',
    role: 'Entrenador Personal',
    avatar: '/avatars/juan.jpg',
    content: 'FitCompass cambió mi forma de trabajar...',
    rating: 5,
  },
  // ... más testimonios
]
```

**Componentes a crear:**

```typescript
// components/landing/Hero.tsx
// components/landing/FeaturesGrid.tsx
// components/landing/PricingCards.tsx
// components/landing/Testimonials.tsx
// components/auth/LoginForm.tsx
// components/auth/RegisterForm.tsx
```

**Navegación simulada:**

```typescript
// app/(auth)/login/page.tsx
'use client'

export default function LoginPage() {
  const handleLogin = (e: FormEvent) => {
    e.preventDefault()
    // Sin validación real, solo redirect
    window.location.href = '/dashboard'
  }

  return <LoginForm onSubmit={handleLogin} />
}
```

### Día 3: Wizard de Onboarding

**Pantallas a implementar:**

4. **Wizard Onboarding** (`app/(auth)/onboarding/page.tsx`)
   - Step 1: Nombre gimnasio + foto (upload placeholder)
   - Step 2: Zona horaria (dropdown)
   - Step 3: Confirmación
   - Progress indicator (3 dots)

**Estado local para wizard:**

```typescript
// app/(auth)/onboarding/page.tsx
'use client'
import { useState } from 'react'

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    gymName: '',
    avatar: null,
    timezone: 'America/Buenos_Aires'
  })

  const handleNext = () => {
    if (step < 3) setStep(step + 1)
    else {
      // Guardar en localStorage (simulado)
      localStorage.setItem('onboarding', JSON.stringify(formData))
      window.location.href = '/dashboard'
    }
  }

  return (
    <div>
      <ProgressDots current={step} total={3} />
      {step === 1 && <Step1 data={formData} onChange={setFormData} />}
      {step === 2 && <Step2 data={formData} onChange={setFormData} />}
      {step === 3 && <Step3 />}
      <button onClick={handleNext}>Siguiente</button>
    </div>
  )
}
```

**Mockdata:**

```typescript
// lib/mockdata/timezones.ts
export const timezones = [
  { value: 'America/Buenos_Aires', label: '(GMT-3) Buenos Aires' },
  { value: 'America/Mexico_City', label: '(GMT-6) Ciudad de México' },
  { value: 'America/Santiago', label: '(GMT-4) Santiago' },
  // ... más zonas
]
```

### Día 4: Testing Responsive + Pulido

- Responsive de todas las pantallas (mobile/tablet/desktop)
- Animaciones con Framer Motion
- Loading states
- Error states (UI)
- Fix de bugs visuales

---

## 1B: DASHBOARD ENTRENADOR UI (3-4 días)

### Día 5-6: Dashboard Principal + Lista de Clientes

**Pantallas a implementar:**

5. **Dashboard Principal** (`app/(dashboard)/dashboard/page.tsx`)
   - Sidebar con navegación
   - Stats cards (Total/Activos/Pausados)
   - Sección "Actividad de Hoy"
   - Tabla de clientes recientes

6. **Lista de Clientes** (`app/(dashboard)/clients/page.tsx`)
   - Search bar
   - Filtros (dropdown)
   - Cliente cards (lista)
   - Botón "Nuevo Cliente"
   - Empty state

**Mockdata necesaria:**

```typescript
// lib/mockdata/clients.ts
export const mockClients = [
  {
    id: '1',
    name: 'Juan Pérez',
    email: 'juan@email.com',
    phone: '+54 11 1234-5678',
    avatar: '/avatars/juan.jpg',
    status: 'active' as const,
    goals: 'Ganar masa muscular',
    notes: 'Cliente muy comprometido',
    lastActivity: new Date('2025-01-12T08:30:00'),
    createdAt: new Date('2025-01-01'),
  },
  {
    id: '2',
    name: 'María García',
    email: 'maria@email.com',
    phone: '+54 11 2345-6789',
    avatar: '/avatars/maria.jpg',
    status: 'active' as const,
    goals: 'Perder peso',
    notes: '',
    lastActivity: new Date('2025-01-11T10:15:00'),
    createdAt: new Date('2025-01-05'),
  },
  {
    id: '3',
    name: 'Pedro Martínez',
    email: 'pedro@email.com',
    phone: '+54 11 3456-7890',
    avatar: '/avatars/pedro.jpg',
    status: 'paused' as const,
    goals: 'Fuerza',
    notes: 'Lesión en hombro',
    lastActivity: new Date('2025-01-07T14:00:00'),
    createdAt: new Date('2024-12-15'),
  },
  // ... 7-10 clientes más
]

// lib/mockdata/activity.ts
export const mockTodayActivity = [
  {
    id: '1',
    clientId: '1',
    clientName: 'Juan Pérez',
    workoutName: 'Rutina Push Día A',
    completedAt: new Date('2025-01-12T08:30:00'),
    exercisesCompleted: 5,
    totalExercises: 5,
  },
  {
    id: '2',
    clientId: '2',
    clientName: 'María García',
    workoutName: 'Rutina Full Body',
    completedAt: new Date('2025-01-12T10:15:00'),
    exercisesCompleted: 4,
    totalExercises: 6,
  },
  // ... más actividad
]
```

**Componentes a crear:**

```typescript
// components/layout/Sidebar.tsx
// components/layout/DashboardLayout.tsx
// components/dashboard/StatsCard.tsx
// components/dashboard/ActivityToday.tsx
// components/clients/ClientCard.tsx
// components/clients/ClientFilters.tsx
// components/clients/ClientList.tsx
```

**Navegación con mockdata:**

```typescript
// app/(dashboard)/clients/page.tsx
'use client'
import { useState } from 'react'
import { mockClients } from '@/lib/mockdata/clients'

export default function ClientsPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const filteredClients = mockClients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === 'all' || client.status === filter
    return matchesSearch && matchesFilter
  })

  return (
    <DashboardLayout>
      <ClientFilters
        search={search}
        onSearchChange={setSearch}
        filter={filter}
        onFilterChange={setFilter}
      />
      <ClientList clients={filteredClients} />
    </DashboardLayout>
  )
}
```

### Día 7: Perfil de Cliente

**Pantallas a implementar:**

7. **Perfil de Cliente** (`app/(dashboard)/clients/[id]/page.tsx`)
   - Header con avatar + nombre + badge estado
   - Botones Editar/Pausar/Eliminar (UI only)
   - Tabs: Información / Rutinas / Progreso
   - Tab Información: Objetivos + Notas + Fecha inicio
   - Tab Rutinas: Lista de rutinas asignadas (mockdata)
   - Tab Progreso: Gráficos placeholder

**Mockdata:**

```typescript
// lib/mockdata/workouts.ts
export const mockWorkouts = [
  {
    id: '1',
    name: 'Rutina Push Día A',
    clientId: '1',
    description: 'Pecho, hombros y tríceps',
    exercises: ['1', '2', '3', '4', '5'], // IDs de ejercicios
    createdAt: new Date('2025-01-05'),
    lastCompleted: new Date('2025-01-12T08:30:00'),
  },
  {
    id: '2',
    name: 'Rutina Pull Día B',
    clientId: '1',
    description: 'Espalda y bíceps',
    exercises: ['6', '7', '8', '9'],
    createdAt: new Date('2025-01-05'),
    lastCompleted: new Date('2025-01-10T09:00:00'),
  },
  // ... más rutinas
]
```

**Componentes:**

```typescript
// components/clients/ClientProfile.tsx
// components/clients/ClientTabs.tsx
// components/clients/WorkoutList.tsx
// components/clients/ProgressCharts.tsx (placeholder)
```

---

## 1C: BIBLIOTECA + CONSTRUCTOR UI (3-4 días)

### Día 8-9: Biblioteca de Ejercicios

**Pantallas a implementar:**

8. **Biblioteca de Ejercicios** (`app/(dashboard)/exercises/page.tsx`)
   - Search bar grande
   - 3 dropdowns de filtros (Grupo Muscular / Equipo / Dificultad)
   - Grid 4 columnas de ejercicio cards
   - Modal de detalle de ejercicio
   - Infinite scroll simulado

**Mockdata necesaria:**

```typescript
// lib/mockdata/exercises.ts
export const mockExercises = [
  {
    id: '1',
    name: 'Press Banca',
    muscleGroup: 'Pecho',
    secondaryMuscles: ['Tríceps', 'Hombros'],
    equipment: 'Barra',
    difficulty: 'intermediate' as const,
    gifUrl: '/exercises/gifs/bench-press.gif',
    instructions: [
      'Acuéstate en el banco plano',
      'Agarra la barra con agarre medio',
      'Baja controladamente al pecho',
      'Empuja explosivamente hacia arriba'
    ],
  },
  {
    id: '2',
    name: 'Sentadilla',
    muscleGroup: 'Piernas',
    secondaryMuscles: ['Glúteos', 'Core'],
    equipment: 'Barra',
    difficulty: 'intermediate' as const,
    gifUrl: '/exercises/gifs/squat.gif',
    instructions: [
      'Coloca la barra en tus hombros',
      'Separa pies ancho de hombros',
      'Baja manteniendo espalda recta',
      'Sube empujando con talones'
    ],
  },
  {
    id: '3',
    name: 'Peso Muerto',
    muscleGroup: 'Espalda',
    secondaryMuscles: ['Piernas', 'Core'],
    equipment: 'Barra',
    difficulty: 'advanced' as const,
    gifUrl: '/exercises/gifs/deadlift.gif',
    instructions: [
      'Pies debajo de barra',
      'Agarra barra con agarre mixto',
      'Mantén espalda recta',
      'Levanta extendiendo cadera'
    ],
  },
  // ... 20-30 ejercicios más para tener variedad
]

// lib/mockdata/filters.ts
export const muscleGroups = [
  'Todos',
  'Pecho',
  'Espalda',
  'Piernas',
  'Hombros',
  'Brazos',
  'Core',
]

export const equipmentTypes = [
  'Todos',
  'Barra',
  'Mancuernas',
  'Máquina',
  'Peso Corporal',
  'Bandas',
]

export const difficultyLevels = [
  'Todos',
  'beginner',
  'intermediate',
  'advanced',
]
```

**Componentes:**

```typescript
// components/exercises/ExerciseGrid.tsx
// components/exercises/ExerciseCard.tsx
// components/exercises/ExerciseFilters.tsx
// components/exercises/ExerciseModal.tsx
// components/exercises/ExerciseSearch.tsx
```

**Funcionalidad de búsqueda/filtros:**

```typescript
// app/(dashboard)/exercises/page.tsx
'use client'
import { useState } from 'react'
import { mockExercises } from '@/lib/mockdata/exercises'

export default function ExercisesPage() {
  const [search, setSearch] = useState('')
  const [muscleFilter, setMuscleFilter] = useState('Todos')
  const [equipmentFilter, setEquipmentFilter] = useState('Todos')
  const [difficultyFilter, setDifficultyFilter] = useState('Todos')

  const filteredExercises = mockExercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(search.toLowerCase())
    const matchesMuscle = muscleFilter === 'Todos' || exercise.muscleGroup === muscleFilter
    const matchesEquipment = equipmentFilter === 'Todos' || exercise.equipment === equipmentFilter
    const matchesDifficulty = difficultyFilter === 'Todos' || exercise.difficulty === difficultyFilter

    return matchesSearch && matchesMuscle && matchesEquipment && matchesDifficulty
  })

  return (
    <DashboardLayout>
      <ExerciseSearch value={search} onChange={setSearch} />
      <ExerciseFilters
        muscleGroup={muscleFilter}
        equipment={equipmentFilter}
        difficulty={difficultyFilter}
        onMuscleChange={setMuscleFilter}
        onEquipmentChange={setEquipmentFilter}
        onDifficultyChange={setDifficultyFilter}
      />
      <ExerciseGrid exercises={filteredExercises} />
    </DashboardLayout>
  )
}
```

### Día 10-11: Constructor de Rutinas

**Pantallas a implementar:**

9. **Constructor de Rutinas** (`app/(dashboard)/workouts/new/page.tsx`)
   - Input nombre rutina
   - Dropdown selector de cliente
   - Botón "Agregar Ejercicio" (abre modal con biblioteca)
   - Lista drag-and-drop de ejercicios
   - Inputs inline (series/reps/peso/descanso)
   - Botones Guardar/Cancelar

**Mockdata:**

```typescript
// lib/mockdata/workout-templates.ts
export type WorkoutExercise = {
  exerciseId: string
  order: number
  sets: number
  reps: number
  weight: number | null
  rest: number
  notes: string
}

export const mockWorkoutTemplate: WorkoutExercise[] = [
  {
    exerciseId: '1',
    order: 1,
    sets: 4,
    reps: 8,
    weight: 60,
    rest: 90,
    notes: 'Mantén omóplatos retraídos'
  },
  {
    exerciseId: '2',
    order: 2,
    sets: 4,
    reps: 10,
    weight: 80,
    rest: 120,
    notes: 'Profundidad completa'
  },
  {
    exerciseId: '3',
    order: 3,
    sets: 3,
    reps: 6,
    weight: 100,
    rest: 180,
    notes: 'Usa cinturón'
  },
]
```

**Componentes:**

```typescript
// components/workouts/WorkoutBuilder.tsx
// components/workouts/ExerciseList.tsx (drag-and-drop)
// components/workouts/ExerciseItem.tsx
// components/workouts/ExerciseSelector.tsx (modal)
```

**Estado local del constructor:**

```typescript
// app/(dashboard)/workouts/new/page.tsx
'use client'
import { useState } from 'react'
import { DndContext, closestCenter } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'

export default function NewWorkoutPage() {
  const [workoutName, setWorkoutName] = useState('')
  const [selectedClient, setSelectedClient] = useState<string | null>(null)
  const [exercises, setExercises] = useState<WorkoutExercise[]>([])
  const [showExerciseModal, setShowExerciseModal] = useState(false)

  const handleAddExercise = (exerciseId: string) => {
    const newExercise: WorkoutExercise = {
      exerciseId,
      order: exercises.length + 1,
      sets: 3,
      reps: 10,
      weight: null,
      rest: 60,
      notes: ''
    }
    setExercises([...exercises, newExercise])
    setShowExerciseModal(false)
  }

  const handleDragEnd = (event: any) => {
    const { active, over } = event
    if (active.id !== over.id) {
      setExercises((items) => {
        const oldIndex = items.findIndex((i) => i.exerciseId === active.id)
        const newIndex = items.findIndex((i) => i.exerciseId === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const handleSave = () => {
    // Guardar en localStorage (simulado)
    const workout = {
      id: Date.now().toString(),
      name: workoutName,
      clientId: selectedClient,
      exercises,
      createdAt: new Date()
    }

    const existingWorkouts = JSON.parse(localStorage.getItem('workouts') || '[]')
    localStorage.setItem('workouts', JSON.stringify([...existingWorkouts, workout]))

    // Redirect
    window.location.href = `/clients/${selectedClient}`
  }

  return (
    <DashboardLayout>
      <div>
        <input
          value={workoutName}
          onChange={(e) => setWorkoutName(e.target.value)}
          placeholder="Nombre de la rutina"
        />

        <select
          value={selectedClient || ''}
          onChange={(e) => setSelectedClient(e.target.value)}
        >
          <option value="">Selecciona un cliente</option>
          {mockClients.map(client => (
            <option key={client.id} value={client.id}>{client.name}</option>
          ))}
        </select>

        <button onClick={() => setShowExerciseModal(true)}>
          + Agregar Ejercicio
        </button>

        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={exercises.map(e => e.exerciseId)} strategy={verticalListSortingStrategy}>
            {exercises.map((exercise, index) => (
              <ExerciseItem
                key={exercise.exerciseId}
                exercise={exercise}
                index={index}
                onChange={(updated) => {
                  const newExercises = [...exercises]
                  newExercises[index] = updated
                  setExercises(newExercises)
                }}
                onRemove={() => {
                  setExercises(exercises.filter((_, i) => i !== index))
                }}
              />
            ))}
          </SortableContext>
        </DndContext>

        <button onClick={handleSave}>Guardar Rutina</button>
      </div>

      {showExerciseModal && (
        <ExerciseSelector
          onSelect={handleAddExercise}
          onClose={() => setShowExerciseModal(false)}
        />
      )}
    </DashboardLayout>
  )
}
```

---

## 1D: MOBILE APP UI (3-4 días)

### Día 12: Setup React Native + Login Móvil

**Setup Expo Router:**

```typescript
// fitness-mobile/app/_layout.tsx
import { Stack } from 'expo-router'

export default function RootLayout() {
  return <Stack />
}
```

**Pantallas a implementar:**

10. **Login Móvil** (`fitness-mobile/app/login.tsx`)
    - Logo grande
    - 2 inputs (email, password)
    - Botón "Iniciar Sesión"
    - Helper text

**Mockdata:**

```typescript
// fitness-mobile/lib/mockdata/auth.ts
export const mockUser = {
  id: '1',
  name: 'Juan Pérez',
  email: 'juan@email.com',
  avatar: '/avatars/juan.jpg'
}
```

**Componentes:**

```typescript
// fitness-mobile/components/common/Button.tsx
// fitness-mobile/components/common/Input.tsx
// fitness-mobile/app/login.tsx

import { useState } from 'react'
import { View, Text, TextInput, Pressable } from 'react-native'
import { useRouter } from 'expo-router'

export default function LoginScreen() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = () => {
    // Sin validación, solo navegar
    router.replace('/(tabs)')
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 24 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 32 }}>
        Bienvenido
      </Text>

      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        autoCapitalize="none"
        style={{ borderWidth: 1, padding: 12, marginBottom: 16, borderRadius: 8 }}
      />

      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Contraseña"
        secureTextEntry
        style={{ borderWidth: 1, padding: 12, marginBottom: 24, borderRadius: 8 }}
      />

      <Pressable
        onPress={handleLogin}
        style={{
          backgroundColor: '#4F46E5',
          padding: 16,
          borderRadius: 8,
          alignItems: 'center'
        }}
      >
        <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
          Iniciar Sesión
        </Text>
      </Pressable>
    </View>
  )
}
```

### Día 13: Dashboard Móvil

**Pantallas a implementar:**

11. **Dashboard Móvil** (`fitness-mobile/app/(tabs)/index.tsx`)
    - Saludo personalizado
    - Card "Rutina de Hoy" (grande)
    - Sección "Actividad Reciente"
    - Bottom navigation bar

**Mockdata:**

```typescript
// fitness-mobile/lib/mockdata/workouts.ts
export const mockWorkoutOfTheDay = {
  id: '1',
  name: 'Rutina Push Día A',
  exercises: 5,
  estimatedTime: 45,
  exercises: ['1', '2', '3', '4', '5']
}

export const mockRecentActivity = [
  {
    id: '1',
    date: new Date('2025-01-11'),
    workoutName: 'Rutina Pull',
    completed: 5,
    total: 5
  },
  {
    id: '2',
    date: new Date('2025-01-10'),
    workoutName: 'Rutina Push',
    completed: 5,
    total: 5
  }
]
```

**Componentes:**

```typescript
// fitness-mobile/app/(tabs)/index.tsx
import { View, Text, ScrollView, Pressable } from 'react-native'
import { mockWorkoutOfTheDay, mockRecentActivity } from '@/lib/mockdata/workouts'
import { useRouter } from 'expo-router'

export default function HomeScreen() {
  const router = useRouter()

  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 4 }}>
        Hola, Juan 👋
      </Text>

      {/* Card Rutina de Hoy */}
      <View style={{
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 12,
        marginVertical: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10
      }}>
        <Text style={{ fontSize: 12, color: '#6B7280', marginBottom: 8 }}>
          TU RUTINA DE HOY
        </Text>
        <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 12 }}>
          {mockWorkoutOfTheDay.name}
        </Text>
        <Text style={{ color: '#6B7280', marginBottom: 16 }}>
          {mockWorkoutOfTheDay.exercises} ejercicios · ~{mockWorkoutOfTheDay.estimatedTime} min
        </Text>

        <Pressable
          onPress={() => router.push('/workout')}
          style={{
            backgroundColor: '#4F46E5',
            padding: 14,
            borderRadius: 8,
            alignItems: 'center'
          }}
        >
          <Text style={{ color: 'white', fontWeight: '600' }}>
            Ver Rutina →
          </Text>
        </Pressable>
      </View>

      {/* Actividad Reciente */}
      <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 12 }}>
        Actividad Reciente
      </Text>

      {mockRecentActivity.map(activity => (
        <View
          key={activity.id}
          style={{
            backgroundColor: 'white',
            padding: 16,
            borderRadius: 8,
            marginBottom: 12
          }}
        >
          <Text style={{ fontWeight: '600' }}>✓ Ayer</Text>
          <Text>{activity.workoutName}</Text>
          <Text style={{ color: '#6B7280' }}>
            {activity.completed}/{activity.total} completados
          </Text>
        </View>
      ))}
    </ScrollView>
  )
}

// fitness-mobile/app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />
        }}
      />
      <Tabs.Screen
        name="workouts"
        options={{
          title: 'Rutinas',
          tabBarIcon: ({ color }) => <Ionicons name="barbell" size={24} color={color} />
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: 'Progreso',
          tabBarIcon: ({ color }) => <Ionicons name="stats-chart" size={24} color={color} />
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} />
        }}
      />
    </Tabs>
  )
}
```

### Día 14: Rutina del Día + Detalle Ejercicio

**Pantallas a implementar:**

12. **Rutina del Día** (`fitness-mobile/app/workout.tsx`)
    - Header con nombre rutina
    - Metadata (ejercicios, tiempo)
    - Lista de ejercicio cards
    - Checkboxes grandes (3 por ejercicio)
    - Botón "Marcar Rutina Completa"

13. **Detalle de Ejercicio** (`fitness-mobile/app/exercise/[id].tsx`)
    - GIF grande
    - Metadata (series, reps, peso, descanso)
    - Series completadas (cards clickables)
    - Instrucciones numeradas
    - Callout "Tip del entrenador"

**Mockdata:**

```typescript
// fitness-mobile/lib/mockdata/workout-detail.ts
export const mockWorkoutDetail = {
  id: '1',
  name: 'Rutina Push Día A',
  exercises: [
    {
      id: '1',
      exerciseId: '1',
      name: 'Press Banca',
      gifUrl: '/exercises/gifs/bench-press.gif',
      sets: 3,
      reps: 10,
      weight: 60,
      rest: 90,
      completed: [false, false, false]
    },
    {
      id: '2',
      exerciseId: '2',
      name: 'Press Inclinado',
      gifUrl: '/exercises/gifs/incline-press.gif',
      sets: 3,
      reps: 12,
      weight: 50,
      rest: 90,
      completed: [false, false, false]
    },
    // ... más ejercicios
  ]
}
```

**Componentes:**

```typescript
// fitness-mobile/app/workout.tsx
import { View, Text, ScrollView, Pressable } from 'react-native'
import { useState } from 'react'
import { mockWorkoutDetail } from '@/lib/mockdata/workout-detail'
import { useRouter } from 'expo-router'

export default function WorkoutScreen() {
  const router = useRouter()
  const [exercises, setExercises] = useState(mockWorkoutDetail.exercises)

  const toggleSet = (exerciseIndex: number, setIndex: number) => {
    const newExercises = [...exercises]
    newExercises[exerciseIndex].completed[setIndex] = !newExercises[exerciseIndex].completed[setIndex]
    setExercises(newExercises)
  }

  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 8 }}>
        {mockWorkoutDetail.name}
      </Text>
      <Text style={{ color: '#6B7280', marginBottom: 20 }}>
        {exercises.length} ejercicios · ~45 min
      </Text>

      {exercises.map((exercise, exerciseIndex) => (
        <View
          key={exercise.id}
          style={{
            backgroundColor: 'white',
            padding: 16,
            borderRadius: 12,
            marginBottom: 16
          }}
        >
          <Pressable onPress={() => router.push(`/exercise/${exercise.exerciseId}`)}>
            <View style={{ width: '100%', height: 150, backgroundColor: '#F3F4F6', borderRadius: 8, marginBottom: 12 }}>
              {/* Placeholder GIF */}
              <Text style={{ textAlign: 'center', paddingTop: 60 }}>[GIF]</Text>
            </View>
          </Pressable>

          <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 8 }}>
            {exerciseIndex + 1}. {exercise.name}
          </Text>

          <Text style={{ color: '#6B7280', marginBottom: 12 }}>
            {exercise.sets} series × {exercise.reps} reps
          </Text>
          <Text style={{ color: '#6B7280', marginBottom: 12 }}>
            {exercise.weight} kg · {exercise.rest}s rest
          </Text>

          {/* Checkboxes */}
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {exercise.completed.map((isCompleted, setIndex) => (
              <Pressable
                key={setIndex}
                onPress={() => toggleSet(exerciseIndex, setIndex)}
                style={{
                  width: 48,
                  height: 48,
                  borderWidth: 2,
                  borderColor: isCompleted ? '#22C55E' : '#D1D5DB',
                  backgroundColor: isCompleted ? '#22C55E' : 'white',
                  borderRadius: 8,
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {isCompleted && (
                  <Text style={{ color: 'white', fontSize: 20 }}>✓</Text>
                )}
              </Pressable>
            ))}
          </View>

          <Pressable onPress={() => router.push(`/exercise/${exercise.exerciseId}`)}>
            <Text style={{ color: '#4F46E5', marginTop: 12 }}>
              Ver detalles →
            </Text>
          </Pressable>
        </View>
      ))}

      <Pressable
        style={{
          backgroundColor: '#22C55E',
          padding: 16,
          borderRadius: 8,
          alignItems: 'center',
          marginVertical: 20
        }}
      >
        <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
          Marcar Rutina Completa
        </Text>
      </Pressable>
    </ScrollView>
  )
}

// fitness-mobile/app/exercise/[id].tsx
import { View, Text, ScrollView } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { mockExercises } from '@/lib/mockdata/exercises'

export default function ExerciseDetailScreen() {
  const { id } = useLocalSearchParams()
  const exercise = mockExercises.find(e => e.id === id)

  if (!exercise) return <Text>Ejercicio no encontrado</Text>

  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      <View style={{ width: '100%', height: 200, backgroundColor: '#F3F4F6', borderRadius: 12, marginBottom: 20 }}>
        <Text style={{ textAlign: 'center', paddingTop: 80 }}>[GIF GRANDE]</Text>
      </View>

      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 12 }}>
        {exercise.name}
      </Text>

      <Text style={{ fontSize: 18, fontWeight: '600', marginTop: 20, marginBottom: 8 }}>
        Instrucciones:
      </Text>
      {exercise.instructions.map((instruction, index) => (
        <Text key={index} style={{ marginBottom: 8 }}>
          {index + 1}. {instruction}
        </Text>
      ))}

      <View style={{
        backgroundColor: '#EEF2FF',
        padding: 16,
        borderRadius: 8,
        marginTop: 20
      }}>
        <Text style={{ color: '#4338CA', fontWeight: '600' }}>
          💡 Tip de tu entrenador:
        </Text>
        <Text style={{ color: '#4338CA', marginTop: 4 }}>
          Mantén los omóplatos retraídos durante todo el movimiento
        </Text>
      </View>
    </ScrollView>
  )
}
```

---

## 🎯 RESUMEN FASE 1

**Al finalizar FASE 1 tendrás:**

✅ **13 pantallas completamente navegables:**
- 1 Landing page
- 3 pantallas de autenticación (login, registro, onboarding)
- 5 pantallas web entrenador (dashboard, clientes, perfil, biblioteca, constructor)
- 4 pantallas móvil cliente (login, dashboard, rutina, detalle ejercicio)

✅ **Mockdata completa en archivos TypeScript:**
- 10 clientes
- 30 ejercicios
- 5 rutinas de ejemplo
- Actividad reciente simulada

✅ **Componentes reutilizables:**
- 20+ componentes web (shadcn/ui based)
- 10+ componentes mobile (React Native)

✅ **Navegación completa:**
- Routing entre pantallas funcional
- Estados guardados en localStorage (simulado)
- Drag-and-drop en constructor

✅ **Diseño responsive:**
- Mobile/tablet/desktop
- Dark mode preparado
- Touch targets correctos (48px móvil)

---

## 🔌 FASE 2: INTEGRACIÓN BACKEND FEATURE POR FEATURE
**Duración:** 8-10 semanas
**Objetivo:** Reemplazar mockdata con funcionalidades reales integrando Supabase

---

## 2A: AUTENTICACIÓN + CLIENTES (Semana 3-4)

### Semana 3: Autenticación Real

**Setup Supabase:**

```bash
# Instalar Supabase
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs

# Crear cuenta en https://supabase.com
# Obtener:
# - SUPABASE_URL
# - SUPABASE_ANON_KEY
```

**Variables de entorno:**

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxx
```

**Configuración cliente Supabase:**

```typescript
// lib/supabase/client.ts
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export const supabase = createClientComponentClient()
```

**Migración 001: Tablas de Autenticación**

```sql
-- Ejecutar en Supabase SQL Editor

-- Tabla trainers
CREATE TABLE trainers (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  gym_name TEXT,
  avatar_url TEXT,
  timezone TEXT DEFAULT 'America/Buenos_Aires',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS policies
ALTER TABLE trainers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Trainers can view own data"
ON trainers FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Trainers can update own data"
ON trainers FOR UPDATE
USING (auth.uid() = id);
```

**Reemplazar mockdata en Login:**

```typescript
// app/(auth)/login/page.tsx
'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (signInError) {
      setError(signInError.message)
      setLoading(false)
      return
    }

    router.push('/dashboard')
  }

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })

    if (error) setError(error.message)
  }

  return (
    <LoginForm
      email={email}
      password={password}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      onSubmit={handleLogin}
      onGoogleLogin={handleGoogleLogin}
      error={error}
      loading={loading}
    />
  )
}
```

**Session management:**

```typescript
// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Si no hay sesión y está intentando acceder a dashboard, redirect a login
  if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Si hay sesión y está en login, redirect a dashboard
  if (session && (req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return res
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register']
}
```

### Semana 4: CRUD de Clientes

**Migración 002: Tabla clients**

```sql
-- Tabla clients
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trainer_id UUID NOT NULL REFERENCES trainers(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  goals TEXT,
  notes TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'inactive')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

-- Índices
CREATE INDEX idx_clients_trainer_id ON clients(trainer_id);
CREATE INDEX idx_clients_status ON clients(status);

-- RLS policies
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Trainers can manage own clients"
ON clients FOR ALL
USING (trainer_id = auth.uid());
```

**Service layer:**

```typescript
// lib/services/clientsService.ts
import { supabase } from '@/lib/supabase/client'
import type { Client } from '@/types/client'

export const clientsService = {
  async getAll() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('trainer_id', user.id)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as Client[]
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data as Client
  },

  async create(client: Omit<Client, 'id' | 'created_at' | 'updated_at'>) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('clients')
      .insert({
        ...client,
        trainer_id: user.id
      })
      .select()
      .single()

    if (error) throw error
    return data as Client
  },

  async update(id: string, updates: Partial<Client>) {
    const { data, error } = await supabase
      .from('clients')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as Client
  },

  async delete(id: string) {
    // Soft delete
    const { error } = await supabase
      .from('clients')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)

    if (error) throw error
  }
}
```

**Reemplazar mockdata en Lista de Clientes:**

```typescript
// app/(dashboard)/clients/page.tsx
'use client'
import { useQuery } from '@tanstack/react-query'
import { clientsService } from '@/lib/services/clientsService'

export default function ClientsPage() {
  const { data: clients, isLoading, error } = useQuery({
    queryKey: ['clients'],
    queryFn: clientsService.getAll
  })

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage error={error} />

  return (
    <DashboardLayout>
      <ClientList clients={clients || []} />
    </DashboardLayout>
  )
}
```

**Crear cliente con form:**

```typescript
// components/clients/CreateClientModal.tsx
'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { clientsService } from '@/lib/services/clientsService'
import { clientSchema } from '@/lib/validations/client'

export function CreateClientModal({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient()

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(clientSchema)
  })

  const createMutation = useMutation({
    mutationFn: clientsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      onClose()
    }
  })

  const onSubmit = (data: any) => {
    createMutation.mutate(data)
  }

  return (
    <Dialog open onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          {...register('full_name')}
          label="Nombre completo"
          error={errors.full_name?.message}
        />
        <Input
          {...register('email')}
          label="Email"
          type="email"
          error={errors.email?.message}
        />
        {/* ... más campos */}

        <Button type="submit" loading={createMutation.isPending}>
          Crear Cliente
        </Button>
      </form>
    </Dialog>
  )
}
```

---

## 2B: BIBLIOTECA + CONSTRUCTOR (Semana 5-8)

### Semana 5-6: Biblioteca de Ejercicios

**Migración 003: Tabla exercises**

```sql
CREATE TABLE exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  external_id TEXT UNIQUE,
  name TEXT NOT NULL,
  muscle_group TEXT NOT NULL,
  secondary_muscles TEXT[],
  equipment TEXT,
  gif_url TEXT,
  instructions TEXT,
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Índices
CREATE INDEX idx_exercises_name ON exercises USING gin(to_tsvector('spanish', name));
CREATE INDEX idx_exercises_muscle_group ON exercises(muscle_group);

-- RLS
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view exercises"
ON exercises FOR SELECT
TO authenticated
USING (true);
```

**Integración ExerciseDB API:**

```typescript
// lib/services/exerciseDBService.ts
const EXERCISEDB_API_KEY = process.env.NEXT_PUBLIC_EXERCISEDB_API_KEY

export const exerciseDBService = {
  async fetchAll() {
    const response = await fetch('https://exercisedb.p.rapidapi.com/exercises', {
      headers: {
        'X-RapidAPI-Key': EXERCISEDB_API_KEY!,
        'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
      }
    })

    if (!response.ok) throw new Error('Failed to fetch exercises')

    const data = await response.json()
    return data
  },

  async syncToSupabase() {
    const exercises = await this.fetchAll()

    // Mapear y guardar en Supabase
    const mapped = exercises.map((ex: any) => ({
      external_id: ex.id,
      name: ex.name,
      muscle_group: ex.target,
      secondary_muscles: ex.secondaryMuscles || [],
      equipment: ex.equipment,
      gif_url: ex.gifUrl,
      instructions: ex.instructions?.join('\n') || '',
      difficulty: 'intermediate' // Default
    }))

    const { error } = await supabase
      .from('exercises')
      .upsert(mapped, { onConflict: 'external_id' })

    if (error) throw error
  }
}
```

**Service para búsqueda:**

```typescript
// lib/services/exercisesService.ts
export const exercisesService = {
  async search(query: string, filters: {
    muscleGroup?: string
    equipment?: string
    difficulty?: string
  }) {
    let queryBuilder = supabase
      .from('exercises')
      .select('*')
      .order('name')

    if (query) {
      queryBuilder = queryBuilder.textSearch('name', query)
    }

    if (filters.muscleGroup && filters.muscleGroup !== 'Todos') {
      queryBuilder = queryBuilder.eq('muscle_group', filters.muscleGroup)
    }

    if (filters.equipment && filters.equipment !== 'Todos') {
      queryBuilder = queryBuilder.eq('equipment', filters.equipment)
    }

    if (filters.difficulty && filters.difficulty !== 'Todos') {
      queryBuilder = queryBuilder.eq('difficulty', filters.difficulty)
    }

    const { data, error } = await queryBuilder

    if (error) throw error
    return data
  }
}
```

### Semana 7-8: Constructor de Rutinas

**Migraciones 004-005:**

```sql
-- Tabla workouts
CREATE TABLE workouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trainer_id UUID NOT NULL REFERENCES trainers(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_template BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabla workout_exercises (relación many-to-many)
CREATE TABLE workout_exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workout_id UUID NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE RESTRICT,
  "order" INTEGER NOT NULL,
  sets INTEGER NOT NULL DEFAULT 3,
  reps INTEGER NOT NULL DEFAULT 10,
  weight_kg DECIMAL,
  rest_seconds INTEGER DEFAULT 60,
  notes TEXT
);

-- Índices
CREATE INDEX idx_workouts_client_id ON workouts(client_id);
CREATE INDEX idx_workout_exercises_workout_id ON workout_exercises(workout_id);

-- RLS
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Trainers can manage own workouts"
ON workouts FOR ALL
USING (trainer_id = auth.uid());

CREATE POLICY "Workout exercises inherit workout policy"
ON workout_exercises FOR ALL
USING (
  workout_id IN (
    SELECT id FROM workouts WHERE trainer_id = auth.uid()
  )
);
```

**Service:**

```typescript
// lib/services/workoutsService.ts
export const workoutsService = {
  async create(workout: {
    name: string
    clientId: string
    description?: string
    exercises: Array<{
      exerciseId: string
      order: number
      sets: number
      reps: number
      weight?: number
      rest: number
      notes?: string
    }>
  }) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    // 1. Crear workout
    const { data: workoutData, error: workoutError } = await supabase
      .from('workouts')
      .insert({
        trainer_id: user.id,
        client_id: workout.clientId,
        name: workout.name,
        description: workout.description
      })
      .select()
      .single()

    if (workoutError) throw workoutError

    // 2. Insertar ejercicios
    const exercisesData = workout.exercises.map(ex => ({
      workout_id: workoutData.id,
      exercise_id: ex.exerciseId,
      order: ex.order,
      sets: ex.sets,
      reps: ex.reps,
      weight_kg: ex.weight,
      rest_seconds: ex.rest,
      notes: ex.notes
    }))

    const { error: exercisesError } = await supabase
      .from('workout_exercises')
      .insert(exercisesData)

    if (exercisesError) throw exercisesError

    return workoutData
  },

  async getByClientId(clientId: string) {
    const { data, error } = await supabase
      .from('workouts')
      .select(`
        *,
        workout_exercises (
          *,
          exercises (*)
        )
      `)
      .eq('client_id', clientId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async duplicate(workoutId: string, targetClientId: string) {
    // Obtener rutina original
    const { data: original, error: fetchError } = await supabase
      .from('workouts')
      .select(`
        *,
        workout_exercises (*)
      `)
      .eq('id', workoutId)
      .single()

    if (fetchError) throw fetchError

    // Crear duplicado
    return this.create({
      name: `${original.name} (Copia)`,
      clientId: targetClientId,
      description: original.description,
      exercises: original.workout_exercises.map((ex: any) => ({
        exerciseId: ex.exercise_id,
        order: ex.order,
        sets: ex.sets,
        reps: ex.reps,
        weight: ex.weight_kg,
        rest: ex.rest_seconds,
        notes: ex.notes
      }))
    })
  }
}
```

---

## 2C: MOBILE INTEGRATION (Semana 9-12)

### Semana 9-10: Setup Supabase Mobile + Auth

**Instalar Supabase en Expo:**

```bash
cd fitness-mobile
npx expo install @supabase/supabase-js
npx expo install @react-native-async-storage/async-storage
npx expo install expo-secure-store
```

**Configurar cliente:**

```typescript
// fitness-mobile/lib/supabase.ts
import 'react-native-url-polyfill/auto'
import { createClient } from '@supabase/supabase-js'
import AsyncStorage from '@react-native-async-storage/async-storage'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
```

**Auth context:**

```typescript
// fitness-mobile/contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

type AuthContextType = {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
```

### Semana 11-12: Sync Workouts + Offline Support

**Service móvil:**

```typescript
// fitness-mobile/lib/services/workoutsService.ts
import { supabase } from '@/lib/supabase'
import AsyncStorage from '@react-native-async-storage/async-storage'

export const workoutsService = {
  async getMyWorkouts() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    // Obtener cliente asociado al usuario
    const { data: client } = await supabase
      .from('clients')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (!client) throw new Error('Client not found')

    // Obtener rutinas del cliente
    const { data, error } = await supabase
      .from('workouts')
      .select(`
        *,
        workout_exercises (
          *,
          exercises (*)
        )
      `)
      .eq('client_id', client.id)

    if (error) throw error

    // Guardar en cache local para offline
    await AsyncStorage.setItem('cached_workouts', JSON.stringify(data))

    return data
  },

  async getCachedWorkouts() {
    const cached = await AsyncStorage.getItem('cached_workouts')
    return cached ? JSON.parse(cached) : []
  },

  async logCompletedSet(workoutExerciseId: string, setNumber: number, reps: number, weight: number) {
    const log = {
      workout_exercise_id: workoutExerciseId,
      set_number: setNumber,
      actual_reps: reps,
      actual_weight_kg: weight,
      completed_at: new Date().toISOString()
    }

    // Intentar guardar en Supabase
    try {
      const { error } = await supabase
        .from('workout_logs')
        .insert(log)

      if (error) throw error
    } catch (error) {
      // Si falla (offline), guardar en queue local
      const queue = await AsyncStorage.getItem('offline_queue') || '[]'
      const queueData = JSON.parse(queue)
      queueData.push(log)
      await AsyncStorage.setItem('offline_queue', JSON.stringify(queueData))
    }
  },

  async syncOfflineQueue() {
    const queue = await AsyncStorage.getItem('offline_queue')
    if (!queue) return

    const queueData = JSON.parse(queue)
    if (queueData.length === 0) return

    // Intentar sincronizar
    const { error } = await supabase
      .from('workout_logs')
      .insert(queueData)

    if (!error) {
      // Limpiar queue si tuvo éxito
      await AsyncStorage.setItem('offline_queue', '[]')
    }
  }
}
```

**Hook de sincronización:**

```typescript
// fitness-mobile/hooks/useWorkoutSync.ts
import { useEffect } from 'react'
import { AppState } from 'react-native'
import NetInfo from '@react-native-community/netinfo'
import { workoutsService } from '@/lib/services/workoutsService'

export function useWorkoutSync() {
  useEffect(() => {
    // Sincronizar cuando vuelve conexión
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected) {
        workoutsService.syncOfflineQueue()
      }
    })

    // Sincronizar cuando app vuelve a foreground
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        workoutsService.syncOfflineQueue()
      }
    })

    return () => {
      unsubscribe()
      subscription.remove()
    }
  }, [])
}
```

---

## 📊 MOCKDATA STRATEGY

### Archivos de Mockdata (FASE 1)

Crear los siguientes archivos en `/lib/mockdata/`:

```bash
# Web mockdata
lib/mockdata/
├── landing.ts          # Features, pricing, testimonials
├── clients.ts          # 10 clientes de ejemplo
├── exercises.ts        # 30 ejercicios con GIFs
├── workouts.ts         # 5 rutinas de ejemplo
├── activity.ts         # Actividad reciente
├── timezones.ts        # Zonas horarias
└── filters.ts          # Grupos musculares, equipos

# Mobile mockdata
fitness-mobile/lib/mockdata/
├── auth.ts             # Usuario mock
├── workouts.ts         # Rutinas del cliente
├── exercises.ts        # Mismos ejercicios que web
└── activity.ts         # Actividad reciente móvil
```

### Tipos TypeScript Compartidos

```typescript
// types/index.ts
export type ClientStatus = 'active' | 'paused' | 'inactive'

export interface Client {
  id: string
  name: string
  email: string | null
  phone: string | null
  avatar: string | null
  status: ClientStatus
  goals: string | null
  notes: string | null
  lastActivity: Date | null
  createdAt: Date
}

export interface Exercise {
  id: string
  name: string
  muscleGroup: string
  secondaryMuscles: string[]
  equipment: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  gifUrl: string
  instructions: string[]
}

export interface WorkoutExercise {
  exerciseId: string
  order: number
  sets: number
  reps: number
  weight: number | null
  rest: number
  notes: string
}

export interface Workout {
  id: string
  name: string
  clientId: string
  description: string | null
  exercises: WorkoutExercise[]
  createdAt: Date
  lastCompleted: Date | null
}
```

---

## 📅 TIMELINE VISUAL (GANTT CHART ASCII)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ FITCOMPASS PRO - ROADMAP DE IMPLEMENTACIÓN (13 SEMANAS)                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│ Semana │ 1  │ 2  │ 3  │ 4  │ 5  │ 6  │ 7  │ 8  │ 9  │ 10 │ 11 │ 12 │ 13 │ │
│ ───────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┤ │
│        │         FASE 0          │         FASE 1 (FRONT-END)        │...│ │
│ ───────┼─────────────────────────┼───────────────────────────────────┼────┤ │
│ Setup  │ ████ │    │    │    │    │    │    │    │    │    │    │    │    │ │
│ Landing│    │ ██████ │    │    │    │    │    │    │    │    │    │    │    │ │
│ Auth   │    │ ██████ │    │    │    │    │    │    │    │    │    │    │    │ │
│ Wizard │    │ ████ │    │    │    │    │    │    │    │    │    │    │    │ │
│ Dash   │    │    │ ██████ │    │    │    │    │    │    │    │    │    │    │ │
│ Clientes│   │    │ ██████ │    │    │    │    │    │    │    │    │    │    │ │
│ Perfil │    │    │    │ ████ │    │    │    │    │    │    │    │    │    │ │
│ Biblio │    │    │    │ ████████ │    │    │    │    │    │    │    │    │ │
│ Constr │    │    │    │    │ ████████ │    │    │    │    │    │    │    │ │
│ Mobile │    │    │    │    │    │    │ ████████████ │    │    │    │    │ │
│ ───────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┤ │
│        │                      FASE 2 (BACKEND)                        │...│ │
│ ───────┼─────────────────────────────────────────────────────────────┼────┤ │
│ Auth✓  │    │    │ ████ │    │    │    │    │    │    │    │    │    │    │ │
│ CRUD✓  │    │    │    │ ████ │    │    │    │    │    │    │    │    │    │ │
│ Ejer✓  │    │    │    │    │ ████████ │    │    │    │    │    │    │    │ │
│ Rutinas│    │    │    │    │    │    │ ████████ │    │    │    │    │    │ │
│ Mobile✓│    │    │    │    │    │    │    │    │ ████████████ │    │    │ │
│ Testing│    │    │    │    │    │    │    │    │    │    │    │    │ ████ │ │
│ ───────┴────┴────┴────┴────┴────┴────┴────┴────┴────┴────┴────┴────┴────┘ │
│                                                                             │
│ ████ = Trabajo activo                                                       │
│ ✓ = Feature completa e integrada                                           │
│                                                                             │
│ HITOS:                                                                      │
│ • Fin Semana 2: Front-End Completo Navegable ✅                            │
│ • Fin Semana 4: Auth + Clientes con Backend ✅                             │
│ • Fin Semana 8: Constructor de Rutinas Funcional ✅                        │
│ • Fin Semana 12: App Móvil Completa con Offline ✅                         │
│ • Fin Semana 13: MVP V1 Listo para Producción 🚀                          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## ✅ CHECKLIST DE PROGRESO

### FASE 0: SETUP INICIAL
- [ ] Proyecto Next.js creado con TypeScript + Tailwind
- [ ] shadcn/ui instalado y configurado
- [ ] Design tokens en tailwind.config.ts
- [ ] Fuentes Inter + JetBrains Mono configuradas
- [ ] Estructura de carpetas creada
- [ ] Proyecto React Native + Expo creado
- [ ] Prettier + ESLint configurados

### FASE 1A: LANDING + AUTH UI
- [ ] Landing page con hero, features, pricing
- [ ] Página de login (UI)
- [ ] Página de registro (UI)
- [ ] Wizard de onboarding (3 steps)
- [ ] Navegación simulada funcional
- [ ] Mockdata de landing creada

### FASE 1B: DASHBOARD ENTRENADOR UI
- [ ] Sidebar con navegación
- [ ] Dashboard principal con stats
- [ ] Lista de clientes con filtros
- [ ] Perfil de cliente con tabs
- [ ] Mockdata de clientes creada (10 clientes)
- [ ] Mockdata de actividad creada

### FASE 1C: BIBLIOTECA + CONSTRUCTOR UI
- [ ] Biblioteca de ejercicios (grid 4 col)
- [ ] Filtros y búsqueda de ejercicios
- [ ] Modal detalle de ejercicio
- [ ] Constructor de rutinas con drag-and-drop
- [ ] Modal selector de ejercicios
- [ ] Mockdata de ejercicios creada (30 ejercicios)
- [ ] Mockdata de rutinas creada (5 rutinas)

### FASE 1D: MOBILE APP UI
- [ ] Login móvil (UI)
- [ ] Dashboard móvil con rutina del día
- [ ] Rutina del día con checkboxes
- [ ] Detalle de ejercicio con GIF
- [ ] Bottom navigation (4 tabs)
- [ ] Mockdata móvil sincronizada con web

### FASE 2A: AUTENTICACIÓN + CLIENTES
- [ ] Supabase configurado
- [ ] Tabla trainers creada
- [ ] Login con Supabase Auth funcional
- [ ] Google OAuth configurado
- [ ] Middleware de sesión implementado
- [ ] Tabla clients creada con RLS
- [ ] Service layer de clientes implementado
- [ ] CRUD de clientes funcional
- [ ] React Query configurado

### FASE 2B: BIBLIOTECA + CONSTRUCTOR
- [ ] Tabla exercises creada
- [ ] ExerciseDB API integrada
- [ ] Script de sync de ejercicios
- [ ] Búsqueda de ejercicios con Supabase
- [ ] Tabla workouts creada
- [ ] Tabla workout_exercises creada
- [ ] Service de rutinas implementado
- [ ] Crear rutina funcional con backend
- [ ] Duplicar rutina funcional

### FASE 2C: MOBILE INTEGRATION
- [ ] Supabase configurado en Expo
- [ ] Auth context implementado
- [ ] Login móvil con Supabase
- [ ] Fetch de rutinas del cliente
- [ ] Tabla workout_logs creada
- [ ] Log de series completadas funcional
- [ ] Offline support con AsyncStorage
- [ ] Queue de sincronización implementado
- [ ] Sync automático al volver conexión

### FASE 3: TESTING & DEPLOYMENT
- [ ] Tests unitarios escritos (>80% coverage)
- [ ] Tests de integración E2E
- [ ] Manual testing desktop (Chrome, Firefox, Safari)
- [ ] Manual testing mobile (iOS, Android)
- [ ] Deploy staging en Vercel
- [ ] Deploy staging mobile en Expo EAS
- [ ] Smoke tests en staging
- [ ] Deploy producción
- [ ] Monitoring con Sentry configurado

---

## 🚀 PRIMER PASO CONCRETO (HOY)

### ¿Por dónde empezar HOY MISMO?

**Opción A: Si tienes 2-3 horas HOY**

```bash
# Paso 1: Crear proyecto Next.js (5 min)
cd /Users/jeroniki/Documents/Github/fitness
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*"

# Paso 2: Instalar dependencias core (5 min)
npm install zustand @tanstack/react-query zod react-hook-form lucide-react
npm install @hookform/resolvers clsx tailwind-merge

# Paso 3: Instalar shadcn/ui (3 min)
npx shadcn-ui@latest init
npx shadcn-ui@latest add button input card

# Paso 4: Crear estructura de carpetas (2 min)
mkdir -p app/\(public\) app/\(auth\) app/\(dashboard\)
mkdir -p components/ui components/layout lib/mockdata hooks types

# Paso 5: Configurar design system (30 min)
# Copiar config de tailwind.config.ts y globals.css del plan

# Paso 6: Crear primera pantalla (1 hora)
# Implementar Landing Page básica con hero section

# Paso 7: Test en navegador (5 min)
npm run dev
# Abrir http://localhost:3000
```

**Opción B: Si solo tienes 30 minutos HOY**

```bash
# 1. Crear proyecto (5 min)
npx create-next-app@latest . --typescript --tailwind --app

# 2. Leer documentación (25 min)
# - Revisar design-system.md en detalle
# - Revisar frontend-features.md wireframes
# - Familiarizarte con estructura del plan
```

**Opción C: Plan recomendado (IDEAL)**

**DÍA 1 (HOY):**
- Mañana (2h): Setup completo de Next.js + shadcn/ui
- Tarde (3h): Landing page + configuración design system

**DÍA 2:**
- Mañana (3h): Login + Registro (UI)
- Tarde (2h): Wizard de onboarding

**DÍA 3:**
- Mañana (2h): Setup React Native + Expo
- Tarde (3h): Dashboard principal web

**... continuar según el plan detallado arriba**

---

## 📚 RECURSOS Y REFERENCIAS

### Documentación Oficial
- Next.js 14: https://nextjs.org/docs
- Tailwind CSS: https://tailwindcss.com/docs
- shadcn/ui: https://ui.shadcn.com
- Supabase: https://supabase.com/docs
- React Native: https://reactnative.dev
- Expo: https://docs.expo.dev

### APIs y Servicios
- ExerciseDB API: https://rapidapi.com/justin-WFnsXH_t6/api/exercisedb
- Supabase Auth: https://supabase.com/docs/guides/auth
- Vercel Deploy: https://vercel.com/docs

### Herramientas de Desarrollo
- React Query: https://tanstack.com/query/latest
- Zustand: https://github.com/pmndrs/zustand
- React Hook Form: https://react-hook-form.com
- Framer Motion: https://www.framer.com/motion

---

## 🎯 MÉTRICAS DE ÉXITO

### FASE 1 (Front-End Completo)
- ✅ 13 pantallas navegables
- ✅ Mockdata completa (10 clientes, 30 ejercicios, 5 rutinas)
- ✅ Todas las pantallas responsive (mobile/tablet/desktop)
- ✅ Drag-and-drop funcional en constructor
- ✅ Navegación fluida entre pantallas
- ✅ Design system implementado (colores, tipografía, espaciado)

### FASE 2 (Backend Integrado)
- ✅ Autenticación real con Supabase
- ✅ CRUD completo de clientes
- ✅ Biblioteca de ejercicios con 1000+ ejercicios de ExerciseDB
- ✅ Constructor de rutinas guardando en base de datos
- ✅ App móvil sincronizando con backend
- ✅ Offline-first funcional en móvil

### FASE 3 (Producción)
- ✅ Tests con >80% coverage
- ✅ Deploy exitoso en Vercel (web) + Expo (mobile)
- ✅ 5-10 entrenadores beta usando el producto
- ✅ 50+ clientes usando app móvil
- ✅ Tasa de completación de rutinas >60%

---

## 🔥 TIPS PARA EJECUTAR ESTE PLAN

### 1. Disciplina de Fases
- ❌ NO saltes de FASE 1 a FASE 2 sin terminar todas las pantallas
- ✅ Completa una subfase completa antes de pasar a la siguiente
- ✅ Usa el checklist para trackear progreso

### 2. Mockdata es Temporal
- Todos los archivos en `/lib/mockdata/` se ELIMINAN en FASE 2
- No optimices mockdata, es solo para visualización
- Enfócate en UI/UX, no en lógica de datos

### 3. Git Workflow
```bash
# Crear branch por subfase
git checkout -b fase-1a-landing-auth
# ... trabajar
git commit -m "feat: landing page completa"
git push origin fase-1a-landing-auth

# Merge cuando esté 100% terminada
git checkout main
git merge fase-1a-landing-auth
```

### 4. Testing Continuo
- Testea en móvil REAL desde semana 1
- Usa Chrome DevTools responsive mode
- Testea en Safari (iOS) y Chrome (Android)

### 5. Comunicación
- Demo semanal del progreso
- Screenshots/videos para validar UI
- Feedback temprano en FASE 1

---

## 📞 SOPORTE

**Preguntas frecuentes:**

**P: ¿Puedo usar otro framework en lugar de Next.js?**
R: No recomendado. El plan está optimizado para Next.js 14 con App Router.

**P: ¿Puedo saltarme la app móvil?**
R: No. La app móvil es feature crítica (RICE 11.4). Sin ella, el producto no tiene valor.

**P: ¿Cuánto cuesta implementar todo esto?**
R: Costos estimados:
- Supabase: $0-25/mes (tier gratuito hasta 500MB)
- Vercel: $0 (tier gratuito)
- Expo EAS Build: $0 (tier gratuito con limits)
- ExerciseDB API: $0 (tier gratuito con rate limits)
- **Total: $0-25/mes** durante desarrollo

**P: ¿Puedo trabajar FASE 1 y FASE 2 en paralelo?**
R: SÍ, si tienes 2+ developers. Developer 1 termina FASE 1, Developer 2 empieza FASE 2 después de semana 2.

---

## 🎉 CONCLUSIÓN

Este plan de implementación te permite:

1. **Ver el producto completo en 2 semanas** (todas las pantallas navegables)
2. **Validar UX/UI antes de invertir en backend**
3. **Trabajo paralelo** (Designer, Frontend, Backend después de FASE 1)
4. **Demos tempranas** para stakeholders
5. **Iteración rápida** sin tocar base de datos en FASE 1
6. **Implementación ordenada** feature por feature según dependencias

**El cliente obtiene:**
- ✅ Visualización completa del producto final en 2 semanas
- ✅ Capacidad de testear flujos de usuario temprano
- ✅ Feedback loop rápido para cambios de UI
- ✅ Implementación backend de forma ordenada y segura

**Próximos pasos inmediatos:**
1. Ejecutar comandos de FASE 0 (HOY)
2. Implementar Landing Page (DÍA 1-2)
3. Demo de progreso al final de semana 1
4. Continuar según timeline

---

**Documento creado:** 2025-01-12
**Versión:** 1.0
**Última actualización:** 2025-01-12
**Autor:** Plan de Implementación FitCompass Pro
