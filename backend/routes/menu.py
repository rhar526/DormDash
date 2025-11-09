from flask import Blueprint, jsonify, request
from models import MenuOption
from app import db

menu_bp = Blueprint('menu', __name__)


@menu_bp.route('/', methods=['GET'])
def get_menu():
    """
    Fetch menu options with optional filters
    
    Query parameters:
    - hall_id (optional): filter by dining hall
    - meal_type (optional): filter by meal type
    
    Returns JSON array of menu items where available_today = true
    """
    try:
        # Start with base query filtering available items
        query = MenuOption.query.filter(MenuOption.available_today == True)
        
        # Get query parameters
        hall_id = request.args.get('hall_id')
        meal_type = request.args.get('meal_type')
        
        # Apply filters if provided
        if hall_id:
            query = query.filter(MenuOption.hall_id == hall_id)
        
        if meal_type:
            query = query.filter(MenuOption.meal_type == meal_type)
        
        # Execute query and convert to dict
        menu_items = query.all()
        result = [item.to_dict() for item in menu_items]
        
        return jsonify(result), 200
    
    except Exception as e:
        return jsonify({'error': f'Failed to fetch menu: {str(e)}'}), 500


@menu_bp.route('/scrape', methods=['POST'])
def scrape_menu():
    """
    Trigger Nutrislice API scrape (admin only)
    
    Calls nutrislice_scraper() function from services/nutrislice.py
    """
    try:
        from services.nutrislice import nutrislice_scraper
        
        # Call the scraper function
        result = nutrislice_scraper()
        
        return jsonify({
            'message': 'Menu scrape initiated successfully',
            'result': result
        }), 200
    
    except ImportError as e:
        return jsonify({'error': f'Scraper function not found: {str(e)}'}), 500
    except Exception as e:
        return jsonify({'error': f'Failed to scrape menu: {str(e)}'}), 500
