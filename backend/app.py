from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime, timedelta
import os
import random
import string
import smtplib
import secrets
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

from routes.menu_routes import menu_bp
from routes.order_routes import order_bp
from routes.dasher_routes import dasher_bp
from routes.admin_routes import admin_bp

load_dotenv()

app = Flask(__name__)
# Allow CORS only for the frontend dev server origin on API routes
# Allow the Vite dev server origin and localhost:8080 (in case frontend or tools use that)
CORS(app, resources={r"/api/*": {"origins": ["http://localhost:5173", "http://localhost:8080"]}})

# Database connection
def get_db_connection():
    conn = psycopg2.connect(
        host=os.getenv('DB_HOST'),
        database=os.getenv('DB_NAME'),
        user=os.getenv('DB_USER'),
        password=os.getenv('DB_PASSWORD'),
        cursor_factory=RealDictCursor
    )
    return conn

# Email configuration
EMAIL_HOST = os.getenv('EMAIL_HOST', 'smtp.gmail.com')
EMAIL_PORT = int(os.getenv('EMAIL_PORT', '587'))
EMAIL_USER = os.getenv('EMAIL_USER')
EMAIL_PASSWORD = os.getenv('EMAIL_PASSWORD')
EMAIL_FROM = os.getenv('EMAIL_FROM', 'noreply@umassdining.com')

def send_email(to_email, subject, body):
    """Send email notification"""
    try:
        msg = MIMEMultipart('alternative')
        msg['Subject'] = subject
        msg['From'] = EMAIL_FROM
        msg['To'] = to_email
        
        html_part = MIMEText(body, 'html')
        msg.attach(html_part)
        
        with smtplib.SMTP(EMAIL_HOST, EMAIL_PORT) as server:
            server.starttls()
            if EMAIL_USER and EMAIL_PASSWORD:
                server.login(EMAIL_USER, EMAIL_PASSWORD)
            server.send_message(msg)
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False

def generate_order_number():
    """Generate unique order number"""
    timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
    random_suffix = ''.join(random.choices(string.ascii_uppercase + string.digits, k=4))
    return f"ORD-{timestamp}-{random_suffix}"

def generate_dasher_token():
    """Generate secure token for dasher confirmation"""
    return secrets.token_urlsafe(32)

app.register_blueprint(menu_bp, url_prefix='/api')
app.register_blueprint(order_bp, url_prefix='/api')
app.register_blueprint(dasher_bp, url_prefix='/api/dasher')
app.register_blueprint(admin_bp, url_prefix='/api/admin')

# Health check
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'message': 'UMass Dining Delivery API is running'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8080)
