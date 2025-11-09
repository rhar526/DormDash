import type { FoodItem } from './CartContext';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardFooter } from './ui/card';
import { Plus, UtensilsCrossed } from 'lucide-react';
interface FoodCardProps {
  item: FoodItem;
  onAdd: (item: FoodItem) => void;
}

export default function FoodCard({ item, onAdd }: FoodCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video overflow-hidden flex items-center justify-center" style={{ backgroundColor: '#fde8e8' }}>
        <UtensilsCrossed className="w-16 h-16" style={{ color: 'var(--umass-maroon)' }} />
      </div>
      <CardContent className="p-4">
        <h3 className="mb-2">{item.name}</h3>
        <p className="text-sm text-gray-600 mb-3">{item.description}</p>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm text-gray-500">{item.diningHall}</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {item.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          onClick={() => onAdd(item)}
          className="w-full"
          style={{ backgroundColor: 'var(--umass-maroon)' }}
          onMouseEnter={(e: { currentTarget: { style: { backgroundColor: string; }; }; }) => e.currentTarget.style.backgroundColor = 'var(--umass-maroon-dark)'}
          onMouseLeave={(e: { currentTarget: { style: { backgroundColor: string; }; }; }) => e.currentTarget.style.backgroundColor = 'var(--umass-maroon)'}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add to Order
        </Button>
      </CardFooter>
    </Card>
  );
}
