-- FitCompass Pro - PostgreSQL Database Schema
-- Created: 2025-11-17
-- Database: fitcompass_dev (development) / fitcompass_prod (production)

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS workout_logs CASCADE;
DROP TABLE IF EXISTS workout_assignments CASCADE;
DROP TABLE IF EXISTS workout_exercises CASCADE;
DROP TABLE IF EXISTS workouts CASCADE;
DROP TABLE IF EXISTS exercises CASCADE;
DROP TABLE IF EXISTS clients CASCADE;
DROP TABLE IF EXISTS trainers CASCADE;

-- =====================================================
-- TRAINERS TABLE
-- =====================================================
CREATE TABLE trainers (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    business_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for trainers
CREATE INDEX idx_trainers_email ON trainers(email);

COMMENT ON TABLE trainers IS 'Entrenadores personales (usuarios principales)';
COMMENT ON COLUMN trainers.email IS 'Email único para login';
COMMENT ON COLUMN trainers.password_hash IS 'Password hasheado con bcrypt';
COMMENT ON COLUMN trainers.business_name IS 'Nombre del negocio/marca del trainer';

-- =====================================================
-- CLIENTS TABLE
-- =====================================================
CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    trainer_id INTEGER NOT NULL REFERENCES trainers(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255),
    name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(trainer_id, email)
);

-- Indexes for clients
CREATE INDEX idx_clients_trainer ON clients(trainer_id);
CREATE INDEX idx_clients_email ON clients(email);

COMMENT ON TABLE clients IS 'Clientes de los entrenadores';
COMMENT ON COLUMN clients.trainer_id IS 'Trainer que gestiona este cliente';
COMMENT ON COLUMN clients.password_hash IS 'Password hasheado (nullable hasta que cliente active cuenta)';
COMMENT ON CONSTRAINT clients_trainer_id_email_key ON clients IS 'Un trainer no puede tener dos clientes con mismo email';

-- =====================================================
-- EXERCISES TABLE
-- =====================================================
CREATE TABLE exercises (
    id SERIAL PRIMARY KEY,
    external_id VARCHAR(100) UNIQUE,
    name VARCHAR(255) NOT NULL,
    body_part VARCHAR(100),
    equipment VARCHAR(100),
    gif_url TEXT,
    target_muscle VARCHAR(100),
    secondary_muscles TEXT[],
    instructions TEXT,
    is_custom BOOLEAN DEFAULT FALSE,
    trainer_id INTEGER REFERENCES trainers(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_custom_trainer CHECK (
        (is_custom = FALSE AND trainer_id IS NULL) OR
        (is_custom = TRUE AND trainer_id IS NOT NULL)
    )
);

-- Indexes for exercises
CREATE INDEX idx_exercises_body_part ON exercises(body_part);
CREATE INDEX idx_exercises_equipment ON exercises(equipment);
CREATE INDEX idx_exercises_trainer ON exercises(trainer_id) WHERE is_custom = TRUE;
CREATE INDEX idx_exercises_name_search ON exercises USING gin(to_tsvector('spanish', name));

COMMENT ON TABLE exercises IS 'Biblioteca de ejercicios (ExerciseDB + custom)';
COMMENT ON COLUMN exercises.external_id IS 'ID de ExerciseDB API (null para custom)';
COMMENT ON COLUMN exercises.is_custom IS 'TRUE si fue creado por trainer, FALSE si viene de ExerciseDB';
COMMENT ON COLUMN exercises.trainer_id IS 'Dueño del ejercicio custom (null para ExerciseDB)';
COMMENT ON COLUMN exercises.secondary_muscles IS 'Array de músculos secundarios trabajados';

-- =====================================================
-- WORKOUTS TABLE
-- =====================================================
CREATE TABLE workouts (
    id SERIAL PRIMARY KEY,
    trainer_id INTEGER NOT NULL REFERENCES trainers(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_template BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for workouts
CREATE INDEX idx_workouts_trainer ON workouts(trainer_id);
CREATE INDEX idx_workouts_template ON workouts(is_template) WHERE is_template = TRUE;

COMMENT ON TABLE workouts IS 'Rutinas de entrenamiento creadas por trainers';
COMMENT ON COLUMN workouts.is_template IS 'TRUE si es template reutilizable, FALSE si es workout específico';

-- =====================================================
-- WORKOUT_EXERCISES TABLE
-- =====================================================
CREATE TABLE workout_exercises (
    id SERIAL PRIMARY KEY,
    workout_id INTEGER NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
    exercise_id INTEGER NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
    order_index INTEGER NOT NULL,
    sets INTEGER DEFAULT 3 CHECK (sets >= 1 AND sets <= 10),
    reps INTEGER DEFAULT 10 CHECK (reps >= 1 AND reps <= 100),
    weight NUMERIC(5,2) CHECK (weight >= 0),
    rest_seconds INTEGER DEFAULT 60 CHECK (rest_seconds >= 0),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(workout_id, order_index)
);

-- Indexes for workout_exercises
CREATE INDEX idx_workout_exercises_workout ON workout_exercises(workout_id);
CREATE INDEX idx_workout_exercises_exercise ON workout_exercises(exercise_id);
CREATE INDEX idx_workout_exercises_order ON workout_exercises(workout_id, order_index);

COMMENT ON TABLE workout_exercises IS 'Ejercicios dentro de cada workout con configuración (sets/reps/peso)';
COMMENT ON COLUMN workout_exercises.order_index IS 'Orden del ejercicio en el workout (0-indexed, para drag & drop)';
COMMENT ON COLUMN workout_exercises.weight IS 'Peso sugerido en kg';
COMMENT ON COLUMN workout_exercises.rest_seconds IS 'Descanso recomendado entre sets en segundos';

-- =====================================================
-- WORKOUT_ASSIGNMENTS TABLE
-- =====================================================
CREATE TABLE workout_assignments (
    id SERIAL PRIMARY KEY,
    workout_id INTEGER NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
    client_id INTEGER NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    assigned_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'skipped')),
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(workout_id, client_id, assigned_date)
);

-- Indexes for workout_assignments
CREATE INDEX idx_assignments_client ON workout_assignments(client_id);
CREATE INDEX idx_assignments_workout ON workout_assignments(workout_id);
CREATE INDEX idx_assignments_date ON workout_assignments(assigned_date);
CREATE INDEX idx_assignments_status ON workout_assignments(status);
CREATE INDEX idx_assignments_client_date ON workout_assignments(client_id, assigned_date);

COMMENT ON TABLE workout_assignments IS 'Asignación de workouts a clientes con fecha';
COMMENT ON COLUMN workout_assignments.status IS 'pending: no iniciado, in_progress: empezado, completed: terminado, skipped: saltado';
COMMENT ON COLUMN workout_assignments.completed_at IS 'Timestamp cuando cliente marcó workout como completado';
COMMENT ON CONSTRAINT workout_assignments_workout_id_client_id_assigned_date_key ON workout_assignments IS 'Un cliente no puede tener mismo workout asignado dos veces en mismo día';

-- =====================================================
-- WORKOUT_LOGS TABLE
-- =====================================================
CREATE TABLE workout_logs (
    id SERIAL PRIMARY KEY,
    assignment_id INTEGER NOT NULL REFERENCES workout_assignments(id) ON DELETE CASCADE,
    workout_exercise_id INTEGER NOT NULL REFERENCES workout_exercises(id) ON DELETE CASCADE,
    set_number INTEGER NOT NULL CHECK (set_number >= 1),
    reps_completed INTEGER NOT NULL CHECK (reps_completed >= 0),
    weight_used NUMERIC(5,2) CHECK (weight_used >= 0),
    rpe SMALLINT CHECK (rpe >= 1 AND rpe <= 10),
    notes TEXT,
    logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(assignment_id, workout_exercise_id, set_number)
);

-- Indexes for workout_logs
CREATE INDEX idx_logs_assignment ON workout_logs(assignment_id);
CREATE INDEX idx_logs_exercise ON workout_logs(workout_exercise_id);
CREATE INDEX idx_logs_logged_at ON workout_logs(logged_at DESC);

COMMENT ON TABLE workout_logs IS 'Registro de ejercicios completados por clientes';
COMMENT ON COLUMN workout_logs.set_number IS 'Número de set (1-based)';
COMMENT ON COLUMN workout_logs.reps_completed IS 'Repeticiones realmente completadas (puede diferir del plan)';
COMMENT ON COLUMN workout_logs.weight_used IS 'Peso usado en kg (puede diferir del sugerido)';
COMMENT ON COLUMN workout_logs.rpe IS 'Rate of Perceived Exertion (1-10)';
COMMENT ON CONSTRAINT workout_logs_assignment_id_workout_exercise_id_set_number_key ON workout_logs IS 'Un set específico de un ejercicio solo se registra una vez';

-- =====================================================
-- SEED DATA (Para desarrollo)
-- =====================================================

-- Demo Trainer
INSERT INTO trainers (email, password_hash, name, business_name) VALUES
('demo@fitcompasspro.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5lGh.zPEoC8vu', 'Demo Trainer', 'FitCompass Demo')
ON CONFLICT (email) DO NOTHING;

-- Demo Clients (asumiendo trainer_id = 1)
INSERT INTO clients (trainer_id, email, name) VALUES
(1, 'laura.gomez@example.com', 'Laura Gómez'),
(1, 'carlos.martinez@example.com', 'Carlos Martínez'),
(1, 'ana.silva@example.com', 'Ana Silva'),
(1, 'juan.rodriguez@example.com', 'Juan Rodríguez'),
(1, 'maria.lopez@example.com', 'María López')
ON CONFLICT (trainer_id, email) DO NOTHING;

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_trainers_updated_at BEFORE UPDATE ON trainers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_exercises_updated_at BEFORE UPDATE ON exercises
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workouts_updated_at BEFORE UPDATE ON workouts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- VIEWS (Para queries comunes)
-- =====================================================

-- View: Client adherence (% workouts completed)
CREATE OR REPLACE VIEW client_adherence AS
SELECT
    c.id AS client_id,
    c.name AS client_name,
    c.trainer_id,
    COUNT(wa.id) AS total_assigned,
    COUNT(CASE WHEN wa.status = 'completed' THEN 1 END) AS total_completed,
    CASE
        WHEN COUNT(wa.id) = 0 THEN 0
        ELSE ROUND((COUNT(CASE WHEN wa.status = 'completed' THEN 1 END)::NUMERIC / COUNT(wa.id)::NUMERIC) * 100, 2)
    END AS adherence_percentage,
    MAX(wa.completed_at) AS last_workout_completed
FROM clients c
LEFT JOIN workout_assignments wa ON wa.client_id = c.id
    AND wa.assigned_date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY c.id, c.name, c.trainer_id;

COMMENT ON VIEW client_adherence IS 'Adherencia de clientes (últimos 30 días)';

-- View: Exercise progress for clients
CREATE OR REPLACE VIEW exercise_progress AS
SELECT
    c.id AS client_id,
    c.name AS client_name,
    e.id AS exercise_id,
    e.name AS exercise_name,
    wl.logged_at::DATE AS workout_date,
    AVG(wl.weight_used) AS avg_weight,
    MAX(wl.weight_used) AS max_weight,
    SUM(wl.reps_completed) AS total_reps
FROM clients c
JOIN workout_assignments wa ON wa.client_id = c.id
JOIN workout_logs wl ON wl.assignment_id = wa.id
JOIN workout_exercises we ON we.id = wl.workout_exercise_id
JOIN exercises e ON e.id = we.exercise_id
GROUP BY c.id, c.name, e.id, e.name, wl.logged_at::DATE
ORDER BY c.id, e.id, workout_date DESC;

COMMENT ON VIEW exercise_progress IS 'Progreso de clientes por ejercicio a lo largo del tiempo';

-- =====================================================
-- GRANTS (Para usuarios de aplicación)
-- =====================================================

-- TODO: Crear usuario de aplicación en producción
-- CREATE USER fitcompass_app WITH PASSWORD 'secure_password';
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO fitcompass_app;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO fitcompass_app;

-- =====================================================
-- ANALYTICS QUERIES (Ejemplos para reference)
-- =====================================================

/*
-- Adherencia global del trainer
SELECT
    t.id AS trainer_id,
    t.name AS trainer_name,
    COUNT(DISTINCT c.id) AS total_clients,
    COUNT(wa.id) AS total_workouts_assigned,
    COUNT(CASE WHEN wa.status = 'completed' THEN 1 END) AS total_workouts_completed,
    ROUND((COUNT(CASE WHEN wa.status = 'completed' THEN 1 END)::NUMERIC / NULLIF(COUNT(wa.id), 0)::NUMERIC) * 100, 2) AS global_adherence
FROM trainers t
LEFT JOIN clients c ON c.trainer_id = t.id
LEFT JOIN workout_assignments wa ON wa.client_id = c.id
    AND wa.assigned_date >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY t.id, t.name;

-- Clientes en riesgo (adherencia < 40%)
SELECT * FROM client_adherence
WHERE adherence_percentage < 40
ORDER BY adherence_percentage ASC;

-- Workouts completados por día (últimos 7 días)
SELECT
    DATE(completed_at) AS date,
    COUNT(*) AS workouts_completed
FROM workout_assignments
WHERE status = 'completed'
    AND completed_at >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY DATE(completed_at)
ORDER BY date;

-- Progreso en ejercicio específico para un cliente
SELECT
    wl.logged_at::DATE AS date,
    wl.set_number,
    wl.reps_completed,
    wl.weight_used
FROM workout_logs wl
JOIN workout_exercises we ON we.id = wl.workout_exercise_id
JOIN workout_assignments wa ON wa.id = wl.assignment_id
WHERE wa.client_id = 1
    AND we.exercise_id = 10
ORDER BY wl.logged_at DESC;
*/

-- =====================================================
-- SCHEMA VERSION
-- =====================================================
CREATE TABLE IF NOT EXISTS schema_version (
    version INTEGER PRIMARY KEY,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    description TEXT
);

INSERT INTO schema_version (version, description) VALUES
(1, 'Initial schema with trainers, clients, exercises, workouts, assignments, logs')
ON CONFLICT (version) DO NOTHING;

-- =====================================================
-- END OF SCHEMA
-- =====================================================
