from flask import Blueprint, jsonify, request
from models import Order
from app import db

orders_bp = Blueprint('orders', __name__)

@orders_bp.route('/', methods=['GET'])
def get_orders():
    """Get all orders"""
    orders = Order.query.all()
    return jsonify([order.to_dict() for order in orders])

@orders_bp.route('/<int:order_id>', methods=['GET'])
def get_order(order_id):
    """Get a specific order"""
    order = Order.query.get_or_404(order_id)
    return jsonify(order.to_dict())

@orders_bp.route('/', methods=['POST'])
def create_order():
    """Create a new order"""
    data = request.get_json()
    order = Order(
        user_id=data['user_id'],
        total_amount=data['total_amount'],
        delivery_address=data.get('delivery_address'),
        status=data.get('status', 'pending')
    )
    db.session.add(order)
    db.session.commit()
    return jsonify(order.to_dict()), 201

@orders_bp.route('/<int:order_id>', methods=['PUT'])
def update_order(order_id):
    """Update an order"""
    order = Order.query.get_or_404(order_id)
    data = request.get_json()
    
    if 'status' in data:
        order.status = data['status']
    if 'total_amount' in data:
        order.total_amount = data['total_amount']
    if 'delivery_address' in data:
        order.delivery_address = data['delivery_address']
    
    db.session.commit()
    return jsonify(order.to_dict())

@orders_bp.route('/<int:order_id>', methods=['DELETE'])
def delete_order(order_id):
    """Delete an order"""
    order = Order.query.get_or_404(order_id)
    db.session.delete(order)
    db.session.commit()
    return '', 204

