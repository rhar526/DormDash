from datetime import datetime
from app import db


class MenuOption(db.Model):
    __tablename__ = 'menu_options'
    
    id = db.Column(db.Integer, primary_key=True)
    hall_id = db.Column(db.String(50), nullable=False)
    meal_type = db.Column(db.String(20), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    nutrition = db.Column(db.JSON)
    allergens = db.Column(db.ARRAY(db.String))
    tags = db.Column(db.ARRAY(db.String))
    available_today = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    user_order_choices = db.relationship('UserOrderChoice', backref='menu_option', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'hall_id': self.hall_id,
            'meal_type': self.meal_type,
            'name': self.name,
            'nutrition': self.nutrition,
            'allergens': self.allergens,
            'tags': self.tags,
            'available_today': self.available_today,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    phone_number = db.Column(db.String(20), nullable=False)
    location = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    user_order_choices = db.relationship('UserOrderChoice', backref='user', lazy=True, cascade='all, delete-orphan')
    orders = db.relationship('Order', backref='user', lazy=True)
    dasher_customers = db.relationship('DasherCustomer', backref='user', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'phone_number': self.phone_number,
            'location': self.location,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class UserOrderChoice(db.Model):
    __tablename__ = 'user_order_choices'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    menu_option_id = db.Column(db.Integer, db.ForeignKey('menu_options.id'), nullable=False)
    added_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'menu_option_id': self.menu_option_id,
            'added_at': self.added_at.isoformat() if self.added_at else None
        }


class Dasher(db.Model):
    __tablename__ = 'dashers'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    orders = db.relationship('Order', backref='dasher', lazy=True)
    dasher_customers = db.relationship('DasherCustomer', backref='dasher', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class DasherCustomer(db.Model):
    __tablename__ = 'dasher_customers'
    
    id = db.Column(db.Integer, primary_key=True)
    dasher_id = db.Column(db.Integer, db.ForeignKey('dashers.id', ondelete='CASCADE'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    user_name = db.Column(db.String(255))
    order_details = db.Column(db.JSON)
    accepted_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'dasher_id': self.dasher_id,
            'user_id': self.user_id,
            'user_name': self.user_name,
            'order_details': self.order_details,
            'accepted_at': self.accepted_at.isoformat() if self.accepted_at else None
        }


class Order(db.Model):
    __tablename__ = 'orders'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    dasher_id = db.Column(db.Integer, db.ForeignKey('dashers.id'), nullable=True)
    location = db.Column(db.String(255), nullable=False)
    phone_number = db.Column(db.String(20), nullable=False)
    order_items = db.Column(db.JSON, nullable=False)
    status = db.Column(db.String(20), default='pending')
    acceptance_token = db.Column(db.String(255), unique=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    accepted_at = db.Column(db.DateTime)
    delivered_at = db.Column(db.DateTime)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'dasher_id': self.dasher_id,
            'location': self.location,
            'phone_number': self.phone_number,
            'order_items': self.order_items,
            'status': self.status,
            'acceptance_token': self.acceptance_token,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'accepted_at': self.accepted_at.isoformat() if self.accepted_at else None,
            'delivered_at': self.delivered_at.isoformat() if self.delivered_at else None
        }
