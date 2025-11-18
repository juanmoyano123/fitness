# 🏋️ FitCompass Pro

**Plataforma todo-en-uno para entrenadores personales**

FitCompass Pro es una solución completa que permite a entrenadores personales gestionar sus clientes, crear rutinas de entrenamiento personalizadas y hacer seguimiento del progreso en tiempo real, mientras que los clientes pueden registrar sus entrenamientos desde una app móvil intuitiva.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/python-3.11-blue.svg)](https://www.python.org/downloads/)
[![Next.js](https://img.shields.io/badge/next.js-14-black.svg)](https://nextjs.org/)
[![React Native](https://img.shields.io/badge/react--native-expo-blue.svg)](https://expo.dev/)

---

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Arquitectura](#-arquitectura)
- [Quickstart](#-quickstart)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Desarrollo](#-desarrollo)
- [Testing](#-testing)
- [Deploy](#-deploy)
- [Documentación](#-documentación)
- [Stack Tecnológico](#-stack-tecnológico)
- [Contribución](#-contribución)
- [Licencia](#-licencia)

---

## ✨ Características

### Para Entrenadores (Dashboard Web)

- ✅ **Gestión de Clientes**: Crear, editar y organizar perfiles de clientes
- ✅ **Biblioteca de Ejercicios**: Acceso a 1300+ ejercicios con GIFs y descripciones (ExerciseDB)
- ✅ **Creación de Workouts**: Builder visual para crear rutinas personalizadas
- ✅ **Asignación Flexible**: Asignar workouts a múltiples clientes simultáneamente
- ✅ **Analytics en Tiempo Real**: Adherencia, progreso y volumen de entrenamiento
- ✅ **Dashboard Intuitivo**: Visualización de métricas clave y tendencias
- ✅ **Invitaciones por Email**: Onboarding simplificado de nuevos clientes

### Para Clientes (App Móvil)

- ✅ **Workouts Personalizados**: Ver rutinas asignadas por el trainer
- ✅ **Logging Fácil**: Registrar sets, reps y peso durante el entrenamiento
- ✅ **Progreso Visual**: Ver evolución de cargas y volumen
- ✅ **Sincronización Automática**: Todos los datos se sincronizan con el trainer
- ✅ **Offline Support**: Entrenar sin conexión y sincronizar después
- ✅ **Notificaciones**: Recordatorios de entrenamientos y nuevas asignaciones

---

## 🏗️ Arquitectura

```
┌─────────────────┐        ┌─────────────────┐
│  Frontend Web   │        │ Frontend Mobile │
│   (Next.js)     │        │  (React Native) │
│   Dashboard     │        │   Expo App      │
└────────┬────────┘        └────────┬────────┘
         │                          │
         │    HTTPS/JSON API        │
         │                          │
         └──────────┬───────────────┘
                    │
         ┌──────────▼──────────┐
         │   Backend API       │
         │   (Flask)           │
         │   - REST API        │
         │   - JWT Auth        │
         │   - Business Logic  │
         └──────────┬──────────┘
                    │
         ┌──────────▼──────────┐
         │   PostgreSQL DB     │
         │   (Neon)            │
         │   - Users           │
         │   - Workouts        │
         │   - Workout Logs    │
         └─────────────────────┘
              │
   ┌──────────▼──────────┐
   │   ExerciseDB API    │
   │   (RapidAPI)        │
   │   1300+ Exercises   │
   └─────────────────────┘
```

---

## 🚀 Quickstart

### Prerrequisitos

- **Node.js** 18+ ([Descargar](https://nodejs.org/))
- **Python** 3.11+ ([Descargar](https://www.python.org/downloads/))
- **PostgreSQL** 15+ ([Descargar](https://www.postgresql.org/download/))
- **Git** ([Descargar](https://git-scm.com/downloads))

### 1. Clonar Repositorio

```bash
git clone https://github.com/yourusername/fitness.git
cd fitness
```

### 2. Setup Backend (Flask API)

```bash
cd backend

# Crear entorno virtual
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# Crear base de datos PostgreSQL
createdb fitcompass_dev

# Aplicar migrations (si existen)
flask db upgrade
# O importar schema directamente:
# psql fitcompass_dev < schema.sql

# Ejecutar servidor
python run.py
```

Backend corriendo en: **http://localhost:5000**

### 3. Setup Frontend Web (Next.js Dashboard)

```bash
cd frontend-web

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local si es necesario

# Ejecutar en desarrollo
npm run dev
```

Dashboard corriendo en: **http://localhost:3000**

### 4. Setup Frontend Mobile (React Native / Expo)

```bash
cd frontend-mobile

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env si es necesario

# Ejecutar con Expo
npx expo start
```

Opciones:
- Presionar **`i`** para abrir en iOS Simulator
- Presionar **`a`** para abrir en Android Emulator
- Escanear QR con **Expo Go** app en tu teléfono

---

## 📁 Estructura del Proyecto

```
fitness/
│
├── backend/                    # Flask API
│   ├── app/
│   │   ├── __init__.py        # App factory
│   │   ├── models/            # SQLAlchemy models
│   │   ├── routes/            # API endpoints
│   │   └── services/          # Business logic
│   ├── run.py                 # Entry point
│   ├── requirements.txt       # Python dependencies
│   └── .env.example          # Environment variables template
│
├── frontend-web/              # Next.js Dashboard
│   ├── src/
│   │   ├── app/              # App Router pages
│   │   ├── components/       # React components
│   │   └── lib/              # Utilities
│   ├── package.json
│   └── .env.example
│
├── frontend-mobile/           # React Native App
│   ├── src/
│   │   ├── screens/          # App screens
│   │   ├── components/       # React Native components
│   │   └── services/         # API client
│   ├── app.json
│   └── package.json
│
├── docs/                      # Documentación
│   ├── plan.md               # Plan de desarrollo
│   ├── TEST_PLAN_E2E.md      # Plan de testing
│   ├── DEPLOY_GUIDE.md       # Guía de deploy
│   └── USER_GUIDE.md         # Guía de usuario
│
└── README.md                  # Este archivo
```

---

## 🛠️ Desarrollo

### Comandos Útiles

#### Backend

```bash
# Ejecutar tests
pytest

# Crear migration
flask db migrate -m "Description"

# Aplicar migration
flask db upgrade

# Health check
curl http://localhost:5000/health
```

#### Frontend Web

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Ejecutar producción localmente
npm start

# Linting
npm run lint
```

#### Frontend Mobile

```bash
# Ejecutar en iOS
npx expo start --ios

# Ejecutar en Android
npx expo start --android

# Clear cache
npx expo start -c

# Build para producción
eas build --platform all
```

### Variables de Entorno

#### Backend (.env)

```env
DATABASE_URL=postgresql://localhost/fitcompass_dev
JWT_SECRET_KEY=your-secret-key
RAPIDAPI_KEY=your-rapidapi-key
CORS_ORIGINS=http://localhost:3000,http://localhost:19006
```

#### Frontend Web (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

#### Frontend Mobile (.env)

```env
API_URL=http://localhost:5000
```

---

## 🧪 Testing

### Backend API Tests

```bash
cd backend

# Ejecutar todos los tests
pytest

# Con coverage
pytest --cov=app

# Health check automatizado
python test_health_check.py
```

### End-to-End Testing

Sigue el plan detallado en: [`docs/TEST_PLAN_E2E.md`](docs/TEST_PLAN_E2E.md)

**Escenarios principales:**
1. Flujo Trainer: Registro → Crear clientes → Crear workout → Asignar
2. Flujo Cliente: Invitación → Registro → Ver workout → Completar logging
3. Flujo Colaborativo: 7 días de entrenamiento con analytics

---

## 🚀 Deploy

### Guía Completa de Deploy

Ver: [`docs/DEPLOY_GUIDE.md`](docs/DEPLOY_GUIDE.md)

### Deploy Rápido

#### Backend (Render)

```bash
# Push a GitHub
git push origin main

# Render detecta automáticamente render.yaml
# O usar Render Dashboard para conectar repo
```

#### Frontend Web (Vercel)

```bash
cd frontend-web

# Deploy con Vercel CLI
vercel --prod
```

#### Mobile (Expo EAS)

```bash
cd frontend-mobile

# Build y submit
eas build --platform all
eas submit --platform all
```

### URLs de Producción

- **Web App**: https://app.fitcompasspro.com
- **API**: https://api.fitcompasspro.com
- **API Health**: https://api.fitcompasspro.com/health

---

## 📚 Documentación

### Documentos Disponibles

- **[Plan de Desarrollo](docs/plan.md)**: Roadmap completo del proyecto
- **[Test Plan E2E](docs/TEST_PLAN_E2E.md)**: Plan de testing end-to-end
- **[Deploy Guide](docs/DEPLOY_GUIDE.md)**: Guía completa de deploy a producción
- **[User Guide](docs/USER_GUIDE.md)**: Manual de usuario para trainers y clientes

### API Documentation

Una vez el backend esté corriendo, la documentación interactiva de la API está disponible en:

- **Swagger UI**: http://localhost:5000/api/docs (próximamente)
- **Postman Collection**: Ver `/backend/postman_collection.json`

---

## 🧰 Stack Tecnológico

### Backend

- **Framework**: Flask 3.0
- **Database**: PostgreSQL 15 + SQLAlchemy ORM
- **Authentication**: JWT (Flask-JWT-Extended)
- **API**: RESTful JSON API
- **External APIs**: ExerciseDB (RapidAPI)

### Frontend Web (Dashboard Trainers)

- **Framework**: Next.js 14 (App Router)
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **State Management**: React Context / Zustand
- **HTTP Client**: Axios / Fetch
- **Charts**: Recharts / Chart.js

### Frontend Mobile (App Clientes)

- **Framework**: React Native + Expo
- **Navigation**: Expo Router / React Navigation
- **UI Components**: React Native Paper / Native Base
- **State Management**: React Context / Zustand
- **Offline**: AsyncStorage
- **HTTP Client**: Axios

### DevOps & Infrastructure

- **Database Hosting**: Neon (PostgreSQL Serverless)
- **Backend Hosting**: Render / Railway
- **Web Hosting**: Vercel
- **Mobile Distribution**: Expo EAS → App Store + Google Play
- **Error Tracking**: Sentry (opcional)
- **Monitoring**: Render Logs + Vercel Analytics

---

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una branch para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Coding Standards

- **Python**: PEP 8
- **JavaScript/TypeScript**: ESLint + Prettier
- **Commits**: Conventional Commits

---

## 📧 Soporte

- **Issues**: [GitHub Issues](https://github.com/yourusername/fitness/issues)
- **Email**: support@fitcompasspro.com
- **Docs**: [Documentación Completa](docs/)

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver archivo `LICENSE` para más detalles.

---

## 🙏 Agradecimientos

- **ExerciseDB**: Por la increíble biblioteca de ejercicios
- **Vercel**: Por el hosting del frontend
- **Render**: Por el hosting del backend
- **Neon**: Por la base de datos serverless
- **Expo**: Por simplificar el desarrollo móvil

---

## 📊 Roadmap

### ✅ Fase 1-6 (Completadas)
- [x] Setup inicial y autenticación
- [x] CRUD de clientes y workouts
- [x] Integración ExerciseDB
- [x] App móvil para clientes
- [x] Analytics y dashboard
- [x] Autenticación JWT

### 🚧 Fase 7 (Actual)
- [x] Testing end-to-end
- [x] Deploy a producción
- [x] Documentación completa

### 🔮 Futuras Mejoras
- [ ] Notificaciones push
- [ ] Chat trainer-cliente
- [ ] Videos de ejercicios personalizados
- [ ] Planes de nutrición
- [ ] Pagos integrados (Stripe)
- [ ] Marketplace de trainers
- [ ] Integración con wearables (Apple Watch, Garmin)

---

<p align="center">
  <strong>Hecho con ❤️ por el equipo de FitCompass Pro</strong>
</p>

<p align="center">
  <a href="https://app.fitcompasspro.com">🌐 Website</a> •
  <a href="https://github.com/yourusername/fitness">📦 GitHub</a> •
  <a href="docs/">📚 Docs</a>
</p>
