# FEATURES DE FRONT-END - FitCompass Pro
## Pantallas y Componentes Visuales (Sin Funcionalidades Backend)

---

## 📱 CATEGORÍAS DE PANTALLAS

### 🌐 PÚBLICO (Landing & Marketing)
### 🔐 AUTENTICACIÓN
### 💼 ENTRENADOR (Web App)
### 📱 CLIENTE (Mobile App)

---

## 🌐 1. PÚBLICO - LANDING & MARKETING

### 1.1 Landing Page (Marketing)

```
┌────────────────────────────────────────────────────────────┐
│  NAVBAR                                                     │
│  [Logo FitCompass] [Features] [Pricing] [Login] [Sign Up]  │
└────────────────────────────────────────────────────────────┘
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              HERO SECTION                           │   │
│  │                                                     │   │
│  │  "Gestiona tus Clientes de Forma Profesional"     │   │
│  │  [Screenshot del dashboard]                        │   │
│  │  [CTA: Prueba Gratis 14 días]                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │            FEATURES SECTION                         │   │
│  │                                                     │   │
│  │  [Icon] Constructor de Rutinas                     │   │
│  │  [Icon] Gestión de Clientes                        │   │
│  │  [Icon] App Móvil para Clientes                    │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │            HOW IT WORKS                             │   │
│  │                                                     │   │
│  │  Paso 1: Crea tu cuenta                            │   │
│  │  Paso 2: Agrega tus clientes                       │   │
│  │  Paso 3: Crea rutinas personalizadas               │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │            PRICING SECTION                          │   │
│  │                                                     │   │
│  │  [Card Free] [Card Starter] [Card Pro] [Card Studio]│  │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │            TESTIMONIALS                             │   │
│  │                                                     │   │
│  │  "FitCompass cambió mi forma de trabajar..."       │   │
│  │  - Juan Pérez, Entrenador Personal                 │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │            CTA FINAL                                │   │
│  │                                                     │   │
│  │  "Empieza a Gestionar Profesionalmente"           │   │
│  │  [CTA: Crear Cuenta Gratis]                        │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │            FOOTER                                   │   │
│  │  [Links] [Redes Sociales] [Copyright]              │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

**Componentes Visuales:**
- ✅ Navbar sticky con logo + links
- ✅ Hero section con headline + screenshot + CTA
- ✅ Features grid (3 columnas con iconos)
- ✅ How it works (3 pasos con números)
- ✅ Pricing cards (4 planes comparativos)
- ✅ Testimonials carousel
- ✅ CTA final con background gradient
- ✅ Footer con links y socials

---

## 🔐 2. AUTENTICACIÓN

### 2.1 Página de Login

```
┌────────────────────────────────────────┐
│                                        │
│     [Logo FitCompass Pro]              │
│                                        │
│     Bienvenido de vuelta               │
│                                        │
│     ┌────────────────────────────┐    │
│     │ Email                      │    │
│     │ [input email]              │    │
│     └────────────────────────────┘    │
│                                        │
│     ┌────────────────────────────┐    │
│     │ Contraseña                 │    │
│     │ [input password]           │    │
│     └────────────────────────────┘    │
│                                        │
│     [✓] Recordarme                     │
│     [link: ¿Olvidaste contraseña?]     │
│                                        │
│     [Botón: Iniciar Sesión]            │
│                                        │
│     ────── o ──────                    │
│                                        │
│     [Botón: Continuar con Google]      │
│                                        │
│     ¿No tienes cuenta? [Regístrate]    │
│                                        │
└────────────────────────────────────────┘
```

**Componentes Visuales:**
- ✅ Logo centrado
- ✅ Formulario login con 2 inputs
- ✅ Checkbox "Recordarme"
- ✅ Link "Olvidaste contraseña"
- ✅ Botón primario "Iniciar Sesión"
- ✅ Divider "o"
- ✅ Botón Google OAuth (con icono)
- ✅ Link a registro

---

### 2.2 Página de Registro

```
┌────────────────────────────────────────┐
│                                        │
│     [Logo FitCompass Pro]              │
│                                        │
│     Crea tu cuenta gratis              │
│                                        │
│     ┌────────────────────────────┐    │
│     │ Nombre completo            │    │
│     │ [input text]               │    │
│     └────────────────────────────┘    │
│                                        │
│     ┌────────────────────────────┐    │
│     │ Email                      │    │
│     │ [input email]              │    │
│     └────────────────────────────┘    │
│                                        │
│     ┌────────────────────────────┐    │
│     │ Contraseña                 │    │
│     │ [input password]           │    │
│     │ Mín. 8 caracteres          │    │
│     └────────────────────────────┘    │
│                                        │
│     [Botón: Crear Cuenta]              │
│                                        │
│     ────── o ──────                    │
│                                        │
│     [Botón: Continuar con Google]      │
│                                        │
│     ¿Ya tienes cuenta? [Inicia sesión] │
│                                        │
└────────────────────────────────────────┘
```

**Componentes Visuales:**
- ✅ Logo centrado
- ✅ Formulario registro con 3 inputs
- ✅ Helper text "Mín. 8 caracteres"
- ✅ Botón primario "Crear Cuenta"
- ✅ Divider "o"
- ✅ Botón Google OAuth
- ✅ Link a login

---

### 2.3 Wizard de Onboarding (3 Steps)

```
STEP 1/3: Información Básica
┌────────────────────────────────────────┐
│  ● ○ ○                                 │
│                                        │
│  Cuéntanos sobre ti                    │
│                                        │
│  ┌────────────────────────────┐       │
│  │ Nombre de tu gimnasio      │       │
│  │ [input text]               │       │
│  └────────────────────────────┘       │
│                                        │
│  ┌────────────────────────────┐       │
│  │ Sube tu logo (opcional)    │       │
│  │ [Área de upload]           │       │
│  └────────────────────────────┘       │
│                                        │
│  [Botón: Siguiente]                    │
│                                        │
└────────────────────────────────────────┘

STEP 2/3: Zona Horaria
┌────────────────────────────────────────┐
│  ○ ● ○                                 │
│                                        │
│  Configura tu zona horaria             │
│                                        │
│  ┌────────────────────────────┐       │
│  │ Zona horaria               │       │
│  │ [Dropdown select]          │       │
│  │ ▼ America/Buenos_Aires     │       │
│  └────────────────────────────┘       │
│                                        │
│  [Botón: Atrás] [Botón: Siguiente]    │
│                                        │
└────────────────────────────────────────┘

STEP 3/3: ¡Listo!
┌────────────────────────────────────────┐
│  ○ ○ ●                                 │
│                                        │
│  🎉 ¡Todo listo!                       │
│                                        │
│  Ya puedes empezar a gestionar         │
│  tus clientes profesionalmente         │
│                                        │
│  [Botón: Ir al Dashboard]              │
│                                        │
└────────────────────────────────────────┘
```

**Componentes Visuales:**
- ✅ Progress indicator (3 dots)
- ✅ Título de step
- ✅ Inputs por step
- ✅ Upload area con preview
- ✅ Dropdown select de zona horaria
- ✅ Botones navegación (Atrás/Siguiente)
- ✅ Pantalla de éxito con icono

---

## 💼 3. ENTRENADOR - WEB APP

### 3.1 Dashboard Principal

```
┌────────────────────────────────────────────────────────────┐
│  SIDEBAR                    │  MAIN CONTENT                │
├─────────────────────────────┼──────────────────────────────┤
│                             │                              │
│  [Logo FitCompass]          │  Dashboard                   │
│                             │                              │
│  ● Dashboard                │  ┌────────┬────────┬────────┐│
│  ○ Clientes                 │  │ Total  │ Activos│ Pausados││
│  ○ Ejercicios               │  │  25    │   18   │    7   ││
│  ○ Rutinas                  │  └────────┴────────┴────────┘│
│  ○ Configuración            │                              │
│                             │  Actividad de Hoy            │
│  ───────────────            │  ┌──────────────────────────┐│
│                             │  │ ✓ Juan entrenó 08:30 AM  ││
│  [Avatar]                   │  │ ✓ María entrenó 10:15 AM ││
│  Martín López               │  │ ✓ Pedro entrenó 11:00 AM ││
│  [Logout]                   │  └──────────────────────────┘│
│                             │                              │
│                             │  Clientes Recientes          │
│                             │  ┌──────────────────────────┐│
│                             │  │ Nombre  │ Estado │ Última ││
│                             │  ├─────────┼────────┼────────││
│                             │  │ Juan    │ Activo │ Hoy    ││
│                             │  │ María   │ Activo │ Ayer   ││
│                             │  │ Pedro   │ Pausado│ 3 días ││
│                             │  └──────────────────────────┘│
│                             │                              │
└─────────────────────────────┴──────────────────────────────┘
```

**Componentes Visuales:**
- ✅ Sidebar con navegación (logo + menu items + profile)
- ✅ Stats cards (3 métricas principales)
- ✅ Lista de actividad del día (con iconos checkmark)
- ✅ Tabla de clientes recientes (responsive)
- ✅ Avatar del entrenador en sidebar
- ✅ Logout button

---

### 3.2 Lista de Clientes

```
┌────────────────────────────────────────────────────────────┐
│  SIDEBAR    │  MAIN CONTENT                                │
├─────────────┼──────────────────────────────────────────────┤
│             │                                              │
│  [Menú]     │  Mis Clientes                 [+ Nuevo Cliente]
│             │                                              │
│             │  [Buscar...] [Filtrar: Todos ▼]              │
│             │                                              │
│             │  ┌───────────────────────────────────────┐   │
│             │  │ [Avatar] Juan Pérez                   │   │
│             │  │ 🟢 Activo · Entrenó hace 2 horas      │   │
│             │  │ Objetivo: Ganar masa muscular         │   │
│             │  │ [Ver Perfil] [Crear Rutina]           │   │
│             │  └───────────────────────────────────────┘   │
│             │                                              │
│             │  ┌───────────────────────────────────────┐   │
│             │  │ [Avatar] María García                 │   │
│             │  │ 🟢 Activo · Entrenó ayer              │   │
│             │  │ Objetivo: Perder peso                 │   │
│             │  │ [Ver Perfil] [Crear Rutina]           │   │
│             │  └───────────────────────────────────────┘   │
│             │                                              │
│             │  ┌───────────────────────────────────────┐   │
│             │  │ [Avatar] Pedro Martínez               │   │
│             │  │ 🟡 Pausado · Última vez hace 5 días   │   │
│             │  │ Objetivo: Fuerza                      │   │
│             │  │ [Ver Perfil] [Crear Rutina]           │   │
│             │  └───────────────────────────────────────┘   │
│             │                                              │
└─────────────┴──────────────────────────────────────────────┘
```

**Componentes Visuales:**
- ✅ Header con título + botón "Nuevo Cliente"
- ✅ Search bar
- ✅ Dropdown de filtros (Todos/Activos/Pausados)
- ✅ Cliente cards (lista vertical)
  - Avatar
  - Nombre
  - Badge de estado (verde/amarillo/rojo)
  - Última actividad
  - Objetivo
  - Botones de acción
- ✅ Empty state (si no hay clientes)

---

### 3.3 Perfil de Cliente

```
┌────────────────────────────────────────────────────────────┐
│  SIDEBAR    │  MAIN CONTENT                                │
├─────────────┼──────────────────────────────────────────────┤
│             │                                              │
│  [Menú]     │  ← Volver a Clientes                         │
│             │                                              │
│             │  ┌─────────────────────────────────────────┐ │
│             │  │ [Avatar Grande] Juan Pérez              │ │
│             │  │ 🟢 Activo                               │ │
│             │  │ juan@email.com · +54 11 1234-5678       │ │
│             │  │ [Editar] [Pausar] [Eliminar]            │ │
│             │  └─────────────────────────────────────────┘ │
│             │                                              │
│             │  [Tab: Información] [Tab: Rutinas] [Tab: Progreso]
│             │                                              │
│             │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│             │  TAB INFORMACIÓN (Activa)                    │
│             │                                              │
│             │  Objetivos                                   │
│             │  ┌─────────────────────────────────────────┐ │
│             │  │ Ganar masa muscular en tren superior    │ │
│             │  │ Mejorar fuerza en press banca           │ │
│             │  └─────────────────────────────────────────┘ │
│             │                                              │
│             │  Notas del Entrenador                        │
│             │  ┌─────────────────────────────────────────┐ │
│             │  │ Cliente muy comprometido, nunca falta   │ │
│             │  │ Lesión antigua en hombro derecho        │ │
│             │  └─────────────────────────────────────────┘ │
│             │                                              │
│             │  Fecha de Inicio: 15 de Enero, 2025          │
│             │                                              │
└─────────────┴──────────────────────────────────────────────┘
```

**Componentes Visuales:**
- ✅ Breadcrumb "Volver a Clientes"
- ✅ Header card con:
  - Avatar grande
  - Nombre + badge estado
  - Email + teléfono
  - Botones de acción (Editar/Pausar/Eliminar)
- ✅ Tabs navigation (3 tabs)
- ✅ Tab content - Información:
  - Sección "Objetivos" (card)
  - Sección "Notas" (textarea)
  - Fecha de inicio
- ✅ Tab content - Rutinas (lista de rutinas asignadas)
- ✅ Tab content - Progreso (gráficos placeholder)

---

### 3.4 Biblioteca de Ejercicios

```
┌────────────────────────────────────────────────────────────┐
│  SIDEBAR    │  MAIN CONTENT                                │
├─────────────┼──────────────────────────────────────────────┤
│             │                                              │
│  [Menú]     │  Biblioteca de Ejercicios                    │
│             │                                              │
│             │  [Buscar ejercicio...]                       │
│             │                                              │
│             │  Filtros:                                    │
│             │  [Grupo Muscular ▼] [Equipo ▼] [Dificultad ▼]│
│             │                                              │
│             │  ┌───────┬───────┬───────┬───────┐          │
│             │  │[GIF]  │[GIF]  │[GIF]  │[GIF]  │          │
│             │  │       │       │       │       │          │
│             │  │Press  │Senta- │Peso   │Domi-  │          │
│             │  │Banca  │dilla  │Muerto │nadas  │          │
│             │  │       │       │       │       │          │
│             │  │Pecho  │Piernas│Espalda│Espalda│          │
│             │  │Barra  │Barra  │Barra  │Peso   │          │
│             │  │       │       │       │Corporal│         │
│             │  └───────┴───────┴───────┴───────┘          │
│             │                                              │
│             │  ┌───────┬───────┬───────┬───────┐          │
│             │  │[GIF]  │[GIF]  │[GIF]  │[GIF]  │          │
│             │  │...    │...    │...    │...    │          │
│             │  └───────┴───────┴───────┴───────┘          │
│             │                                              │
│             │  [Cargar más ejercicios]                     │
│             │                                              │
└─────────────┴──────────────────────────────────────────────┘
```

**Componentes Visuales:**
- ✅ Search bar grande
- ✅ 3 dropdowns de filtros (inline)
- ✅ Grid de ejercicios (4 columnas)
  - Card con:
    - GIF animado (thumbnail)
    - Nombre del ejercicio
    - Grupo muscular (badge)
    - Equipo (badge)
- ✅ Botón "Cargar más" (infinite scroll)
- ✅ Empty state si no hay resultados

**Modal de Detalle de Ejercicio:**
```
┌──────────────────────────────────────┐
│  Press Banca                    [X]  │
├──────────────────────────────────────┤
│                                      │
│  [GIF grande animado]                │
│                                      │
│  Grupo Muscular: Pecho               │
│  Equipo: Barra                       │
│  Dificultad: Intermedio              │
│                                      │
│  Instrucciones:                      │
│  1. Acuéstate en el banco plano      │
│  2. Agarra la barra con agarre medio │
│  3. Baja controladamente al pecho    │
│  4. Empuja explosivamente hacia arriba│
│                                      │
│  Músculos trabajados:                │
│  • Pectoral mayor                    │
│  • Tríceps                           │
│  • Deltoides anterior                │
│                                      │
│  [Botón: Agregar a Rutina]           │
│                                      │
└──────────────────────────────────────┘
```

**Componentes Visuales del Modal:**
- ✅ Header con nombre + botón cerrar
- ✅ GIF grande
- ✅ Metadata (grupo, equipo, dificultad) con badges
- ✅ Instrucciones numeradas
- ✅ Lista de músculos trabajados
- ✅ Botón CTA "Agregar a Rutina"

---

### 3.5 Constructor de Rutinas

```
┌────────────────────────────────────────────────────────────┐
│  SIDEBAR    │  MAIN CONTENT                                │
├─────────────┼──────────────────────────────────────────────┤
│             │                                              │
│  [Menú]     │  Nueva Rutina                                │
│             │                                              │
│             │  ┌─────────────────────────────────────────┐ │
│             │  │ Nombre de la rutina                     │ │
│             │  │ [input: Ej. "Rutina Push Día A"]       │ │
│             │  └─────────────────────────────────────────┘ │
│             │                                              │
│             │  ┌─────────────────────────────────────────┐ │
│             │  │ Cliente                                 │ │
│             │  │ [Dropdown: Selecciona cliente ▼]       │ │
│             │  └─────────────────────────────────────────┘ │
│             │                                              │
│             │  Ejercicios                                  │
│             │  [+ Agregar Ejercicio desde Biblioteca]      │
│             │                                              │
│             │  ┌─────────────────────────────────────────┐ │
│             │  │ 1. [::] Press Banca            [Eliminar]│ │
│             │  │                                          │ │
│             │  │     Series: [3] Reps: [10]              │ │
│             │  │     Peso: [60] kg  Descanso: [90] seg   │ │
│             │  └─────────────────────────────────────────┘ │
│             │                                              │
│             │  ┌─────────────────────────────────────────┐ │
│             │  │ 2. [::] Sentadilla             [Eliminar]│ │
│             │  │                                          │ │
│             │  │     Series: [4] Reps: [8]               │ │
│             │  │     Peso: [80] kg  Descanso: [120] seg  │ │
│             │  └─────────────────────────────────────────┘ │
│             │                                              │
│             │  ┌─────────────────────────────────────────┐ │
│             │  │ 3. [::] Peso Muerto            [Eliminar]│ │
│             │  │                                          │ │
│             │  │     Series: [3] Reps: [6]               │ │
│             │  │     Peso: [100] kg  Descanso: [180] seg │ │
│             │  └─────────────────────────────────────────┘ │
│             │                                              │
│             │  [Botón: Guardar Rutina] [Botón: Cancelar]   │
│             │                                              │
└─────────────┴──────────────────────────────────────────────┘
```

**Componentes Visuales:**
- ✅ Input nombre de rutina
- ✅ Dropdown selector de cliente
- ✅ Botón "Agregar Ejercicio" (abre modal de biblioteca)
- ✅ Lista de ejercicios drag-and-drop:
  - Handle de drag (::)
  - Nombre del ejercicio
  - Botón eliminar
  - 4 inputs inline (series, reps, peso, descanso)
- ✅ Botones Guardar/Cancelar
- ✅ Empty state "Agrega ejercicios desde la biblioteca"

---

## 📱 4. CLIENTE - MOBILE APP

### 4.1 Dashboard Cliente (Móvil)

```
┌──────────────────────────┐
│  ☰  FitCompass   [🔔]    │
├──────────────────────────┤
│                          │
│  Hola, Juan 👋           │
│                          │
│  ┌────────────────────┐  │
│  │ TU RUTINA DE HOY   │  │
│  │                    │  │
│  │ Rutina Push Día A  │  │
│  │                    │  │
│  │ 5 ejercicios       │  │
│  │ ~45 minutos        │  │
│  │                    │  │
│  │ [Ver Rutina →]     │  │
│  └────────────────────┘  │
│                          │
│  Actividad Reciente      │
│                          │
│  ┌────────────────────┐  │
│  │ ✓ Ayer             │  │
│  │ Rutina Pull        │  │
│  │ 5/5 completados    │  │
│  └────────────────────┘  │
│                          │
│  ┌────────────────────┐  │
│  │ ✓ Hace 2 días      │  │
│  │ Rutina Push        │  │
│  │ 5/5 completados    │  │
│  └────────────────────┘  │
│                          │
│                          │
│                          │
├──────────────────────────┤
│ [🏠] [💪] [📊] [👤]      │
└──────────────────────────┘
```

**Componentes Visuales:**
- ✅ Top bar con menú hamburger + notificaciones
- ✅ Saludo personalizado
- ✅ Card grande "Rutina de Hoy" (highlight)
  - Nombre de rutina
  - Cantidad de ejercicios
  - Tiempo estimado
  - Botón CTA
- ✅ Sección "Actividad Reciente"
- ✅ Cards de actividad (lista vertical)
  - Checkmark
  - Fecha relativa
  - Nombre rutina
  - Progreso (X/Y completados)
- ✅ Bottom navigation bar (4 tabs)

---

### 4.2 Rutina del Día (Móvil)

```
┌──────────────────────────┐
│  ← Rutina Push Día A     │
├──────────────────────────┤
│                          │
│  5 ejercicios · 45 min   │
│                          │
│  ┌────────────────────┐  │
│  │ [GIF]              │  │
│  │                    │  │
│  │ 1. Press Banca     │  │
│  │                    │  │
│  │ 3 series × 10 reps │  │
│  │ 60 kg · 90s rest   │  │
│  │                    │  │
│  │ ☐ ☐ ☐             │  │
│  │                    │  │
│  │ [Ver detalles →]   │  │
│  └────────────────────┘  │
│                          │
│  ┌────────────────────┐  │
│  │ [GIF]              │  │
│  │                    │  │
│  │ 2. Incline Press   │  │
│  │                    │  │
│  │ 3 series × 12 reps │  │
│  │ 50 kg · 90s rest   │  │
│  │                    │  │
│  │ ☐ ☐ ☐             │  │
│  │                    │  │
│  │ [Ver detalles →]   │  │
│  └────────────────────┘  │
│                          │
│  ┌────────────────────┐  │
│  │ [GIF]              │  │
│  │                    │  │
│  │ 3. Fondos          │  │
│  │ ...                │  │
│  └────────────────────┘  │
│                          │
│  [Marcar Rutina Completa]│
│                          │
└──────────────────────────┘
```

**Componentes Visuales:**
- ✅ Header con back button + nombre rutina
- ✅ Metadata (ejercicios, tiempo)
- ✅ Lista de ejercicios (cards verticales):
  - GIF animado (thumbnail)
  - Número + nombre
  - Series × reps
  - Peso + descanso
  - Checkboxes para cada serie (3 checkboxes grandes)
  - Link "Ver detalles"
- ✅ Botón fijo "Marcar Rutina Completa" (bottom)

---

### 4.3 Detalle de Ejercicio (Móvil)

```
┌──────────────────────────┐
│  ← Press Banca           │
├──────────────────────────┤
│                          │
│  ┌────────────────────┐  │
│  │                    │  │
│  │   [GIF GRANDE]     │  │
│  │                    │  │
│  │   [Animado loop]   │  │
│  │                    │  │
│  └────────────────────┘  │
│                          │
│  3 series × 10 reps      │
│  60 kg · 90s descanso    │
│                          │
│  Series completadas:     │
│                          │
│  ┌──────────────────┐    │
│  │ Serie 1          │    │
│  │ [✓] Completada   │    │
│  └──────────────────┘    │
│                          │
│  ┌──────────────────┐    │
│  │ Serie 2          │    │
│  │ [☐] Pendiente    │    │
│  └──────────────────┘    │
│                          │
│  ┌──────────────────┐    │
│  │ Serie 3          │    │
│  │ [☐] Pendiente    │    │
│  └──────────────────┘    │
│                          │
│  ───────────────────     │
│                          │
│  Instrucciones:          │
│  1. Acuéstate en banco   │
│  2. Agarra barra ancho   │
│     medio                │
│  3. Baja al pecho        │
│  4. Empuja explosivo     │
│                          │
│  💡 Tip de tu entrenador:│
│  Mantén los omóplatos    │
│  retraídos durante todo  │
│  el movimiento           │
│                          │
│  [Marcar Serie Completa] │
│                          │
└──────────────────────────┘
```

**Componentes Visuales:**
- ✅ Header con back button + nombre ejercicio
- ✅ GIF grande (ocupa 40% pantalla)
- ✅ Metadata (series, reps, peso, descanso)
- ✅ Sección "Series completadas":
  - Cards de cada serie (clickables)
  - Checkmark o checkbox grande
  - Estado (Completada/Pendiente)
- ✅ Divider
- ✅ Sección "Instrucciones" (lista numerada)
- ✅ Callout "Tip de tu entrenador" (con icono 💡)
- ✅ Botón fijo "Marcar Serie Completa"

---

### 4.4 Login Móvil

```
┌──────────────────────────┐
│                          │
│                          │
│   [Logo FitCompass]      │
│                          │
│   Bienvenido             │
│                          │
│   ┌──────────────────┐   │
│   │ Email            │   │
│   │ [input]          │   │
│   └──────────────────┘   │
│                          │
│   ┌──────────────────┐   │
│   │ Contraseña       │   │
│   │ [input]          │   │
│   └──────────────────┘   │
│                          │
│   [Olvidaste contraseña?]│
│                          │
│   [Botón: Iniciar Sesión]│
│                          │
│                          │
│   No tienes cuenta?      │
│   Contacta a tu entrenador│
│                          │
└──────────────────────────┘
```

**Componentes Visuales:**
- ✅ Logo centrado (grande)
- ✅ Título "Bienvenido"
- ✅ 2 inputs (email, password) - grandes para móvil
- ✅ Link "Olvidaste contraseña"
- ✅ Botón primario grande (full-width)
- ✅ Helper text (no hay registro, entrenador invita)

---

## 📊 TABLA RESUMEN DE FEATURES

| # | Categoría | Pantalla/Componente | Plataforma | Prioridad |
|---|-----------|---------------------|------------|-----------|
| 1.1 | Público | Landing Page | Web | P0 |
| 2.1 | Auth | Login | Web | P0 |
| 2.2 | Auth | Registro | Web | P0 |
| 2.3 | Auth | Wizard Onboarding | Web | P0 |
| 3.1 | Entrenador | Dashboard Principal | Web | P0 |
| 3.2 | Entrenador | Lista de Clientes | Web | P0 |
| 3.3 | Entrenador | Perfil de Cliente | Web | P0 |
| 3.4 | Entrenador | Biblioteca de Ejercicios | Web | P0 |
| 3.5 | Entrenador | Constructor de Rutinas | Web | P0 |
| 4.1 | Cliente | Dashboard Móvil | Mobile | P0 |
| 4.2 | Cliente | Rutina del Día | Mobile | P0 |
| 4.3 | Cliente | Detalle de Ejercicio | Mobile | P0 |
| 4.4 | Cliente | Login Móvil | Mobile | P0 |

---

## 🎨 COMPONENTES REUTILIZABLES

### Componentes Web (shadcn/ui)

| Componente | Variantes | Usado en |
|------------|-----------|----------|
| **Button** | Primary, Secondary, Ghost, Destructive | Todas las pantallas |
| **Input** | Text, Email, Password, Number | Forms de login, registro, constructor |
| **Card** | Default, Hover, Selected | Cliente cards, ejercicio cards, stats |
| **Badge** | Success, Warning, Danger, Neutral | Estados de clientes, tags de ejercicios |
| **Modal** | Default, Large | Detalle ejercicio, confirmaciones |
| **Table** | Responsive | Lista de clientes, actividad reciente |
| **Tabs** | Default | Perfil de cliente (Info/Rutinas/Progreso) |
| **Dropdown** | Single select, Multi select | Filtros, selectores |
| **Avatar** | Small, Medium, Large | Perfil usuario, lista clientes |
| **Sidebar** | Fixed, Collapsible | Navegación principal |

### Componentes Mobile (React Native)

| Componente | Variantes | Usado en |
|------------|-----------|----------|
| **Button** | Primary, Secondary (48px altura mín) | Todas las pantallas móvil |
| **Card** | Exercise, Activity | Rutina del día, dashboard |
| **Checkbox** | Large (44px touch target) | Series completadas |
| **List** | Vertical scroll | Ejercicios, actividad |
| **Bottom Navigation** | 4 tabs | Navegación principal móvil |
| **Header** | With back button | Pantallas internas |
| **GIF Player** | Auto-loop, Pausable | Ejercicios |

---

## 🚀 PRIORIDAD DE IMPLEMENTACIÓN

### FASE 1: Landing + Auth (Semana 1-2)
- ✅ Landing Page (1.1)
- ✅ Login Web (2.1)
- ✅ Registro Web (2.2)
- ✅ Wizard Onboarding (2.3)

### FASE 2: Dashboard Entrenador (Semana 3-4)
- ✅ Dashboard Principal (3.1)
- ✅ Lista de Clientes (3.2)
- ✅ Perfil de Cliente (3.3)

### FASE 3: Constructor (Semana 5-8)
- ✅ Biblioteca de Ejercicios (3.4)
- ✅ Constructor de Rutinas (3.5)

### FASE 4: Mobile Cliente (Semana 9-13)
- ✅ Login Móvil (4.4)
- ✅ Dashboard Móvil (4.1)
- ✅ Rutina del Día (4.2)
- ✅ Detalle de Ejercicio (4.3)

---

## 📱 RESPONSIVE BREAKPOINTS

### Web
- **Mobile:** < 640px (vista móvil del dashboard)
- **Tablet:** 640px - 1024px (sidebar colapsado)
- **Desktop:** > 1024px (sidebar expandido)

### Mobile
- **Small:** 320px - 375px (iPhone SE)
- **Medium:** 375px - 414px (iPhone 13)
- **Large:** 414px+ (iPhone Pro Max, Android)

---

## 🎯 NOTAS FINALES

**Este documento enumera SOLO las pantallas y componentes visuales (front-end).**

**NO incluye:**
- ❌ Funcionalidades backend (API calls, base de datos)
- ❌ Lógica de negocio (cálculos, validaciones complejas)
- ❌ Integraciones (ExerciseDB, Stripe, etc.)
- ❌ Autenticación real (solo UI de login/registro)

**SÍ incluye:**
- ✅ Todas las pantallas visuales
- ✅ Componentes UI reutilizables
- ✅ Layouts y estructura
- ✅ Estados visuales (hover, active, disabled)
- ✅ Wireframes en ASCII
- ✅ Priorización de diseño

**Próximo paso:** Implementar componentes siguiendo `design-system.md`
