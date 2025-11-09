import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { CheckCircle2, Clock, Home, Package, UtensilsCrossed } from 'lucide-react';

export default function OrderStatusPage() {
  const navigate = useNavigate();
  const { cart, orderInfo, setOrderInfo, clearCart } = useCart();
  const [orderStatus, setOrderStatus] = useState<'pending' | 'accepted' | 'delivered'>('pending');
  const [estimatedTime, setEstimatedTime] = useState(orderInfo?.estimatedTime || '25-30 minutes');

  useEffect(() => {
    if (!orderInfo) {
      navigate('/');
      return;
    }

    // Simulate checking for dasher acceptance
    // In production, this would poll your backend or use websockets
    const checkInterval = setInterval(() => {
      // TODO: Replace with actual API call to check order status
      // const response = await fetch(`/api/orders/${orderInfo.orderId}/status`);
      // const data = await response.json();
      
      // Mock: Simulate dasher accepting after 5 seconds
      if (orderStatus === 'pending') {
        const timeSinceOrder = Date.now() - new Date(orderInfo.orderId?.replace('ORD-', '') || Date.now()).getTime();
        if (timeSinceOrder > 5000) {
          setOrderStatus('accepted');
          setOrderInfo({ ...orderInfo, dasherAccepted: true });
        }
      }
    }, 1000);

    return () => clearInterval(checkInterval);
  }, [orderInfo, orderStatus, setOrderInfo, navigate]);

  const handleOrderDelivered = () => {
    setOrderStatus('delivered');
    setEstimatedTime('n/a');
    // In production, you would call your backend to mark order as delivered
    // await fetch(`/api/orders/${orderInfo.orderId}/delivered`, { method: 'POST' });
  };

  const handleNewOrder = () => {
    clearCart();
    setOrderInfo(null);
    navigate('/order');
  };

  if (!orderInfo) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl mb-2" style={{ color: 'var(--umass-maroon)' }}>Order Status</h1>
          <p className="text-gray-600">Order ID: {orderInfo.orderId}</p>
        </div>

        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {orderStatus === 'pending' && (
                  <>
                    <Clock className="w-5 h-5 text-yellow-600" />
                    Waiting for Dasher
                  </>
                )}
                {orderStatus === 'accepted' && (
                  <>
                    <Package className="w-5 h-5 text-blue-600" />
                    Order Confirmed
                  </>
                )}
                {orderStatus === 'delivered' && (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    Order Delivered
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orderStatus === 'pending' && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800">
                      Your order has been sent to dashers. Waiting for acceptance...
                    </p>
                  </div>
                )}

                {orderStatus === 'accepted' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800 mb-2">
                      A dasher has accepted your order! Your food is on the way.
                    </p>
                    <p className="text-blue-600">
                      Estimated arrival: {estimatedTime}
                    </p>
                  </div>
                )}

                {orderStatus === 'delivered' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-800">
                      Your order has been delivered. Enjoy your meal!
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Delivery Location</p>
                    <p>{orderInfo.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Contact Number</p>
                    <p>{orderInfo.phoneNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Estimated Time</p>
                    <p>{estimatedTime}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Status</p>
                    <Badge
                      variant={
                        orderStatus === 'pending' ? 'secondary' :
                        orderStatus === 'accepted' ? 'default' : 'outline'
                      }
                      className={
                        orderStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        orderStatus === 'accepted' ? 'bg-blue-600' : 'bg-green-600'
                      }
                    >
                      {orderStatus === 'pending' ? 'Pending' :
                       orderStatus === 'accepted' ? 'In Progress' : 'Delivered'}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8">
          <h2 className="mb-4">Your Order</h2>
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="space-y-3">
              {cart.map((item, index) => (
                <div key={`${item.id}-${index}`} className="flex gap-3 items-start">
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
            <div className="mt-4 pt-4 border-t">
              <p>Total Items: {cart.length}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          {orderStatus === 'accepted' && (
            <Button
              onClick={handleOrderDelivered}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Mark as Delivered
            </Button>
          )}
          
          {orderStatus === 'delivered' && (
            <Button
              onClick={handleNewOrder}
              className="flex-1"
              style={{ backgroundColor: 'var(--umass-maroon)' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--umass-maroon-dark)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--umass-maroon)'}
            >
              Place New Order
            </Button>
          )}

          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="flex-1"
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
