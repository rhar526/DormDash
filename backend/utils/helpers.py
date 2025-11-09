import random
import string
import secrets
from datetime import datetime

def generate_order_number():
    """Generate unique order number"""
    timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
    random_suffix = ''.join(random.choices(string.ascii_uppercase + string.digits, k=4))
    return f"ORD-{timestamp}-{random_suffix}"

def generate_dasher_token():
    """Generate secure token for dasher confirmation"""
    return secrets.token_urlsafe(32)
