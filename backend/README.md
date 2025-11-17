# FitCompass Pro - Backend API

API REST para FitCompass Pro construida con Flask, SQLAlchemy y PostgreSQL.

## 🚀 Quick Start

### Prerrequisitos

- Python 3.11+
- PostgreSQL 14+
- pip y virtualenv

### Instalación

1. Crear y activar entorno virtual:
```bash
python3 -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
```

2. Instalar dependencias:
```bash
pip install -r requirements.txt
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

4. Crear base de datos PostgreSQL:
```bash
# Conectar a PostgreSQL
psql postgres

# Crear database
CREATE DATABASE fitcompass_dev;
\q
```

5. Ejecutar servidor de desarrollo:
```bash
python run.py
```

El servidor estará disponible en [http://localhost:5000](http://localhost:5000)

## 📁 Estructura del Proyecto

```
backend/
├── app/
│   ├── __init__.py        # Flask app factory
│   ├── models/            # SQLAlchemy models
│   ├── routes/            # API endpoints (blueprints)
│   └── services/          # Business logic
├── migrations/            # Alembic migrations
├── run.py                 # Application entry point
├── requirements.txt       # Python dependencies
└── .env                   # Environment variables (gitignored)
```

## 🛠️ Stack Tecnológico

- **Framework:** Flask 3.0
- **ORM:** SQLAlchemy
- **Database:** PostgreSQL 14+
- **Migrations:** Alembic
- **Authentication:** Flask-JWT-Extended
- **Password Hashing:** bcrypt
- **CORS:** Flask-CORS

## 📋 API Endpoints

### Health Check
- `GET /health` - Health check endpoint

### Authentication (F-020, F-021, F-022)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token
- `POST /api/auth/refresh` - Refresh JWT token

### Clients (F-011)
- `GET /api/clients` - List all clients (trainer)
- `POST /api/clients` - Create new client
- `GET /api/clients/:id` - Get client details
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client

### Exercises (F-012)
- `GET /api/exercises` - List exercises (with search/filter)
- `POST /api/exercises/custom` - Create custom exercise
- `GET /api/exercises/:id` - Get exercise details

### Workouts (F-013)
- `GET /api/workouts` - List workouts
- `POST /api/workouts` - Create workout
- `GET /api/workouts/:id` - Get workout details
- `PUT /api/workouts/:id` - Update workout
- `DELETE /api/workouts/:id` - Delete workout
- `POST /api/workouts/:id/assign` - Assign workout to client(s)

### Workout Logs (F-014)
- `POST /api/logs` - Log completed workout/exercise
- `GET /api/logs/client/:id` - Get client's workout history

### Analytics (F-018)
- `GET /api/analytics/adherence` - Get adherence metrics
- `GET /api/analytics/progress/:clientId` - Get client progress

## 🗄️ Database Schema

Ver schema SQL completo en: `/docs/schema.sql`

Tablas principales:
- `trainers` - Entrenadores
- `clients` - Clientes
- `exercises` - Ejercicios
- `workouts` - Rutinas
- `workout_exercises` - Ejercicios por rutina
- `workout_assignments` - Asignaciones de rutinas
- `workout_logs` - Registro de entrenamientos

## 🧪 Testing

```bash
# Ejecutar tests
pytest

# Con coverage
pytest --cov=app tests/
```

## 🔐 Seguridad

- Passwords hasheados con bcrypt
- JWT tokens para autenticación
- CORS configurado para orígenes permitidos
- SQL injection prevención (SQLAlchemy ORM)
- Input validation con marshmallow

## 🚢 Deploy

### Railway / Render

```bash
# Configurar variables de entorno en dashboard
DATABASE_URL=postgresql://...
SECRET_KEY=...
JWT_SECRET_KEY=...

# Deploy automático desde Git
git push
```

## 📝 Notas de Desarrollo

- Seguir PEP 8 style guide
- Usar type hints donde sea posible
- Documentar funciones con docstrings
- Models en `models/`, Routes en `routes/`, Logic en `services/`
- Usar blueprints para organizar rutas

## 🆘 Troubleshooting

### Error: "could not connect to server"
- Verificar que PostgreSQL esté corriendo: `pg_ctl status`
- Verificar DATABASE_URL en .env

### Error: "ModuleNotFoundError"
- Activar virtualenv: `source venv/bin/activate`
- Reinstalar dependencias: `pip install -r requirements.txt`
