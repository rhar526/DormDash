import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart, type FoodItem } from './CartContext';
import { MOCK_FOOD_ITEMS, FOOD_TAGS, DINING_HALLS } from './mockData';
import FoodCard from './FoodCard';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ShoppingCart, ArrowLeft, X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

export default function OrderPage() {
  const navigate = useNavigate();
  const { cart, addToCart } = useCart();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedDiningHall, setSelectedDiningHall] = useState<string>('All');

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const filteredItems = MOCK_FOOD_ITEMS.filter((item: { tags: string | string[]; diningHall: string; }) => {
    const matchesTags = selectedTags.length === 0 || selectedTags.every(tag => item.tags.includes(tag));
    const matchesDiningHall = selectedDiningHall === 'All' || item.diningHall === selectedDiningHall;
    return matchesTags && matchesDiningHall;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
            <h1 className="text-3xl" style={{ color: 'var(--umass-maroon)' }}>DormDash</h1>
            <Button
              onClick={() => navigate('/checkout')}
              className="gap-2"
              style={{ backgroundColor: 'var(--umass-maroon)' }}
              onMouseEnter={(e: { currentTarget: { style: { backgroundColor: string; }; }; }) => e.currentTarget.style.backgroundColor = 'var(--umass-maroon-dark)'}
              onMouseLeave={(e: { currentTarget: { style: { backgroundColor: string; }; }; }) => e.currentTarget.style.backgroundColor = 'var(--umass-maroon)'}
              disabled={cart.length === 0}
            >
              <ShoppingCart className="w-4 h-4" />
              Checkout ({cart.length})
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block mb-2">Dining Hall</label>
              <Select value={selectedDiningHall} onValueChange={setSelectedDiningHall}>
                <SelectTrigger className="w-full md:w-64">
                  <SelectValue placeholder="Select dining hall" />
                </SelectTrigger>
                <SelectContent>
                  {DINING_HALLS.map((hall: any) => (
                    <SelectItem key={hall} value={hall}>
                      {hall}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block mb-2">Filter by Tags</label>
              <div className="flex flex-wrap gap-2">
                {FOOD_TAGS.map((tag: string) => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    style={selectedTags.includes(tag) ? { 
                      backgroundColor: 'var(--umass-maroon)',
                      borderColor: 'var(--umass-maroon)'
                    } : {}}
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                    {selectedTags.includes(tag) && (
                      <X className="w-3 h-3 ml-1" />
                    )}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <p className="mb-4 text-gray-600">
          Showing {filteredItems.length} items
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item: FoodItem) => (
            <FoodCard
              key={item.id}
              item={item}
              onAdd={addToCart}
            />
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500">No items match your filters. Try adjusting your selection.</p>
          </div>
        )}
      </div>
    </div>
  );
}
