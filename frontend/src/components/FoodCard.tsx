"use client"

import type { FoodItem } from "./CartContext"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Card, CardContent, CardFooter } from "./ui/card"
import { Plus, UtensilsCrossed } from "lucide-react"

interface FoodCardProps {
  item: FoodItem
  onAdd: (item: FoodItem) => void
}

export default function FoodCard({ item, onAdd }: FoodCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video overflow-hidden flex items-center justify-center bg-[#fde8e8]">
        <UtensilsCrossed className="w-16 h-16 text-umass-maroon" />
      </div>
      <CardContent className="p-4">
        <h3 className="mb-2 font-semibold">{item.item_name}</h3>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm text-gray-600 font-semibold">${item.price.toFixed(2)}</span>
          <span className="text-sm text-gray-500">{item.location}</span>
        </div>
        <p className="text-sm text-gray-600 mb-3">Category: {item.category}</p>
        {item.dietary_info && item.dietary_info.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {item.dietary_info.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          onClick={() => onAdd(item)}
          className="w-full bg-umass-maroon hover:bg-umass-maroon-dark"
          disabled={!item.available}
        >
          <Plus className="w-4 h-4 mr-2" />
          {item.available ? "Add to Order" : "Unavailable"}
        </Button>
      </CardFooter>
    </Card>
  )
}
