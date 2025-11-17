# FitCompass Pro - Frontend Web Dashboard

Dashboard web para entrenadores personales construido con Next.js 14, TypeScript, Tailwind CSS y shadcn/ui.

## 🚀 Quick Start

### Prerrequisitos

- Node.js 18+ (LTS)
- npm o pnpm

### Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno:
```bash
cp .env.example .env.local
# Editar .env.local con tus configuraciones
```

3. Ejecutar en desarrollo:
```bash
npm run dev
```

4. Abrir [http://localhost:3000](http://localhost:3000)

## 📁 Estructura del Proyecto

```
frontend-web/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── layout.tsx    # Layout principal
│   │   ├── page.tsx      # Landing page
│   │   └── dashboard/    # Dashboard routes
│   ├── components/       # Componentes React
│   │   └── ui/          # shadcn/ui components
│   ├── contexts/        # React Context providers
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utilidades y helpers
│   └── types/           # TypeScript types
├── public/              # Assets estáticos
└── ...config files
```

## 🛠️ Stack Tecnológico

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Components:** shadcn/ui
- **State Management:** Zustand (a agregar)
- **Forms:** React Hook Form + Zod (a agregar)
- **Charts:** Recharts (a agregar)

## 📋 Scripts Disponibles

```bash
npm run dev          # Desarrollo (localhost:3000)
npm run build        # Build producción
npm run start        # Servidor producción
npm run lint         # ESLint
npm run type-check   # TypeScript check
```

## 🎨 Componentes UI Instalados

- Button
- Card
- Input
- Label
- Table
- Dialog
- Badge
- Avatar
- Dropdown Menu
- Select

## 🔧 Configuración

### Variables de Entorno

Ver `.env.example` para variables disponibles:

- `NEXT_PUBLIC_API_URL`: URL del backend API
- `NEXT_PUBLIC_APP_NAME`: Nombre de la app
- `NEXT_PUBLIC_APP_URL`: URL del frontend
- `NEXT_PUBLIC_DEMO_ENABLED`: Habilitar modo demo

## 📦 Próximos Pasos

1. ✅ Setup básico completado
2. ⏳ Implementar demo auto-login (F-001)
3. ⏳ Crear layout y navegación dashboard (F-002)
4. ⏳ Implementar gestión de clientes UI (F-003)
5. ⏳ Biblioteca de ejercicios UI (F-004)
6. ⏳ Constructor de workouts (F-005)
7. ⏳ Dashboard de progreso (F-006)

## 🚢 Deploy

### Vercel (Recomendado)

```bash
npm run build
# Conectar repo en Vercel dashboard
```

## 📝 Notas de Desarrollo

- Usar TypeScript strict mode
- Componentes en PascalCase
- Archivos de utilidades en camelCase
- Seguir convenciones de Next.js App Router
- Usar client components solo cuando sea necesario ("use client")
