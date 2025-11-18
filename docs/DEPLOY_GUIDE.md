# Guía de Deploy a Producción - FitCompass Pro

Esta guía detalla el proceso completo para deployar FitCompass Pro a producción.

## 📋 Pre-requisitos

- [ ] Cuenta en [Vercel](https://vercel.com)
- [ ] Cuenta en [Render](https://render.com) o [Railway](https://railway.app)
- [ ] Cuenta en [Neon](https://neon.tech) para PostgreSQL serverless
- [ ] RapidAPI Key para ExerciseDB
- [ ] Dominio personalizado (opcional): `fitcompasspro.com`

## 🗄️ 1. Database Setup (Neon PostgreSQL)

### 1.1 Crear Proyecto en Neon

1. Ir a [neon.tech](https://neon.tech) y crear cuenta
2. Click en "Create Project"
3. Configurar:
   - Project name: `fitcompass-prod`
   - Region: `US East (Ohio)` o cercano a usuarios
   - PostgreSQL version: 15

### 1.2 Obtener Connection String

1. En el dashboard, copiar la **Connection String**
2. Formato: `postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb`
3. Guardar para configuración del backend

### 1.3 Aplicar Schema

```bash
# Conectar a Neon database
psql "postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb"

# O usar el schema.sql si existe
\i backend/schema.sql
```

Alternativamente, si usas migrations:

```bash
# Configurar DATABASE_URL
export DATABASE_URL="postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb"

# Ejecutar migrations
cd backend
flask db upgrade
```

---

## 🚀 2. Backend API Deploy (Render)

### 2.1 Preparación

Asegúrate de tener estos archivos en `/backend`:
- ✅ `requirements.txt` (con gunicorn)
- ✅ `render.yaml`
- ✅ `Procfile`
- ✅ `.env.example`

### 2.2 Deploy en Render

#### Opción A: Blueprint (Recomendado)

1. Push código a GitHub
2. Ir a [render.com](https://render.com) → "New" → "Blueprint"
3. Conectar repositorio GitHub
4. Render detectará automáticamente `render.yaml`
5. Click en "Apply"

#### Opción B: Manual

1. Ir a [render.com](https://render.com) → "New" → "Web Service"
2. Conectar repositorio GitHub
3. Configurar:
   - **Name**: `fitcompass-api`
   - **Region**: Oregon
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn run:app`

### 2.3 Environment Variables (Render Dashboard)

Configurar las siguientes variables en Settings → Environment:

```env
# Database
DATABASE_URL=postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb

# Security (generar valores seguros)
JWT_SECRET_KEY=<generar-secreto-aleatorio-64-chars>
SECRET_KEY=<generar-secreto-aleatorio-64-chars>

# Flask
FLASK_ENV=production
FLASK_APP=run.py

# CORS (actualizar con dominio real)
CORS_ORIGINS=https://app.fitcompasspro.com,https://fitcompass-web.vercel.app

# ExerciseDB API
RAPIDAPI_KEY=<tu-rapidapi-key>
RAPIDAPI_HOST=exercisedb.p.rapidapi.com
```

**Generar secretos seguros:**

```bash
# En tu terminal local
python -c "import secrets; print(secrets.token_hex(32))"
```

### 2.4 Custom Domain (Opcional)

1. En Render dashboard, ir a Settings → Custom Domain
2. Agregar: `api.fitcompasspro.com`
3. Configurar DNS:
   ```
   Type: CNAME
   Name: api
   Value: fitcompass-api.onrender.com
   TTL: 3600
   ```

### 2.5 Verificar Deploy

```bash
# Health check
curl https://fitcompass-api.onrender.com/health

# Debería responder:
# {"status":"healthy","database":"connected","service":"FitCompass Pro API"}
```

---

## 🌐 3. Frontend Web Deploy (Vercel)

### 3.1 Preparación

Asegúrate de tener estos archivos en `/frontend-web`:
- ✅ `vercel.json`
- ✅ `package.json`
- ✅ `.env.example`

### 3.2 Deploy en Vercel

#### Opción A: Vercel CLI (Recomendado)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy desde directorio frontend-web
cd frontend-web
vercel

# Para producción
vercel --prod
```

#### Opción B: Dashboard

1. Ir a [vercel.com](https://vercel.com) → "Add New Project"
2. Importar repositorio desde GitHub
3. Configurar:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend-web`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### 3.3 Environment Variables (Vercel Dashboard)

En Settings → Environment Variables:

```env
# API URL (actualizar con tu dominio de Render)
NEXT_PUBLIC_API_URL=https://fitcompass-api.onrender.com

# O si tienes dominio custom:
NEXT_PUBLIC_API_URL=https://api.fitcompasspro.com
```

### 3.4 Custom Domain (Opcional)

1. En Vercel dashboard, ir a Settings → Domains
2. Agregar: `app.fitcompasspro.com`
3. Seguir instrucciones de Vercel para DNS

---

## 📱 4. Mobile App Deploy (Expo EAS)

### 4.1 Setup EAS

```bash
# Instalar EAS CLI
npm install -g eas-cli

# Login
eas login

# Configurar proyecto
cd frontend-mobile
eas build:configure
```

### 4.2 Configurar Environment Variables

Editar `frontend-mobile/.env.production`:

```env
API_URL=https://api.fitcompasspro.com
```

### 4.3 Build para iOS

```bash
# Build para TestFlight
eas build --platform ios --profile production

# Submit a App Store
eas submit --platform ios
```

### 4.4 Build para Android

```bash
# Build para Google Play
eas build --platform android --profile production

# Submit a Play Store
eas submit --platform android
```

### 4.5 Configure Deep Links

En `app.json`, verificar:

```json
{
  "expo": {
    "scheme": "fitcompass",
    "ios": {
      "associatedDomains": ["applinks:app.fitcompasspro.com"]
    },
    "android": {
      "intentFilters": [
        {
          "action": "VIEW",
          "data": {
            "scheme": "https",
            "host": "app.fitcompasspro.com"
          }
        }
      ]
    }
  }
}
```

---

## 🔐 5. Security Checklist

- [ ] JWT_SECRET_KEY es aleatorio y secreto (no commitear)
- [ ] DATABASE_URL está protegida (no commitear)
- [ ] CORS configurado solo para dominios permitidos
- [ ] HTTPS habilitado en todos los servicios
- [ ] Rate limiting configurado en API
- [ ] SQL injection protegido (usar ORM)
- [ ] XSS protegido (React sanitiza por defecto)
- [ ] Passwords hasheados con bcrypt

---

## 📊 6. Monitoring & Logging

### 6.1 Sentry (Error Tracking)

```bash
# Instalar Sentry
pip install sentry-sdk[flask]
npm install @sentry/nextjs
```

Configurar en backend:

```python
import sentry_sdk
from sentry_sdk.integrations.flask import FlaskIntegration

sentry_sdk.init(
    dsn="https://xxx@xxx.ingest.sentry.io/xxx",
    integrations=[FlaskIntegration()],
    traces_sample_rate=1.0
)
```

### 6.2 Render Logs

- Logs disponibles en Render Dashboard → Logs
- Configurar alertas para errores críticos

### 6.3 Uptime Monitoring

- UptimeRobot: Monitorear `https://api.fitcompasspro.com/health`
- Ping cada 5 minutos
- Alertas por email si falla

---

## ✅ 7. Post-Deploy Testing

### 7.1 Smoke Tests

```bash
# Health check
curl https://api.fitcompasspro.com/health

# Register test user
curl -X POST https://api.fitcompasspro.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test123!","name":"Test User","role":"trainer"}'

# Login
curl -X POST https://api.fitcompasspro.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test123!"}'
```

### 7.2 Frontend Tests

1. Abrir `https://app.fitcompasspro.com`
2. Verificar que carga sin errores
3. Registrar usuario de prueba
4. Crear cliente
5. Crear workout
6. Verificar analytics

### 7.3 Mobile Tests

1. Descargar app desde TestFlight / Play Store
2. Hacer login
3. Verificar que workouts se sincronizan
4. Completar un workout
5. Verificar que trainer ve progreso

---

## 🚨 8. Rollback Plan

Si algo sale mal:

### Backend (Render)

1. Ir a Render Dashboard → Deploys
2. Click en "Rollback" al deploy anterior
3. Verificar `/health` endpoint

### Frontend (Vercel)

1. Ir a Vercel Dashboard → Deployments
2. Click en deployment anterior → "Promote to Production"

### Database

1. Si migrations fallan, restaurar desde backup de Neon
2. Neon hace backups automáticos cada 24h

---

## 📝 9. DNS Configuration (Custom Domain)

Si usas dominio personalizado:

### En tu proveedor de DNS (Namecheap, GoDaddy, etc.):

```
# Frontend Web
Type: CNAME
Name: app
Value: cname.vercel-dns.com
TTL: 3600

# Backend API
Type: CNAME
Name: api
Value: fitcompass-api.onrender.com
TTL: 3600

# Root domain redirect
Type: A
Name: @
Value: 76.76.21.21  # Vercel IP
TTL: 3600
```

---

## 🎉 10. Launch Checklist

Pre-launch:
- [ ] Todos los tests E2E pasan
- [ ] Backend deployed y health check OK
- [ ] Frontend deployed y accesible
- [ ] Mobile app en TestFlight/Play Store
- [ ] Custom domains configurados
- [ ] HTTPS habilitado en todos los servicios
- [ ] Error tracking (Sentry) configurado
- [ ] Uptime monitoring configurado
- [ ] Backup database configurado

Launch:
- [ ] Anunciar en redes sociales
- [ ] Invitar primeros usuarios beta
- [ ] Monitorear logs por 24h
- [ ] Estar disponible para hot-fixes

Post-launch:
- [ ] Recolectar feedback de usuarios
- [ ] Monitorear performance y errors
- [ ] Iterar basado en feedback

---

## 📞 Support

- **Render Support**: https://render.com/docs
- **Vercel Support**: https://vercel.com/support
- **Neon Support**: https://neon.tech/docs
- **Expo Support**: https://expo.dev/support

---

## 🔗 URLs de Producción

Una vez deployed:

- **Web App**: https://app.fitcompasspro.com
- **API**: https://api.fitcompasspro.com
- **API Health**: https://api.fitcompasspro.com/health
- **iOS App**: https://apps.apple.com/app/fitcompass-pro
- **Android App**: https://play.google.com/store/apps/details?id=com.fitcompass.pro

---

¡Éxito con el deploy! 🚀
