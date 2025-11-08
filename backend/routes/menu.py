from flask import Blueprint, jsonify, request
from models import MenuItem
from app import db

menu_bp = Blueprint('menu', __name__)

@menu_bp.route('/', methods=['GET'])
def get_menu():
    """Get all menu items"""
    items = MenuItem.query.all()
    return jsonify([item.to_dict() for item in items])

@menu_bp.route('/<int:item_id>', methods=['GET'])
def get_menu_item(item_id):
    """Get a specific menu item"""
    item = MenuItem.query.get_or_404(item_id)
    return jsonify(item.to_dict())

@menu_bp.route('/', methods=['POST'])
def create_menu_item():
    """Create a new menu item"""
    data = request.get_json()
    item = MenuItem(
        name=data['name'],
        description=data.get('description'),
        price=data['price'],
        category=data.get('category'),
        available=data.get('available', True)
    )
    db.session.add(item)
    db.session.commit()
    return jsonify(item.to_dict()), 201

@menu_bp.route('/<int:item_id>', methods=['PUT'])
def update_menu_item(item_id):
    """Update a menu item"""
    item = MenuItem.query.get_or_404(item_id)
    data = request.get_json()
    
    if 'name' in data:
        item.name = data['name']
    if 'description' in data:
        item.description = data['description']
    if 'price' in data:
        item.price = data['price']
    if 'category' in data:
        item.category = data['category']
    if 'available' in data:
        item.available = data['available']
    
    db.session.commit()
    return jsonify(item.to_dict())

@menu_bp.route('/<int:item_id>', methods=['DELETE'])
def delete_menu_item(item_id):
    """Delete a menu item"""
    item = MenuItem.query.get_or_404(item_id)
    db.session.delete(item)
    db.session.commit()
    return '', 204

