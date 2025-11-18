# Test Plan End-to-End - FitCompass Pro

## Objetivo
Validar que todos los flujos críticos del sistema funcionan correctamente antes del deploy a producción.

## Pre-requisitos
- Backend corriendo en `http://localhost:5000`
- Frontend Web corriendo en `http://localhost:3000`
- Frontend Mobile corriendo en Expo
- Base de datos PostgreSQL configurada y con migrations aplicadas

## Escenario 1: Flujo Trainer Completo

### Objetivo
Verificar que un trainer puede registrarse, crear clientes y asignar workouts.

### Pasos
1. **Registro de Trainer**
   - [ ] Abrir `http://localhost:3000/register`
   - [ ] Completar formulario con:
     - Email: `trainer@test.com`
     - Password: `Test123!`
     - Name: `Test Trainer`
     - Role: `trainer`
   - [ ] Click en "Registrar"
   - [ ] Verificar redirección al dashboard
   - [ ] Verificar que se muestra mensaje de bienvenida

2. **Agregar 3 Clientes**
   - [ ] Navegar a sección "Clientes"
   - [ ] Click en "Agregar Cliente"
   - [ ] Crear Cliente 1:
     - Name: `Juan Pérez`
     - Email: `juan@test.com`
     - Phone: `+54 11 1234-5678`
   - [ ] Repetir para Cliente 2 y Cliente 3
   - [ ] Verificar que los 3 clientes aparecen en la lista

3. **Crear Workout con 5 Ejercicios**
   - [ ] Navegar a sección "Workouts"
   - [ ] Click en "Crear Workout"
   - [ ] Completar:
     - Name: `Full Body A`
     - Description: `Entrenamiento de cuerpo completo`
   - [ ] Agregar 5 ejercicios (usando buscador ExerciseDB):
     - Bench Press (3 sets x 10 reps)
     - Squat (4 sets x 8 reps)
     - Deadlift (3 sets x 6 reps)
     - Pull-ups (3 sets x 12 reps)
     - Plank (3 sets x 60 seconds)
   - [ ] Click en "Guardar Workout"
   - [ ] Verificar que workout aparece en lista

4. **Asignar Workout a 3 Clientes**
   - [ ] Abrir workout "Full Body A"
   - [ ] Click en "Asignar a Clientes"
   - [ ] Seleccionar los 3 clientes creados
   - [ ] Configurar fecha inicio: Hoy
   - [ ] Click en "Asignar"
   - [ ] Verificar mensaje de confirmación

5. **Verificar Dashboard**
   - [ ] Navegar a Dashboard
   - [ ] Verificar que muestra:
     - 3 clientes totales
     - 1 workout activo
     - Adherencia promedio: 0% (ningún cliente ha entrenado)
   - [ ] Verificar que no hay errores en consola del navegador

### Resultado Esperado
✅ Trainer puede registrarse, crear clientes y workouts, y asignarlos exitosamente.

---

## Escenario 2: Flujo Cliente Completo

### Objetivo
Verificar que un cliente puede recibir invitación, registrarse y completar workouts.

### Pasos

1. **Simular Invitación por Email**
   - [ ] Desde panel del trainer, ir a Cliente 1 (Juan Pérez)
   - [ ] Click en "Enviar Invitación"
   - [ ] Copiar link de invitación generado
   - [ ] Verificar formato: `fitcompass://invite?token=...`

2. **Crear Cuenta Cliente**
   - [ ] Abrir app móvil (Expo)
   - [ ] Pegar deep link en navegador para abrir app
   - [ ] Verificar que app muestra pantalla de registro pre-filled
   - [ ] Completar password: `Cliente123!`
   - [ ] Click en "Crear Cuenta"
   - [ ] Verificar redirección a home de cliente

3. **Ver Workout Asignado**
   - [ ] En app móvil, verificar que muestra:
     - "Full Body A" en lista de workouts
     - Estado: No completado
   - [ ] Click en "Full Body A"
   - [ ] Verificar que muestra los 5 ejercicios con detalles

4. **Iniciar y Completar Workout**
   - [ ] Click en "Iniciar Entrenamiento"
   - [ ] Para cada ejercicio:
     - Bench Press: Completar 3 sets (60kg, 65kg, 70kg)
     - Squat: Completar 4 sets (80kg, 85kg, 90kg, 90kg)
     - Deadlift: Completar 3 sets (100kg, 110kg, 120kg)
     - Pull-ups: Completar 3 sets (bodyweight)
     - Plank: Completar 3 sets (60s cada uno)
   - [ ] Click en "Finalizar Workout"
   - [ ] Verificar mensaje de confirmación
   - [ ] Verificar que workout aparece como "Completado"

5. **Verificar Sincronización con Trainer**
   - [ ] En web del trainer, navegar a Dashboard
   - [ ] Verificar que Juan Pérez muestra:
     - Adherencia: 100%
     - Último workout: "Full Body A" (hoy)
   - [ ] Click en detalle de Juan Pérez
   - [ ] Verificar que se muestran los pesos registrados

### Resultado Esperado
✅ Cliente puede registrarse, ver workouts asignados y completarlos. Datos se sincronizan con trainer.

---

## Escenario 3: Flujo Colaborativo (7 días)

### Objetivo
Simular una semana completa de entrenamiento entre trainer y cliente.

### Pasos

1. **Día 1 - Lunes: Asignar Workout**
   - [ ] Trainer crea "Full Body A" y asigna a Juan
   - [ ] Juan completa workout en app móvil
   - [ ] Trainer verifica completitud en dashboard

2. **Día 2 - Martes: Descanso**
   - [ ] No hay workout asignado
   - [ ] Dashboard muestra adherencia: 50% (1/2 días)

3. **Día 3 - Miércoles: Nuevo Workout con Progresión**
   - [ ] Trainer crea "Full Body B" (variación con +5kg)
   - [ ] Asigna a Juan
   - [ ] Juan completa workout
   - [ ] Trainer verifica progresión de peso

4. **Día 4 - Jueves: Descanso**
   - [ ] Dashboard actualiza adherencia

5. **Día 5 - Viernes: Workout Final**
   - [ ] Trainer asigna "Full Body A" nuevamente
   - [ ] Juan completa
   - [ ] Adherencia semanal: 100%

6. **Verificar Analytics Semanales**
   - [ ] Dashboard muestra:
     - 3 workouts completados de 3 asignados
     - Adherencia: 100%
     - Gráfico de progreso poblado
     - Volumen total (sets × reps × peso)
   - [ ] Gráficos muestran tendencia ascendente en peso

### Resultado Esperado
✅ Sistema maneja flujo completo de 7 días, analytics se calculan correctamente.

---

## Checklist de Performance y Calidad

### Backend API
- [ ] Todos los endpoints responden en <500ms
- [ ] No hay errores 500 en logs
- [ ] JWT authentication funciona correctamente
- [ ] CORS configurado correctamente

### Frontend Web
- [ ] No hay errores en consola del navegador
- [ ] Todos los formularios validan correctamente
- [ ] Loading states se muestran apropiadamente
- [ ] Responsive design funciona en mobile/tablet/desktop

### Frontend Mobile
- [ ] App no crashea en 20 minutos de uso continuo
- [ ] Deep links funcionan correctamente
- [ ] Navegación fluida entre pantallas
- [ ] Datos persisten después de cerrar app

### Database
- [ ] Migrations aplicadas correctamente
- [ ] Índices configurados para queries frecuentes
- [ ] No hay queries N+1
- [ ] Datos se persisten correctamente

---

## Bugs Encontrados

### Registrar aquí cualquier bug encontrado durante testing:

| # | Descripción | Severidad | Componente | Status |
|---|-------------|-----------|------------|--------|
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |

---

## Sign-off

- [ ] Escenario 1 completado sin errores críticos
- [ ] Escenario 2 completado sin errores críticos
- [ ] Escenario 3 completado sin errores críticos
- [ ] Performance checklist completado
- [ ] Todos los bugs críticos resueltos

**Testeador:** _______________
**Fecha:** _______________
**Firma:** _______________

---

## Próximos Pasos

Una vez completado este test plan:
1. Resolver todos los bugs críticos encontrados
2. Proceder con F-025: Deploy a Producción
3. Repetir testing en ambiente de producción (smoke tests)
