# FitCompass Pro - Mobile App

App móvil para clientes de entrenadores personales construida con React Native y Expo.

## 🚀 Quick Start

### Prerrequisitos

- Node.js 18+ (LTS)
- npm o yarn
- Expo Go app en tu dispositivo móvil ([iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))

### Instalación

**NOTA:** Hay un problema con permisos de npm cache. Antes de instalar, ejecuta:
```bash
# Arreglar permisos de npm (requiere password de admin)
sudo chown -R $(whoami) ~/.npm
```

Luego:
```bash
npm install
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
│   ├── components/    # Componentes reutilizables
│   ├── screens/       # Pantallas de la app
│   ├── navigation/    # React Navigation setup
│   ├── types/         # TypeScript types
│   └── utils/         # Utilidades y helpers
├── assets/            # Imágenes, fuentes, etc.
├── App.tsx            # Componente raíz
└── ...config files
```

## 🛠️ Stack Tecnológico

- **Framework:** React Native con Expo
- **Language:** TypeScript
- **Navigation:** React Navigation (a instalar)
- **State Management:** Zustand (a instalar)
- **Storage:** AsyncStorage (a instalar)
- **API Client:** Axios (a instalar)

## 📋 Scripts Disponibles

```bash
npx expo start       # Iniciar development server
npx expo start --android  # Iniciar en Android
npx expo start --ios      # Iniciar en iOS
npx expo start --web      # Iniciar en web browser
```

## 📦 Próximos Pasos

1. ✅ Setup básico creado
2. ⏳ Instalar dependencias (resolver problema npm cache)
3. ⏳ Configurar React Navigation (F-007)
4. ⏳ Implementar lista de workouts UI (F-008)
5. ⏳ Implementar detalle workout y logging (F-009)

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
