"""
Seed script for FitCompass Pro database
Populates database with demo data for development
"""
from app import create_app, db
from app.models import Trainer, Client, Workout, Exercise, WorkoutExercise
from datetime import datetime, date
import bcrypt


def hash_password(password: str) -> str:
    """Hash password using bcrypt"""
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')


def seed_database():
    """Seed database with demo data"""
    app = create_app()

    with app.app_context():
        print("🌱 Starting database seed...")

        # Clear existing data (optional - be careful in production!)
        print("Clearing existing data...")
        db.session.query(WorkoutExercise).delete()
        db.session.query(Workout).delete()
        db.session.query(Exercise).delete()
        db.session.query(Client).delete()
        db.session.query(Trainer).delete()
        db.session.commit()

        # Create demo trainer
        print("Creating demo trainer...")
        demo_trainer = Trainer(
            email='demo@fitcompasspro.com',
            password_hash=hash_password('demo123'),  # Password: demo123
            name='Demo Trainer',
            business_name='FitCompass Demo'
        )
        db.session.add(demo_trainer)
        db.session.commit()
        print(f"✓ Created trainer: {demo_trainer.email}")

        # Create demo clients
        print("Creating demo clients...")
        clients_data = [
            {'email': 'laura.gomez@example.com', 'name': 'Laura Gómez'},
            {'email': 'carlos.martinez@example.com', 'name': 'Carlos Martínez'},
            {'email': 'ana.silva@example.com', 'name': 'Ana Silva'},
            {'email': 'juan.rodriguez@example.com', 'name': 'Juan Rodríguez'},
            {'email': 'maria.lopez@example.com', 'name': 'María López'}
        ]

        clients = []
        for client_data in clients_data:
            client = Client(
                trainer_id=demo_trainer.id,
                email=client_data['email'],
                name=client_data['name']
            )
            db.session.add(client)
            clients.append(client)

        db.session.commit()
        print(f"✓ Created {len(clients)} clients")

        # Create demo exercises
        print("Creating demo exercises...")
        exercises_data = [
            {
                'name': 'Barbell Squat',
                'body_part': 'legs',
                'equipment': 'barbell',
                'target_muscle': 'quadriceps',
                'gif_url': 'https://example.com/squat.gif'
            },
            {
                'name': 'Bench Press',
                'body_part': 'chest',
                'equipment': 'barbell',
                'target_muscle': 'pectorals',
                'gif_url': 'https://example.com/benchpress.gif'
            },
            {
                'name': 'Deadlift',
                'body_part': 'back',
                'equipment': 'barbell',
                'target_muscle': 'lower back',
                'gif_url': 'https://example.com/deadlift.gif'
            },
            {
                'name': 'Pull-ups',
                'body_part': 'back',
                'equipment': 'body weight',
                'target_muscle': 'lats',
                'gif_url': 'https://example.com/pullups.gif'
            },
            {
                'name': 'Dumbbell Curl',
                'body_part': 'arms',
                'equipment': 'dumbbell',
                'target_muscle': 'biceps',
                'gif_url': 'https://example.com/curl.gif'
            },
            {
                'name': 'Shoulder Press',
                'body_part': 'shoulders',
                'equipment': 'dumbbell',
                'target_muscle': 'deltoids',
                'gif_url': 'https://example.com/shoulderpress.gif'
            },
            {
                'name': 'Leg Press',
                'body_part': 'legs',
                'equipment': 'machine',
                'target_muscle': 'quadriceps',
                'gif_url': 'https://example.com/legpress.gif'
            },
            {
                'name': 'Tricep Dips',
                'body_part': 'arms',
                'equipment': 'body weight',
                'target_muscle': 'triceps',
                'gif_url': 'https://example.com/dips.gif'
            },
            {
                'name': 'Romanian Deadlift',
                'body_part': 'legs',
                'equipment': 'barbell',
                'target_muscle': 'hamstrings',
                'gif_url': 'https://example.com/rdl.gif'
            },
            {
                'name': 'Cable Row',
                'body_part': 'back',
                'equipment': 'cable',
                'target_muscle': 'lats',
                'gif_url': 'https://example.com/cablerow.gif'
            }
        ]

        exercises = []
        for i, ex_data in enumerate(exercises_data):
            exercise = Exercise(
                external_id=f'ex-{i+1}',
                name=ex_data['name'],
                body_part=ex_data['body_part'],
                equipment=ex_data['equipment'],
                target_muscle=ex_data['target_muscle'],
                gif_url=ex_data['gif_url'],
                is_custom=False
            )
            db.session.add(exercise)
            exercises.append(exercise)

        db.session.commit()
        print(f"✓ Created {len(exercises)} exercises")

        # Create demo workouts
        print("Creating demo workouts...")

        # Workout 1: Full Body
        workout1 = Workout(
            trainer_id=demo_trainer.id,
            name='Full Body Strength',
            description='Complete full body workout for beginners',
            is_template=True
        )
        db.session.add(workout1)
        db.session.commit()

        # Add exercises to workout 1
        workout1_exercises = [
            {'exercise': exercises[0], 'order': 0, 'sets': 3, 'reps': 10, 'weight': 60, 'rest': 90},  # Squat
            {'exercise': exercises[1], 'order': 1, 'sets': 3, 'reps': 8, 'weight': 70, 'rest': 90},   # Bench Press
            {'exercise': exercises[2], 'order': 2, 'sets': 3, 'reps': 5, 'weight': 100, 'rest': 120}, # Deadlift
            {'exercise': exercises[3], 'order': 3, 'sets': 3, 'reps': 8, 'weight': 0, 'rest': 60},    # Pull-ups
        ]

        for we_data in workout1_exercises:
            we = WorkoutExercise(
                workout_id=workout1.id,
                exercise_id=we_data['exercise'].id,
                order_index=we_data['order'],
                sets=we_data['sets'],
                reps=we_data['reps'],
                weight=we_data['weight'],
                rest_seconds=we_data['rest']
            )
            db.session.add(we)

        # Workout 2: Upper Body
        workout2 = Workout(
            trainer_id=demo_trainer.id,
            name='Upper Body Hypertrophy',
            description='Focused upper body muscle building',
            is_template=True
        )
        db.session.add(workout2)
        db.session.commit()

        workout2_exercises = [
            {'exercise': exercises[1], 'order': 0, 'sets': 4, 'reps': 10, 'weight': 60, 'rest': 90},  # Bench Press
            {'exercise': exercises[9], 'order': 1, 'sets': 4, 'reps': 12, 'weight': 50, 'rest': 60},  # Cable Row
            {'exercise': exercises[5], 'order': 2, 'sets': 3, 'reps': 12, 'weight': 20, 'rest': 60},  # Shoulder Press
            {'exercise': exercises[4], 'order': 3, 'sets': 3, 'reps': 12, 'weight': 15, 'rest': 60},  # Dumbbell Curl
            {'exercise': exercises[7], 'order': 4, 'sets': 3, 'reps': 10, 'weight': 0, 'rest': 60},   # Tricep Dips
        ]

        for we_data in workout2_exercises:
            we = WorkoutExercise(
                workout_id=workout2.id,
                exercise_id=we_data['exercise'].id,
                order_index=we_data['order'],
                sets=we_data['sets'],
                reps=we_data['reps'],
                weight=we_data['weight'],
                rest_seconds=we_data['rest']
            )
            db.session.add(we)

        # Workout 3: Lower Body
        workout3 = Workout(
            trainer_id=demo_trainer.id,
            name='Lower Body Power',
            description='Leg day for strength and power',
            is_template=True
        )
        db.session.add(workout3)
        db.session.commit()

        workout3_exercises = [
            {'exercise': exercises[0], 'order': 0, 'sets': 5, 'reps': 5, 'weight': 100, 'rest': 180}, # Squat
            {'exercise': exercises[8], 'order': 1, 'sets': 4, 'reps': 8, 'weight': 80, 'rest': 120},  # Romanian DL
            {'exercise': exercises[6], 'order': 2, 'sets': 4, 'reps': 12, 'weight': 150, 'rest': 90}, # Leg Press
        ]

        for we_data in workout3_exercises:
            we = WorkoutExercise(
                workout_id=workout3.id,
                exercise_id=we_data['exercise'].id,
                order_index=we_data['order'],
                sets=we_data['sets'],
                reps=we_data['reps'],
                weight=we_data['weight'],
                rest_seconds=we_data['rest']
            )
            db.session.add(we)

        db.session.commit()
        print(f"✓ Created 3 workouts with exercises")

        print("\n✅ Database seeding completed successfully!")
        print(f"\n📊 Summary:")
        print(f"   - Trainers: {Trainer.query.count()}")
        print(f"   - Clients: {Client.query.count()}")
        print(f"   - Exercises: {Exercise.query.count()}")
        print(f"   - Workouts: {Workout.query.count()}")
        print(f"   - Workout Exercises: {WorkoutExercise.query.count()}")
        print(f"\n🔐 Demo Login:")
        print(f"   Email: demo@fitcompasspro.com")
        print(f"   Password: demo123")


if __name__ == '__main__':
    seed_database()
