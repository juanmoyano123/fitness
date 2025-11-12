# PLAN DE PRODUCTO: FitCompass Pro
## Product Requirements Document (PRD) - Enfoque Técnico

---

## 1. VISIÓN DEL PRODUCTO

### Problema Técnico a Resolver

Los entrenadores personales actualmente gestionan sus clientes y rutinas mediante herramientas desconectadas (Excel, WhatsApp, Google Sheets, papel), lo que genera:

- **Ineficiencia operativa:** Creación manual repetitiva de rutinas sin reutilización
- **Falta de seguimiento:** Imposibilidad de trackear qué clientes completan entrenamientos
- **Comunicación fragmentada:** Pérdida de información en conversaciones de WhatsApp
- **Ausencia de datos estructurados:** No hay histórico ni análisis de progreso

### Solución Técnica

FitCompass Pro es una plataforma web + móvil que centraliza la gestión de clientes, creación de rutinas, seguimiento de progreso y comunicación entrenador-cliente en un único ecosistema tecnológico.

**Arquitectura:** Aplicación web (Next.js) para entrenadores + app móvil (React Native) para clientes, con backend en Supabase (PostgreSQL + Realtime + Storage).

### Usuarios Objetivo

**Usuario Primario - Entrenador Personal (B2B):**
- Gestiona 5-50 clientes activos
- Necesita crear rutinas semanales personalizadas
- Requiere visibilidad de adherencia de clientes
- Busca eficiencia en tareas repetitivas

**Usuario Secundario - Cliente de Entrenador (B2C):**
- Recibe rutina asignada por su entrenador
- Necesita ver ejercicios con referencia visual
- Registra entrenamientos completados
- Comunica dudas/progreso al entrenador

---

## 2. USER PERSONAS TÉCNICAS

### Persona 1: Martín - Entrenador Personal

**Contexto de Uso:**
- Usa la plataforma en laptop/desktop durante planificación (1-2 horas diarias)
- Revisa dashboard en móvil para check rápido de actividad de clientes
- Crea 10-15 rutinas nuevas por semana
- Duplica y adapta rutinas existentes en el 60% de los casos

**Workflows Principales:**
1. **Onboarding de nuevo cliente:** Crear perfil → Definir objetivos → Asignar rutina inicial
2. **Creación de rutina:** Buscar ejercicios en biblioteca → Configurar series/reps/peso → Asignar a cliente
3. **Seguimiento semanal:** Revisar dashboard → Ver quién entrenó → Ajustar rutinas según adherencia
4. **Duplicación eficiente:** Tomar rutina existente → Modificar ejercicios/volumen → Asignar a otro cliente

**Pain Points Técnicos:**
- Necesita crear rutinas rápido (máx. 10 min por rutina)
- Requiere UI simple sin curva de aprendizaje
- Busca acceso offline a datos de clientes
- Necesita notificaciones de inactividad de clientes

**Requerimientos Técnicos:**
- Responsive design (uso en tablet/laptop)
- Drag-and-drop para asignar ejercicios
- Búsqueda/filtros rápidos en biblioteca de ejercicios
- Dashboard con vista de alto nivel (todos los clientes de un vistazo)

---

### Persona 2: Laura - Cliente de Entrenador

**Contexto de Uso:**
- Usa app móvil en el gimnasio (40-60 min, 3-5 días/semana)
- Abre la app al inicio del entreno para ver rutina del día
- Marca ejercicios completados a medida que avanza
- Consulta GIF de ejercicio cuando tiene dudas de ejecución

**Workflows Principales:**
1. **Inicio de entreno:** Abrir app → Ver rutina del día → Comenzar primer ejercicio
2. **Durante entreno:** Ver serie actual → Ejecutar → Marcar como completada → Ver siguiente
3. **Consulta de ejercicio:** Tap en ejercicio → Ver GIF demostrativo → Leer instrucciones
4. **Fin de entreno:** Marcar rutina como completada → Salir de app

**Pain Points Técnicos:**
- Necesita UI simple y grande (uso con manos sudadas/guantes)
- Requiere acceso offline (gimnasios con mala señal)
- Busca referencia visual clara de ejercicios
- Necesita saber exactamente qué hacer (no quiere "pensar" durante entreno)

**Requerimientos Técnicos:**
- App móvil nativa (iOS + Android)
- Funcionalidad offline-first
- Botones grandes y fáciles de tocar
- Carga rápida de GIFs/videos de ejercicios
- Sincronización automática cuando hay conexión

---

## 3. FEATURES CON PRIORIZACIÓN RICE

### Metodología RICE

**RICE Score = (Reach × Impact × Confidence) / Effort**

- **Reach:** % de usuarios que usarán la feature (0-100)
- **Impact:** Impacto en valor del producto (3=alto, 2=medio, 1=bajo)
- **Confidence:** Confianza en estimaciones (0-100%)
- **Effort:** Días de desarrollo estimados

---

### Tabla de Priorización RICE (13 Features)

| # | Feature | Reach | Impact | Conf% | Effort | RICE | Prioridad | Fase |
|---|---------|-------|--------|-------|--------|------|-----------|------|
| 1 | **Gestión de Clientes** | 100 | 3 | 100 | 7 | **42.9** | P0 | V1 |
| 2 | **Biblioteca de Ejercicios** | 100 | 3 | 90 | 10 | **27.0** | P0 | V1 |
| 3 | **Constructor de Rutinas** | 100 | 3 | 100 | 14 | **21.4** | P0 | V1 |
| 4 | **Dashboard de Seguimiento** | 90 | 2 | 80 | 10 | **14.4** | P1 | V1 |
| 5 | **App Móvil Cliente (MVP)** | 100 | 3 | 80 | 21 | **11.4** | P1 | V1 |
| 6 | **Autenticación y Onboarding** | 100 | 2 | 100 | 5 | **40.0** | P0 | V1 |
| 7 | **Calendario de Programación** | 80 | 2 | 90 | 10 | **14.4** | P2 | V2 |
| 8 | **Tracking de Rendimiento** | 85 | 2 | 80 | 12 | **11.3** | P2 | V2 |
| 9 | **Comunicación Entrenador-Cliente** | 70 | 2 | 70 | 10 | **9.8** | P2 | V2 |
| 10 | **Check-ins Semanales** | 75 | 2 | 80 | 8 | **15.0** | P2 | V2 |
| 11 | **Tracking de Hábitos** | 60 | 2 | 70 | 12 | **7.0** | P3 | V2 |
| 12 | **Planes Nutricionales** | 50 | 2 | 60 | 15 | **4.0** | P3 | V3 |
| 13 | **Análisis con IA** | 40 | 2 | 50 | 20 | **2.0** | P3 | V3 |

---

### Justificación de Scores

#### **1. Gestión de Clientes (RICE: 42.9)**
- **Reach: 100** - Todo entrenador necesita gestionar sus clientes
- **Impact: 3** - Feature core sin la cual el producto no funciona
- **Confidence: 100%** - Feature bien definida y estándar (CRUD básico)
- **Effort: 7 días** - CRUD con formularios y validaciones

#### **2. Biblioteca de Ejercicios (RICE: 27.0)**
- **Reach: 100** - Necesaria para crear rutinas
- **Impact: 3** - Diferenciador clave (vs enviar videos de YouTube)
- **Confidence: 90%** - Depende de integración ExerciseDB API
- **Effort: 10 días** - Integración API + UI de búsqueda/filtros + cache

#### **3. Constructor de Rutinas (RICE: 21.4)**
- **Reach: 100** - Feature principal del producto
- **Impact: 3** - Resuelve el pain point #1 (eficiencia en creación)
- **Confidence: 100%** - Feature bien especificada
- **Effort: 14 días** - Lógica compleja (drag-and-drop, relaciones DB)

#### **4. Dashboard de Seguimiento (RICE: 14.4)**
- **Reach: 90** - Usado diariamente por entrenadores activos
- **Impact: 2** - Importante pero no bloqueante
- **Confidence: 80%** - Requiere definir métricas clave a mostrar
- **Effort: 10 días** - Queries complejas + visualización

#### **5. App Móvil Cliente (RICE: 11.4)**
- **Reach: 100** - Todo cliente necesita ver su rutina
- **Impact: 3** - Crítica para uso real del producto
- **Confidence: 80%** - Primera app móvil, curva de aprendizaje
- **Effort: 21 días** - React Native + offline-first + sincronización

#### **6. Autenticación y Onboarding (RICE: 40.0)**
- **Reach: 100** - Feature obligatoria
- **Impact: 2** - Necesaria pero commoditizada (Supabase Auth)
- **Confidence: 100%** - Bien resuelta con Supabase
- **Effort: 5 días** - Integración Supabase Auth + wizard onboarding

#### **7-13. Features V2/V3:**
Priorizadas según RICE pero excluidas de MVP para mantener scope controlado.

---

### Dependencias Técnicas Entre Features

```
Autenticación (V1)
    ↓
Gestión de Clientes (V1)
    ↓
Biblioteca de Ejercicios (V1)
    ↓
Constructor de Rutinas (V1) ──→ App Móvil Cliente (V1)
    ↓                               ↓
Dashboard de Seguimiento (V1) ←────┘
    ↓
Tracking de Rendimiento (V2) ──→ Tracking de Hábitos (V2)
    ↓
Check-ins Semanales (V2)
    ↓
Calendario de Programación (V2)
    ↓
Comunicación Entrenador-Cliente (V2)
```

---

## 4. ACCEPTANCE CRITERIA (Given-When-Then)

### Feature 1: Autenticación y Onboarding

#### AC-1.1: Registro de entrenador con email
**Given** un usuario nuevo visita la página de registro
**When** completa el formulario con email válido y contraseña (mín. 8 caracteres)
**Then** se crea su cuenta, recibe email de verificación y es redirigido al wizard de onboarding

**Edge Cases:**
- Email ya registrado → Mostrar error "Email ya existe"
- Contraseña débil (<8 caracteres) → Mostrar error en tiempo real
- Email inválido → Validación en frontend antes de submit

#### AC-1.2: Login con Google OAuth
**Given** un usuario hace click en "Continuar con Google"
**When** autoriza la app en el popup de Google
**Then** se crea/vincula su cuenta y es redirigido al dashboard (o wizard si es primera vez)

#### AC-1.3: Wizard de onboarding
**Given** un entrenador recién registrado
**When** completa wizard con: nombre del gimnasio/marca, foto de perfil, zona horaria
**Then** sus datos se guardan y es redirigido al dashboard vacío con mensaje de bienvenida

---

### Feature 2: Gestión de Clientes

#### AC-2.1: Crear nuevo cliente
**Given** un entrenador autenticado en el dashboard
**When** hace click en "Nuevo Cliente" y completa: nombre, email, teléfono, objetivos, notas
**Then** el cliente se crea con estado "Activo" y aparece en la lista de clientes

**Edge Cases:**
- Campos obligatorios vacíos → Deshabilitar botón "Crear"
- Email duplicado → Permitir (un entrenador puede tener dos clientes con mismo email)
- Límite de clientes según plan → Mostrar modal de upgrade si excede límite

#### AC-2.2: Editar cliente existente
**Given** un entrenador en la vista de detalle de un cliente
**When** modifica campos y guarda
**Then** los cambios se reflejan inmediatamente en BD y UI

#### AC-2.3: Cambiar estado de cliente (Activo/Pausado/Inactivo)
**Given** un entrenador ve la lista de clientes
**When** selecciona un cliente y cambia su estado a "Pausado"
**Then** el cliente aparece con badge "Pausado" y se mueve visualmente a sección separada

#### AC-2.4: Eliminar cliente
**Given** un entrenador en la vista de detalle de un cliente
**When** hace click en "Eliminar" y confirma en modal
**Then** el cliente y todas sus rutinas/logs asociados se eliminan (soft delete)

**Edge Cases:**
- Cliente con entrenamientos registrados → Mostrar advertencia "Perderás X entrenamientos"
- Confirmación requerida → Modal con botón de confirmación explícito

---

### Feature 3: Biblioteca de Ejercicios

#### AC-3.1: Ver catálogo de ejercicios
**Given** un entrenador en la sección "Biblioteca"
**When** carga la página
**Then** ve grid de ejercicios con: nombre, imagen thumbnail, grupo muscular

#### AC-3.2: Buscar ejercicio por nombre
**Given** un entrenador en la biblioteca
**When** escribe "sentadilla" en el buscador
**Then** la lista se filtra mostrando solo ejercicios con "sentadilla" en el nombre (case-insensitive, fuzzy match)

#### AC-3.3: Filtrar ejercicios por grupo muscular
**Given** un entrenador en la biblioteca
**When** selecciona filtro "Piernas"
**Then** ve solo ejercicios de grupo muscular "Piernas", "Cuádriceps", "Glúteos", "Isquiotibiales"

#### AC-3.4: Ver detalle de ejercicio
**Given** un entrenador hace click en un ejercicio
**When** se abre el modal de detalle
**Then** ve: GIF animado, instrucciones, músculos trabajados, equipo necesario

**Edge Cases:**
- GIF no disponible → Mostrar placeholder "Video no disponible"
- API ExerciseDB caída → Usar cache local + mensaje "Mostrando ejercicios guardados"

---

### Feature 4: Constructor de Rutinas

#### AC-4.1: Crear rutina nueva desde cero
**Given** un entrenador en la vista de un cliente
**When** hace click en "Nueva Rutina" y asigna 5 ejercicios con series/reps/peso
**Then** la rutina se guarda vinculada al cliente y aparece en su perfil

#### AC-4.2: Agregar ejercicio a rutina
**Given** un entrenador creando/editando una rutina
**When** busca "press banca" en la biblioteca y hace click en "Agregar"
**Then** el ejercicio aparece en la rutina con campos: series (default: 3), reps (default: 10), peso (vacío), descanso (default: 60s)

#### AC-4.3: Configurar series/reps/peso de ejercicio en rutina
**Given** un ejercicio agregado a la rutina
**When** el entrenador modifica: series = 4, reps = 8, peso = 60kg, descanso = 90s
**Then** los valores se guardan y se muestran en la rutina

#### AC-4.4: Duplicar rutina de un cliente a otro
**Given** un entrenador ve la rutina del Cliente A
**When** hace click en "Duplicar" y selecciona Cliente B
**Then** se crea una copia exacta de la rutina asignada al Cliente B (sin afectar la original)

#### AC-4.5: Reordenar ejercicios en rutina (drag-and-drop)
**Given** un entrenador editando una rutina con 5 ejercicios
**When** arrastra el ejercicio #4 a la posición #1
**Then** el orden se actualiza visualmente y se guarda en BD

**Edge Cases:**
- Rutina sin ejercicios → Mostrar estado vacío "Agrega ejercicios desde la biblioteca"
- Duplicar a cliente con rutina existente → Reemplazar o crear nueva (modal de confirmación)

---

### Feature 5: App Móvil Cliente (MVP)

#### AC-5.1: Login de cliente con credenciales compartidas
**Given** un entrenador crea un cliente con email "juan@gmail.com"
**When** el entrenador comparte credenciales por WhatsApp y el cliente abre la app
**Then** el cliente hace login con email + contraseña temporal y accede a su dashboard

**Edge Cases:**
- Primera vez → Forzar cambio de contraseña
- Cliente sin rutina asignada → Mostrar mensaje "Tu entrenador aún no te asignó rutina"

#### AC-5.2: Ver rutina del día
**Given** un cliente logeado con rutina asignada
**When** abre la app
**Then** ve su rutina del día con: nombre de ejercicios, series/reps/peso, botón "Completar"

#### AC-5.3: Marcar ejercicio como completado
**Given** un cliente viendo su rutina
**When** completa una serie y hace tap en checkbox
**Then** la serie se marca visualmente como completada (strikethrough + checkmark)

#### AC-5.4: Ver GIF demostrativo de ejercicio
**Given** un cliente viendo un ejercicio en su rutina
**When** hace tap en el nombre del ejercicio
**Then** se abre modal con GIF animado e instrucciones

#### AC-5.5: Funcionalidad offline
**Given** un cliente descargó su rutina con conexión
**When** entra al gimnasio sin señal
**Then** puede ver rutina, marcar ejercicios completados (se sincroniza cuando vuelve conexión)

**Edge Cases:**
- Sin conexión y sin cache → Mostrar error "Descarga tu rutina con WiFi primero"
- Sincronización fallida → Reintentar automáticamente cada 30s

---

### Feature 6: Dashboard de Seguimiento

#### AC-6.1: Ver lista de todos los clientes con última actividad
**Given** un entrenador en el dashboard
**When** carga la página
**Then** ve tabla con: nombre cliente, última actividad (ej: "Entrenó hace 2 días"), estado (Activo/Pausado)

#### AC-6.2: Identificar quién entrenó hoy
**Given** un entrenador en el dashboard
**When** revisa la sección "Actividad de Hoy"
**Then** ve lista de clientes que marcaron entrenamientos hoy con hora (ej: "Juan - 08:30 AM")

#### AC-6.3: Filtrar clientes por estado
**Given** un entrenador en el dashboard
**When** selecciona filtro "Solo activos"
**Then** la lista muestra solo clientes con estado "Activo"

**Edge Cases:**
- Sin clientes → Mostrar estado vacío "Agrega tu primer cliente"
- Ningún cliente entrenó hoy → Mostrar "Ningún cliente entrenó hoy"

---

## 5. TECH STACK Y ARQUITECTURA

### Stack Tecnológico Completo

#### **Frontend Web (Entrenadores)**

| Tecnología | Versión | Justificación |
|------------|---------|---------------|
| **Next.js** | 14+ (App Router) | Framework React con SSR, optimización automática, routing file-based |
| **React** | 18+ | Librería UI estándar, gran ecosistema, hooks modernos |
| **TypeScript** | 5+ | Type safety, mejor DX, menos bugs en producción |
| **Tailwind CSS** | 3+ | Utility-first CSS, rápido de prototipar, bundle pequeño |
| **shadcn/ui** | Latest | Componentes accesibles, customizables, copy-paste (no NPM dependency) |
| **Zustand** | 4+ | State management simple, menos boilerplate que Redux |
| **React Hook Form** | 7+ | Formularios performantes, validación integrada |
| **Zod** | 3+ | Validación de schemas type-safe, integración con React Hook Form |
| **Recharts** | 2+ | Gráficos React-native, fácil de usar, suficiente para MVP |
| **@dnd-kit** | Latest | Drag-and-drop accesible, mejor que react-beautiful-dnd (deprecated) |
| **TanStack Query** | 5+ | Data fetching, caching, sincronización con Supabase |

#### **Frontend Móvil (Clientes)**

| Tecnología | Versión | Justificación |
|------------|---------|---------------|
| **React Native** | 0.73+ | Código compartido iOS/Android, gran comunidad |
| **Expo** | SDK 50+ | Desarrollo rápido, OTA updates, EAS Build para CI/CD |
| **TypeScript** | 5+ | Consistencia con web, type safety |
| **React Navigation** | 6+ | Navegación estándar RN, stack/tab navigators |
| **Zustand** | 4+ | Compartir lógica de estado con web |
| **React Native Paper** | 5+ | Material Design components para Android/iOS |
| **Expo Image** | Latest | Caching automático de imágenes, mejor que Image nativo |
| **AsyncStorage** | Latest | Persistencia local para offline-first |

#### **Backend y Base de Datos**

| Tecnología | Justificación |
|------------|---------------|
| **Supabase** | BaaS completo: PostgreSQL + Auth + Realtime + Storage + Edge Functions |
| **PostgreSQL** | Base de datos relacional robusta, Row Level Security nativo |
| **Supabase Auth** | Autenticación con email/password + OAuth (Google), gestión de sesiones JWT |
| **Supabase Realtime** | WebSockets para chat y actualizaciones en tiempo real |
| **Supabase Storage** | Object storage para videos/imágenes de ejercicios custom |
| **Supabase Edge Functions** | Serverless Deno para cron jobs (notificaciones, emails) |

**Trade-off Decision: ¿Por qué Supabase vs Firebase?**

| Criterio | Supabase | Firebase |
|----------|----------|----------|
| Base de datos | PostgreSQL (SQL, relacional) ✅ | Firestore (NoSQL) |
| Pricing | Más predecible, tier gratuito generoso | Puede escalar costos rápido |
| Queries complejas | Nativo SQL ✅ | Limitado en NoSQL |
| Vendor lock-in | Menor (self-hosteable) ✅ | Alto (Google Cloud) |
| Ecosystem móvil | Bueno | Excelente (FCM nativo) |

**Decisión:** Supabase por SQL + pricing + self-hosting futuro.

#### **Integraciones de Terceros**

| Servicio | Propósito | Fase |
|----------|-----------|------|
| **ExerciseDB API** (RapidAPI) | Catálogo de 1300+ ejercicios con GIFs | V1 |
| **Stripe** | Pagos de suscripciones (internacionales) | V2 |
| **Resend** | Envío de emails transaccionales | V1 |
| **Firebase Cloud Messaging** | Push notifications móviles | V2 |
| **Sentry** | Error tracking y monitoring | V1 |
| **PostHog** | Analytics de producto (self-hosted option) | V2 |

#### **Hosting y Deployment**

| Componente | Plataforma | Justificación |
|------------|-----------|---------------|
| **Web App** | Vercel | Optimizado para Next.js, deploy automático desde Git |
| **Mobile App** | Expo EAS Build → App Store / Google Play | CI/CD integrado, OTA updates |
| **Backend** | Supabase Cloud | Managed PostgreSQL, sin ops |
| **DNS/CDN** | Cloudflare | CDN gratis, analytics, protección DDoS |

---

### Arquitectura de Alto Nivel

```
┌─────────────────────────────────────────────────────────────┐
│                     CAPA DE CLIENTE                          │
├──────────────────────────────┬──────────────────────────────┤
│   Web App (Next.js 14)       │   Mobile App (React Native)  │
│   ├─ Dashboard entrenador    │   ├─ Ver rutina del día      │
│   ├─ Constructor rutinas     │   ├─ Marcar completados      │
│   ├─ Gestión clientes        │   ├─ Ver GIFs ejercicios     │
│   ├─ Biblioteca ejercicios   │   ├─ Offline-first           │
│   └─ Analytics               │   └─ Sincronización auto     │
│                              │                              │
│   Tech: Next.js + TypeScript │   Tech: React Native + Expo  │
│         Tailwind + shadcn/ui │         RN Paper + Zustand   │
│         Zustand + TanStack   │         AsyncStorage         │
└──────────────────────────────┴──────────────────────────────┘
                         │
                         │ HTTPS / WebSocket
                         ▼
            ┌────────────────────────────┐
            │    SUPABASE PLATFORM       │
            ├────────────────────────────┤
            │  ┌──────────────────────┐  │
            │  │   REST API (PostgREST)│  │
            │  │   - CRUD operations   │  │
            │  │   - Row Level Security│  │
            │  └──────────────────────┘  │
            │  ┌──────────────────────┐  │
            │  │   Realtime (WS)      │  │
            │  │   - Chat messages    │  │
            │  │   - Live updates     │  │
            │  └──────────────────────┘  │
            │  ┌──────────────────────┐  │
            │  │   Auth (GoTrue)      │  │
            │  │   - JWT tokens       │  │
            │  │   - OAuth providers  │  │
            │  └──────────────────────┘  │
            └────────────────────────────┘
                         │
         ┌───────────────┼───────────────┬─────────────┐
         ▼               ▼               ▼             ▼
┌────────────┐  ┌────────────┐  ┌────────────┐  ┌─────────┐
│ PostgreSQL │  │  Storage   │  │   Edge     │  │  Auth   │
│            │  │            │  │ Functions  │  │ Provider│
│ - trainers │  │ - Exercise │  │            │  │         │
│ - clients  │  │   videos   │  │ - Cron     │  │ - Google│
│ - workouts │  │ - Profile  │  │ - Webhooks │  │ - Email │
│ - exercises│  │   pics     │  │ - Emails   │  │         │
│ - logs     │  │            │  │            │  │         │
│            │  │ CDN cache  │  │ Deno JS    │  │         │
│ RLS policies│ │            │  │            │  │         │
└────────────┘  └────────────┘  └────────────┘  └─────────┘
         │
         ▼
┌─────────────────────────────────────────────────┐
│        INTEGRACIONES EXTERNAS                   │
├─────────────────────────────────────────────────┤
│ - ExerciseDB API (RapidAPI) - Ejercicios        │
│ - Resend - Emails transaccionales               │
│ - Sentry - Error tracking                       │
│ - PostHog (opcional) - Analytics                │
│ - Firebase Cloud Messaging - Push notifications │
└─────────────────────────────────────────────────┘
```

---

### Decisiones Técnicas y Trade-offs

#### **1. Next.js App Router vs Pages Router**

**Decisión:** App Router (Next.js 14+)

**Justificación:**
- Server Components por default → mejor performance
- Layouts anidados → menos código repetido
- Streaming y Suspense → mejor UX
- Futuro de Next.js (Pages Router en mantenimiento)

**Trade-off:** Curva de aprendizaje más empinada, menos ejemplos en Stack Overflow.

---

#### **2. React Native con Expo vs Flutter**

**Decisión:** React Native + Expo

**Justificación:**
- Código compartido con web (React)
- TypeScript end-to-end
- Ecosistema maduro y gran comunidad
- Expo simplifica desarrollo y deployment (EAS Build, OTA updates)

**Trade-off vs Flutter:**
- Performance nativa ligeramente inferior (irrelevante para este caso de uso)
- Dart es un lenguaje adicional a aprender

---

#### **3. Supabase vs Backend Custom (Node.js/Express)**

**Decisión:** Supabase

**Justificación:**
- Acelera desarrollo en 60-70% (no escribir boilerplate de auth, DB, storage)
- PostgreSQL → queries complejas fáciles
- Row Level Security → seguridad de datos nativa
- Realtime WebSockets incluidos
- Pricing predecible y tier gratuito generoso

**Trade-off:**
- Vendor lock-in moderado (mitigado porque se puede self-host)
- Menos control granular sobre backend

---

#### **4. Zustand vs Redux Toolkit**

**Decisión:** Zustand

**Justificación:**
- API simple y mínima (menos boilerplate)
- No requiere Context providers
- Bundle size pequeño (1.5kb vs 15kb Redux)
- Suficiente para complejidad del MVP

**Trade-off:**
- Redux Toolkit tiene mejor ecosistema de devtools
- Si el estado crece mucho, Redux puede ser más mantenible

---

#### **5. Tailwind CSS vs CSS-in-JS (Styled Components)**

**Decisión:** Tailwind CSS

**Justificación:**
- Desarrollo más rápido (utility-first)
- Bundle CSS optimizado automáticamente
- Design system consistente out-of-the-box
- shadcn/ui usa Tailwind (componentes pre-hechos)

**Trade-off:**
- HTML más verboso (muchas clases)
- Curva de aprendizaje para quien no conoce Tailwind

---

### Herramientas de Desarrollo

| Herramienta | Propósito |
|-------------|-----------|
| **Git + GitHub** | Control de versiones |
| **VSCode** | IDE principal |
| **ESLint + Prettier** | Linting y formateo de código |
| **Husky + lint-staged** | Pre-commit hooks |
| **GitHub Actions** | CI/CD para tests y deploy automático |
| **Sentry** | Error tracking en producción |
| **Supabase Studio** | Admin UI para PostgreSQL |
| **Expo Dev Client** | Testing en dispositivos físicos |

---

## 6. ROADMAP DE DESARROLLO

### V1 - MVP (12-13 semanas / ~62 días)

**Objetivo:** Entrenadores pueden gestionar clientes, crear rutinas y sus clientes pueden ver/completar rutinas en móvil.

#### Sprint 1 (Semana 1-2): Setup y Autenticación
- **Días 1-2:** Setup proyecto Next.js + Supabase + Tailwind + TypeScript
- **Días 3-5:** Implementar autenticación (email/password + Google OAuth) con Supabase Auth
- **Días 6-7:** Wizard de onboarding (nombre gimnasio, foto perfil, zona horaria)
- **Días 8-10:** Configurar Row Level Security en Supabase para aislamiento de datos

**Entregable:** Entrenador puede registrarse, loguearse y completar onboarding.

---

#### Sprint 2 (Semana 3-4): Gestión de Clientes
- **Días 11-13:** CRUD de clientes (crear, listar, editar)
- **Días 14-15:** Estados de cliente (activo/pausado/inactivo) con badges UI
- **Días 16-17:** Soft delete de clientes + confirmación modal
- **Días 18-20:** Búsqueda y filtros de clientes

**Entregable:** Entrenador puede gestionar su cartera de clientes completa.

---

#### Sprint 3 (Semana 5-6): Biblioteca de Ejercicios
- **Días 21-23:** Integración con ExerciseDB API (RapidAPI)
- **Días 24-26:** UI de biblioteca (grid view, card de ejercicio)
- **Días 27-28:** Búsqueda por nombre (fuzzy search con Fuse.js)
- **Días 29-30:** Filtros por grupo muscular y equipo
- **Día 31:** Modal de detalle de ejercicio (GIF, instrucciones, músculos)

**Entregable:** Catálogo de 1300+ ejercicios navegable y buscable.

---

#### Sprint 4 (Semana 7-8): Constructor de Rutinas
- **Días 32-35:** Modelo de datos (tablas `workouts`, `workout_exercises`, relaciones)
- **Días 36-39:** UI para crear rutina (agregar ejercicios desde biblioteca)
- **Días 40-42:** Configuración de series/reps/peso/descanso por ejercicio
- **Días 43-45:** Drag-and-drop para reordenar ejercicios (@dnd-kit)
- **Día 46:** Duplicar rutina entre clientes

**Entregable:** Entrenador puede crear rutinas completas y asignarlas a clientes.

---

#### Sprint 5 (Semana 9-11): App Móvil Cliente
- **Días 47-49:** Setup React Native + Expo + TypeScript
- **Días 50-52:** Autenticación móvil (Supabase Auth)
- **Días 53-55:** Pantalla de rutina del día (lista de ejercicios)
- **Días 56-58:** Marcar ejercicios como completados (checkboxes + sincronización)
- **Días 59-61:** Modal de detalle de ejercicio con GIF
- **Días 62-64:** Implementar offline-first (AsyncStorage + queue de sincronización)
- **Días 65-67:** Testing en iOS + Android (Expo Go + builds de desarrollo)

**Entregable:** Cliente puede ver y completar su rutina en app móvil, funciona offline.

---

#### Sprint 6 (Semana 12-13): Dashboard y Pulido
- **Días 68-70:** Dashboard de entrenador (lista de clientes con última actividad)
- **Días 71-72:** Sección "Quién entrenó hoy"
- **Días 73-74:** Filtros de dashboard (por estado, por actividad)
- **Días 75-77:** Testing end-to-end (Playwright para web, Detox para móvil)
- **Días 78-80:** Corrección de bugs, pulido de UI, optimizaciones de performance
- **Días 81-82:** Deploy a producción (Vercel + Expo EAS Build)

**Entregable:** MVP completo funcional en producción.

---

### V2 - Features Adicionales (8-10 semanas)

**Objetivo:** Agregar tracking avanzado, comunicación y herramientas de retención.

#### Prioridad Alta V2:
1. **Check-ins Semanales** (1.5 semanas / 8 días)
   - Cliente reporta peso, medidas, fotos
   - Entrenador revisa y compara con semanas anteriores
   - Gráficos de evolución (peso/medidas en el tiempo)

2. **Calendario de Programación** (1.5 semanas / 10 días)
   - Asignar rutinas por fecha específica
   - Vista mensual/semanal del plan de cada cliente
   - Notificaciones automáticas de rutina del día

3. **Tracking de Rendimiento** (2 semanas / 12 días)
   - Historial de entrenamientos completados
   - Gráficos de progreso (peso levantado, volumen)
   - Cálculo de 1RM estimado (fórmula Epley)
   - Registro de estado emocional pre/post entreno

#### Prioridad Media V2:
4. **Tracking de Hábitos y Correlación** (2 semanas / 12 días)
   - Crear hábitos personalizados por cliente (sueño, hidratación, nutrición)
   - Registro diario de hábitos (checkboxes + valores numéricos)
   - Dashboard de correlación (rendimiento vs hábitos)
   - Alertas de patrones negativos

5. **Comunicación Entrenador-Cliente** (1.5 semanas / 10 días)
   - Chat integrado (Supabase Realtime)
   - Notificaciones push de nuevos mensajes (Firebase Cloud Messaging)
   - Adjuntar imágenes/videos en chat
   - Alertas automáticas si cliente no entrena X días

**Duración Total V2:** 8-10 semanas

---

### V3+ - Features Futuras (Exploración)

#### Opcionales (NO en roadmap inmediato):
- **Sistema de Pagos Integrado:** Stripe/Mercado Pago para cobrar suscripciones
- **Planes Nutricionales:** Asignar dietas/macros, tracking de comidas
- **Análisis con IA:** Detección de estancamiento, sugerencias de ajustes
- **Marketplace de Rutinas:** Entrenadores venden templates a otros entrenadores
- **Integración con Wearables:** Apple Health, Fitbit, Garmin

---

### Timeline Visual

```
┌─────────────────────────────────────────────────────────────┐
│                         2025                                │
├─────────┬─────────┬─────────┬─────────┬─────────┬─────────┤
│  Ene-Feb │ Mar-Abr │ May-Jun │ Jul-Ago │ Sep-Oct │ Nov-Dic │
├─────────┼─────────┼─────────┼─────────┼─────────┼─────────┤
│         │         │         │         │         │         │
│   V1    │   V1    │   V2    │   V2    │   V3    │   V3    │
│  Setup  │  Mobile │  Check- │ Tracking│ Sistema │  IA +   │
│  + Auth │   App   │   ins   │  Hábitos│  Pagos  │  Nutri  │
│  + CRUD │  Cliente│  + Cal  │  + Chat │         │         │
│         │         │         │         │         │         │
└─────────┴─────────┴─────────┴─────────┴─────────┴─────────┘

  ← 12-13 semanas V1 →  ← 8-10 semanas V2 →  ← Exploración →
```

---

### Hitos de Desarrollo (Milestones)

| Milestone | Fecha Estimada | Criterio de Éxito |
|-----------|----------------|-------------------|
| **M1: Setup Completo** | Semana 2 | Entrenador puede registrarse y loguearse |
| **M2: Gestión de Clientes** | Semana 4 | Entrenador gestiona 10+ clientes de prueba |
| **M3: Biblioteca Funcional** | Semana 6 | Catálogo de ejercicios navegable |
| **M4: Constructor de Rutinas** | Semana 8 | Entrenador crea 5+ rutinas y las asigna |
| **M5: App Móvil MVP** | Semana 11 | Cliente ve rutina y completa entreno en app |
| **M6: Dashboard Completo** | Semana 13 | Entrenador ve actividad de todos sus clientes |
| **M7: MVP en Producción** | Semana 13 | 5-10 entrenadores beta usando en real |
| **M8: V2 Completo** | Semana 23 | Check-ins, calendario, tracking implementados |

---

## 7. HANDOFF PARA DISEÑADOR UX/UI

### User Flows Prioritarios

#### **Flow 1: Onboarding de Entrenador (Crítico para V1)**
```
Landing Page → Registro (Email/Google) → Verificación Email
→ Wizard (Nombre gimnasio + Foto + Zona horaria) → Dashboard Vacío
→ CTA "Agrega tu primer cliente"
```

**Pantallas a diseñar:**
1. Landing page marketing (hero, features, pricing, CTA)
2. Página de registro/login (email + Google OAuth)
3. Wizard de onboarding (3 steps)
4. Dashboard vacío (empty state con CTA)

---

#### **Flow 2: Crear Cliente y Asignar Rutina (Core del Producto)**
```
Dashboard → Click "Nuevo Cliente" → Formulario (Nombre, Email, Objetivos)
→ Guardar → Ver Perfil Cliente → Click "Nueva Rutina"
→ Buscar Ejercicios en Biblioteca → Agregar 5 ejercicios
→ Configurar Series/Reps/Peso → Guardar Rutina
→ Rutina asignada al cliente
```

**Pantallas a diseñar:**
5. Modal/página de nuevo cliente (formulario)
6. Perfil de cliente (tabs: Info, Rutinas, Progreso)
7. Biblioteca de ejercicios (grid view + filtros)
8. Constructor de rutinas (drag-and-drop interface)
9. Modal de configuración de ejercicio (series/reps/peso)

---

#### **Flow 3: Cliente Completa Entreno en App Móvil (Crítico para Retención)**
```
Abrir App → Login → Ver Dashboard → Tap "Rutina de Hoy"
→ Ver Lista de Ejercicios → Tap en Ejercicio → Ver GIF
→ Ejecutar Serie → Tap Checkbox "Completar"
→ Repetir → Finalizar Rutina → Confirmación
```

**Pantallas a diseñar (MÓVIL):**
10. Splash screen + login móvil
11. Dashboard móvil (próximo entreno, historial)
12. Pantalla de rutina del día (lista de ejercicios)
13. Detalle de ejercicio (GIF + instrucciones + timer)
14. Confirmación de rutina completada

---

### Pantallas Críticas del MVP (Prioridad de Diseño)

| Prioridad | Pantalla | Plataforma | Complejidad | Notas |
|-----------|----------|------------|-------------|-------|
| **P0** | Dashboard entrenador | Web | Media | Tabla de clientes, filtros, última actividad |
| **P0** | Biblioteca de ejercicios | Web | Media | Grid view, búsqueda, filtros, modal detalle |
| **P0** | Constructor de rutinas | Web | Alta | Drag-and-drop, formularios inline |
| **P0** | Rutina del día (móvil) | Mobile | Media | Lista simple, checkboxes, accesible |
| **P0** | Detalle ejercicio (móvil) | Mobile | Baja | GIF, texto, botones grandes |
| **P1** | Onboarding wizard | Web | Baja | 3 steps, progress indicator |
| **P1** | Perfil de cliente | Web | Media | Tabs, formularios, historial |
| **P1** | Login/Registro | Web + Mobile | Baja | OAuth botones, formulario simple |

---

### Componentes Reutilizables Necesarios

#### **Componentes Web (shadcn/ui base + custom)**
- **Button** (primary, secondary, ghost, destructive)
- **Input** (text, email, number, textarea)
- **Select/Dropdown** (filtros, asignación de clientes)
- **Modal/Dialog** (confirmaciones, formularios)
- **Card** (cliente card, ejercicio card)
- **Badge** (estado activo/pausado, tags)
- **Table** (lista de clientes, rutinas)
- **Tabs** (navegación en perfil de cliente)
- **Tooltip** (ayudas contextuales)
- **Skeleton** (loading states)
- **Empty State** (cuando no hay datos)

#### **Componentes Móvil (React Native Paper base + custom)**
- **Button** (grande, accesible para gym)
- **Card** (ejercicio card con imagen)
- **Checkbox** (completar series)
- **List** (ejercicios de rutina)
- **Modal** (detalle de ejercicio)
- **ProgressBar** (progreso de rutina)
- **FAB** (floating action button para acciones rápidas)

---

### Referencias de Competidores para UI/UX

#### **Para Inspiración de Dashboard (Web):**
- **Trainerize:** Dashboard limpio, tabla de clientes con avatars
- **TrueCoach:** Vista de calendario mensual, color coding por cliente
- **Notion:** Tablas con filtros/sorts, UI minimalista

#### **Para Constructor de Rutinas (Web):**
- **Trello:** Drag-and-drop de tarjetas
- **Notion Database:** Inline editing de campos
- **Figma:** Sidebar de componentes + canvas central

#### **Para App Móvil (Cliente):**
- **JEFIT:** Lista de ejercicios con GIFs, timer integrado
- **Strong App:** UI simple, botones grandes, fácil de usar con guantes
- **Apple Fitness+:** Animaciones smooth, feedback visual al completar

---

### Requerimientos de Diseño

#### **General:**
- **Design System:** Consistente entre web y móvil (misma paleta, tipografía, espaciado)
- **Accesibilidad:** WCAG AA mínimo (contraste, tamaños de fuente, navegación por teclado)
- **Responsive:** Mobile-first (web debe funcionar en tablet/móvil también)
- **Dark Mode:** No requerido en V1, pero diseñar pensando en que se agregará en V2

#### **Web (Entrenadores):**
- **Viewport mínimo:** 1024px width (laptop)
- **Tipografía:** Sans-serif moderna (Inter, Manrope, o similar)
- **Paleta:** Primario (CTA), secundario (info), neutros (texto/backgrounds), success/error/warning
- **Espaciado:** Sistema de 4px grid (4, 8, 12, 16, 24, 32, 48, 64)

#### **Móvil (Clientes):**
- **Tamaño de botones:** Mínimo 44x44px (Apple) o 48x48dp (Android) para touch targets
- **Tipografía móvil:** Mínimo 16px para body text (evitar zoom en iOS)
- **Navegación:** Bottom tab bar (Home, Rutinas, Progreso, Perfil)
- **Gestures:** Swipe para navegar entre ejercicios, pull-to-refresh en listas

---

### Assets Necesarios del Diseñador

1. **Figma/Sketch Files:**
   - Wireframes de todas las pantallas P0/P1
   - Mockups de alta fidelidad para desarrollo
   - Prototipo interactivo para user testing

2. **Design System Exportado:**
   - Paleta de colores (hex codes)
   - Tipografía (fonts, pesos, tamaños)
   - Espaciado (spacing scale)
   - Componentes documentados (Storybook ideal)

3. **Assets Gráficos:**
   - Logo (SVG + PNG @1x, @2x, @3x)
   - Iconos (usar librería como Lucide React o Heroicons)
   - Ilustraciones para empty states
   - Imágenes placeholder para ejercicios sin GIF

4. **Documentación:**
   - Guía de estilos (typography, colors, spacing)
   - Comportamiento de componentes (hover, active, disabled states)
   - Responsive breakpoints (web)
   - Navigation patterns (móvil)

---

## 8. MODELO DE DATOS

### Diagrama Entidad-Relación (Simplificado)

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│  trainers   │         │   clients   │         │  workouts   │
├─────────────┤         ├─────────────┤         ├─────────────┤
│ id (PK)     │──1───N──│ id (PK)     │──1───N──│ id (PK)     │
│ email       │         │ trainer_id  │         │ client_id   │
│ full_name   │         │ full_name   │         │ name        │
│ gym_name    │         │ email       │         │ created_at  │
│ avatar_url  │         │ phone       │         │             │
│ timezone    │         │ goals       │         └─────────────┘
│ created_at  │         │ notes       │                │
│             │         │ status      │                │
└─────────────┘         │ created_at  │                │
                        └─────────────┘                │
                                                       │
                        ┌─────────────┐                │
                        │  exercises  │                │
                        ├─────────────┤                │
                        │ id (PK)     │──┐             │
                        │ name        │  │             │
                        │ muscle_group│  │             │
                        │ equipment   │  │             │
                        │ gif_url     │  │             │
                        │ instructions│  │             │
                        └─────────────┘  │             │
                                         │             │
                                         │   ┌─────────┴─────────────┐
                                         │   │  workout_exercises    │
                                         │   ├───────────────────────┤
                                         └─N─│ id (PK)               │
                                             │ workout_id (FK)       │
                                             │ exercise_id (FK)      │
                                             │ sets                  │
                                             │ reps                  │
                                             │ weight_kg             │
                                             │ rest_seconds          │
                                             │ order                 │
                                             └───────────────────────┘
                                                       │
                                                       │
                                             ┌─────────┴─────────────┐
                                             │   workout_logs        │
                                             ├───────────────────────┤
                                             │ id (PK)               │
                                             │ workout_exercise_id   │
                                             │ client_id (FK)        │
                                             │ completed_at          │
                                             │ actual_weight         │
                                             │ actual_reps           │
                                             │ notes                 │
                                             └───────────────────────┘
```

---

### Tablas Principales

#### **1. trainers**
Almacena datos de los entrenadores (usuarios B2B).

| Campo | Tipo | Descripción | Constraints |
|-------|------|-------------|-------------|
| `id` | UUID | Identificador único | PK, default: uuid_generate_v4() |
| `email` | TEXT | Email de autenticación | UNIQUE, NOT NULL |
| `full_name` | TEXT | Nombre completo | NOT NULL |
| `gym_name` | TEXT | Nombre de gimnasio/marca | NULL |
| `avatar_url` | TEXT | URL de foto de perfil | NULL |
| `timezone` | TEXT | Zona horaria (ej: "America/Buenos_Aires") | default: "UTC" |
| `created_at` | TIMESTAMPTZ | Fecha de registro | default: now() |
| `updated_at` | TIMESTAMPTZ | Última actualización | default: now() |

**Row Level Security (RLS):**
```sql
-- Entrenadores solo ven sus propios datos
CREATE POLICY "Trainers can view own data"
ON trainers FOR SELECT
USING (auth.uid() = id);
```

---

#### **2. clients**
Almacena datos de los clientes de cada entrenador.

| Campo | Tipo | Descripción | Constraints |
|-------|------|-------------|-------------|
| `id` | UUID | Identificador único | PK, default: uuid_generate_v4() |
| `trainer_id` | UUID | ID del entrenador | FK → trainers.id, NOT NULL |
| `user_id` | UUID | ID de autenticación (Supabase Auth) | FK → auth.users.id, NULL (en V1) |
| `full_name` | TEXT | Nombre completo | NOT NULL |
| `email` | TEXT | Email del cliente | NULL |
| `phone` | TEXT | Teléfono | NULL |
| `goals` | TEXT | Objetivos del cliente | NULL |
| `notes` | TEXT | Notas privadas del entrenador | NULL |
| `status` | TEXT | Estado: 'active', 'paused', 'inactive' | default: 'active' |
| `created_at` | TIMESTAMPTZ | Fecha de creación | default: now() |
| `deleted_at` | TIMESTAMPTZ | Soft delete timestamp | NULL |

**RLS:**
```sql
-- Entrenador solo ve sus propios clientes
CREATE POLICY "Trainers can manage own clients"
ON clients FOR ALL
USING (trainer_id = auth.uid());
```

---

#### **3. exercises**
Catálogo de ejercicios (pre-cargado desde ExerciseDB API).

| Campo | Tipo | Descripción | Constraints |
|-------|------|-------------|-------------|
| `id` | UUID | Identificador único | PK, default: uuid_generate_v4() |
| `external_id` | TEXT | ID de ExerciseDB API | UNIQUE, NULL |
| `name` | TEXT | Nombre del ejercicio | NOT NULL |
| `muscle_group` | TEXT | Grupo muscular principal | NOT NULL |
| `secondary_muscles` | TEXT[] | Músculos secundarios | NULL |
| `equipment` | TEXT | Equipo necesario | NULL |
| `gif_url` | TEXT | URL del GIF demostrativo | NULL |
| `instructions` | TEXT | Instrucciones de ejecución | NULL |
| `difficulty` | TEXT | 'beginner', 'intermediate', 'advanced' | NULL |
| `created_at` | TIMESTAMPTZ | Fecha de creación | default: now() |

**RLS:**
```sql
-- Todos los usuarios autenticados pueden leer ejercicios
CREATE POLICY "Authenticated users can view exercises"
ON exercises FOR SELECT
USING (auth.role() = 'authenticated');
```

---

#### **4. workouts**
Rutinas de entrenamiento creadas por entrenadores.

| Campo | Tipo | Descripción | Constraints |
|-------|------|-------------|-------------|
| `id` | UUID | Identificador único | PK, default: uuid_generate_v4() |
| `trainer_id` | UUID | Creador de la rutina | FK → trainers.id, NOT NULL |
| `client_id` | UUID | Cliente asignado | FK → clients.id, NOT NULL |
| `name` | TEXT | Nombre de la rutina | NOT NULL |
| `description` | TEXT | Descripción/notas | NULL |
| `is_template` | BOOLEAN | Si es template reutilizable | default: false |
| `created_at` | TIMESTAMPTZ | Fecha de creación | default: now() |
| `updated_at` | TIMESTAMPTZ | Última actualización | default: now() |

**RLS:**
```sql
-- Entrenador ve rutinas de sus clientes
CREATE POLICY "Trainers can manage workouts of their clients"
ON workouts FOR ALL
USING (trainer_id = auth.uid());
```

---

#### **5. workout_exercises**
Ejercicios dentro de una rutina (relación many-to-many entre workouts y exercises).

| Campo | Tipo | Descripción | Constraints |
|-------|------|-------------|-------------|
| `id` | UUID | Identificador único | PK, default: uuid_generate_v4() |
| `workout_id` | UUID | Rutina padre | FK → workouts.id, NOT NULL, ON DELETE CASCADE |
| `exercise_id` | UUID | Ejercicio asignado | FK → exercises.id, NOT NULL |
| `sets` | INTEGER | Número de series | NOT NULL, default: 3 |
| `reps` | INTEGER | Repeticiones por serie | NOT NULL, default: 10 |
| `weight_kg` | DECIMAL | Peso objetivo (kg) | NULL |
| `rest_seconds` | INTEGER | Descanso entre series (segundos) | default: 60 |
| `order` | INTEGER | Orden del ejercicio en la rutina | NOT NULL |
| `notes` | TEXT | Notas del entrenador | NULL |

**RLS:**
```sql
-- Heredado de workout (entrenador ve ejercicios de sus rutinas)
CREATE POLICY "Workout exercises inherit workout policy"
ON workout_exercises FOR ALL
USING (
  workout_id IN (
    SELECT id FROM workouts WHERE trainer_id = auth.uid()
  )
);
```

---

#### **6. workout_logs**
Registro de entrenamientos completados por clientes.

| Campo | Tipo | Descripción | Constraints |
|-------|------|-------------|-------------|
| `id` | UUID | Identificador único | PK, default: uuid_generate_v4() |
| `workout_exercise_id` | UUID | Ejercicio de la rutina | FK → workout_exercises.id, NOT NULL |
| `client_id` | UUID | Cliente que completó | FK → clients.id, NOT NULL |
| `completed_at` | TIMESTAMPTZ | Timestamp de completación | default: now() |
| `actual_sets` | INTEGER | Series realmente completadas | NULL |
| `actual_reps` | INTEGER | Reps realmente completadas | NULL |
| `actual_weight_kg` | DECIMAL | Peso usado (kg) | NULL |
| `notes` | TEXT | Notas del cliente | NULL |
| `feeling` | INTEGER | Estado emocional (1-10) | CHECK (feeling >= 1 AND feeling <= 10) |

**RLS:**
```sql
-- Cliente ve solo sus propios logs
CREATE POLICY "Clients can manage own logs"
ON workout_logs FOR ALL
USING (client_id IN (
  SELECT id FROM clients WHERE user_id = auth.uid()
));

-- Entrenador ve logs de sus clientes
CREATE POLICY "Trainers can view client logs"
ON workout_logs FOR SELECT
USING (client_id IN (
  SELECT id FROM clients WHERE trainer_id = auth.uid()
));
```

---

### Relaciones Entre Tablas

```
trainers (1) ──< (N) clients
trainers (1) ──< (N) workouts
clients (1) ──< (N) workouts
workouts (1) ──< (N) workout_exercises
exercises (1) ──< (N) workout_exercises
workout_exercises (1) ──< (N) workout_logs
clients (1) ──< (N) workout_logs
```

---

### Índices Recomendados (Performance)

```sql
-- Búsqueda de clientes por entrenador (dashboard)
CREATE INDEX idx_clients_trainer_id ON clients(trainer_id);
CREATE INDEX idx_clients_status ON clients(status);

-- Búsqueda de rutinas por cliente
CREATE INDEX idx_workouts_client_id ON workouts(client_id);

-- Búsqueda de ejercicios por nombre (biblioteca)
CREATE INDEX idx_exercises_name ON exercises USING gin(to_tsvector('spanish', name));

-- Búsqueda de logs por cliente (historial)
CREATE INDEX idx_workout_logs_client_id ON workout_logs(client_id);
CREATE INDEX idx_workout_logs_completed_at ON workout_logs(completed_at DESC);
```

---

### Migraciones Iniciales

#### **Migración 001: Setup Inicial**
```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create trainers table
CREATE TABLE trainers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  gym_name TEXT,
  avatar_url TEXT,
  timezone TEXT DEFAULT 'UTC',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE trainers ENABLE ROW LEVEL SECURITY;

-- RLS Policy
CREATE POLICY "Trainers can view own data"
ON trainers FOR SELECT
USING (auth.uid() = id);
```

*(Similarmente para todas las tablas)*

---

## RESUMEN EJECUTIVO PARA DESARROLLO

### MVP V1 - Scope Final

**Duración:** 12-13 semanas (62 días de desarrollo)

**Features Incluidas:**
1. ✅ Autenticación y Onboarding (5 días)
2. ✅ Gestión de Clientes (7 días)
3. ✅ Biblioteca de Ejercicios (10 días)
4. ✅ Constructor de Rutinas (14 días)
5. ✅ App Móvil Cliente MVP (21 días)
6. ✅ Dashboard Básico (5 días)

**Stack Técnico:**
- **Web:** Next.js 14 + TypeScript + Tailwind + shadcn/ui + Supabase
- **Móvil:** React Native + Expo + TypeScript + Supabase
- **Backend:** Supabase (PostgreSQL + Auth + Realtime + Storage)
- **Hosting:** Vercel (web) + Expo EAS (móvil)

**Criterio de Éxito MVP:**
- 5-10 entrenadores beta pueden gestionar 50+ clientes en total
- 50+ clientes completan entrenamientos en app móvil
- Tasa de completación de rutinas >60%
- Tiempo de creación de rutina <10 min
- App móvil funciona offline

---

### Próximos Pasos Inmediatos

1. **Diseñador:** Crear wireframes de 14 pantallas prioritarias (ver sección 7)
2. **Developer:** Setup de proyecto Next.js + Supabase (días 1-2)
3. **PM:** Validar acceptance criteria con stakeholders
4. **DevOps:** Configurar CI/CD en GitHub Actions

---

**Documento creado:** 2025-01-11
**Versión:** 1.0
**Próxima revisión:** Post-MVP (semana 14)
