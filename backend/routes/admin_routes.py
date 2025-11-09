from flask import Blueprint, request, jsonify
from utils.database import get_db_connection
from psycopg2.extras import RealDictCursor
import subprocess

admin_bp = Blueprint('admin', __name__)

# ----------------------
# DASHERS ENDPOINTS
# ----------------------
@admin_bp.route('/dashers', methods=['GET'])
def get_dashers():
    """Get all dashers"""
    conn = None
    cur = None
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute('SELECT * FROM dashers ORDER BY name')
        dashers = cur.fetchall()
        return jsonify({'dashers': dashers}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()

@admin_bp.route('/dashers', methods=['POST'])
def add_dasher():
    """Add a new dasher"""
    data = request.json
    if not data.get('name') or not data.get('email'):
        return jsonify({'error': 'Name and email required'}), 400

    conn = None
    cur = None
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute('''
            INSERT INTO dashers (name, email, phone, active)
            VALUES (%s, %s, %s, %s)
            RETURNING *
        ''', (data['name'], data['email'], data.get('phone'), True))
        dasher = cur.fetchone()
        conn.commit()
        return jsonify({'dasher': dasher}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()

# ----------------------
# ORDERS ENDPOINT
# ----------------------
@admin_bp.route('/orders', methods=['GET'])
def get_all_orders():
    """Get all orders (admin view)"""
    status = request.args.get('tracking_status')
    conn = None
    cur = None
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        query = 'SELECT * FROM orders'
        params = []
        if status:
            query += ' WHERE tracking_status = %s'
            params.append(status)
        query += ' ORDER BY created_at DESC'
        cur.execute(query, params)
        orders = cur.fetchall()
        return jsonify({'orders': orders}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()

# ----------------------
# SCRAPER ENDPOINT
# ----------------------
@admin_bp.route('/scrape-menu', methods=['POST'])
def trigger_scraper():
    """Trigger menu scraper (runs asynchronously)"""
    try:
        subprocess.Popen(['python', 'scraper/run_scraper.py'])
        return jsonify({'message': 'Menu scraper started'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
