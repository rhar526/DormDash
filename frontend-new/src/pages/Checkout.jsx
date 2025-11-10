import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, X, Utensils } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, getTotalItems, getTotalPrice, clearCart } = useCart();
  
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    delivery_address: '',
    pickup_location: '',
    special_instructions: ''
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (cartItems.length === 0) {
      setError('Your cart is empty');
      return;
    }

    setSubmitting(true);

    try {
      const orderData = {
        ...formData,
        items: cartItems.map(item => ({
          name: item.item_name,
          category: item.category,
          quantity: item.quantity || 1,
          price: item.price || 2.0,
          special_instructions: ''
        })),
        total_amount: getTotalPrice()
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      const data = await response.json();

      if (response.ok) {
        // Pass order data directly to confirmation page
        const orderForConfirmation = {
          ...orderData,
          order_number: data.order_number,
          order_id: data.order_id
        };
        clearCart();
        navigate(`/order-confirmation/${data.order_number}`, { 
          state: { order: orderForConfirmation } 
        });
      } else {
        setError(data.error || 'Failed to place order');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Order submission error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/menu')}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Order
            </button>
            
            <h1 className="text-2xl font-bold text-dormdash-red">Checkout</h1>
            
            <div className="w-32"></div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Your Order */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Your Order</h2>
            
            {cartItems.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <p className="text-gray-600">Your cart is empty</p>
                <button
                  onClick={() => navigate('/menu')}
                  className="mt-4 text-dormdash-red hover:underline"
                >
                  Browse Menu
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map(item => (
                  <div key={item.id} className="bg-white rounded-lg shadow-md p-4 flex">
                    {/* Item Image Placeholder */}
                    <div className="bg-dormdash-pink w-20 h-20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Utensils className="w-8 h-8 text-dormdash-red" />
                    </div>
                    
                    {/* Item Details */}
                    <div className="ml-4 flex-grow">
                      <h3 className="font-semibold">{item.item_name}</h3>
                      <p className="text-sm text-gray-600">{item.location}</p>
                      
                      {/* Tags */}
                      {item.dietary_info && item.dietary_info.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {item.dietary_info.slice(0, 2).map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="ml-4 text-gray-400 hover:text-red-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                
                {/* Total */}
                <div className="bg-white rounded-lg shadow-md p-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total Items:</span>
                    <span>{getTotalItems()}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2 text-lg font-bold">
                    <span>Total:</span>
                    <span>${getTotalPrice().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Delivery Information */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Delivery Information</h2>
            
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}
              
              {/* Delivery Location */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Location
                </label>
                <input
                  type="text"
                  name="delivery_address"
                  value={formData.delivery_address}
                  onChange={handleInputChange}
                  placeholder="e.g., Southwest Tower 401"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dormdash-red focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter your dorm name and room number
                </p>
              </div>

              {/* Pickup Location */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pickup Location (Dining Hall)
                </label>
                <select
                  name="pickup_location"
                  value={formData.pickup_location}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dormdash-red focus:border-transparent"
                >
                  <option value="">Select dining hall</option>
                  <option value="Worcester">Worcester</option>
                  <option value="Hampshire">Hampshire</option>
                  <option value="Berkshire">Berkshire</option>
                  <option value="Franklin">Franklin</option>
                </select>
              </div>

              {/* Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  name="customer_name"
                  value={formData.customer_name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dormdash-red focus:border-transparent"
                />
              </div>

              {/* Phone Number */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="customer_phone"
                  value={formData.customer_phone}
                  onChange={handleInputChange}
                  placeholder="e.g., (555) 123-4567"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dormdash-red focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  We'll use this to contact you about your order
                </p>
              </div>

              {/* Email */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="customer_email"
                  value={formData.customer_email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dormdash-red focus:border-transparent"
                />
              </div>

              {/* Special Instructions */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Instructions (Optional)
                </label>
                <textarea
                  name="special_instructions"
                  value={formData.special_instructions}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Any special requests or delivery instructions..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dormdash-red focus:border-transparent"
                />
              </div>

              {/* Place Order Button */}
              <button
                type="submit"
                disabled={submitting || cartItems.length === 0}
                className="w-full bg-dormdash-red text-white py-3 rounded-lg font-medium hover:bg-red-900 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {submitting ? 'Placing Order...' : 'Place Order'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
