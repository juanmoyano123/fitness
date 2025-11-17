# FASE 3 y 4: Backend API + Integración Frontend-Backend

## Resumen de Implementación

Este documento describe la implementación completa de la **FASE 3: BACKEND API CORE** y **FASE 4: INTEGRACIÓN FRONTEND-BACKEND** del proyecto FitCompass Pro.

## 📋 Features Implementadas

### FASE 3: Backend API Core

#### ✅ F-010: Setup Flask + PostgreSQL
- Configuración de Flask con SQLAlchemy
- Integración de PostgreSQL/Neon
- CORS configurado para frontend
- JWT preparado para Fase 6

#### ✅ F-011: API CRUD Clientes
**Endpoints:**
- `GET /api/clients` - Listar clientes del trainer
- `POST /api/clients` - Crear nuevo cliente
- `GET /api/clients/:id` - Obtener detalles de cliente
- `PUT /api/clients/:id` - Actualizar cliente
- `DELETE /api/clients/:id` - Eliminar cliente

**Características:**
- Cálculo automático de adherencia
- Tracking de última actividad
- Estadísticas de workouts completados/asignados

#### ✅ F-012: Integración ExerciseDB API
**Endpoints:**
- `GET /api/exercises` - Listar ejercicios (con filtros)
- `GET /api/exercises/filters` - Obtener filtros disponibles
- `POST /api/exercises/custom` - Crear ejercicio personalizado
- `GET /api/exercises/:id` - Obtener detalles de ejercicio

**Características:**
- Integración con ExerciseDB API (1300+ ejercicios)
- Sistema de caché para ejercicios
- Soporte para ejercicios personalizados por trainer
- Búsqueda por nombre, body part, target, equipment

#### ✅ F-013: API Workouts
**Endpoints:**
- `GET /api/workouts` - Listar workouts del trainer
- `POST /api/workouts` - Crear workout
- `GET /api/workouts/:id` - Obtener detalles de workout
- `PUT /api/workouts/:id` - Actualizar workout
- `DELETE /api/workouts/:id` - Eliminar workout
- `POST /api/workouts/:id/assign` - Asignar workout a clientes

**Características:**
- Constructor de workouts con ejercicios
- Especificación de sets/reps/rest por ejercicio
- Asignación múltiple a clientes
- Programación por fecha

#### ✅ F-014: API Logging Entrenamientos
**Endpoints:**
- `GET /api/assignments?clientId=X` - Listar assignments de cliente
- `GET /api/assignments/:id` - Obtener detalles de assignment
- `POST /api/assignments/:id/start` - Iniciar workout
- `POST /api/assignments/:id/logs` - Registrar set completado
- `POST /api/assignments/:id/complete` - Finalizar workout
- `POST /api/assignments/:id/skip` - Marcar como omitido

**Características:**
- Logging individual por set
- Estados: pending → in_progress → completed/skipped
- Cálculo automático de duración
- Persistencia de progreso parcial

---

### FASE 4: Integración Frontend-Backend

#### ✅ F-015: Dashboard Web Conectado con API Real

**Archivos Modificados:**
- `frontend-web/src/lib/api.ts` - Cliente API completo
- `frontend-web/src/app/dashboard/clients/page.tsx` - Gestión de clientes
- `frontend-web/src/app/dashboard/exercises/page.tsx` - Biblioteca de ejercicios
- `frontend-web/src/app/dashboard/workouts/page.tsx` - Constructor de workouts

**Características Implementadas:**
- ✅ Reemplazo de MOCK_CLIENTS con API real
- ✅ Loading states con spinners
- ✅ Error handling con mensajes descriptivos
- ✅ Optimistic updates para mejor UX
- ✅ Integración completa con ExerciseDB
- ✅ Creación de workouts con ejercicios reales
- ✅ Asignación de workouts a clientes

#### ✅ F-016: App Móvil Conectada con API Real

**Archivos Modificados:**
- `frontend-mobile/src/lib/api.ts` - Cliente API móvil
- `frontend-mobile/src/screens/WorkoutsScreen.tsx` - Lista de workouts
- `frontend-mobile/src/screens/WorkoutDetailScreen.tsx` - Detalle y logging
- `frontend-mobile/src/screens/HomeScreen.tsx` - Dashboard principal

**Características Implementadas:**
- ✅ Carga de workouts asignados desde API
- ✅ Inicio de workout (estado: pending → in_progress)
- ✅ Logging de sets en tiempo real
- ✅ Finalización de workout con cálculo de duración
- ✅ Pull-to-refresh en todas las pantallas
- ✅ Loading states y error handling
- ✅ Dashboard con estadísticas reales

#### ✅ F-017: Sincronización Datos y Estados

**Implementado:**
- ✅ Optimistic updates en web (crear/editar clientes, workouts)
- ✅ Error rollback automático en caso de fallo
- ✅ Pull-to-refresh en app móvil
- ✅ Recarga automática al volver a pantallas (useFocusEffect)
- ✅ Sincronización inmediata de logs entre sets

---

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────┐         ┌─────────────────────┐
│  Frontend Web       │         │  Frontend Mobile    │
│  (Next.js)          │         │  (React Native)     │
│                     │         │                     │
│  - Dashboard        │         │  - Home             │
│  - Clientes         │         │  - Workouts         │
│  - Ejercicios       │         │  - Workout Detail   │
│  - Workouts         │         │  - Progress         │
└──────────┬──────────┘         └──────────┬──────────┘
           │                               │
           │  HTTP/REST API                │
           │                               │
           └───────────┬───────────────────┘
                       │
                       ▼
            ┌──────────────────────┐
            │  Backend API         │
            │  (Flask + SQLAlchemy)│
            │                      │
            │  Routes:             │
            │  - /api/clients      │
            │  - /api/exercises    │
            │  - /api/workouts     │
            │  - /api/assignments  │
            └──────────┬───────────┘
                       │
          ┌────────────┼────────────┐
          │            │            │
          ▼            ▼            ▼
    ┌─────────┐  ┌──────────┐  ┌─────────────┐
    │PostgreSQL│  │ExerciseDB│  │ File System │
    │  (Neon) │  │   API    │  │   (cache)   │
    └─────────┘  └──────────┘  └─────────────┘
```

---

## 🗄️ Modelos de Base de Datos

### Trainers
```python
- id: String (PK)
- email: String (unique)
- password_hash: String
- name: String
- created_at: DateTime
```

### Clients
```python
- id: String (PK)
- trainer_id: String (FK → trainers)
- name: String
- email: String
- gender: String
- age: Integer
- goals: Text
- status: String (active/archived)
- created_at/updated_at: DateTime
```

### Exercises
```python
- id: String (PK)
- external_id: String (ExerciseDB ID)
- name: String
- body_part: String
- equipment: String
- target: String
- gif_url: String
- instructions: Text
- is_custom: Boolean
- trainer_id: String (FK, nullable)
```

### Workouts
```python
- id: String (PK)
- trainer_id: String (FK → trainers)
- name: String
- description: Text
- category: String
- difficulty: String
- duration_minutes: Integer
```

### WorkoutExercises
```python
- id: String (PK)
- workout_id: String (FK → workouts)
- exercise_id: String (FK → exercises)
- order_index: Integer
- sets: Integer
- reps: String
- rest_seconds: Integer
- notes: Text
```

### WorkoutAssignments
```python
- id: String (PK)
- workout_id: String (FK → workouts)
- client_id: String (FK → clients)
- assigned_date: DateTime
- scheduled_date: Date
- status: String (pending/in_progress/completed/skipped)
- started_at: DateTime
- completed_at: DateTime
- duration_minutes: Integer
```

### WorkoutLogs
```python
- id: String (PK)
- assignment_id: String (FK → workout_assignments)
- workout_exercise_id: String (FK → workout_exercises)
- set_number: Integer
- reps_completed: Integer
- weight_used: Float
- logged_at: DateTime
```

---

## 🚀 Cómo Ejecutar el Proyecto

### 1. Backend (Flask)

```bash
cd backend

# Crear entorno virtual
python3 -m venv venv
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tu DATABASE_URL

# Ejecutar migraciones (crear tablas)
python run.py  # Crea tablas automáticamente

# Cargar datos de demostración
python seed_data.py

# Iniciar servidor
python run.py
# → http://localhost:5000
```

### 2. Frontend Web (Next.js)

```bash
cd frontend-web

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# NEXT_PUBLIC_API_URL=http://localhost:5000

# Iniciar servidor de desarrollo
npm run dev
# → http://localhost:3000
```

### 3. Frontend Mobile (React Native)

```bash
cd frontend-mobile

# Instalar dependencias
npm install

# iOS
npx pod-install
npm run ios

# Android
npm run android
```

**Importante:** Actualizar la URL de API en `frontend-mobile/src/lib/api.ts`:
```typescript
const API_BASE = 'http://YOUR_LOCAL_IP:5000/api';
// Ejemplo: 'http://192.168.1.100:5000/api'
```

---

## 🧪 Testing Manual

### Test 1: Crear Cliente (Web)
1. Ir a http://localhost:3000/dashboard/clients
2. Click en "Agregar Cliente"
3. Llenar formulario
4. Verificar que aparece en la tabla
5. Refrescar página → cliente debe persistir

### Test 2: Crear Workout (Web)
1. Ir a /dashboard/exercises
2. Buscar ejercicios (ej. "push")
3. Ir a /dashboard/workouts
4. Crear workout con 3 ejercicios
5. Asignar a un cliente
6. Verificar en BD: `SELECT * FROM workouts;`

### Test 3: Completar Workout (Mobile)
1. Abrir app móvil
2. Ver workouts asignados
3. Abrir workout
4. Iniciar workout
5. Completar sets (registrar reps/peso)
6. Finalizar workout
7. Verificar en web: Dashboard → Cliente → Ver adherencia actualizada

---

## 📊 Datos de Demo

Después de ejecutar `python seed_data.py`:

**Trainer:**
- Email: trainer@fitcompass.com
- Password: demo123
- ID: trainer-demo-1

**Clientes:**
- Laura Gómez (client-1)
- Juan Pérez (client-2)
- María López (client-3)

**Workouts:**
- Full Body Beginner (3 ejercicios)
- Upper Body Focus (2 ejercicios)

**Assignments:**
- Varios assignments con diferentes estados

---

## 🔧 Tecnologías Utilizadas

### Backend
- Flask 3.0
- SQLAlchemy (ORM)
- PostgreSQL
- Flask-CORS
- Flask-JWT-Extended
- requests (ExerciseDB API)

### Frontend Web
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Shadcn/ui components
- Chart.js (para gráficos)

### Frontend Mobile
- React Native
- TypeScript
- React Navigation
- date-fns

---

## ✅ Checklist de Implementación

### FASE 3: Backend API Core
- [x] F-010: Setup Flask + PostgreSQL/Neon
- [x] F-011: API CRUD clientes
- [x] F-012: Integración ExerciseDB API + cache
- [x] F-013: API workouts (crear, asignar, listar)
- [x] F-014: API logging entrenamientos

### FASE 4: Integración Frontend-Backend
- [x] F-015: Conectar dashboard web con API real
  - [x] Gestión de clientes con API
  - [x] Biblioteca de ejercicios con ExerciseDB
  - [x] Constructor de workouts
  - [x] Loading states
  - [x] Error handling
  - [x] Optimistic updates
- [x] F-016: Conectar app móvil con API real
  - [x] Lista de workouts asignados
  - [x] Detalle de workout con logging
  - [x] Inicio y finalización de workouts
  - [x] Pull to refresh
  - [x] Loading states
- [x] F-017: Sincronización datos y estados
  - [x] Optimistic updates en web
  - [x] Error rollback
  - [x] Recarga automática en móvil
  - [x] Sincronización de logs

---

## 📝 Notas de Implementación

### Autenticación Temporal
Actualmente se usa un header `X-Trainer-Id` para demo. En Fase 6 se implementará JWT completo.

### ExerciseDB API
- Requiere API key de RapidAPI
- Configurar en `.env`: `EXERCISEDB_API_KEY=your_key`
- Si no se configura, el sistema funciona solo con ejercicios custom

### Base de Datos
- SQLite para desarrollo (por defecto)
- PostgreSQL para producción
- Las tablas se crean automáticamente al iniciar la app

### Próximos Pasos (Fase 5 y 6)
- [ ] Analytics y dashboard de adherencia
- [ ] Autenticación JWT completa
- [ ] Login/registro en web y móvil
- [ ] Invitaciones por email

---

## 🐛 Troubleshooting

### Error: "CORS policy"
- Verificar que CORS_ORIGINS en backend/.env incluya frontend URL
- Default: `http://localhost:3000`

### Error: "Cannot connect to API"
- Verificar que backend esté corriendo en puerto 5000
- Verificar NEXT_PUBLIC_API_URL en frontend-web/.env.local
- En móvil, usar IP local (no localhost)

### Error: "Table does not exist"
- Ejecutar `python run.py` para crear tablas
- O ejecutar `python seed_data.py` (crea tablas + datos)

---

## 👥 Créditos

Implementado por: Claude Code
Fecha: Noviembre 2025
Fase: 3 y 4 completadas
