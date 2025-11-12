# MAPA DE DEPENDENCIAS - FitCompass Pro

## Diagrama de Dependencias Visual

```
┌─────────────────────────────────────────────────────────────────────┐
│                          NIVEL 0 (BASE)                              │
│                     ⚠️  BLOQUEANTE CRÍTICO                            │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                    ┌──────────────┴──────────────┐
                    │                             │
         ┌──────────▼──────────┐      ┌──────────▼──────────┐
         │  F1: Autenticación  │      │  F0: Setup Proyecto │
         │   y Onboarding      │      │  (Next.js+Supabase) │
         │                     │      │                     │
         │  📅 5 días          │      │  📅 2 días          │
         │  👤 1 dev           │      │  👤 1 dev           │
         └──────────┬──────────┘      └─────────────────────┘
                    │
                    │ DESBLOQUEA ↓
                    │
┌───────────────────┴────────────────────────────────────────────────┐
│                          NIVEL 1                                    │
│              🔓 Se pueden trabajar en PARALELO                      │
└─────────────────────────────────────────────────────────────────────┘
                    │
        ┌───────────┼───────────────┐
        │           │               │
┌───────▼──────┐ ┌──▼────────────┐ ┌▼────────────────┐
│ F2: Gestión  │ │ F3: Biblioteca│ │ Diseño UI/UX    │
│ de Clientes  │ │ de Ejercicios │ │ (Paralelo)      │
│              │ │               │ │                 │
│ 📅 7 días    │ │ 📅 10 días    │ │ 📅 10-14 días   │
│ 👤 1 dev     │ │ 👤 1 dev      │ │ 👤 1 designer   │
└───────┬──────┘ └──┬────────────┘ └─────────────────┘
        │           │
        │           │ AMBOS NECESARIOS ↓
        │           │
        └─────┬─────┘
              │
┌─────────────┴────────────────────────────────────────────────────┐
│                          NIVEL 2                                  │
│               ⚠️  BLOQUEADO por F2 + F3                           │
└───────────────────────────────────────────────────────────────────┘
              │
    ┌─────────▼─────────┐
    │ F4: Constructor   │
    │    de Rutinas     │
    │                   │
    │ 📅 14 días        │
    │ 👤 1 dev          │
    └─────────┬─────────┘
              │
              │ DESBLOQUEA ↓
              │
┌─────────────┴────────────────────────────────────────────────────┐
│                          NIVEL 3                                  │
│              🔓 Se pueden trabajar en PARALELO                    │
└───────────────────────────────────────────────────────────────────┘
              │
      ┌───────┴────────┐
      │                │
┌─────▼──────────┐ ┌───▼─────────────┐
│ F5: App Móvil  │ │ F6: Dashboard   │
│    Cliente     │ │ de Seguimiento  │
│                │ │                 │
│ 📅 21 días     │ │ 📅 5 días       │
│ 👤 1 dev móvil │ │ 👤 1 dev web    │
└────────────────┘ └─────────────────┘
      │
      │ MVP V1 COMPLETO ✅
      │
┌─────┴────────────────────────────────────────────────────────────┐
│                          NIVEL 4 (V2)                             │
│              🔓 TODAS se pueden trabajar en PARALELO              │
└───────────────────────────────────────────────────────────────────┘
      │
      ├────────┬────────┬────────┬────────┐
      │        │        │        │        │
  ┌───▼──┐ ┌──▼───┐ ┌──▼───┐ ┌──▼───┐ ┌─▼────┐
  │ F7:  │ │ F8:  │ │ F9:  │ │ F10: │ │ F11: │
  │Cal   │ │Track │ │Chat  │ │Check │ │Hábit │
  │      │ │Rend  │ │      │ │-ins  │ │itos  │
  │10d   │ │12d   │ │10d   │ │8d    │ │12d   │
  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘
```

---

## Tabla de Features con Dependencias

| ID | Feature | Duración | Bloquea a | Bloqueada por | Paralelo con |
|----|---------|----------|-----------|---------------|--------------|
| **F0** | 🔧 Setup Proyecto | 2 días | F1, F2, F3 | - | - |
| **F1** | 🔐 Autenticación | 5 días | F2, F3, F4 | F0 | - |
| **F2** | 👥 Gestión Clientes | 7 días | F4 | F1 | F3, Diseño |
| **F3** | 💪 Biblioteca Ejercicios | 10 días | F4 | F1 | F2, Diseño |
| **F4** | 📋 Constructor Rutinas | 14 días | F5, F6 | F2 + F3 | - |
| **F5** | 📱 App Móvil Cliente | 21 días | - | F4 | F6 |
| **F6** | 📊 Dashboard Seguimiento | 5 días | - | F4 | F5 |
| **F7** | 📅 Calendario | 10 días | - | F6 (MVP V1) | F8, F9, F10, F11 |
| **F8** | 📈 Tracking Rendimiento | 12 días | - | F6 (MVP V1) | F7, F9, F10, F11 |
| **F9** | 💬 Chat | 10 días | - | F6 (MVP V1) | F7, F8, F10, F11 |
| **F10** | 📸 Check-ins | 8 días | - | F6 (MVP V1) | F7, F8, F9, F11 |
| **F11** | 🎯 Tracking Hábitos | 12 días | - | F6 (MVP V1) | F7, F8, F9, F10 |

---

## Grupos de Trabajo en Paralelo

### 🟢 GRUPO 1: Puede empezar AHORA (Semana 1-2)

```
┌─────────────────────────────────────────────────────────┐
│  Developer 1           │  Developer 2 (Opcional)        │
├────────────────────────┼────────────────────────────────┤
│  F0: Setup (2 días)    │  -                             │
│  F1: Auth (5 días)     │  -                             │
└────────────────────────┴────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│  Designer                                                │
├──────────────────────────────────────────────────────────┤
│  Diseño UI/UX (10-14 días) - Puede empezar en paralelo  │
│  con F0/F1 sin bloqueos                                  │
└──────────────────────────────────────────────────────────┘
```

**⏱ Tiempo:** 7 días (Setup 2d + Auth 5d)
**🚫 Bloqueantes:** Ninguno
**📌 Requisito:** Terminar F1 antes de continuar

---

### 🟡 GRUPO 2: Después de F1 (Semana 3-4)

```
┌──────────────────────────────────────────────────────────┐
│  Developer 1              │  Developer 2 (si hay)        │
├───────────────────────────┼──────────────────────────────┤
│  F2: Gestión Clientes     │  F3: Biblioteca Ejercicios   │
│      (7 días)             │      (10 días)               │
│                           │                              │
│  ✅ Independiente de F3   │  ✅ Independiente de F2      │
└───────────────────────────┴──────────────────────────────┘
```

**⏱ Tiempo:** 10 días (si trabajás ambos en paralelo)
**🚫 Bloqueantes:** F1 (Autenticación) debe estar terminada
**✅ Ventaja:** Ahorrás 7 días trabajando en paralelo

**Si trabajás solo:**
- Opción A: F2 primero (7d) → F3 después (10d) = 17 días
- Opción B: F3 primero (10d) → F2 después (7d) = 17 días
- **Recomendación:** F2 primero (más simple, da confianza)

---

### 🔴 GRUPO 3: Después de F2 + F3 (Semana 5-6)

```
┌──────────────────────────────────────────────────────────┐
│  Developer 1 (NO SE PUEDE PARALELIZAR)                   │
├──────────────────────────────────────────────────────────┤
│  F4: Constructor de Rutinas (14 días)                    │
│                                                           │
│  ⚠️  REQUIERE que F2 Y F3 estén 100% terminadas          │
│  ❌ No se puede trabajar en paralelo con nada            │
└──────────────────────────────────────────────────────────┘
```

**⏱ Tiempo:** 14 días
**🚫 Bloqueantes:** F2 + F3 terminadas
**❌ No paralelizable:** Feature compleja que integra F2 y F3

---

### 🟢 GRUPO 4: Después de F4 (Semana 7-11)

```
┌──────────────────────────────────────────────────────────┐
│  Developer 1 (Web)        │  Developer 2 (Mobile)        │
├───────────────────────────┼──────────────────────────────┤
│  F6: Dashboard            │  F5: App Móvil Cliente       │
│      (5 días)             │      (21 días)               │
│                           │                              │
│  ✅ Independiente de F5   │  ✅ Independiente de F6      │
└───────────────────────────┴──────────────────────────────┘
```

**⏱ Tiempo:** 21 días (si trabajás ambos en paralelo)
**🚫 Bloqueantes:** F4 (Constructor) debe estar terminada
**✅ Ventaja:** Ahorrás 5 días trabajando en paralelo

**Si trabajás solo:**
- Opción A: F5 primero (21d) → F6 después (5d) = 26 días
- Opción B: F6 primero (5d) → F5 después (21d) = 26 días
- **Recomendación:** F6 primero (terminás dashboard rápido, das señal de progreso)

---

### 🟢 GRUPO 5: V2 - Después de MVP (Semana 14+)

```
┌──────────────────────────────────────────────────────────┐
│  🎉 TODAS las features de V2 son INDEPENDIENTES          │
│  Se pueden trabajar en CUALQUIER orden o en PARALELO     │
└──────────────────────────────────────────────────────────┘

┌───────────┬───────────┬───────────┬───────────┬──────────┐
│ F7:       │ F8:       │ F9:       │ F10:      │ F11:     │
│ Calendario│ Tracking  │ Chat      │ Check-ins │ Hábitos  │
│           │ Rendim.   │           │           │          │
│ 10 días   │ 12 días   │ 10 días   │ 8 días    │ 12 días  │
└───────────┴───────────┴───────────┴───────────┴──────────┘
```

**⏱ Tiempo:** Variable (según prioridad)
**🚫 Bloqueantes:** MVP V1 completo
**✅ Ventaja:** Máxima flexibilidad, elegís por prioridad de negocio

---

## Estrategias de Trabajo

### 📊 Estrategia 1: SOLO (1 Developer)

**Ruta Crítica Óptima:**
```
F0 (2d) → F1 (5d) → F2 (7d) → F3 (10d) → F4 (14d) → F6 (5d) → F5 (21d)

Total: 64 días (~13 semanas)
```

**Calendario:**
- **Semana 1-2:** F0 + F1 (Setup + Auth)
- **Semana 3:** F2 (Gestión Clientes)
- **Semana 4-5:** F3 (Biblioteca Ejercicios)
- **Semana 6-8:** F4 (Constructor Rutinas)
- **Semana 9:** F6 (Dashboard)
- **Semana 10-13:** F5 (App Móvil)

**✅ MVP listo en 13 semanas**

---

### 🚀 Estrategia 2: EQUIPO (2 Developers + 1 Designer)

**Ruta Crítica Optimizada:**
```
        Dev 1                    Dev 2                  Designer
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Semana 1-2:  F0+F1 (7d)          -                    Diseño (14d)
Semana 3-4:  F2 (7d)             F3 (10d)             Diseño (cont)
Semana 5-8:  F4 (14d)            F4 (14d)             -
Semana 9-13: F6 (5d)             F5 (21d)             -
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Total: 47 días (~9-10 semanas) - AHORRO: 17 días vs solo
```

**Calendario:**
- **Semana 1-2:**
  - Dev 1: F0 + F1
  - Designer: Wireframes + mockups (en paralelo)
- **Semana 3-4:**
  - Dev 1: F2 (Clientes)
  - Dev 2: F3 (Ejercicios)
- **Semana 5-8:**
  - Ambos devs: F4 (pair programming en feature compleja)
- **Semana 9-13:**
  - Dev 1: F6 (Dashboard)
  - Dev 2: F5 (App Móvil)

**✅ MVP listo en 10 semanas (ahorrás 3 semanas)**

---

### ⚡ Estrategia 3: EQUIPO GRANDE (3 Developers)

**Ruta Crítica Ultra-Optimizada:**
```
        Dev 1 (Lead)        Dev 2 (Web)        Dev 3 (Mobile)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
S1-2:   F0+F1 (7d)          -                  -
S3-4:   F4 (prep) (3d)      F2 (7d)            F3 (10d)
S5-8:   F4 (14d)            F4 (ayuda)         Setup Mobile (3d)
S9-13:  F6 (5d)             Testing/Bugs       F5 (21d)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Total: 44 días (~9 semanas) - AHORRO: 20 días vs solo
```

**✅ MVP listo en 9 semanas**

---

## Análisis de Bloqueos Críticos

### 🔴 BLOQUEANTES CRÍTICOS (Hard Dependencies)

| Bloqueante | Bloquea a | ¿Por qué? |
|------------|-----------|-----------|
| **F1: Autenticación** | F2, F3, F4, F5, F6 | Toda la app requiere usuarios autenticados. Row Level Security depende de auth. |
| **F2: Gestión Clientes** | F4 | No podés crear rutinas sin tener clientes a quienes asignarlas. |
| **F3: Biblioteca Ejercicios** | F4 | Constructor necesita ejercicios para agregar a rutinas. |
| **F4: Constructor Rutinas** | F5, F6 | App móvil muestra rutinas. Dashboard muestra actividad de rutinas. |

### 🟡 BLOQUEANTES SUAVES (Soft Dependencies)

| Feature | Depende de (suave) | Nota |
|---------|--------------------|------|
| **F6: Dashboard** | F5 (móvil) | Técnicamente independientes, pero dashboard sin datos móviles es poco útil. |
| **F8: Tracking Rendimiento** | F5 (móvil) | Tracking necesita logs de entrenamientos (generados en móvil). |
| **F11: Hábitos** | F8 (tracking) | Correlación de hábitos necesita datos de rendimiento. |

---

## Matriz de Paralelización

### ✅ Se PUEDEN trabajar en paralelo:

```
F2 ║ F3         (✅ INDEPENDIENTES - Nivel 1)
F5 ║ F6         (✅ INDEPENDIENTES - Nivel 3)
F7 ║ F8 ║ F9 ║ F10 ║ F11  (✅ TODAS independientes - V2)
```

### ❌ NO se pueden trabajar en paralelo:

```
F1 → F2         (❌ F2 necesita auth)
F1 → F3         (❌ F3 necesita auth)
F2 + F3 → F4    (❌ F4 necesita ambas terminadas)
F4 → F5         (❌ F5 necesita rutinas)
F4 → F6         (❌ F6 necesita rutinas)
```

---

## Recomendaciones Finales

### Si trabajás SOLO:
1. **Seguí la ruta crítica:** F0 → F1 → F2 → F3 → F4 → F6 → F5
2. **No saltees features:** Cada una desbloquea la siguiente
3. **Enfocate en MVP:** Dejá V2 para después de validar con usuarios

### Si tenés un EQUIPO:
1. **Paralelizá F2 + F3:** Ahorrás 7 días inmediatamente
2. **Paralelizá F5 + F6:** Ahorrás 5 días al final
3. **Designer en paralelo desde día 1:** No bloquea a nadie

### Para V2:
1. **Máxima flexibilidad:** Elegí features por valor de negocio
2. **Podés trabajar 2-3 features en paralelo** si tenés equipo
3. **Prioridad sugerida:** F10 (Check-ins) → F8 (Tracking) → F11 (Hábitos)

---

## Gráfico Gantt Simplificado (1 Developer)

```
Semana │ 1  │ 2  │ 3  │ 4  │ 5  │ 6  │ 7  │ 8  │ 9  │ 10 │ 11 │ 12 │ 13 │
───────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┤
F0     │ ██ │    │    │    │    │    │    │    │    │    │    │    │    │
F1     │ ██ │ ██ │    │    │    │    │    │    │    │    │    │    │    │
F2     │    │    │ ██ │ ██ │    │    │    │    │    │    │    │    │    │
F3     │    │    │    │ ██ │ ██ │ ██ │    │    │    │    │    │    │    │
F4     │    │    │    │    │    │ ██ │ ██ │ ██ │    │    │    │    │    │
F6     │    │    │    │    │    │    │    │    │ ██ │    │    │    │    │
F5     │    │    │    │    │    │    │    │    │ ██ │ ██ │ ██ │ ██ │ ██ │
───────┴────┴────┴────┴────┴────┴────┴────┴────┴────┴────┴────┴────┴────┘
                                                                    ↑
                                                               MVP LISTO
```

---

## Resumen Visual: ¿Qué puedo hacer AHORA?

```
┌─────────────────────────────────────────────────────────────────┐
│  🟢 AHORA (Sin Bloqueantes)                                     │
├─────────────────────────────────────────────────────────────────┤
│  ✅ F0: Setup Proyecto (2 días)                                 │
│  ✅ Diseño UI/UX (puede empezar en paralelo)                    │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  🟡 DESPUÉS DE F0 (Bloqueado por setup)                         │
├─────────────────────────────────────────────────────────────────┤
│  ⏳ F1: Autenticación (5 días)                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  🟡 DESPUÉS DE F1 (En Paralelo Posible)                         │
├─────────────────────────────────────────────────────────────────┤
│  ⏳ F2: Gestión de Clientes (7 días)  ║  F3: Biblioteca (10d)   │
│     👥 Developer 1                    ║  👥 Developer 2         │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  🔴 DESPUÉS DE F2+F3 (Bloqueante Crítico)                       │
├─────────────────────────────────────────────────────────────────┤
│  ⏳ F4: Constructor de Rutinas (14 días) - NO PARALELIZABLE     │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  🟡 DESPUÉS DE F4 (En Paralelo Posible)                         │
├─────────────────────────────────────────────────────────────────┤
│  ⏳ F6: Dashboard (5d)  ║  F5: App Móvil (21d)                  │
│     👥 Developer 1      ║  👥 Developer 2                       │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  🟢 V2 - DESPUÉS DE MVP (Todas en Paralelo)                     │
├─────────────────────────────────────────────────────────────────┤
│  ✅ F7, F8, F9, F10, F11 - ELIGE CUALQUIERA                     │
└─────────────────────────────────────────────────────────────────┘
```

---

**Leyenda:**
- 🟢 Verde = Sin bloqueos, podés empezar YA
- 🟡 Amarillo = Bloqueado por 1 feature
- 🔴 Rojo = Bloqueado por múltiples features
- ║ = Se pueden trabajar en paralelo
- → = Dependencia secuencial obligatoria
