import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { CheckCircle2, Home, Package, AlertCircle, UtensilsCrossed } from 'lucide-react';

interface OrderDetails {
  orderId: string;
  items: Array<{
    id: string;
    name: string;
    diningHall: string;
  }>;
  location: string;
  phoneNumber: string;
  customerName?: string;
  timestamp: string;
}

export default function DasherConfirmPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [isAccepted, setIsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch order details from your backend
    const fetchOrderDetails = async () => {
      try {
        // TODO: Replace with your actual API call
        // const response = await fetch(`/api/orders/${orderId}`);
        // const data = await response.json();
        
        // Mock data for demo
        await new Promise(resolve => setTimeout(resolve, 500));
        const mockOrder: OrderDetails = {
          orderId: orderId || 'ORD-12345',
          items: [
            {
              id: '1',
              name: 'Classic Cheeseburger',
              diningHall: 'Worcester'
            },
            {
              id: '2',
              name: 'Margherita Pizza',
              diningHall: 'Hampshire'
            }
          ],
          location: 'Southwest Tower 401',
          phoneNumber: '(555) 123-4567',
          customerName: 'John Student',
          timestamp: new Date().toISOString()
        };

        setOrderDetails(mockOrder);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load order details');
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const handleAcceptOrder = async () => {
    try {
      // TODO: Replace with your actual API call
      // await fetch(`/api/orders/${orderId}/accept`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ dasherId: 'current-dasher-id' })
      // });

      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setIsAccepted(true);
      
      // In production, this would trigger:
      // 1. Email to customer confirming dasher accepted
      // 2. Add customer to dasher's list
      // 3. Update order status in database
    } catch (err) {
      setError('Failed to accept order. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: 'var(--umass-maroon)' }}></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !orderDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{ color: 'var(--umass-maroon)' }}>
              <AlertCircle className="w-5 h-5" />
              Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{error || 'Order not found'}</p>
            <Button onClick={() => navigate('/')} className="w-full">
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl mb-2" style={{ color: 'var(--umass-maroon)' }}>Dasher Portal</h1>
          <p className="text-gray-600">Order ID: {orderDetails.orderId}</p>
        </div>

        {isAccepted ? (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="text-center">
                <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h2 className="mb-2">Order Accepted!</h2>
                <p className="text-gray-600 mb-6">
                  The customer has been notified. Customer details have been added to your dashboard.
                </p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-left">
                  <p className="mb-2">
                    <span className="text-gray-600">Customer:</span> {orderDetails.customerName || 'N/A'}
                  </p>
                  <p className="mb-2">
                    <span className="text-gray-600">Delivery Location:</span> {orderDetails.location}
                  </p>
                  <p>
                    <span className="text-gray-600">Contact:</span> {orderDetails.phoneNumber}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  New Order Available
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Delivery Location</p>
                    <p>{orderDetails.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Customer Contact</p>
                    <p>{orderDetails.phoneNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Order Time</p>
                    <p>{new Date(orderDetails.timestamp).toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Order Items ({orderDetails.items.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {orderDetails.items.map((item) => (
                    <div key={item.id} className="flex gap-3 items-start p-3 bg-gray-50 rounded-lg">
                      <div className="w-16 h-16 flex-shrink-0 rounded overflow-hidden flex items-center justify-center" style={{ backgroundColor: '#fde8e8' }}>
                        <UtensilsCrossed className="w-8 h-8" style={{ color: 'var(--umass-maroon)' }} />
                      </div>
                      <div className="flex-1">
                        <p>{item.name}</p>
                        <p className="text-sm text-gray-500">{item.diningHall}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={handleAcceptOrder}
              className="w-full bg-green-600 hover:bg-green-700"
              size="lg"
            >
              <CheckCircle2 className="w-5 h-5 mr-2" />
              Accept This Order
            </Button>
          </>
        )}

        <div className="mt-4">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="w-full"
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
