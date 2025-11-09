from flask import Blueprint, request, jsonify
from psycopg2.extras import RealDictCursor
from utils.database import get_db_connection
from utils.email import send_email
from config import FRONTEND_URL

dasher_bp = Blueprint('dasher', __name__)

# -------------------------------
# Get Orders for Dasher
# -------------------------------
@dasher_bp.route('/orders', methods=['GET'])
def get_dasher_orders():
    """Get all orders for a specific dasher by email"""
    dasher_email = request.args.get('email')
    if not dasher_email:
        return jsonify({'error': 'Email parameter required'}), 400

    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)

        cur.execute('''
            SELECT order_number, customer_name, customer_phone, delivery_address,
                   pickup_location, total_amount, tracking_status as status, created_at, accepted_at,
                   dasher_name, dasher_phone
            FROM orders
            WHERE dasher_email = %s
            ORDER BY created_at DESC
        ''', (dasher_email,))

        orders = cur.fetchall()
        cur.close()
        conn.close()

        return jsonify({'orders': orders}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# -------------------------------
# Accept an Order
# -------------------------------
@dasher_bp.route('/accept', methods=['POST'])
def accept_order():
    """
    Dasher accepts an order.
    Expected JSON: { "dasher_email": "...", "order_number": "..." }
    """
    data = request.json
    dasher_email = data.get('dasher_email')
    order_number = data.get('order_number')

    if not dasher_email or not order_number:
        return jsonify({'error': 'dasher_email and order_number are required'}), 400

    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)

        # Verify dasher exists
        cur.execute('SELECT name, phone FROM dashers WHERE email = %s', (dasher_email,))
        dasher = cur.fetchone()
        if not dasher:
            cur.close()
            conn.close()
            return jsonify({'error': 'Dasher not found'}), 404

        # Verify order exists and is pending
        cur.execute('SELECT id, customer_name, customer_email, pickup_location, delivery_address, tracking_status FROM orders WHERE order_number = %s', (order_number,))
        order = cur.fetchone()
        if not order:
            cur.close()
            conn.close()
            return jsonify({'error': 'Order not found'}), 404
        if order['tracking_status'] != 'pending':
            cur.close()
            conn.close()
            return jsonify({'error': 'Order already accepted'}), 400

        # Accept the order
        cur.execute('''
            UPDATE orders
            SET tracking_status = 'confirmed', dasher_email = %s, dasher_name = %s,
                dasher_phone = %s, accepted_at = CURRENT_TIMESTAMP
            WHERE id = %s AND tracking_status = 'pending'
        ''', (dasher_email, dasher['name'], dasher['phone'], order['id']))
        conn.commit()

        # Notify customer
        customer_email_body = f"""
        <html>
        <body>
            <h2>Dasher Assigned!</h2>
            <p>Hi {order['customer_name']},</p>
            <p>Your order {order_number} has been accepted by a dasher.</p>
            <p><strong>Dasher:</strong> {dasher['name']}</p>
            <p><strong>Dasher Phone:</strong> {dasher['phone']}</p>
            <p>Pickup: {order['pickup_location']} | Delivery: {order['delivery_address']}</p>
            <p>Track your order: <a href="{FRONTEND_URL}/order/{order_number}">View Order Status</a></p>
        </body>
        </html>
        """
        send_email(order['customer_email'], f'Dasher Assigned - {order_number}', customer_email_body)

        cur.close()
        conn.close()
        return jsonify({'message': 'Order accepted successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# -------------------------------
# Update Order Status
# -------------------------------
@dasher_bp.route('/update-status', methods=['PATCH'])
def update_order_status():
    """
    Dasher updates the status of an order.
    Expected JSON: { "dasher_email": "...", "order_number": "...", "status": "..." }
    """
    data = request.json
    dasher_email = data.get('dasher_email')
    order_number = data.get('order_number')
    new_status = data.get('status')

    if not dasher_email or not order_number or not new_status:
        return jsonify({'error': 'dasher_email, order_number, and status are required'}), 400

    valid_statuses = ['confirmed', 'picked_up', 'delivered']
    if new_status not in valid_statuses:
        return jsonify({'error': f'Invalid status. Must be one of {valid_statuses}'}), 400

    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)

        # Verify order exists and belongs to dasher
        cur.execute('''
            SELECT id, customer_name, customer_email, tracking_status
            FROM orders
            WHERE order_number = %s AND dasher_email = %s
        ''', (order_number, dasher_email))
        order = cur.fetchone()
        if not order:
            cur.close()
            conn.close()
            return jsonify({'error': 'Order not found or does not belong to this dasher'}), 404

        # Update status
        cur.execute('''
            UPDATE orders
            SET tracking_status = %s, updated_at = CURRENT_TIMESTAMP
            WHERE id = %s
        ''', (new_status, order['id']))
        conn.commit()

        # Notify customer
        status_messages = {
            'confirmed': 'Your order has been confirmed by the dasher.',
            'picked_up': 'Your order has been picked up and is on the way.',
            'delivered': 'Your order has been delivered!'
        }
        customer_email_body = f"""
        <html>
        <body>
            <h2>Order Update</h2>
            <p>Hi {order['customer_name']},</p>
            <p><strong>Order:</strong> {order_number}</p>
            <p><strong>Status:</strong> {status_messages[new_status]}</p>
            <p>Track your order: <a href="{FRONTEND_URL}/order/{order_number}">View Order Status</a></p>
        </body>
        </html>
        """
        send_email(order['customer_email'], f'Order Update - {order_number}', customer_email_body)

        cur.close()
        conn.close()
        return jsonify({'message': 'Status updated successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
