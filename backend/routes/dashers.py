from flask import Blueprint, jsonify, request
from models import Dasher
from app import db

dashers_bp = Blueprint('dashers', __name__)

@dashers_bp.route('/', methods=['GET'])
def get_dashers():
    """Get all dashers"""
    dashers = Dasher.query.all()
    return jsonify([dasher.to_dict() for dasher in dashers])

@dashers_bp.route('/<int:dasher_id>', methods=['GET'])
def get_dasher(dasher_id):
    """Get a specific dasher"""
    dasher = Dasher.query.get_or_404(dasher_id)
    return jsonify(dasher.to_dict())

@dashers_bp.route('/', methods=['POST'])
def create_dasher():
    """Create a new dasher"""
    data = request.get_json()
    dasher = Dasher(
        name=data['name'],
        email=data['email'],
        phone=data.get('phone'),
        status=data.get('status', 'available')
    )
    db.session.add(dasher)
    db.session.commit()
    return jsonify(dasher.to_dict()), 201

@dashers_bp.route('/<int:dasher_id>', methods=['PUT'])
def update_dasher(dasher_id):
    """Update a dasher"""
    dasher = Dasher.query.get_or_404(dasher_id)
    data = request.get_json()
    
    if 'name' in data:
        dasher.name = data['name']
    if 'email' in data:
        dasher.email = data['email']
    if 'phone' in data:
        dasher.phone = data['phone']
    if 'status' in data:
        dasher.status = data['status']
    if 'current_order_id' in data:
        dasher.current_order_id = data['current_order_id']
    
    db.session.commit()
    return jsonify(dasher.to_dict())

@dashers_bp.route('/<int:dasher_id>', methods=['DELETE'])
def delete_dasher(dasher_id):
    """Delete a dasher"""
    dasher = Dasher.query.get_or_404(dasher_id)
    db.session.delete(dasher)
    db.session.commit()
    return '', 204

