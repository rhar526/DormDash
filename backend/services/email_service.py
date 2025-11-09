from flask_mail import Message, Mail
from typing import List, Optional

# Mail instance will be imported from app when needed
def get_mail():
    from app import mail
    return mail

def send_email(subject: str, recipients: List[str], body: str, html: Optional[str] = None):
    """
    Send an email using Flask-Mail
    
    Args:
        subject: Email subject
        recipients: List of recipient email addresses
        body: Plain text email body
        html: Optional HTML email body
    """
    try:
        mail = get_mail()
        msg = Message(
            subject=subject,
            recipients=recipients,
            body=body,
            html=html
        )
        mail.send(msg)
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False

def send_order_confirmation(order_id: int, recipient_email: str, order_details: dict):
    """
    Send order confirmation email
    
    Args:
        order_id: Order ID
        recipient_email: Customer email address
        order_details: Dictionary containing order details
    """
    subject = f"Order Confirmation - Order #{order_id}"
    body = f"""
    Thank you for your order!
    
    Order ID: {order_id}
    Total: ${order_details.get('total_amount', 0):.2f}
    Status: {order_details.get('status', 'pending')}
    
    We'll notify you when your order is ready.
    """
    
    html = f"""
    <html>
        <body>
            <h2>Order Confirmation</h2>
            <p>Thank you for your order!</p>
            <p><strong>Order ID:</strong> {order_id}</p>
            <p><strong>Total:</strong> ${order_details.get('total_amount', 0):.2f}</p>
            <p><strong>Status:</strong> {order_details.get('status', 'pending')}</p>
            <p>We'll notify you when your order is ready.</p>
        </body>
    </html>
    """
    
    return send_email(subject, [recipient_email], body, html)

