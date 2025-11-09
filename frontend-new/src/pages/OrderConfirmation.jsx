import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Package, Truck, Home, Clock } from 'lucide-react';

const OrderConfirmation = () => {
  const { orderNumber } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [estimatedArrival, setEstimatedArrival] = useState(null);

  useEffect(() => {
    if (orderNumber) {
      fetchOrderDetails();
    }
  }, [orderNumber]);

  // Initialize countdown timer when order is loaded
  useEffect(() => {
    if (order) {
      // Calculate estimated delivery time (25-35 minutes from order placement)
      const orderTime = new Date(order.order_time || Date.now());
      const estimatedMinutes = Math.floor(Math.random() * 11) + 25; // Random between 25-35 minutes
      const arrivalTime = new Date(orderTime.getTime() + estimatedMinutes * 60000);
      setEstimatedArrival(arrivalTime);
    }
  }, [order]);

  // Countdown timer effect
  useEffect(() => {
    if (!estimatedArrival) return;

    const updateCountdown = () => {
      const now = new Date();
      const diff = estimatedArrival - now;

      if (diff <= 0) {
        setTimeRemaining({ minutes: 0, seconds: 0 });
        return;
      }

      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setTimeRemaining({ minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [estimatedArrival]);

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`/api/orders/${orderNumber}`);
      const data = await response.json();
      
      if (response.ok) {
        setOrder(data);
      }
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      'pending': {
        icon: Package,
        text: 'Order Received',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100'
      },
      'confirmed': {
        icon: Truck,
        text: 'Dasher Assigned',
        color: 'text-blue-600',
        bgColor: 'bg-blue-100'
      },
      'picked_up': {
        icon: Truck,
        text: 'Order Picked Up',
        color: 'text-purple-600',
        bgColor: 'bg-purple-100'
      },
      'delivered': {
        icon: CheckCircle,
        text: 'Delivered',
        color: 'text-green-600',
        bgColor: 'bg-green-100'
      }
    };
    
    return statusMap[status] || statusMap['pending'];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-dormdash-red"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Order not found</p>
          <button
            onClick={() => navigate('/')}
            className="text-dormdash-red hover:underline"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(order.tracking_status);
  const StatusIcon = statusInfo.icon;

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
          <h2 className="text-2xl font-bold mb-2">Order Confirmed!</h2>
          <p className="text-gray-600 mb-4">
            Thank you for your order, {order.customer_name}
          </p>
          <div className="inline-block bg-gray-100 px-4 py-2 rounded-lg">
            <span className="text-sm text-gray-600">Order Number: </span>
            <span className="font-mono font-semibold">{order.order_number}</span>
          </div>
        </div>

        {/* Estimated Arrival Time */}
        {timeRemaining && order.tracking_status !== 'delivered' && (
          <div className="bg-gradient-to-r from-dormdash-red to-red-700 rounded-lg shadow-md p-6 mb-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="w-8 h-8 mr-3" />
                <div>
                  <p className="text-sm opacity-90">Estimated Arrival</p>
                  <p className="text-2xl font-bold">
                    {timeRemaining.minutes}:{timeRemaining.seconds.toString().padStart(2, '0')}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm opacity-90">Expected at</p>
                <p className="font-semibold">
                  {estimatedArrival?.toLocaleTimeString('en-US', { 
                    hour: 'numeric', 
                    minute: '2-digit',
                    hour12: true 
                  })}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Order Status */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Order Status</h3>
          <div className={`flex items-center ${statusInfo.bgColor} rounded-lg p-4`}>
            <StatusIcon className={`w-8 h-8 ${statusInfo.color} mr-3`} />
            <div>
              <p className={`font-semibold ${statusInfo.color}`}>{statusInfo.text}</p>
              <p className="text-sm text-gray-600">
                {order.tracking_status === 'pending' && 'Waiting for a dasher to accept your order'}
                {order.tracking_status === 'confirmed' && `Dasher: ${order.dasher_name || 'Assigned'}`}
                {order.tracking_status === 'picked_up' && 'Your order is on the way'}
                {order.tracking_status === 'delivered' && 'Your order has been delivered'}
              </p>
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Order Details</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Pickup Location:</span>
              <span className="font-medium">{order.pickup_location}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Delivery Address:</span>
              <span className="font-medium">{order.delivery_address}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Phone:</span>
              <span className="font-medium">{order.customer_phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium">{order.customer_email}</span>
            </div>
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
          <h3 className="text-lg font-semibold mb-4">Items</h3>
          <div className="space-y-3">
            {order.items && order.items.map((item, index) => (
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
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t flex justify-between items-center">
            <span className="text-lg font-semibold">Total</span>
            <span className="text-lg font-bold">${order.total_amount?.toFixed(2)}</span>
          </div>
        </div>

        {/* Dasher Info (if assigned) */}
        {order.dasher_name && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Your Dasher</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium">{order.dasher_name}</span>
              </div>
              {order.dasher_phone && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Phone:</span>
                  <span className="font-medium">{order.dasher_phone}</span>
                </div>
              )}
            </div>
          </div>
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
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>A confirmation email has been sent to {order.customer_email}</p>
          <p className="mt-1">You'll receive updates when your order status changes</p>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
