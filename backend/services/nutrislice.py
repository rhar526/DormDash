import os
import requests
from typing import Dict, List, Optional

class NutrisliceService:
    """Service for interacting with Nutrislice API"""
    
    def __init__(self, base_url: Optional[str] = None):
        self.base_url = base_url or os.environ.get('NUTRISLICE_BASE_URL', 'https://api.nutrislice.com')
    
    def get_menu(self, location_id: str) -> List[Dict]:
        """
        Fetch menu data from Nutrislice API
        
        Args:
            location_id: The location ID for the dining hall
            
        Returns:
            List of menu items
        """
        try:
            url = f"{self.base_url}/locations/{location_id}/menus"
            response = requests.get(url)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Error fetching menu from Nutrislice: {e}")
            return []
    
    def get_daily_menu(self, location_id: str, date: Optional[str] = None) -> Dict:
        """
        Fetch daily menu for a specific date
        
        Args:
            location_id: The location ID for the dining hall
            date: Date in YYYY-MM-DD format (defaults to today)
            
        Returns:
            Dictionary containing daily menu data
        """
        try:
            url = f"{self.base_url}/locations/{location_id}/menus/daily"
            params = {}
            if date:
                params['date'] = date
            
            response = requests.get(url, params=params)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Error fetching daily menu from Nutrislice: {e}")
            return {}

