import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import CartItem from './CartItem';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, removeFromCart, setOrderInfo } = useCart();
  const [location, setLocation] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    if (!location.trim() || !phoneNumber.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call to submit order to your backend
    // Replace this with your actual API endpoint
    try {
      const orderData = {
        items: cart,
        location: location.trim(),
        phoneNumber: phoneNumber.trim(),
        timestamp: new Date().toISOString()
      };

      // TODO: Replace with your actual API call
      // const response = await fetch('/api/orders', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(orderData)
      // });
      // const result = await response.json();

      // Mock response for demo
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockOrderId = `ORD-${Date.now()}`;
      const mockEstimatedTime = '25-30 minutes';

      // Store order info in context
      setOrderInfo({
        location: location.trim(),
        phoneNumber: phoneNumber.trim(),
        orderId: mockOrderId,
        estimatedTime: mockEstimatedTime,
        dasherAccepted: false
      });

      toast.success('Order placed successfully!');
      
      // Navigate to status page
      setTimeout(() => {
        navigate('/status');
      }, 500);
    } catch (error) {
      console.error('Error submitting order:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/order')}
            className="gap-2 mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Order
          </Button>
          <div className="text-center py-16">
            <ShoppingBag className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h2 className="mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-4">Add some items to get started</p>
            <Button
              onClick={() => navigate('/order')}
              style={{ backgroundColor: 'var(--umass-maroon)' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--umass-maroon-dark)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--umass-maroon)'}
            >
              Browse Menu
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/order')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Order
          </Button>
          <h1 className="text-3xl" style={{ color: 'var(--umass-maroon)' }}>Checkout</h1>
          <div className="w-24"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="mb-4">Your Order</h2>
            <div className="space-y-3">
              {cart.map((item, index) => (
                <CartItem
                  key={`${item.id}-${index}`}
                  item={item}
                  onRemove={removeFromCart}
                />
              ))}
            </div>
            <div className="mt-4 p-4 bg-white rounded-lg shadow-sm border">
              <p className="text-gray-600">Total Items: {cart.length}</p>
            </div>
          </div>

          <div>
            <h2 className="mb-4">Delivery Information</h2>
            <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-sm border">
              <div>
                <Label htmlFor="location">Delivery Location</Label>
                <Input
                  id="location"
                  type="text"
                  placeholder="e.g., Southwest Tower 401"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                  className="mt-1"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Enter your dorm name and room number
                </p>
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="e.g., (555) 123-4567"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  className="mt-1"
                />
                <p className="text-sm text-gray-500 mt-1">
                  We'll use this to contact you about your order
                </p>
              </div>

              <Button
                type="submit"
                className="w-full"
                style={{ backgroundColor: 'var(--umass-maroon)' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--umass-maroon-dark)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--umass-maroon)'}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Placing Order...' : 'Place Order'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
