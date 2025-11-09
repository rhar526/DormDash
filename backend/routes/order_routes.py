from flask import Blueprint, request, jsonify
from utils.database import get_db_connection
from utils.email import send_email
from utils.helpers import generate_order_number
from config import FRONTEND_URL
from datetime import datetime

from psycopg2.extras import RealDictCursor

order_bp = Blueprint('order', __name__)

@order_bp.route('/orders', methods=['POST'])
def create_order():
    """Create a new order (no authentication required)"""
    data = request.json

    required_fields = ['customer_name', 'customer_email', 'customer_phone',
                       'delivery_address', 'pickup_location', 'items']
    data = request.json
    if not data or not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400

    if not data['items'] or len(data['items']) == 0:
        return jsonify({'error': 'Order must contain at least one item'}), 400

    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)

        order_number = generate_order_number()
        total_amount = data.get('total_amount', 0)

        # Insert order
        cur.execute('''
            INSERT INTO orders (
                order_number, customer_name, customer_email, customer_phone,
                delivery_address, special_instructions, pickup_location,
                total_amount
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id, order_number, created_at
        ''', (
            order_number, data['customer_name'], data['customer_email'],
            data['customer_phone'], data['delivery_address'],
            data.get('special_instructions'), data['pickup_location'],
            total_amount
        ))

        order = cur.fetchone()
        order_id = order['id']

        # Insert order items
        for item in data['items']:
            cur.execute('''
                INSERT INTO order_items (order_id, item_name, category, quantity, price, special_instructions)
                VALUES (%s, %s, %s, %s, %s, %s)
            ''', (
                order_id, item['name'], item.get('category'),
                item.get('quantity', 1), item.get('price', 5.0),
                item.get('special_instructions')
            ))

        conn.commit()

        # Send confirmation email to customer
        customer_email_body = f"""
        <html>
        <body>
            <h2>Order Confirmation</h2>
            <p>Thank you for your order, {data['customer_name']}!</p>
            <p><strong>Order Number:</strong> {order_number}</p>
            <p><strong>Pickup Location:</strong> {data['pickup_location']}</p>
            <p><strong>Delivery Address:</strong> {data['delivery_address']}</p>
            <p><strong>Total:</strong> ${total_amount:.2f}</p>
            <p>You will receive an email when a dasher accepts your order.</p>
            <p>Track your order at: <a href="{FRONTEND_URL}/order/{order_number}">View Order Status</a></p>
        </body>
        </html>
        """
        send_email(data['customer_email'], f'Order Confirmation - {order_number}', customer_email_body)

        # Get active dashers and send notification emails
        cur.execute('SELECT email, name FROM dashers WHERE active = true')
        dashers = cur.fetchall()

        for dasher in dashers:
            dasher_email_body = f"""
            <html>
            <body>
                <h2>New Delivery Available</h2>
                <p>Hi {dasher['name']},</p>
                <p>A new delivery order is available:</p>
                <p><strong>Order Number:</strong> {order_number}</p>
                <p><strong>Pickup:</strong> {data['pickup_location']}</p>
                <p><strong>Deliver to:</strong> {data['delivery_address']}</p>
                <p><strong>Order Total:</strong> ${total_amount:.2f}</p>
                <p>Check the orders dashboard to accept this delivery.</p>
            </body>
            </html>
            """
            send_email(dasher['email'], f'New Delivery - {order_number}', dasher_email_body)

        conn.commit()
        cur.close()
        conn.close()

        return jsonify({
            'order_number': order_number,
            'message': 'Order created successfully'
        }), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@order_bp.route('/orders/<order_number>', methods=['GET'])
def get_order(order_number):
    """Get order details by order number (no authentication)"""
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)

        # Get order details
        cur.execute('SELECT * FROM orders WHERE order_number = %s', (order_number,))
        order = cur.fetchone()

        if not order:
            return jsonify({'error': 'Order not found'}), 404

        # Get order items
        cur.execute('''
            SELECT item_name AS name, category, quantity, price, special_instructions
            FROM order_items
            WHERE order_id = %s
        ''', (order['id'],))

        items = cur.fetchall()
        cur.close()
        conn.close()

        order_dict = dict(order)
        order_dict['items'] = [dict(item) for item in items]

        return jsonify(order_dict), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
