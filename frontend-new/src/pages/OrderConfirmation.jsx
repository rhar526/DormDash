import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Home } from 'lucide-react';

const OrderConfirmation = () => {
  const { orderNumber } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);

  // Try to fetch order details if not passed via state
  useEffect(() => {
    if (!order && orderNumber) {
      fetchOrderDetails();
    }
  }, [orderNumber]);

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`/api/orders/${orderNumber}`);
      if (response.ok) {
        const data = await response.json();
        setOrder(data);
      }
    } catch (error) {
      console.error('Error fetching order:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-dormdash-red text-center">DormDash</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Success Message */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Order Placed!</h2>
          <p className="text-gray-600 mb-4">
            Thank you for your order{order?.customer_name ? `, ${order.customer_name}` : ''}
          </p>
          {orderNumber && (
            <div className="inline-block bg-gray-100 px-4 py-2 rounded-lg">
              <span className="text-sm text-gray-600">Order Number: </span>
              <span className="font-mono font-semibold">{orderNumber}</span>
            </div>
          )}
        </div>

        {/* Order Details */}
        {order && (
          <>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Delivery Information</h3>
              
              <div className="space-y-3">
                {order.pickup_location && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pickup Location:</span>
                    <span className="font-medium">{order.pickup_location}</span>
                  </div>
                )}
                {order.delivery_address && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Address:</span>
                    <span className="font-medium">{order.delivery_address}</span>
                  </div>
                )}
                {order.customer_phone && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-medium">{order.customer_phone}</span>
                  </div>
                )}
                {order.customer_email && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{order.customer_email}</span>
                  </div>
                )}
                {order.special_instructions && (
                  <div className="pt-3 border-t">
                    <span className="text-gray-600 block mb-1">Special Instructions:</span>
                    <span className="text-sm">{order.special_instructions}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
              <div className="space-y-3">
                {order.items && order.items.length > 0 ? order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      {item.category && (
                        <p className="text-sm text-gray-600">{item.category}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-medium">x{item.quantity}</p>
                      <p className="text-sm text-gray-600">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                )) : (
                  <p className="text-gray-600 text-center py-4">No items found</p>
                )}
              </div>
              
              <div className="mt-4 pt-4 border-t flex justify-between items-center">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-lg font-bold">${order.total_amount?.toFixed(2) || '0.00'}</span>
              </div>
            </div>
          </>
        )}

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/')}
            className="flex-1 bg-white border-2 border-dormdash-red text-dormdash-red py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center"
          >
            <Home className="w-5 h-5 mr-2" />
            Back to Home
          </button>
          <button
            onClick={() => navigate('/menu')}
            className="flex-1 bg-dormdash-red text-white py-3 rounded-lg font-medium hover:bg-red-900 transition-colors"
          >
            Order Again
          </button>
        </div>

        {/* Email Notification */}
        {order?.customer_email && (
          <div className="mt-6 text-center text-sm text-gray-600">
            <p>A confirmation email will be sent to {order.customer_email}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderConfirmation;
