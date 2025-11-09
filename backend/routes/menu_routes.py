from flask import Blueprint, request, jsonify
from utils.database import get_db_connection
import psycopg2.extras

menu_bp = Blueprint('menu', __name__)

@menu_bp.route('/menu', methods=['GET'])
def get_menu():
    """Get all menu items, optionally filtered by location"""
    location = request.args.get('location')
    
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        
        query = 'SELECT * FROM menu_items WHERE available = true'
        params = []
        
        if location:
            query += ' AND location = %s'
            params.append(location)
        
        query += ' ORDER BY category, item_name'
        
        cur.execute(query, params)
        menu_items = cur.fetchall()
        
        cur.close()
        conn.close()
        
        return jsonify({'menu_items': menu_items}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@menu_bp.route('/locations', methods=['GET'])
def get_locations():
    """Get all unique dining hall locations"""
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        
        cur.execute('SELECT DISTINCT location FROM menu_items ORDER BY location')
        locations = cur.fetchall()
        
        cur.close()
        conn.close()
        
        return jsonify({'locations': [loc['location'] for loc in locations]}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@menu_bp.route('/categories', methods=['GET'])
def get_categories():
    """Get all unique menu categories, optionally filtered by location"""
    location = request.args.get('location')
    
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        
        query = 'SELECT DISTINCT category FROM menu_items'
        params = []
        
        if location:
            query += ' WHERE location = %s'
            params.append(location)
        
        query += ' ORDER BY category'
        
        cur.execute(query, params)
        categories = cur.fetchall()
        
        cur.close()
        conn.close()
        
        return jsonify({'categories': [cat['category'] for cat in categories]}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
