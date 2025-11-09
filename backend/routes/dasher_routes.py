from flask import Blueprint, request, jsonify
from datetime import datetime
from utils.database import get_db_connection
from utils.email import send_email
from config import FRONTEND_URL

dasher_bp = Blueprint('dasher', __name__)

@dasher_bp.route('/verify/<token>', methods=['GET'])
def verify_dasher_token(token):
    """Verify dasher token and return order details"""
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Check if token is valid and not expired
        cur.execute('''
            SELECT dt.order_id, dt.dasher_email, dt.used_at,
                   o.order_number, o.customer_name, o.customer_phone, o.customer_email,
                   o.delivery_address, o.pickup_location, o.total_amount, 
                   o.special_instructions, o.status, o.created_at
            FROM dasher_tokens dt
            JOIN orders o ON dt.order_id = o.id
            WHERE dt.token = %s AND dt.expires_at > CURRENT_TIMESTAMP
        ''', (token,))
        
        result = cur.fetchone()
        
        if not result:
            cur.close()
            conn.close()
            return jsonify({'error': 'Invalid or expired token'}), 404
        
        # Get order items
        cur.execute('''
            SELECT item_name as name, category, quantity, price, special_instructions
            FROM order_items
            WHERE order_id = %s
        ''', (result['order_id'],))
        
        items = cur.fetchall()
        
        cur.close()
        conn.close()
        
        order_data = dict(result)
        order_data['items'] = [dict(item) for item in items]
        
        return jsonify(order_data), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@dasher_bp.route('/accept/<token>', methods=['POST'])
def accept_order_with_token(token):
    """Dasher accepts an order using the token"""
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Verify token and get order info
        cur.execute('''
            SELECT dt.order_id, dt.dasher_email, dt.used_at,
                   o.order_number, o.customer_email, o.customer_name, 
                   o.delivery_address, o.pickup_location, o.status
            FROM dasher_tokens dt
            JOIN orders o ON dt.order_id = o.id
            WHERE dt.token = %s AND dt.expires_at > CURRENT_TIMESTAMP
        ''', (token,))
        
        result = cur.fetchone()
        
        if not result:
            cur.close()
            conn.close()
            return jsonify({'error': 'Invalid or expired token'}), 404
        
        # Check if already accepted
        if result['status'] != 'pending':
            cur.close()
            conn.close()
            return jsonify({'error': 'Order already accepted by another dasher'}), 400
        
        # Get dasher info
        cur.execute('SELECT name, phone FROM dashers WHERE email = %s', (result['dasher_email'],))
        dasher = cur.fetchone()
        
        if not dasher:
            cur.close()
            conn.close()
            return jsonify({'error': 'Dasher not found'}), 404
        
        # Accept the order
        cur.execute('''
            UPDATE orders 
            SET status = %s, dasher_email = %s, dasher_name = %s, 
                dasher_phone = %s, accepted_at = CURRENT_TIMESTAMP
            WHERE id = %s AND status = %s
        ''', ('confirmed', result['dasher_email'], dasher['name'], 
              dasher['phone'], result['order_id'], 'pending'))
        
        if cur.rowcount == 0:
            cur.close()
            conn.close()
            return jsonify({'error': 'Order already accepted'}), 400
        
        # Mark token as used
        cur.execute('''
            UPDATE dasher_tokens SET used_at = CURRENT_TIMESTAMP WHERE token = %s
        ''', (token,))
        
        conn.commit()
        
        # Notify customer
        customer_email_body = f"""
        <html>
        <body>
            <h2>Dasher Assigned!</h2>
            <p>Hi {result['customer_name']},</p>
            <p>Great news! Your order {result['order_number']} has been accepted by a dasher.</p>
            <p><strong>Dasher:</strong> {dasher['name']}</p>
            <p><strong>Dasher Phone:</strong> {dasher['phone']}</p>
            <p>Your order will be picked up from {result['pickup_location']} and delivered to {result['delivery_address']}.</p>
            <p>Track your order: <a href="{FRONTEND_URL}/order/{result['order_number']}">View Order Status</a></p>
        </body>
        </html>
        """
        send_email(result['customer_email'], f'Dasher Assigned - {result["order_number"]}', customer_email_body)
        
        cur.close()
        conn.close()
        
        return jsonify({'message': 'Order accepted successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@dasher_bp.route('/update-status/<token>', methods=['PATCH'])
def update_order_status_with_token(token):
    """Update order status using dasher token"""
    data = request.json
    
    if not data.get('status'):
        return jsonify({'error': 'Status required'}), 400
    
    valid_statuses = ['confirmed', 'picked_up', 'delivered']
    if data['status'] not in valid_statuses:
        return jsonify({'error': 'Invalid status'}), 400
    
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Verify token and order ownership
        cur.execute('''
            SELECT dt.order_id, o.order_number, o.customer_email, o.customer_name, o.status
            FROM dasher_tokens dt
            JOIN orders o ON dt.order_id = o.id
            WHERE dt.token = %s AND dt.used_at IS NOT NULL
        ''', (token,))
        
        result = cur.fetchone()
        
        if not result:
            cur.close()
            conn.close()
            return jsonify({'error': 'Invalid token or order not accepted'}), 404
        
        # Update status
        cur.execute('''
            UPDATE orders 
            SET status = %s, updated_at = CURRENT_TIMESTAMP
            WHERE id = %s
        ''', (data['status'], result['order_id']))
        
        conn.commit()
        
        # Send status update email to customer
        status_messages = {
            'confirmed': 'Your order has been confirmed by the dasher',
            'picked_up': 'Your order has been picked up and is on the way',
            'delivered': 'Your order has been delivered!'
        }
        
        customer_email_body = f"""
        <html>
        <body>
            <h2>Order Update</h2>
            <p>Hi {result['customer_name']},</p>
            <p><strong>Order:</strong> {result['order_number']}</p>
            <p><strong>Status:</strong> {status_messages.get(data['status'])}</p>
            <p>Track your order: <a href="{FRONTEND_URL}/order/{result['order_number']}">View Order Status</a></p>
        </body>
        </html>
        """
        send_email(result['customer_email'], f'Order Update - {result["order_number"]}', customer_email_body)
        
        cur.close()
        conn.close()
        
        return jsonify({'message': 'Status updated successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@dasher_bp.route('/orders', methods=['GET'])
def get_dasher_orders():
    """Get orders for a specific dasher by email"""
    dasher_email = request.args.get('email')
    
    if not dasher_email:
        return jsonify({'error': 'Email parameter required'}), 400
    
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        cur.execute('''
            SELECT order_number, customer_name, customer_phone, delivery_address,
                   pickup_location, total_amount, status, created_at, accepted_at
            FROM orders
            WHERE dasher_email = %s
            ORDER BY created_at DESC
        ''', (dasher_email,))
        
        orders = cur.fetchall()
        cur.close()
        conn.close()
        
        return jsonify({'orders': [dict(order) for order in orders]}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
