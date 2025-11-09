from flask import Blueprint, request, jsonify
from utils.database import get_db_connection

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/dashers', methods=['GET'])
def get_dashers():
    """Get all dashers"""
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        cur.execute('SELECT * FROM dashers ORDER BY name')
        dashers = cur.fetchall()
        cur.close()
        conn.close()
        
        return jsonify({'dashers': [dict(dasher) for dasher in dashers]}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/dashers', methods=['POST'])
def add_dasher():
    """Add a new dasher"""
    data = request.json
    
    if not data.get('name') or not data.get('email'):
        return jsonify({'error': 'Name and email required'}), 400
    
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        cur.execute('''
            INSERT INTO dashers (name, email, phone, active)
            VALUES (%s, %s, %s, %s)
            RETURNING *
        ''', (data['name'], data['email'], data.get('phone'), True))
        
        dasher = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()
        
        return jsonify({'dasher': dict(dasher)}), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/orders', methods=['GET'])
def get_all_orders():
    """Get all orders (admin view)"""
    status = request.args.get('status')
    
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        query = 'SELECT * FROM orders'
        params = []
        
        if status:
            query += ' WHERE status = %s'
            params.append(status)
        
        query += ' ORDER BY created_at DESC'
        
        cur.execute(query, params)
        orders = cur.fetchall()
        cur.close()
        conn.close()
        
        return jsonify({'orders': [dict(order) for order in orders]}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/scrape-menu', methods=['POST'])
def trigger_scraper():
    """Trigger menu scraper (runs asynchronously)"""
    try:
        import subprocess
        subprocess.Popen(['python', 'scraper/run_scraper.py'])
        return jsonify({'message': 'Menu scraper started'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
