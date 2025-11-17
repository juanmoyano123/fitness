# FitCompass Pro - Mobile App

App móvil para clientes de entrenadores personales construida con React Native y Expo.

**FASE 2 COMPLETADA** ✅ - Frontend móvil con datos mock completamente funcional.

## 🚀 Quick Start

### Prerrequisitos

- Node.js 18+ (LTS)
- npm o yarn
- Expo Go app en tu dispositivo móvil ([iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))

### Instalación

```bash
npm install --legacy-peer-deps
```

### Configurar Variables de Entorno

```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

### Ejecutar en Desarrollo

```bash
npx expo start
```

Luego escanea el QR code con:
- **iOS:** Cámara nativa
- **Android:** Expo Go app

## 📁 Estructura del Proyecto

```
frontend-mobile/
├── src/
│   ├── navigation/          # React Navigation setup
│   │   └── AppNavigator.tsx    # Bottom Tabs + Stack
│   ├── screens/             # Pantallas principales
│   │   ├── HomeScreen.tsx
│   │   ├── WorkoutsScreen.tsx      # F-008: Lista de workouts
│   │   ├── ProgressScreen.tsx
│   │   └── WorkoutDetailScreen.tsx # F-009: Detalle y logging
│   ├── components/          # Componentes reutilizables
│   │   ├── WorkoutCard.tsx
│   │   ├── FilterTabs.tsx
│   │   ├── ExerciseCard.tsx        # Card expandible con logging
│   │   ├── RestTimer.tsx           # Modal timer con countdown
│   │   └── WorkoutCompleteModal.tsx
│   ├── constants/           # Design tokens
│   │   └── theme.ts            # Colores, tipografía, spacing, etc.
│   ├── types/               # TypeScript types
│   │   └── workout.ts
│   └── lib/                 # Mock data
│       ├── mock-workouts.ts
│       └── mock-workout-detail.ts
├── assets/                  # Imágenes, fuentes, etc.
├── App.tsx                  # Componente raíz
└── package.json
```

## 🛠️ Stack Tecnológico

- **Framework:** React Native 0.81.5 + Expo 54
- **Language:** TypeScript 5.9.2
- **Navigation:** React Navigation v7 (Bottom Tabs + Stack)
- **Date Utils:** date-fns v4.1.0
- **Haptics:** expo-haptics (feedback táctil)
- **UI:** Pure React Native components (sin UI library)

## 📋 Scripts Disponibles

```bash
npx expo start              # Iniciar development server
npx expo start --android    # Iniciar en Android
npx expo start --ios        # Iniciar en iOS
npx expo start --web        # Iniciar en web browser
```

## ✅ Features Implementadas (FASE 2)

### F-007: Setup React Native + Navegación ✅
- Bottom Tabs navigation (Inicio, Workouts, Progreso)
- Stack navigation para drill-down screens
- Pantallas placeholder con design system
- Design tokens completos basados en fitness-style-guide

### F-008: UI Lista Workouts Cliente ✅
- Lista de workouts con SectionList (Hoy, Esta Semana, Próximos, Completados)
- WorkoutCard con thumbnail, duración, ejercicios y estado
- FilterTabs para filtrar por estado (Todos/Pendientes/En Progreso/Completados)
- Pull to Refresh funcional
- Empty State con mensajes contextuales
- Navegación a detalle de workout

### F-009: UI Detalle Workout y Logging ✅
- Header con stats dinámico (tiempo, sets completados)
- Botón "Iniciar/Finalizar Entrenamiento"
- ExerciseCard expandible con:
  - GIF demostrativo
  - Form de logging (reps/peso por set)
  - Auto-expand del siguiente ejercicio
- RestTimer modal con:
  - Countdown visual
  - Haptic feedback
  - Pausar/Reanudar/Saltar
- WorkoutCompleteModal con stats y mensaje motivacional
- Alert de confirmación al salir sin finalizar

## 🎨 Design System

Basado en el fitness-style-guide del repositorio:

### Colores
- **Primary:** Earth tones (#37322f, #49423d, #605a57)
- **Backgrounds:** Neutral whites (#ffffff, #f7f5f3, #fbfaf9)
- **Accents:** Amber (#f59e0b), Sky (#0ea5e9), Green (#10b981), Purple (#8b5cf6), Rose (#f43f5e)

### Tipografía
- **Font:** Inter (400, 500, 600, 700)
- **Scale:** 12px - 48px (9 tamaños)

### Spacing
- **Base:** 4px grid
- **Scale:** 4px - 96px (11 valores)

### Border Radius
- **Variants:** 4px (sm), 8px (md), 10px (lg), 16px (xl), 999px (full)

## 📦 Progreso del Proyecto

### FASE 0: Setup ✅
- ✅ Setup repos
- ✅ Demo auto-login

### FASE 1: Frontend Web Dashboard ✅
- ✅ Layout y navegación
- ✅ CRUD clientes
- ✅ Biblioteca ejercicios
- ✅ Constructor workouts
- ✅ Dashboard progreso

### FASE 2: App Móvil Frontend ✅
- ✅ F-007: Setup React Native + Navegación (2d)
- ✅ F-008: UI Lista Workouts (2.5d)
- ✅ F-009: UI Detalle Workout y Logging (3d)

### FASE 3: Backend API Core (Próximo)
- ⏳ Setup Flask + PostgreSQL
- ⏳ API CRUD clientes
- ⏳ Integración ExerciseDB
- ⏳ API workouts
- ⏳ API logging entrenamientos

## 🐛 Troubleshooting

### Error EACCES en npm install

```bash
# Arreglar permisos
sudo chown -R $(whoami) ~/.npm
npm cache clean --force
npm install
```

## 🚢 Deploy

### Expo EAS Build

```bash
# Instalar EAS CLI
npm install -g eas-cli

# Login
eas login

# Configurar proyecto
eas build:configure

# Build para iOS/Android
eas build --platform ios
eas build --platform android
```

## 📝 Notas de Desarrollo

- Usar TypeScript strict mode
- Componentes en PascalCase
- Screens en PascalCase con sufijo "Screen" (ej: WorkoutListScreen)
- Seguir convenciones de React Native / Expo
