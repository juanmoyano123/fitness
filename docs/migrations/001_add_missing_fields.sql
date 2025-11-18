-- =====================================================
-- MIGRACIÓN 001: Agregar campos faltantes para FASE 6
-- =====================================================
-- Esta migración agrega campos que existen en los modelos Python
-- pero no en el schema.sql original de FASE 0

-- =====================================================
-- CLIENTS TABLE - Agregar campos FASE 1 & 6
-- =====================================================
ALTER TABLE clients ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
ALTER TABLE clients ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS gender VARCHAR(30);
ALTER TABLE clients ADD COLUMN IF NOT EXISTS age INTEGER;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS goals TEXT;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS invite_token VARCHAR(255);
ALTER TABLE clients ADD COLUMN IF NOT EXISTS invite_sent_at TIMESTAMP;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS registered_at TIMESTAMP;

COMMENT ON COLUMN clients.phone IS 'Teléfono de contacto del cliente';
COMMENT ON COLUMN clients.notes IS 'Notas del trainer sobre el cliente';
COMMENT ON COLUMN clients.is_active IS 'Cliente activo o archivado';
COMMENT ON COLUMN clients.gender IS 'Género del cliente (male, female, other, prefer-not-to-say)';
COMMENT ON COLUMN clients.age IS 'Edad del cliente';
COMMENT ON COLUMN clients.goals IS 'Objetivos de fitness del cliente';
COMMENT ON COLUMN clients.invite_token IS 'JWT token para invitación de registro';
COMMENT ON COLUMN clients.invite_sent_at IS 'Fecha de envío de invitación';
COMMENT ON COLUMN clients.registered_at IS 'Fecha de registro completado';

-- =====================================================
-- WORKOUT_ASSIGNMENTS TABLE - Agregar campos FASE 4 & 5
-- =====================================================
ALTER TABLE workout_assignments ADD COLUMN IF NOT EXISTS trainer_id INTEGER REFERENCES trainers(id) ON DELETE CASCADE;
ALTER TABLE workout_assignments ADD COLUMN IF NOT EXISTS due_date TIMESTAMP;
ALTER TABLE workout_assignments ADD COLUMN IF NOT EXISTS started_at TIMESTAMP;
ALTER TABLE workout_assignments ADD COLUMN IF NOT EXISTS notes TEXT;

-- Índices para nuevos campos
CREATE INDEX IF NOT EXISTS idx_assignments_trainer ON workout_assignments(trainer_id);

COMMENT ON COLUMN workout_assignments.trainer_id IS 'Trainer que asignó el workout';
COMMENT ON COLUMN workout_assignments.due_date IS 'Fecha límite sugerida para completar';
COMMENT ON COLUMN workout_assignments.started_at IS 'Timestamp cuando cliente empezó el workout';
COMMENT ON COLUMN workout_assignments.notes IS 'Notas del trainer sobre esta asignación';

-- =====================================================
-- WORKOUTS TABLE - Agregar campos FASE 1 & 2
-- =====================================================
ALTER TABLE workouts ADD COLUMN IF NOT EXISTS category VARCHAR(50);
ALTER TABLE workouts ADD COLUMN IF NOT EXISTS difficulty VARCHAR(20);
ALTER TABLE workouts ADD COLUMN IF NOT EXISTS duration INTEGER;

COMMENT ON COLUMN workouts.category IS 'Categoría: strength, cardio, hybrid, flexibility';
COMMENT ON COLUMN workouts.difficulty IS 'Dificultad: beginner, intermediate, advanced';
COMMENT ON COLUMN workouts.duration IS 'Duración estimada en minutos';

-- =====================================================
-- EXERCISES TABLE - Agregar campos FASE 1 & 2
-- =====================================================
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS name_es VARCHAR(200);
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS category VARCHAR(50);
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS muscle_group VARCHAR(100);
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS difficulty VARCHAR(20);
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS video_url TEXT;

COMMENT ON COLUMN exercises.name_es IS 'Nombre del ejercicio en español';
COMMENT ON COLUMN exercises.category IS 'Categoría: strength, cardio, flexibility, balance';
COMMENT ON COLUMN exercises.muscle_group IS 'Grupo muscular (para UI frontend)';
COMMENT ON COLUMN exercises.difficulty IS 'Dificultad: beginner, intermediate, advanced';
COMMENT ON COLUMN exercises.video_url IS 'URL opcional de video instructivo';

-- =====================================================
-- WORKOUT_EXERCISES TABLE - Agregar campo weight
-- =====================================================
-- Ya existe en schema.sql original, verificar por si acaso
ALTER TABLE workout_exercises ADD COLUMN IF NOT EXISTS weight NUMERIC(5,2);

COMMENT ON COLUMN workout_exercises.weight IS 'Peso sugerido en kg';
