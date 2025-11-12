# VALIDACION: FitCompass Pro

---

## 1. RESUMEN EJECUTIVO

### Que es FitCompass Pro

FitCompass Pro es una plataforma B2B/B2C diseñada para entrenadores personales y preparadores físicos que les permite gestionar clientes, crear rutinas personalizadas, hacer seguimiento de progreso y comunicarse eficientemente con sus alumnos. El modelo es híbrido: se cobra a los entrenadores por gestionar sus clientes (B2B) y opcionalmente a los clientes finales por funcionalidades premium (B2C).

### Veredicto

**DECISION: GO con PIVOT ESTRATEGICO**

**Confianza en la oportunidad: 75% (Alta-Media)**

**Justificación:**

El problema que ataca FitCompass Pro es REAL y VALIDADO. Competidores como Trainerize (líder global con precios de $10-$250/mes), TrueCoach ($20-$107/mes para 5-50 clientes) y Harbiz (líder en LATAM) demuestran que existe demanda paga por este tipo de soluciones. El mercado fitness en Latinoamérica está creciendo a 10.26% CAGR y alcanzará USD 8.32 billones en 2030.

**HOWEVER:** El mercado de plataformas genéricas está saturado con más de 14 competidores fuertes. La estrategia recomendada es ESPECIALIZACION VERTICAL: atacar un nicho específico (CrossFit, entrenamiento funcional, o mercado LATAM hispanohablante) en lugar de competir directamente con gigantes establecidos.

### Oportunidad de Mercado (Datos Clave)

- **Tamaño de mercado Sudamérica:** USD 5.11 billones (2025) → USD 8.32 billones (2030)
- **Penetración fitness LATAM:** 3-6% (baja comparada con USA/Europa = oportunidad)
- **Entrenadores personales en Argentina:** 337+ documentados (estudio Mercado Fitness)
- **Pricing validado:** Los entrenadores ya pagan $20-250/mes por estas herramientas
- **Tendencia clave:** Adopción acelerada de herramientas digitales post-pandemia

---

## 2. PROBLEMA Y SOLUCION

### 2.1 Constructor de Rutinas

**PROBLEMA:**

Los entrenadores usan Excel, Google Sheets, WhatsApp o papel para enviar rutinas a sus clientes. Esto genera:
- Ineficiencia en la creación de planes (deben copiar/pegar manualmente)
- Imposibilidad de hacer seguimiento de qué clientes completan sus entrenamientos
- Falta de estandarización (cada cliente recibe formatos diferentes)
- Pérdida de tiempo en tareas repetitivas (rehacer la misma rutina para diferentes clientes)

**SOLUCION:**

Interface visual drag-and-drop para crear rutinas de entrenamiento donde el entrenador puede:
- Asignar ejercicios con series, repeticiones, peso objetivo y descansos
- Duplicar rutinas entre clientes y adaptarlas rápidamente
- Crear templates reutilizables (ej: "Rutina Fuerza Principiante")
- Organizar rutinas por días/semanas (programación periodizada)

**HERRAMIENTAS/INTEGRACIONES:**

- **Base de datos relacional:** PostgreSQL/Supabase para almacenar rutinas, ejercicios, relaciones cliente-entrenador
- **Librería drag-and-drop:** `@dnd-kit/core` (React) o `react-beautiful-dnd` para la UI de construcción
- **Editor WYSIWYG:** TipTap o Slate para notas/instrucciones del entrenador
- **Catálogo de ejercicios:** API externa como ExerciseDB (RapidAPI) o base de datos propia con videos
- **Storage de archivos:** Supabase Storage o AWS S3 para videos/imágenes de ejercicios custom

---

### 2.2 Gestión de Clientes

**PROBLEMA:**

Los entrenadores gestionan su cartera de clientes en cuadernos, planillas Excel dispersas o WhatsApp, lo que provoca:
- Pérdida de información histórica (no hay registro estructurado)
- Dificultad para recordar objetivos específicos de cada cliente
- Imposibilidad de identificar rápidamente quién está activo/inactivo
- Falta de profesionalismo al no tener un CRM dedicado

**SOLUCION:**

Base de datos centralizada de clientes donde el entrenador puede:
- Crear perfiles con datos personales, objetivos, historial médico
- Agregar notas privadas (observaciones, progreso cualitativo)
- Ver estado de cada cliente (activo, pausado, inactivo)
- Filtrar y buscar clientes rápidamente
- Exportar reportes de su cartera

**HERRAMIENTAS/INTEGRACIONES:**

- **Base de datos:** PostgreSQL con tablas `clients`, `client_notes`, `client_goals`
- **Gestión de estado:** React Context API o Zustand para manejo de datos en frontend
- **Validación de formularios:** React Hook Form + Zod para validación de datos de cliente
- **Búsqueda/filtros:** Implementación nativa SQL o librería como Fuse.js para búsqueda fuzzy
- **Exportación de datos:** Librería `xlsx` para exportar a Excel/CSV

---

### 2.3 Biblioteca de Ejercicios

**PROBLEMA:**

Los entrenadores necesitan enviar referencias visuales de ejercicios a sus clientes (especialmente online), pero:
- Buscar videos en YouTube cada vez es lento e inconsistente
- Los clientes no saben ejecutar correctamente sin referencia visual
- No existe un catálogo estandarizado accesible desde la plataforma
- Los entrenadores con ejercicios propios no tienen dónde almacenarlos

**SOLUCION:**

Catálogo pre-cargado de ejercicios con videos/GIFs demostrativos donde:
- El entrenador busca ejercicios por grupo muscular, equipo necesario, dificultad
- Puede agregar ejercicios custom con videos propios
- Los ejercicios se integran directamente al constructor de rutinas
- Los clientes ven el video/GIF al ejecutar su rutina

**HERRAMIENTAS/INTEGRACIONES:**

- **API de ejercicios:** ExerciseDB API (RapidAPI) - 1300+ ejercicios con GIFs
- **Storage de videos custom:** Supabase Storage o Cloudinary para videos propios del entrenador
- **Reproductor de video:** Video.js o librería nativa HTML5 con controles custom
- **Filtros avanzados:** SQL queries con índices para búsqueda eficiente por múltiples criterios
- **CDN:** Cloudflare o Vercel Edge para servir videos rápidamente

---

### 2.4 Calendario de Programación

**PROBLEMA:**

Los entrenadores coordinan con cada cliente individualmente cuándo entrenar, lo que genera:
- Desorganización y olvidos (clientes que no entrenan porque "olvidaron")
- Falta de visibilidad global de la agenda del entrenador
- Comunicación ineficiente (cada cliente pregunta por WhatsApp)
- Imposibilidad de planificar con anticipación

**SOLUCION:**

Calendario integrado donde el entrenador puede:
- Asignar rutinas a días específicos para cada cliente
- Ver vista mensual/semanal de todos sus clientes
- Enviar notificaciones automáticas recordando entrenamientos
- Reprogramar sesiones con drag-and-drop

**HERRAMIENTAS/INTEGRACIONES:**

- **Librería de calendario:** FullCalendar (React) o react-big-calendar
- **Sistema de notificaciones:**
  - Push notifications: Firebase Cloud Messaging (FCM)
  - Email: SendGrid o Resend
  - WhatsApp (futuro): Twilio WhatsApp API
- **Gestión de zonas horarias:** Day.js o date-fns-tz para manejar clientes en diferentes zonas
- **Sincronización:** Supabase Realtime para actualizar calendarios en tiempo real

---

### 2.5 Dashboard de Seguimiento

**PROBLEMA:**

El entrenador no tiene visibilidad en tiempo real sobre:
- Quién está completando sus entrenamientos vs quién no
- Progreso de carga (peso levantado, volumen) de cada cliente
- Necesidad de ajustar planes sobre la marcha basado en adherencia

Resultado: Reacciona tarde cuando un cliente se desmotiva o estanca.

**SOLUCION:**

Dashboard centralizado que muestra:
- Estado de completado de rutinas (hoy, esta semana)
- Alertas de clientes inactivos (ej: 3+ días sin entrenar)
- Gráficos de progreso por cliente (peso levantado, volumen total)
- Capacidad de ajustar planes directamente desde el dashboard

**HERRAMIENTAS/INTEGRACIONES:**

- **Gráficos/visualización:** Recharts o Chart.js para gráficos de progreso
- **Tiempo real:** Supabase Realtime Subscriptions para actualizar cuando clientes completan entrenamientos
- **Agregación de datos:** SQL queries con funciones agregadas (SUM, AVG, COUNT) para métricas
- **Sistema de alertas:** Cron jobs (Supabase Edge Functions) que revisan inactividad y envían notificaciones
- **UI de estadísticas:** Componentes tipo tarjetas con KPIs (clientes activos, tasa de completado, volumen promedio)

---

### 2.6 App Móvil para Clientes (Fase 2 - B2C)

**PROBLEMA:**

Los clientes reciben rutinas por WhatsApp/PDF pero:
- No tienen forma de registrar qué completaron (vuelven al papel/notas)
- No pueden trackear progreso histórico fácilmente
- El entrenador no recibe feedback de ejecución
- Experiencia poco profesional comparada con apps comerciales

**SOLUCION:**

App móvil (iOS/Android) donde el cliente:
- Ve su rutina del día asignada por el entrenador
- Registra series completadas, peso usado, RPE (sensación de esfuerzo)
- Usa timer integrado para descansos entre series
- Marca entrenamientos como completados

**HERRAMIENTAS/INTEGRACIONES:**

- **Framework móvil:** React Native (código compartido iOS/Android) o Flutter
- **Almacenamiento local:** AsyncStorage (React Native) para cache offline
- **Sincronización:** Supabase realtime + offline-first con queue de sincronización
- **Timer/cronómetro:** Librería nativa o custom con notificaciones locales
- **UI móvil:** React Native Paper o NativeBase para componentes nativos

---

### 2.7 Tracking de Rendimiento

**PROBLEMA:**

Clientes y entrenadores no tienen:
- Histórico estructurado de entrenamientos pasados
- Visualización de progreso (mejoras en fuerza, volumen)
- Datos para tomar decisiones (¿estoy estancado? ¿debo cambiar el plan?)

**SOLUCION:**

Sistema de tracking que genera:
- Historial completo de entrenamientos (qué hice cada día)
- Gráficos de progreso: peso levantado por ejercicio, volumen total semanal
- Registro de estado emocional pre/post entreno (escala 1-10)
- Comparativas temporales (esta semana vs semana anterior)

**HERRAMIENTAS/INTEGRACIONES:**

- **Base de datos de series:** Tabla `workout_logs` con relaciones a `exercises`, `clients`, `workouts`
- **Gráficos interactivos:** Recharts o Victory Native (React Native)
- **Cálculos de métricas:**
  - Volumen = series × reps × peso
  - 1RM estimado (fórmula Epley)
  - Progresión porcentual
- **Exportación de datos:** Generar PDFs con reportes de progreso (react-pdf)

---

### 2.8 Comunicación Entrenador-Cliente

**PROBLEMA:**

La comunicación ocurre por WhatsApp, lo que causa:
- Mezcla de mensajes personales y profesionales
- Pérdida de consultas importantes en el chat
- Falta de historial estructurado de conversaciones
- Imposibilidad de adjuntar contexto (ej: "en relación a tu rutina del lunes")

**SOLUCION:**

Chat integrado en la plataforma donde:
- Entrenador y cliente conversan dentro del contexto de la app
- El entrenador recibe alertas si el cliente no entrena X días
- Se pueden adjuntar archivos (fotos de ejecución, videos)
- Historial de mensajes vinculado al perfil del cliente

**HERRAMIENTAS/INTEGRACIONES:**

- **Sistema de mensajería:** Supabase Realtime + tabla `messages` con relación cliente-entrenador
- **Notificaciones push:** Firebase Cloud Messaging para alertas de nuevos mensajes
- **Carga de archivos:** Supabase Storage para imágenes/videos enviados en chat
- **Indicadores de lectura:** Sistema de estados (enviado, entregado, leído) con timestamps
- **UI de chat:** Librería react-native-gifted-chat o custom con FlatList

---

### 2.9 Check-ins Semanales

**PROBLEMA:**

El entrenador necesita datos periódicos del cliente (peso, medidas, fotos) para ajustar planes, pero:
- Clientes olvidan enviar los datos
- Los datos llegan desorganizados por WhatsApp
- No hay histórico visual de evolución física
- Proceso manual de recopilar y analizar información

**SOLUCION:**

Sistema de check-ins donde:
- El cliente reporta semanalmente peso, medidas, fotos de progreso
- El entrenador revisa y puede comparar con semanas anteriores
- Sistema de recordatorios automáticos para hacer check-in
- El entrenador puede ajustar el plan basado en estos datos

**HERRAMIENTAS/INTEGRACIONES:**

- **Base de datos:** Tabla `checkins` con campos: peso, medidas (pecho, cintura, etc.), fotos
- **Storage de fotos:** Supabase Storage con compresión de imágenes (sharp o react-native-image-resizer)
- **Recordatorios:** Cron job semanal que envía notificación push + email
- **Comparación visual:** Galería que muestra fotos lado a lado (semana 1 vs semana actual)
- **Gráficos de evolución:** Recharts mostrando curva de peso/medidas en el tiempo

---

### 2.10 Tracking de Hábitos y Correlación con Rendimiento

**PROBLEMA:**

Los entrenadores saben que el rendimiento en el gym no solo depende del entrenamiento, sino también de:
- Calidad y cantidad de sueño
- Hidratación diaria
- Nutrición y cumplimiento de macros
- Niveles de estrés
- Adherencia a hábitos de recuperación

Actualmente:
- No hay forma de trackear estos hábitos de manera estructurada
- No se puede correlacionar el rendimiento con los hábitos del cliente
- El entrenador no puede identificar qué hábito está afectando el progreso
- Los clientes no ven la relación entre sus hábitos y resultados

**SOLUCION:**

Sistema de tracking de hábitos diarios que permite:
- Crear hábitos personalizados por cliente (sueño, hidratación, nutrición, estrés, etc.)
- Registro diario simple de cumplimiento de hábitos (checkboxes + valores numéricos)
- Dashboard de correlación que muestra:
  - Cómo el rendimiento en entrenamientos varía según el cumplimiento de hábitos
  - Gráficos de tendencias (ej: "cuando duermes <6hs, tu volumen de entrenamiento cae 15%")
  - Alertas de patrones negativos (ej: "3 días seguidos sin cumplir hidratación")
- Vinculación automática entre estado emocional pre/post entreno y hábitos del día

**HERRAMIENTAS/INTEGRACIONES:**

- **Base de datos:** Tabla `habits` (definición de hábito), `habit_logs` (registro diario)
- **UI de tracking:** Formulario diario simple con checkboxes y sliders numéricos
- **Recordatorios:** Notificaciones push diarias para registrar hábitos (Firebase Cloud Messaging)
- **Análisis de correlación:** Cálculos estadísticos simples (correlación de Pearson) entre:
  - Hábitos cumplidos vs volumen de entrenamiento
  - Horas de sueño vs rendimiento en ejercicios compuestos
  - Hidratación vs sensación post-entreno
- **Visualización:** Gráficos de correlación con Recharts (scatter plots, líneas de tendencia)
- **Integración con wearables (opcional):** API de Fitbit, Garmin, Apple Health para auto-importar datos de sueño y actividad

**EJEMPLO DE USO:**

1. Entrenador crea hábitos para Juan: "Dormir 7hs+", "Beber 3L agua", "Comer 4 comidas"
2. Juan registra diariamente sus hábitos en la app (30 segundos)
3. Después de 4 semanas, el dashboard muestra: "Cuando Juan duerme <6hs, su 1RM en sentadilla cae 12%"
4. Entrenador ajusta plan: prioriza recuperación en semanas de mal sueño

---

### 2.11 Sistema de Pagos Integrado (Feature Opcional - Futuro)

**PROBLEMA:**

Los entrenadores cobran manualmente (efectivo, transferencias, etc.), lo que genera:
- Incomodidad al perseguir pagos atrasados
- Falta de automatización en suscripciones recurrentes
- Pérdida de profesionalismo
- Dificultad para escalar el negocio (más clientes = más pagos manuales)

**SOLUCION:**

Sistema de pagos integrado donde:
- El entrenador configura planes de suscripción (mensual, trimestral)
- Los clientes pagan automáticamente con tarjeta
- Recordatorios automáticos de pagos pendientes
- El entrenador recibe pagos directamente a su cuenta

**HERRAMIENTAS/INTEGRACIONES:**

- **Pasarela de pagos:** Stripe (internacional) o Mercado Pago (LATAM)
- **Gestión de suscripciones:** Stripe Subscriptions API con webhooks para renovaciones
- **Facturación:** Generación automática de facturas/recibos (react-pdf + envío por email)
- **Manejo de impuestos:** Integración con APIs fiscales locales según país (ej: AFIP en Argentina)
- **Dashboard financiero:** Reportes de ingresos, clientes activos, churn rate

---

### 2.12 Planes Nutricionales (Feature Opcional - Futuro)

**PROBLEMA:**

Muchos entrenadores también asignan pautas nutricionales a sus clientes, pero:
- Las envían por WhatsApp sin seguimiento
- No saben si el cliente las está siguiendo
- Falta de integración con el plan de entrenamiento
- Clientes piden ayuda para calcular macros/calorías

**SOLUCION:**

Módulo de nutrición donde:
- El entrenador asigna planes de alimentación con macros objetivo
- El cliente trackea comidas diarias
- Integración con apps como MyFitnessPal
- Reportes de adherencia nutricional

**HERRAMIENTAS/INTEGRACIONES:**

- **API nutricional:** MyFitnessPal API o Nutritionix para base de datos de alimentos
- **Calculadora de macros:** Algoritmos para calcular TDEE, macros según objetivos
- **Base de datos:** Tablas `meal_plans`, `meals`, `food_logs`
- **UI de tracking:** Input rápido de comidas con autocompletado
- **Gráficos:** Adherencia diaria (macros consumidos vs objetivo)

---

### 2.13 Análisis con IA (Feature Opcional - Futuro)

**PROBLEMA:**

Los entrenadores con muchos clientes no pueden analizar manualmente todos los datos para detectar:
- Patrones de estancamiento
- Riesgo de sobreentrenamiento
- Momentos óptimos para cambiar programa

**SOLUCION:**

Sistema de IA que analiza datos históricos y sugiere:
- Ajustes de carga cuando detecta estancamiento
- Alertas de sobreentrenamiento (volumen excesivo + mal estado emocional)
- Predicción de adherencia (riesgo de abandono)

**HERRAMIENTAS/INTEGRACIONES:**

- **Modelo ML:** TensorFlow.js o modelos pre-entrenados via API (OpenAI, Anthropic)
- **Análisis de series temporales:** Algoritmos de detección de tendencias/anomalías
- **Embeddings:** Análisis de texto (notas del entrenador, mensajes) para detectar sentimiento
- **Backend ML:** Python (FastAPI) con scikit-learn para modelos más complejos
- **Triggers automáticos:** Edge Functions que corren análisis semanalmente y generan insights

---

## 3. VALIDACION DE MERCADO

### Competidores Principales

| Plataforma | Mercado | Precio/mes | Fortalezas | Debilidades |
|------------|---------|------------|------------|-------------|
| **Trainerize** | Global (líder) | $10-$250 | Ecosistema completo, integraciones (MyFitnessPal, wearables), marca establecida | Caro para entrenadores pequeños, curva de aprendida compleja, poco localizado LATAM |
| **TrueCoach** | Global | $20-$107 (5-50 clientes) | UI simple, enfoque en comunicación, videos personalizados | Features limitados vs Trainerize, sin app móvil propia robusta |
| **Harbiz** | LATAM (líder) | No disponible público | Enfoque mercado hispanohablante, comprende necesidades locales | Menor ecosistema de integraciones vs gigantes USA |
| **Traineeks** | España/LATAM | No disponible público | Plataforma "definitiva" nutrición + entrenamiento | Competidor emergente, validación de mercado aún en proceso |

### Tamaño de Mercado

**Mercado Global Fitness Software:**
- Estimado en crecimiento acelerado post-pandemia
- Más de 14 plataformas compitiendo activamente (mercado fragmentado pero validado)

**Mercado Sudamérica Health & Fitness:**
- **2025:** USD 5.11 billones
- **2030:** USD 8.32 billones
- **CAGR:** 10.26%

**Penetración por País (LATAM):**
- Chile: 5.3% (2,089 gimnasios, 1M+ usuarios)
- Perú: 6% (4,026 gimnasios, 2M+ usuarios)
- México: 4.2% (crecimiento en espacios arrendados)
- Colombia: 4to mercado más grande LATAM (2M+ usuarios regulares)
- Argentina: 337+ entrenadores personales documentados

**Insight clave:** Baja penetración (3-6%) vs mercados desarrollados = oportunidad de crecimiento significativa.

### Ventajas Competitivas de FitCompass Pro

1. **Foco en mercado hispanohablante LATAM:** UI/UX culturalmente relevante, pricing adaptado a poder adquisitivo local, soporte en español
2. **Modelo híbrido B2B/B2C flexible:** Los entrenadores pueden ofrecer la app gratis a clientes o monetizar con plan premium (vs competidores que cobran solo al entrenador)
3. **Onboarding simplificado:** Competidores tienen curvas de aprendizaje empinadas; FitCompass priorizará simplicidad (entrenador operativo en <30 min)
4. **Pricing competitivo:** Entrada más baja que Trainerize ($19/mes vs $70/mes para 20-30 clientes)
5. **Feature parity con líderes + especialización:** Replicar features core validados + agregar módulos específicos (ej: integración Mercado Pago vs solo Stripe)

---

## 4. ESTRUCTURA BASICA DE LA APP

### Stack Tecnológico Recomendado

**Frontend Web (Entrenadores):**
- **Framework:** Next.js 14+ (React) con App Router
- **UI Components:** shadcn/ui + Tailwind CSS (diseño moderno, customizable)
- **Gestión de estado:** Zustand (simple, escalable)
- **Formularios:** React Hook Form + Zod (validación type-safe)
- **Gráficos:** Recharts

**Frontend Móvil (Clientes):**
- **Framework:** React Native con Expo (despliegue rápido iOS/Android)
- **UI:** React Native Paper o NativeBase
- **Navegación:** React Navigation v6
- **Estado offline:** Zustand + AsyncStorage con queue de sincronización

**Backend:**
- **BaaS:** Supabase (PostgreSQL + Auth + Realtime + Storage + Edge Functions)
  - Razón: Acelera desarrollo, escalable, pricing competitivo, Realtime nativo
- **Alternativa:** Firebase (si se necesita mayor ecosistema móvil)

**Base de Datos:**
- **Principal:** PostgreSQL (via Supabase)
- **Esquema core:**
  - `trainers` (entrenadores)
  - `clients` (clientes)
  - `workouts` (rutinas)
  - `exercises` (ejercicios)
  - `workout_logs` (registros de entrenamientos)
  - `messages` (chat)
  - `checkins` (check-ins semanales)

**Autenticación:**
- Supabase Auth con proveedores: Email/Password, Google OAuth
- Row Level Security (RLS) para aislamiento de datos entre entrenadores

**Hosting/Deploy:**
- **Web:** Vercel (Next.js optimizado)
- **Móvil:** Expo EAS Build + App Store / Google Play
- **Backend:** Supabase Cloud (tier Pro)

### Arquitectura de Alto Nivel

```
┌─────────────────────────────────────────────────────┐
│                   CAPA DE CLIENTE                    │
├──────────────────────┬──────────────────────────────┤
│   Web App (Next.js)  │  Mobile App (React Native)   │
│   - Dashboard        │  - Rutinas del día           │
│   - Constructor      │  - Tracking                  │
│   - Gestión clientes │  - Chat                      │
│   - Analytics        │  - Check-ins                 │
└──────────────────────┴──────────────────────────────┘
                         │
                         ▼
            ┌────────────────────────┐
            │     API SUPABASE       │
            │  - REST API            │
            │  - Realtime WS         │
            │  - Auth JWT            │
            └────────────────────────┘
                         │
         ┌───────────────┼───────────────┐
         ▼               ▼               ▼
┌────────────┐  ┌────────────┐  ┌────────────┐
│ PostgreSQL │  │  Storage   │  │   Edge     │
│            │  │  (Videos/  │  │ Functions  │
│ - RLS      │  │  Imágenes) │  │ (Crons,    │
│ - Índices  │  │            │  │  Webhooks) │
└────────────┘  └────────────┘  └────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│        INTEGRACIONES EXTERNAS           │
├─────────────────────────────────────────┤
│ - ExerciseDB API (catálogo ejercicios) │
│ - Stripe / Mercado Pago (pagos)        │
│ - SendGrid / Resend (emails)           │
│ - Firebase CM (push notifications)     │
│ - MyFitnessPal API (nutrición)         │
└─────────────────────────────────────────┘
```

### Integraciones Principales Requeridas

1. **ExerciseDB API (RapidAPI)**
   - Propósito: Catálogo de 1300+ ejercicios con GIFs
   - Complejidad: Baja (REST API simple)
   - Estimado: 2-3 días

2. **Stripe / Mercado Pago**
   - Propósito: Sistema de pagos y suscripciones
   - Complejidad: Media (webhooks, manejo de estados de pago)
   - Estimado: 5-7 días

3. **SendGrid / Resend**
   - Propósito: Envío de emails transaccionales (notificaciones, recordatorios)
   - Complejidad: Baja (API simple)
   - Estimado: 1-2 días

4. **Firebase Cloud Messaging**
   - Propósito: Push notifications móviles
   - Complejidad: Media (configuración iOS/Android, manejo de tokens)
   - Estimado: 3-4 días

5. **MyFitnessPal API** (Opcional - Fase 2)
   - Propósito: Tracking nutricional
   - Complejidad: Media-Alta (OAuth, sincronización de datos)
   - Estimado: 5-7 días

---

## 5. MODELO DE NEGOCIO

### Pricing Validado vs Competencia

**Modelo Propuesto para Entrenadores (B2B):**

| Plan | Clientes | Precio/mes | Comparación Mercado |
|------|----------|------------|---------------------|
| **Free** | 1-3 clientes | $0 | Trainerize: 1 cliente gratis |
| **Starter** | Hasta 10 clientes | $15 | TrueCoach: $20 (5 clientes) |
| **Pro** | Hasta 30 clientes | $39 | Trainerize: $70, TrueCoach: $53 (20 clientes) |
| **Studio** | Hasta 100 clientes | $89 | Trainerize: $250 |
| **Enterprise** | Ilimitado | $149 | Trainerize: Custom quote |

**Justificación:** Pricing 30-40% más bajo que líderes, pero con feature parity en MVP. Estrategia de penetración de mercado.

**Modelo Propuesto para Clientes (B2C - Opcional):**

- **Gratis:** Acceso a rutinas asignadas por su entrenador, tracking básico
- **Premium ($4.99/mes):** Análisis avanzado, integración wearables, planes nutricionales, historial ilimitado

### Proyección Simple de Ingresos (Escenario Realista)

**Supuestos:**
- Mercado objetivo inicial: Argentina + Chile + Colombia
- Entrenadores personales estimados (conservador): 1,500 activos en estos países
- Tasa de conversión: 2% en primer año (30 entrenadores pagos)
- Mix de planes: 40% Starter, 40% Pro, 20% Studio

**Año 1 (12 meses):**

| Mes | Entrenadores Pagos | MRR (Monthly Recurring Revenue) | ARR Proyectado |
|-----|--------------------|---------------------------------|----------------|
| 3 | 5 | $150 | $1,800 |
| 6 | 15 | $550 | $6,600 |
| 9 | 25 | $950 | $11,400 |
| 12 | 30 | $1,150 | **$13,800** |

**Año 2 (objetivo):**
- 100 entrenadores pagos
- MRR: $4,000
- ARR: **$48,000**

Nota: Proyecciones conservadoras sin incluir revenue B2C (clientes premium) ni features de pago adicionales (sistema de pagos integrado toma comisión).

---

## 6. MVP RECOMENDADO

### Features Core para V1 (Priorización RICE)

**RICE Score = (Reach × Impact × Confidence) / Effort**

| Feature | Reach | Impact | Confidence | Effort | RICE Score | Prioridad | Estimado |
|---------|-------|--------|------------|--------|------------|-----------|----------|
| **Gestión de Clientes** | 100 | 3 | 100% | 5 | 60 | P0 | 7 días |
| **Constructor de Rutinas** | 100 | 3 | 100% | 13 | 23 | P0 | 14 días |
| **Biblioteca de Ejercicios** | 100 | 3 | 90% | 8 | 34 | P0 | 10 días |
| **App Móvil Básica (cliente)** | 100 | 3 | 80% | 21 | 11 | P1 | 21 días |
| **Calendario de Programación** | 80 | 2 | 90% | 8 | 18 | P1 | 10 días |
| **Dashboard de Seguimiento** | 90 | 2 | 80% | 10 | 14 | P1 | 12 días |
| **Chat Entrenador-Cliente** | 70 | 2 | 70% | 8 | 12 | P2 | 10 días |

**Definiciones:**
- **Reach:** % de usuarios que usarán la feature (0-100)
- **Impact:** Impacto en valor percibido (1=bajo, 2=medio, 3=alto)
- **Confidence:** Confianza en estimaciones (0-100%)
- **Effort:** Días de desarrollo estimados

### MVP V1 - Scope Definitivo

**INCLUYE (Features Core No Negociables):**

1. **Autenticación y Onboarding**
   - Registro/login entrenadores (email + Google OAuth)
   - Wizard de configuración inicial (nombre del gimnasio/marca, foto perfil)
   - Estimado: 5 días

2. **Gestión de Clientes**
   - CRUD de clientes (crear, listar, editar, eliminar)
   - Perfil con: nombre, email, teléfono, objetivos, notas
   - Estados: activo/pausado/inactivo
   - Estimado: 7 días

3. **Biblioteca de Ejercicios**
   - Catálogo pre-cargado desde ExerciseDB API (1300+ ejercicios)
   - Búsqueda/filtros por: grupo muscular, equipo, nombre
   - Vista de detalle con GIF demostrativo
   - Estimado: 10 días

4. **Constructor de Rutinas (Versión Simplificada)**
   - Crear rutina asignando ejercicios desde biblioteca
   - Configurar: series, reps, peso sugerido, descanso
   - Asignar rutina a cliente específico
   - Duplicar rutinas entre clientes
   - Estimado: 14 días

5. **App Móvil Cliente (Versión MVP)**
   - Login con credenciales compartidas por entrenador
   - Ver rutina asignada del día
   - Marcar ejercicios como completados
   - Ver GIF de ejercicio
   - Estimado: 21 días

6. **Dashboard Básico**
   - Vista de todos los clientes con estado de última actividad
   - Lista de quién entrenó hoy
   - Estimado: 5 días

**Total MVP V1: 62 días de desarrollo (aprox. 12-13 semanas con 1 desarrollador)**

### EXCLUIDO de V1 (Roadmap V2)

- Calendario de programación (se asigna rutina "general", no por fechas específicas)
- Chat integrado (comunicación inicial sigue por WhatsApp)
- Check-ins semanales
- Tracking de rendimiento con gráficos
- Tracking de hábitos y correlación con rendimiento
- Sistema de pagos integrado
- Planes nutricionales
- Análisis con IA
- Ejercicios custom del entrenador (solo catálogo pre-cargado en V1)

---

## 7. PROXIMOS PASOS

### Acción Inmediata (Próximas 2 semanas)

**VALIDACION DE PROBLEMA CON USUARIOS REALES:**

1. **Entrevistar 5-8 entrenadores personales:**
   - Objetivo: Validar pain points identificados
   - Preguntas clave:
     - ¿Cómo gestionas actualmente tus clientes y rutinas?
     - ¿Qué herramientas usas? (Excel, apps, papel)
     - ¿Cuánto tiempo te toma crear/enviar rutinas semanalmente?
     - ¿Conoces Trainerize/TrueCoach? ¿Por qué no las usas? (si aplica)
     - ¿Pagarías $15-39/mes por una solución? ¿Qué features serían esenciales?

2. **Investigar pricing local:**
   - ¿Cuánto cobran entrenadores en Argentina/Chile/Colombia por mes?
   - Validar que $15-39/mes es <5% de sus ingresos mensuales (umbral aceptable)

3. **Crear landing page de validación:**
   - Propuesta de valor clara
   - Formulario de early access
   - Objetivo: 20-30 signups en 2 semanas = señal de interés real

### Siguientes Gates de Validación

**Gate 1 (Antes de desarrollo):**
- Mínimo 5 entrenadores dispuestos a pagar (pre-venta o compromiso verbal)
- Validación de que pain points son reales y prioritarios

**Gate 2 (Post MVP):**
- 10 entrenadores usando MVP activamente (1+ sesiones/semana)
- Feedback cualitativo: ¿resuelve el problema core?
- Decisión: iterar MVP o avanzar a features V2

**Gate 3 (Escalamiento):**
- 30+ entrenadores pagos
- Churn <10% mensual
- NPS >40
- Decisión: escalar marketing o pivotar modelo

---

**Validación completada:** 2025-11-11
**Validator:** Idea Validator Agent

---

## ANEXO: RIESGOS Y MITIGACIONES

### Riesgos Identificados

**RIESGO 1: Competencia con gigantes establecidos**
- **Impacto:** Alto
- **Probabilidad:** Alta
- **Mitigación:** Enfoque en mercado LATAM hispanohablante, pricing agresivo, onboarding superior

**RIESGO 2: Adopción lenta (entrenadores son conservadores)**
- **Impacto:** Alto
- **Probabilidad:** Media
- **Mitigación:** Free tier generoso (3 clientes), onboarding guiado, casos de éxito locales

**RIESGO 3: Complejidad técnica subestimada (app móvil + web + realtime)**
- **Impacto:** Medio
- **Probabilidad:** Media
- **Mitigación:** Usar BaaS (Supabase) reduce complejidad, MVP minimalista, no reinventar rueda

**RIESGO 4: Poder adquisitivo LATAM limita pricing**
- **Impacto:** Medio
- **Probabilidad:** Media
- **Mitigación:** Planes flexibles, pricing en moneda local, partnerships con asociaciones de entrenadores

**RIESGO 5: Dependencia de APIs externas (ExerciseDB, Stripe)**
- **Impacto:** Bajo-Medio
- **Probabilidad:** Baja
- **Mitigación:** Cachear datos críticos, tener alternativas (ej: catálogo propio si ExerciseDB falla)

---

FIN DEL DOCUMENTO DE VALIDACION
