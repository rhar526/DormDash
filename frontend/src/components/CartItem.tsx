"use client"

import type { FoodItem } from "./CartContext"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { X, UtensilsCrossed } from "lucide-react"

interface CartItemProps {
  item: FoodItem & { cartItemId: string }
  onRemove: (cartItemId: string) => void
}

export default function CartItem({ item, onRemove }: CartItemProps) {
  return (
    <div className="flex gap-4 p-4 bg-white rounded-lg shadow-sm border">
      <div
        className="w-24 h-24 flex-shrink-0 rounded overflow-hidden flex items-center justify-center"
        style={{ backgroundColor: "#fde8e8" }}
      >
        <UtensilsCrossed className="w-10 h-10" style={{ color: "var(--umass-maroon)" }} />
      </div>
      <div className="flex-1">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="mb-1">{item.item_name}</h3>
            <p className="text-sm text-gray-600 mb-2">{item.location}</p>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-semibold">${item.price.toFixed(2)}</span>
              {item.dietary_info && item.dietary_info.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {item.dietary_info.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(item.cartItemId)}
            className="hover:bg-red-100"
            style={{ color: "var(--umass-maroon)" }}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
