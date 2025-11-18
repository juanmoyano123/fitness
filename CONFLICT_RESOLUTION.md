# Cómo Resolver Conflictos de Merge - Fase 4

## Conflicto en backend/app/__init__.py

### ❌ Contenido con Conflicto:
```python
# Register blueprints (routes)
<<<<<<< claude/execute-task-01GwETXiv3gkxMrXJCbFiz1V
from app.routes import (
    health_bp,
    clients_bp,
    exercises_bp,
    workouts_bp,
    assignments_bp
)
=======
from app.routes import health_bp, clients_bp, exercises_bp, workouts_bp, logs_bp
>>>>>>> main
app.register_blueprint(health_bp)
app.register_blueprint(clients_bp)
app.register_blueprint(exercises_bp)
app.register_blueprint(workouts_bp)
<<<<<<< claude/execute-task-01GwETXiv3gkxMrXJCbFiz1V
app.register_blueprint(assignments_bp)
=======
app.register_blueprint(logs_bp)
>>>>>>> main
```

### ✅ Resolución Correcta:

Mantén la versión de **Fase 4** (`assignments_bp`) porque es más completa:

```python
# Register blueprints (routes)
from app.routes import (
    health_bp,
    clients_bp,
    exercises_bp,
    workouts_bp,
    assignments_bp
)
app.register_blueprint(health_bp)
app.register_blueprint(clients_bp)
app.register_blueprint(exercises_bp)
app.register_blueprint(workouts_bp)
app.register_blueprint(assignments_bp)
```

## Pasos para Resolver el Conflicto:

### 1. Editar el archivo manualmente
```bash
# Abre el archivo en conflicto
nano backend/app/__init__.py
# O usa tu editor preferido
```

### 2. Eliminar las marcas de conflicto
Borra estas líneas:
- `<<<<<<< claude/execute-task-01GwETXiv3gkxMrXJCbFiz1V`
- `=======`
- `>>>>>>> main`
- La versión de `main` (que tiene `logs_bp`)

### 3. Mantener solo esta versión:
```python
from app.routes import (
    health_bp,
    clients_bp,
    exercises_bp,
    workouts_bp,
    assignments_bp
)
app.register_blueprint(health_bp)
app.register_blueprint(clients_bp)
app.register_blueprint(exercises_bp)
app.register_blueprint(workouts_bp)
app.register_blueprint(assignments_bp)
```

### 4. Verificar que existe el archivo
```bash
ls -la backend/app/routes/assignments.py
```
Debe existir este archivo (lo creaste en Fase 4).

### 5. Verificar backend/app/routes/__init__.py
Debe contener:
```python
from app.routes.health import health_bp
from app.routes.clients import clients_bp
from app.routes.exercises import exercises_bp
from app.routes.workouts import workouts_bp
from app.routes.assignments import assignments_bp

__all__ = [
    'health_bp',
    'clients_bp',
    'exercises_bp',
    'workouts_bp',
    'assignments_bp'
]
```

### 6. Guardar y agregar al stage
```bash
git add backend/app/__init__.py
```

### 7. Continuar el merge
```bash
git merge --continue
# O si estás en un rebase:
# git rebase --continue
```

## Por qué `assignments_bp` es la opción correcta:

### ✅ assignments_bp (Fase 4)
- Maneja **assignments** (asignaciones de workouts)
- Maneja **logs** (registro de sets)
- Endpoints completos:
  - `GET /api/assignments?clientId=X`
  - `POST /api/assignments/:id/start`
  - `POST /api/assignments/:id/logs`
  - `POST /api/assignments/:id/complete`
- **Más completo y robusto**

### ❌ logs_bp (main)
- Solo maneja logs
- Funcionalidad limitada
- No compatible con la implementación de Fase 4

## Si el conflicto persiste:

### Opción 1: Hacer merge desde tu rama
```bash
# Asegúrate de estar en tu rama
git checkout claude/execute-task-01GwETXiv3gkxMrXJCbFiz1V

# Intenta merge desde main
git fetch origin
git merge origin/main

# Resuelve conflictos como se indicó arriba
```

### Opción 2: Reescribir el archivo completo
Si tienes dudas, copia este contenido completo:

```python
"""
FitCompass Pro - Backend Flask Application
"""
from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Initialize extensions
db = SQLAlchemy()
jwt = JWTManager()

def create_app():
    """Application factory pattern"""
    app = Flask(__name__)

    # Configuration
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'postgresql://localhost/fitcompass_dev')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'jwt-secret-key')

    # Initialize extensions with app
    db.init_app(app)
    jwt.init_app(app)

    # CORS configuration
    CORS(app, origins=os.getenv('CORS_ORIGINS', 'http://localhost:3000').split(','))

    # Register blueprints (routes)
    from app.routes import (
        health_bp,
        clients_bp,
        exercises_bp,
        workouts_bp,
        assignments_bp
    )
    app.register_blueprint(health_bp)
    app.register_blueprint(clients_bp)
    app.register_blueprint(exercises_bp)
    app.register_blueprint(workouts_bp)
    app.register_blueprint(assignments_bp)

    # Create tables (for development only)
    with app.app_context():
        db.create_all()

    return app
```

Guarda este contenido en `backend/app/__init__.py` y luego:
```bash
git add backend/app/__init__.py
git commit -m "fix: Resolver conflicto de merge - usar assignments_bp de Fase 4"
```
