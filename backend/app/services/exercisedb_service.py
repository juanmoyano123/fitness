"""
ExerciseDB Service - Integration with ExerciseDB API
F-012: Integración ExerciseDB API + Cache
"""
import requests
import os
from app import db
from app.models import Exercise
from datetime import datetime


class ExerciseDBService:
    """Service to interact with ExerciseDB API (RapidAPI)"""

    def __init__(self):
        self.api_url = os.getenv('EXERCISEDB_API_URL', 'https://exercisedb.p.rapidapi.com')
        self.api_key = os.getenv('EXERCISEDB_API_KEY', '')
        self.headers = {
            'X-RapidAPI-Key': self.api_key,
            'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
        }

    def _make_request(self, endpoint):
        """Make HTTP request to ExerciseDB API"""
        url = f"{self.api_url}/{endpoint}"
        try:
            response = requests.get(url, headers=self.headers, timeout=30)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            raise Exception(f"Failed to fetch from ExerciseDB API: {str(e)}")

    def fetch_all_exercises(self):
        """
        Fetch all exercises from ExerciseDB API
        Returns list of exercises
        """
        return self._make_request('exercises')

    def fetch_exercise_by_id(self, exercise_id):
        """
        Fetch single exercise by ID from ExerciseDB API
        """
        return self._make_request(f'exercises/exercise/{exercise_id}')

    def fetch_exercises_by_body_part(self, body_part):
        """
        Fetch exercises filtered by body part
        body_part examples: back, chest, legs, shoulders, arms
        """
        return self._make_request(f'exercises/bodyPart/{body_part}')

    def fetch_exercises_by_equipment(self, equipment):
        """
        Fetch exercises filtered by equipment
        equipment examples: barbell, dumbbell, cable, body weight
        """
        return self._make_request(f'exercises/equipment/{equipment}')

    def sync_exercises_to_database(self, limit=None):
        """
        Fetch exercises from API and sync to local database
        Args:
            limit: Optional limit on number of exercises to sync (for testing)
        Returns:
            dict with sync statistics
        """
        try:
            exercises_data = self.fetch_all_exercises()

            if limit:
                exercises_data = exercises_data[:limit]

            synced_count = 0
            updated_count = 0
            error_count = 0

            for ex_data in exercises_data:
                try:
                    # Check if exercise already exists
                    existing = Exercise.query.filter_by(external_id=ex_data['id']).first()

                    if existing:
                        # Update existing exercise
                        existing.name = ex_data.get('name', existing.name)
                        existing.body_part = ex_data.get('bodyPart', existing.body_part)
                        existing.equipment = ex_data.get('equipment', existing.equipment)
                        existing.gif_url = ex_data.get('gifUrl', existing.gif_url)
                        existing.target_muscle = ex_data.get('target', existing.target_muscle)
                        existing.secondary_muscles = ex_data.get('secondaryMuscles', [])
                        existing.instructions = ', '.join(ex_data.get('instructions', []))
                        existing.updated_at = datetime.utcnow()
                        updated_count += 1
                    else:
                        # Create new exercise
                        exercise = Exercise(
                            external_id=ex_data['id'],
                            name=ex_data['name'],
                            body_part=ex_data.get('bodyPart'),
                            equipment=ex_data.get('equipment'),
                            gif_url=ex_data.get('gifUrl'),
                            target_muscle=ex_data.get('target'),
                            secondary_muscles=ex_data.get('secondaryMuscles', []),
                            instructions=', '.join(ex_data.get('instructions', [])) if ex_data.get('instructions') else None,
                            is_custom=False
                        )
                        db.session.add(exercise)
                        synced_count += 1

                    # Commit every 100 exercises to avoid memory issues
                    if (synced_count + updated_count) % 100 == 0:
                        db.session.commit()

                except Exception as e:
                    error_count += 1
                    print(f"Error syncing exercise {ex_data.get('id', 'unknown')}: {str(e)}")

            # Final commit
            db.session.commit()

            return {
                'success': True,
                'synced': synced_count,
                'updated': updated_count,
                'errors': error_count,
                'total': synced_count + updated_count
            }

        except Exception as e:
            db.session.rollback()
            raise Exception(f"Failed to sync exercises: {str(e)}")

    def get_body_parts(self):
        """Get list of available body parts"""
        return self._make_request('exercises/bodyPartList')

    def get_equipment_list(self):
        """Get list of available equipment"""
        return self._make_request('exercises/equipmentList')


# Singleton instance
exercisedb_service = ExerciseDBService()
