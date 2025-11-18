"""
ExerciseDB API Integration - F-012
"""
import requests
import os
from typing import List, Dict, Optional


class ExerciseDBService:
    """Service for fetching exercises from ExerciseDB API"""

    BASE_URL = "https://exercisedb.p.rapidapi.com"

    def __init__(self):
        self.api_key = os.getenv('EXERCISEDB_API_KEY', '')
        self.headers = {
            'X-RapidAPI-Key': self.api_key,
            'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
        }

    def get_exercises(self, limit: int = 50, offset: int = 0) -> List[Dict]:
        """Fetch exercises with pagination"""
        try:
            url = f"{self.BASE_URL}/exercises"
            params = {'limit': limit, 'offset': offset}

            response = requests.get(url, headers=self.headers, params=params, timeout=10)
            response.raise_for_status()

            exercises = response.json()
            return self._format_exercises(exercises)
        except Exception as e:
            print(f"Error fetching exercises: {e}")
            return []

    def search_exercises(self, query: str, limit: int = 20) -> List[Dict]:
        """Search exercises by name"""
        try:
            url = f"{self.BASE_URL}/exercises/name/{query}"
            params = {'limit': limit}

            response = requests.get(url, headers=self.headers, params=params, timeout=10)

            if response.status_code == 404:
                return []

            response.raise_for_status()
            exercises = response.json()
            return self._format_exercises(exercises)
        except Exception as e:
            print(f"Error searching exercises: {e}")
            return []

    def get_by_body_part(self, body_part: str, limit: int = 50) -> List[Dict]:
        """Get exercises by body part"""
        try:
            url = f"{self.BASE_URL}/exercises/bodyPart/{body_part}"
            params = {'limit': limit}

            response = requests.get(url, headers=self.headers, params=params, timeout=10)
            response.raise_for_status()

            exercises = response.json()
            return self._format_exercises(exercises)
        except Exception as e:
            print(f"Error fetching exercises by body part: {e}")
            return []

    def get_by_target(self, target: str, limit: int = 50) -> List[Dict]:
        """Get exercises by target muscle"""
        try:
            url = f"{self.BASE_URL}/exercises/target/{target}"
            params = {'limit': limit}

            response = requests.get(url, headers=self.headers, params=params, timeout=10)
            response.raise_for_status()

            exercises = response.json()
            return self._format_exercises(exercises)
        except Exception as e:
            print(f"Error fetching exercises by target: {e}")
            return []

    def get_by_equipment(self, equipment: str, limit: int = 50) -> List[Dict]:
        """Get exercises by equipment"""
        try:
            url = f"{self.BASE_URL}/exercises/equipment/{equipment}"
            params = {'limit': limit}

            response = requests.get(url, headers=self.headers, params=params, timeout=10)
            response.raise_for_status()

            exercises = response.json()
            return self._format_exercises(exercises)
        except Exception as e:
            print(f"Error fetching exercises by equipment: {e}")
            return []

    def get_body_parts(self) -> List[str]:
        """Get list of available body parts"""
        try:
            url = f"{self.BASE_URL}/exercises/bodyPartList"
            response = requests.get(url, headers=self.headers, timeout=10)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            print(f"Error fetching body parts: {e}")
            return []

    def get_target_muscles(self) -> List[str]:
        """Get list of available target muscles"""
        try:
            url = f"{self.BASE_URL}/exercises/targetList"
            response = requests.get(url, headers=self.headers, timeout=10)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            print(f"Error fetching target muscles: {e}")
            return []

    def get_equipment_list(self) -> List[str]:
        """Get list of available equipment"""
        try:
            url = f"{self.BASE_URL}/exercises/equipmentList"
            response = requests.get(url, headers=self.headers, timeout=10)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            print(f"Error fetching equipment list: {e}")
            return []

    def _format_exercises(self, exercises: List[Dict]) -> List[Dict]:
        """Format exercises to match our schema"""
        formatted = []
        for ex in exercises:
            formatted.append({
                'id': f"exercisedb-{ex['id']}",
                'externalId': ex['id'],
                'name': ex['name'].title(),
                'bodyPart': ex.get('bodyPart', ''),
                'equipment': ex.get('equipment', ''),
                'target': ex.get('target', ''),
                'gifUrl': ex.get('gifUrl', ''),
                'instructions': ex.get('instructions', []),
                'isCustom': False
            })
        return formatted


# Singleton instance
exercise_db_service = ExerciseDBService()
