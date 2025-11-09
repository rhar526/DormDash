import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Utensils, MapPin, Clock } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <div className="text-center pt-16 pb-8">
        <h1 className="text-5xl font-bold text-dormdash-red mb-3">DormDash</h1>
        <p className="text-gray-600 text-lg">UMass Amherst Dining Hall Delivery</p>
      </div>

      {/* CTA Button */}
      <div className="text-center mb-16">
        <button
          onClick={() => navigate('/menu')}
          className="bg-dormdash-red text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-red-900 transition-colors shadow-lg"
        >
          Start Your Order
        </button>
      </div>

      {/* Feature Cards */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Choose Your Meal */}
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="w-16 h-16 bg-dormdash-pink rounded-full flex items-center justify-center mx-auto mb-4">
              <Utensils className="w-8 h-8 text-dormdash-red" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Choose Your Meal</h3>
            <p className="text-gray-600">
              Browse menus from all UMass dining halls in one place
            </p>
          </div>

          {/* Set Your Location */}
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="w-16 h-16 bg-dormdash-pink rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-dormdash-red" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Set Your Location</h3>
            <p className="text-gray-600">
              Enter your dorm or campus location for delivery
            </p>
          </div>

          {/* Track Delivery */}
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="w-16 h-16 bg-dormdash-pink rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-dormdash-red" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Track Delivery</h3>
            <p className="text-gray-600">
              Get real-time updates on your order status
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-8 border-t border-gray-200">
        <p className="text-gray-500">
          Serving Worcester • Hampshire • Berkshire • Franklin
        </p>
      </div>
    </div>
  );
};

export default Home;
