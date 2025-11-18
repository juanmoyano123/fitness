"""
Seed data script for FitCompass Pro
Creates demo trainer, clients, workouts, and assignments
"""
from app import create_app, db
from app.models import Trainer, Client, Exercise, Workout, WorkoutExercise, WorkoutAssignment
from datetime import datetime, timedelta, date
import uuid

app = create_app()

def clear_data():
    """Clear all data from database"""
    with app.app_context():
        print("🗑️  Clearing existing data...")
        WorkoutAssignment.query.delete()
        WorkoutExercise.query.delete()
        Workout.query.delete()
        Exercise.query.delete()
        Client.query.delete()
        Trainer.query.delete()
        db.session.commit()
        print("✅ Data cleared")

def seed_trainer():
    """Create demo trainer"""
    with app.app_context():
        print("👤 Creating demo trainer...")
        trainer = Trainer(
            id='trainer-demo-1',
            email='trainer@fitcompass.com',
            name='Juan Rodríguez'
        )
        trainer.set_password('demo123')

        db.session.add(trainer)
        db.session.commit()
        print(f"✅ Created trainer: {trainer.name}")
        return trainer.id

def seed_clients(trainer_id):
    """Create demo clients"""
    with app.app_context():
        print("👥 Creating demo clients...")

        clients_data = [
            {
                'id': 'client-1',
                'name': 'Laura Gómez',
                'email': 'laura@example.com',
                'gender': 'female',
                'age': 28,
                'goals': 'Perder 5kg y ganar resistencia cardiovascular'
            },
            {
                'id': 'client-2',
                'name': 'Juan Pérez',
                'email': 'juan@example.com',
                'gender': 'male',
                'age': 35,
                'goals': 'Ganar masa muscular en tren superior'
            },
            {
                'id': 'client-3',
                'name': 'María López',
                'email': 'maria@example.com',
                'gender': 'female',
                'age': 42,
                'goals': 'Mejorar flexibilidad y fuerza core'
            }
        ]

        client_ids = []
        for data in clients_data:
            client = Client(
                id=data['id'],
                trainer_id=trainer_id,
                name=data['name'],
                email=data['email'],
                gender=data['gender'],
                age=data['age'],
                goals=data['goals'],
                status='active'
            )
            db.session.add(client)
            client_ids.append(client.id)
            print(f"  ✓ {client.name}")

        db.session.commit()
        print(f"✅ Created {len(client_ids)} clients")
        return client_ids

def seed_exercises(trainer_id):
    """Create demo custom exercises"""
    with app.app_context():
        print("💪 Creating demo exercises...")

        exercises_data = [
            {
                'id': 'exercise-1',
                'name': 'Push-ups',
                'body_part': 'chest',
                'equipment': 'body weight',
                'target': 'pectorals',
                'gif_url': 'https://example.com/pushup.gif'
            },
            {
                'id': 'exercise-2',
                'name': 'Squats',
                'body_part': 'legs',
                'equipment': 'body weight',
                'target': 'quadriceps',
                'gif_url': 'https://example.com/squat.gif'
            },
            {
                'id': 'exercise-3',
                'name': 'Plank',
                'body_part': 'core',
                'equipment': 'body weight',
                'target': 'abs',
                'gif_url': 'https://example.com/plank.gif'
            }
        ]

        exercise_ids = []
        for data in exercises_data:
            exercise = Exercise(
                id=data['id'],
                name=data['name'],
                body_part=data['body_part'],
                equipment=data['equipment'],
                target=data['target'],
                gif_url=data['gif_url'],
                is_custom=True,
                trainer_id=trainer_id
            )
            db.session.add(exercise)
            exercise_ids.append(exercise.id)
            print(f"  ✓ {exercise.name}")

        db.session.commit()
        print(f"✅ Created {len(exercise_ids)} exercises")
        return exercise_ids

def seed_workouts(trainer_id, exercise_ids):
    """Create demo workouts"""
    with app.app_context():
        print("🏋️  Creating demo workouts...")

        # Workout 1: Full Body Beginner
        workout1 = Workout(
            id='workout-1',
            trainer_id=trainer_id,
            name='Full Body Beginner',
            description='Rutina completa para principiantes',
            category='Fuerza',
            difficulty='beginner',
            duration_minutes=45
        )
        db.session.add(workout1)

        # Add exercises to workout 1
        we1_1 = WorkoutExercise(
            id='we-1-1',
            workout_id=workout1.id,
            exercise_id=exercise_ids[0],
            order_index=0,
            sets=3,
            reps='10-12',
            rest_seconds=60
        )
        we1_2 = WorkoutExercise(
            id='we-1-2',
            workout_id=workout1.id,
            exercise_id=exercise_ids[1],
            order_index=1,
            sets=3,
            reps='15',
            rest_seconds=60
        )
        we1_3 = WorkoutExercise(
            id='we-1-3',
            workout_id=workout1.id,
            exercise_id=exercise_ids[2],
            order_index=2,
            sets=3,
            reps='30-45 seg',
            rest_seconds=45
        )
        db.session.add_all([we1_1, we1_2, we1_3])

        # Workout 2: Upper Body Focus
        workout2 = Workout(
            id='workout-2',
            trainer_id=trainer_id,
            name='Upper Body Focus',
            description='Enfoque en tren superior',
            category='Fuerza',
            difficulty='intermediate',
            duration_minutes=60
        )
        db.session.add(workout2)

        # Add exercises to workout 2
        we2_1 = WorkoutExercise(
            id='we-2-1',
            workout_id=workout2.id,
            exercise_id=exercise_ids[0],
            order_index=0,
            sets=4,
            reps='8-10',
            rest_seconds=90
        )
        we2_2 = WorkoutExercise(
            id='we-2-2',
            workout_id=workout2.id,
            exercise_id=exercise_ids[2],
            order_index=1,
            sets=3,
            reps='60 seg',
            rest_seconds=60
        )
        db.session.add_all([we2_1, we2_2])

        db.session.commit()
        print("  ✓ Full Body Beginner (3 exercises)")
        print("  ✓ Upper Body Focus (2 exercises)")
        print("✅ Created 2 workouts")

        return [workout1.id, workout2.id]

def seed_assignments(client_ids, workout_ids):
    """Create demo workout assignments"""
    with app.app_context():
        print("📅 Creating demo assignments...")

        today = date.today()

        assignments = [
            # Client 1 - Laura
            WorkoutAssignment(
                id='assignment-1',
                workout_id=workout_ids[0],
                client_id=client_ids[0],
                scheduled_date=today,
                status='pending'
            ),
            WorkoutAssignment(
                id='assignment-2',
                workout_id=workout_ids[1],
                client_id=client_ids[0],
                scheduled_date=today + timedelta(days=2),
                status='pending'
            ),
            # Client 2 - Juan (completed some)
            WorkoutAssignment(
                id='assignment-3',
                workout_id=workout_ids[0],
                client_id=client_ids[1],
                scheduled_date=today - timedelta(days=2),
                status='completed',
                started_at=datetime.utcnow() - timedelta(days=2, hours=2),
                completed_at=datetime.utcnow() - timedelta(days=2, hours=1),
                duration_minutes=42
            ),
            WorkoutAssignment(
                id='assignment-4',
                workout_id=workout_ids[1],
                client_id=client_ids[1],
                scheduled_date=today,
                status='in_progress',
                started_at=datetime.utcnow() - timedelta(minutes=15)
            ),
            # Client 3 - María
            WorkoutAssignment(
                id='assignment-5',
                workout_id=workout_ids[0],
                client_id=client_ids[2],
                scheduled_date=today + timedelta(days=1),
                status='pending'
            )
        ]

        for assignment in assignments:
            db.session.add(assignment)
            print(f"  ✓ {assignment.status} workout for client {assignment.client_id}")

        db.session.commit()
        print(f"✅ Created {len(assignments)} assignments")

def run_seed():
    """Run all seed functions"""
    print("\n" + "="*50)
    print("🌱 SEEDING DATABASE FOR FITCOMPASS PRO")
    print("="*50 + "\n")

    clear_data()

    trainer_id = seed_trainer()
    client_ids = seed_clients(trainer_id)
    exercise_ids = seed_exercises(trainer_id)
    workout_ids = seed_workouts(trainer_id, exercise_ids)
    seed_assignments(client_ids, workout_ids)

    print("\n" + "="*50)
    print("✅ SEEDING COMPLETED SUCCESSFULLY!")
    print("="*50)
    print("\nDemo credentials:")
    print("  Email: trainer@fitcompass.com")
    print("  Password: demo123")
    print(f"\n  Trainer ID: {trainer_id}")
    print(f"  Clients: {len(client_ids)}")
    print(f"  Workouts: {len(workout_ids)}")
    print("\n")

if __name__ == '__main__':
    run_seed()
