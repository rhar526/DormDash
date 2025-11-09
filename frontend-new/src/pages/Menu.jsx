import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Utensils, ChevronDown } from 'lucide-react';
import { useCart } from '../context/CartContext';
import AIChatbot from '../components/AIChatbot';

const Menu = () => {
  const navigate = useNavigate();
  const { addToCart, getTotalItems } = useCart();
  
  const [menuItems, setMenuItems] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedTags, setSelectedTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [aiFilteredItems, setAiFilteredItems] = useState(null);

  const dietaryTags = [
    'Vegetarian', 'Plant Based', 'Halal', 'Whole Grain',
    'Local', 'Sustainable', 'Antibiotic Free'
  ];

  useEffect(() => {
    fetchLocations();
    fetchMenuItems();
  }, [selectedLocation]);

  const fetchLocations = async () => {
    try {
      const response = await fetch('/api/locations');
      const data = await response.json();
      setLocations(['All', ...data.locations]);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const url = selectedLocation === 'All' 
        ? '/api/menu' 
        : `/api/menu?location=${encodeURIComponent(selectedLocation)}`;
      
      const response = await fetch(url);
      const data = await response.json();
      setMenuItems(data.menu_items || []);
    } catch (error) {
      console.error('Error fetching menu items:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  // If AI has filtered items, use those; otherwise use tag filters
  const filteredItems = (aiFilteredItems || menuItems).filter(item => {
    if (selectedTags.length === 0) return true;
    
    const itemTags = item.tags || [];
    return selectedTags.some(tag => 
      itemTags.some(dietTag => 
        dietTag.toLowerCase().includes(tag.toLowerCase()) ||
        tag.toLowerCase().includes(dietTag.toLowerCase())
      ) ||
      item.category?.toLowerCase().includes(tag.toLowerCase())
    );
  });

  const handleAIFilter = (filteredResults) => {
    setAiFilteredItems(filteredResults);
  };

  const handleAddToCart = (item) => {
    addToCart(item);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </button>
            
            <h1 className="text-2xl font-bold text-dormdash-red">DormDash</h1>
            
            <button
              onClick={() => navigate('/checkout')}
              className="flex items-center bg-dormdash-red text-white px-4 py-2 rounded-lg hover:bg-red-900 transition-colors"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Checkout ({getTotalItems()})
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Dining Hall Selector */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Dining Hall</h2>
          <div className="relative">
            <button
              onClick={() => setShowLocationDropdown(!showLocationDropdown)}
              className="w-full md:w-64 bg-white border border-gray-300 rounded-lg px-4 py-2 flex items-center justify-between hover:border-gray-400"
            >
              <span>{selectedLocation}</span>
              <ChevronDown className="w-5 h-5" />
            </button>
            
            {showLocationDropdown && (
              <div className="absolute top-full mt-1 w-full md:w-64 bg-white border border-gray-300 rounded-lg shadow-lg z-20">
                {locations.map(location => (
                  <button
                    key={location}
                    onClick={() => {
                      setSelectedLocation(location);
                      setShowLocationDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                      selectedLocation === location ? 'bg-gray-50 font-medium' : ''
                    }`}
                  >
                    {location}
                    {selectedLocation === location && (
                      <span className="float-right">✓</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Filter by Tags */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Filter by Tags</h2>
          <div className="flex flex-wrap gap-2">
            {dietaryTags.map(tag => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  selectedTags.includes(tag)
                    ? 'bg-dormdash-red text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Items Count */}
        <div className="mb-4">
          <p className="text-gray-600">
            Showing {filteredItems.length} items
          </p>
        </div>

        {/* Menu Items Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-dormdash-red"></div>
            <p className="mt-4 text-gray-600">Loading menu items...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map(item => (
              <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Placeholder Image */}
                <div className="bg-dormdash-pink h-48 flex items-center justify-center">
                  <Utensils className="w-16 h-16 text-dormdash-red" />
                </div>
                
                {/* Item Details */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{item.item_name}</h3>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                    {item.category || 'No description available'}
                  </p>
                  <p className="text-gray-500 text-sm mb-3">{item.location}</p>
                  
                  {/* Dietary Tags */}
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {item.tags.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {/* Add to Order Button */}
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="w-full bg-dormdash-red text-white py-2 rounded-lg font-medium hover:bg-red-900 transition-colors flex items-center justify-center"
                  >
                    <span className="mr-2">+</span>
                    Add to Order
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No items found matching your filters.</p>
          </div>
        )}
      </div>

      {/* AI Chatbot */}
      <AIChatbot menuItems={menuItems} onFilterResults={handleAIFilter} />
    </div>
  );
};

export default Menu;
