from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail
from config import Config

db = SQLAlchemy()
mail = Mail()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Initialize extensions
    db.init_app(app)
    mail.init_app(app)
    
    # Configure CORS to allow requests from frontend
    CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})
    
    # Import models after db is initialized (to avoid circular imports)
    from models import MenuItem, Order, Dasher
    
    # Register blueprints
    from routes.menu import menu_bp
    from routes.orders import orders_bp
    from routes.dashers import dashers_bp
    
    app.register_blueprint(menu_bp, url_prefix='/api/menu')
    app.register_blueprint(orders_bp, url_prefix='/api/orders')
    app.register_blueprint(dashers_bp, url_prefix='/api/dashers')
    
    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, port=8080)

