import { FoodItem } from './CartContext';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { X, UtensilsCrossed } from 'lucide-react';

interface CartItemProps {
  item: FoodItem;
  onRemove: (itemId: string) => void;
}

export default function CartItem({ item, onRemove }: CartItemProps) {
  return (
    <div className="flex gap-4 p-4 bg-white rounded-lg shadow-sm border">
      <div className="w-24 h-24 flex-shrink-0 rounded overflow-hidden flex items-center justify-center" style={{ backgroundColor: '#fde8e8' }}>
        <UtensilsCrossed className="w-10 h-10" style={{ color: 'var(--umass-maroon)' }} />
      </div>
      <div className="flex-1">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="mb-1">{item.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{item.diningHall}</p>
            <div className="flex flex-wrap gap-1">
              {item.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(item.id)}
            className="hover:bg-red-100"
            style={{ color: 'var(--umass-maroon)' }}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
