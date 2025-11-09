import os
import requests
from typing import Dict, List, Optional
from app import db
from models import MenuOption


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


def nutrislice_scraper():
    """
    Scrape menu data from Nutrislice API and save to database
    
    Returns:
        Dictionary with scrape results including count of items added
    """
    try:
        service = NutrisliceService()
        
        # List of dining hall IDs (update with actual UMass dining hall IDs)
        dining_halls = ['worcester', 'berkshire', 'hampshire', 'franklin']  # Example hall IDs
        
        meal_types = ['breakfast', 'lunch', 'dinner']
        
        total_added = 0
        
        for hall_id in dining_halls:
            for meal_type in meal_types:
                try:
                    # Fetch menu data from Nutrislice
                    menu_data = service.get_daily_menu(hall_id)
                    
                    # Process and save menu items
                    # Note: This is a placeholder - adjust based on actual Nutrislice API response structure
                    if menu_data and 'items' in menu_data:
                        for item_data in menu_data['items']:
                            # Check if item already exists
                            existing = MenuOption.query.filter_by(
                                hall_id=hall_id,
                                meal_type=meal_type,
                                name=item_data.get('name', '')
                            ).first()
                            
                            if not existing:
                                menu_option = MenuOption(
                                    hall_id=hall_id,
                                    meal_type=meal_type,
                                    name=item_data.get('name', ''),
                                    nutrition=item_data.get('nutrition', {}),
                                    allergens=item_data.get('allergens', []),
                                    tags=item_data.get('tags', []),
                                    available_today=True
                                )
                                db.session.add(menu_option)
                                total_added += 1
                            else:
                                # Update existing item
                                existing.nutrition = item_data.get('nutrition', existing.nutrition)
                                existing.allergens = item_data.get('allergens', existing.allergens)
                                existing.tags = item_data.get('tags', existing.tags)
                                existing.available_today = True
                
                except Exception as e:
                    print(f"Error processing {hall_id} - {meal_type}: {e}")
                    continue
        
        # Commit all changes
        db.session.commit()
        
        return {
            'success': True,
            'items_added': total_added,
            'message': f'Successfully scraped and added {total_added} menu items'
        }
    
    except Exception as e:
        db.session.rollback()
        print(f"Error in nutrislice_scraper: {e}")
        return {
            'success': False,
            'error': str(e),
            'message': 'Failed to scrape menu data'
        }

