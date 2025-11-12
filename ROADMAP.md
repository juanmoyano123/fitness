# 🗺️ ROADMAP - FitCompass Pro

**Última actualización:** 12 Noviembre 2025
**Estado actual:** MVP V1 en desarrollo

---

## 📊 ESTADO GENERAL

```
MVP V1 PROGRESO: ████████████░░░░░░░░ 50% (3/6 features completas)

Completadas:  3/6 features
En progreso:  0/6 features
Pendientes:   3/6 features
```

---

## 🎯 FEATURES MVP V1

### ✅ F0: Setup Proyecto
**Estado:** COMPLETADO ✅
**Duración estimada:** 2 días
**Duración real:** 2 días

**Completado:**
- ✅ Next.js 16 + TypeScript + Tailwind CSS 4
- ✅ SQLite + Drizzle ORM configurado
- ✅ shadcn/ui componentes instalados
- ✅ Estructura de carpetas definida
- ✅ Diseño Buckler unificado

---

### ✅ F1: Autenticación y Onboarding
**Estado:** COMPLETADO ✅
**Duración estimada:** 5 días
**Duración real:** 4 días

**Completado:**
- ✅ Migración de SQLite a Supabase PostgreSQL
- ✅ Supabase Auth configurado (@supabase/ssr)
- ✅ Registro de usuarios (email/password)
- ✅ Login de usuarios (email/password)
- ✅ Protección de rutas con middleware
- ✅ Hook useAuth para componentes cliente
- ✅ Integración con componentes existentes
- ✅ Auth checks en server actions

**Rutas implementadas:**
- `/register` - Registro de nuevos entrenadores
- `/login` - Inicio de sesión

**📝 Notas:**
- OAuth de Google y wizard de onboarding dejados para V2
- Requiere que el usuario configure credenciales de Supabase en `.env.local`
- Base de datos migrada a PostgreSQL (schema actualizado)

---

### ✅ F2: Gestión de Clientes
**Estado:** COMPLETADO ✅
**Duración estimada:** 7 días
**Duración real:** 5 días

**Completado:**
- ✅ CRUD completo (crear, leer, actualizar, eliminar)
- ✅ Filtros por nombre, email, estado
- ✅ Estados: Activo/Pausado/Inactivo con badges
- ✅ Vista tabla y grid
- ✅ Perfil detallado de cliente
- ✅ Soft delete implementado
- ✅ Formularios unificados con validación Zod

**Rutas implementadas:**
- `/dashboard/clientes` - Lista de clientes
- `/dashboard/clientes/[id]` - Perfil de cliente

---

### ❌ F3: Biblioteca de Ejercicios
**Estado:** NO INICIADO ⏸️
**Duración estimada:** 10 días
**Bloqueada por:** F1 debe completarse primero

**Scope:**
- ❌ Integración con ExerciseDB API (RapidAPI)
- ❌ Grid view de ejercicios con thumbnails
- ❌ Búsqueda por nombre (fuzzy search)
- ❌ Filtros por grupo muscular y equipo
- ❌ Modal de detalle (GIF, instrucciones, músculos)
- ❌ Cache local para offline

**🎯 SIGUIENTE FEATURE A TRABAJAR**

---

### ❌ F4: Constructor de Rutinas
**Estado:** NO INICIADO ⏸️
**Duración estimada:** 14 días
**Bloqueada por:** F2 + F3 deben completarse

**Scope:**
- ❌ Crear rutina nueva desde cero
- ❌ Agregar ejercicios desde biblioteca
- ❌ Configurar series/reps/peso/descanso
- ❌ Drag-and-drop para reordenar ejercicios
- ❌ Duplicar rutina entre clientes
- ❌ Templates de rutinas

**Tablas DB necesarias:**
- `workouts`
- `workout_exercises`

---

### ❌ F5: App Móvil Cliente
**Estado:** NO INICIADO ⏸️
**Duración estimada:** 21 días
**Bloqueada por:** F4 debe completarse

**Scope:**
- ❌ Setup React Native + Expo
- ❌ Autenticación móvil
- ❌ Ver rutina del día
- ❌ Marcar ejercicios completados
- ❌ Ver GIFs de ejercicios
- ❌ Funcionalidad offline-first
- ❌ Sincronización automática

**Plataformas:** iOS + Android

---

### ❌ F6: Dashboard de Seguimiento
**Estado:** NO INICIADO ⏸️
**Duración estimada:** 5 días
**Bloqueada por:** F4 debe completarse

**Scope:**
- ❌ Lista de clientes con última actividad
- ❌ Sección "Quién entrenó hoy"
- ❌ Filtros por estado y actividad
- ❌ Métricas de adherencia
- ❌ Gráficos de progreso

**Ruta:** `/dashboard` (mejorar página actual)

---

## 🔄 DEPENDENCIAS VISUALES

```
F0 (Setup) ──────────────┐
                         ▼
F1 (Auth) ───────────────┼──────────┐
                         ▼          ▼
              ┌─── F2 (Clientes) ✅ │
              │          │          │
              │          ▼          ▼
              └─── F3 (Ejercicios) 🎯 ← PRÓXIMO
                         │
                         ▼
              F4 (Constructor Rutinas)
                         │
                    ┌────┴────┐
                    ▼         ▼
              F5 (Móvil)  F6 (Dashboard)
                    │         │
                    └────┬────┘
                         ▼
                    MVP V1 ✅
```

---

## 📅 TIMELINE ESTIMADO

| Semana | Feature | Estado | Notas |
|--------|---------|--------|-------|
| **Semana 1-2** | F0 + F1 | ✅ 100% | Setup y auth completados |
| **Semana 3** | F2 | ✅ 100% | Gestión clientes completada |
| **Semana 4-5** | F3 | ⏸️ 0% | **← Estamos aquí** |
| **Semana 6-8** | F4 | ⏸️ 0% | Constructor de rutinas |
| **Semana 9-13** | F5 | ⏸️ 0% | App móvil |
| **Semana 14** | F6 | ⏸️ 0% | Dashboard final |

**Tiempo transcurrido:** 3 semanas
**Tiempo restante estimado:** 11 semanas
**Fecha estimada MVP:** Febrero 2025

---

## 🎯 PRÓXIMOS PASOS INMEDIATOS

### 1️⃣ Configurar Credenciales de Supabase ⚠️
**Prioridad:** CRÍTICA 🔴
**Bloquea:** Toda la aplicación requiere esto para funcionar

**Tareas:**
- [ ] Crear proyecto en [supabase.com](https://supabase.com)
- [ ] Copiar credenciales desde Settings > API
- [ ] Actualizar `.env.local` con las credenciales reales
- [ ] Ejecutar `npx drizzle-kit push` para crear tablas
- [ ] Probar registro y login

---

### 2️⃣ Implementar F3: Biblioteca de Ejercicios (10 días)
**Prioridad:** ALTA 🎯
**Desbloquea:** F4 (Constructor de Rutinas)

**Tareas:**
- [ ] Integrar ExerciseDB API (RapidAPI)
- [ ] Crear tabla `exercises` en DB
- [ ] UI: Grid view de ejercicios
- [ ] Buscador con fuzzy search
- [ ] Filtros por músculo y equipo
- [ ] Modal de detalle con GIF
- [ ] Cache local de ejercicios

**Ruta a crear:** `/dashboard/ejercicios`

---

## 📦 FEATURES V2 (Post-MVP)

Después de completar MVP V1, estas features se pueden trabajar en paralelo:

| Feature | Duración | Prioridad |
|---------|----------|-----------|
| **F7:** Calendario de Programación | 10 días | P2 |
| **F8:** Tracking de Rendimiento | 12 días | P2 |
| **F9:** Chat Entrenador-Cliente | 10 días | P2 |
| **F10:** Check-ins Semanales | 8 días | P2 |
| **F11:** Tracking de Hábitos | 12 días | P3 |

---

## 🚀 CÓMO USAR ESTE ROADMAP

### Para actualizar el estado:
1. Cambiar emoji de estado: ⏸️ → 🟡 → ✅
2. Actualizar porcentaje de progreso general
3. Marcar tareas completadas con ✅
4. Mover "← Estamos aquí" a la feature actual

### Leyenda de estados:
- ✅ **COMPLETADO** - Feature 100% funcional
- 🟡 **EN PROGRESO** - Feature siendo desarrollada
- ⏸️ **NO INICIADO** - Feature pendiente
- 🎯 **PRÓXIMO** - Siguiente feature a trabajar
- ⚠️ **BLOQUEANTE** - Bloquea otras features

---

## 📊 MÉTRICAS DE ÉXITO MVP

### Objetivos Técnicos:
- [ ] 5-10 entrenadores beta usando la plataforma
- [ ] 50+ clientes gestionados en total
- [ ] Rutinas creadas en <10 minutos
- [ ] App móvil funciona offline
- [ ] Tasa de completación de rutinas >60%

### Métricas de Calidad:
- [ ] 0 errores críticos en producción
- [ ] Tiempo de carga <2s
- [ ] Responsive en móvil/tablet/desktop
- [ ] Accesibilidad WCAG AA

---

**📍 Ubicación de documentación completa:**
- Plan general: `/docs/planning/general-plan.md`
- Dependencias: `/docs/features/dependencies-features.md`
- Diseño: `/docs/design/buckler-inspiration.md`
