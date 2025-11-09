"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useCart, type FoodItem } from "./CartContext"
import { fetchMenu } from "../utils/api"
import FoodCard from "./FoodCard"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { ShoppingCart, ArrowLeft, X, Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

export default function OrderPage() {
  const navigate = useNavigate()
  const { cart, addToCart, locations, fetchCategories, loadingLocations, loadingCategories } = useCart()
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedDiningHall, setSelectedDiningHall] = useState<string>(locations[0] || "All")
  const [allMenuItems, setAllMenuItems] = useState<FoodItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadMenu = async () => {
      setLoading(true)
      try {
        const location = selectedDiningHall === "All" ? undefined : selectedDiningHall
        const items = await fetchMenu(location)
        setAllMenuItems(items)
        if (location) {
          await fetchCategories(location)
        } else {
          await fetchCategories()
        }
      } catch (error) {
        console.error("Error loading menu:", error)
      } finally {
        setLoading(false)
      }
    }
    loadMenu()
  }, [selectedDiningHall, fetchCategories])

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const filteredItems = allMenuItems.filter((item: FoodItem) => {
    if (selectedTags.length === 0) return true
    const dietaryInfo = item.dietary_info || []
    return selectedTags.every((tag) => dietaryInfo.includes(tag))
  })

  const availableTags = Array.from(new Set(allMenuItems.flatMap((item) => item.dietary_info || [])))

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" onClick={() => navigate("/")} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
            <h1 className="text-3xl text-umass-maroon">DormDash</h1>
            <Button
              onClick={() => navigate("/checkout")}
              className="gap-2 bg-umass-maroon hover:bg-umass-maroon-dark"
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
                  <SelectValue placeholder="Loading..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Locations</SelectItem>
                  {locations.map((hall) => (
                    <SelectItem key={hall} value={hall}>
                      {hall}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block mb-2">Filter by Dietary Info</label>
              <div className="flex flex-wrap gap-2">
                {availableTags.length > 0 ? (
                  availableTags.map((tag: string) => (
                    <Badge
                      key={tag}
                      variant={selectedTags.includes(tag) ? "default" : "outline"}
                      className={`cursor-pointer ${
                        selectedTags.includes(tag) ? "bg-umass-maroon border-umass-maroon" : ""
                      }`}
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                      {selectedTags.includes(tag) && <X className="w-3 h-3 ml-1" />}
                    </Badge>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">Loading dietary options...</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {loading || loadingLocations || loadingCategories ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : (
          <>
            <p className="mb-4 text-gray-600">Showing {filteredItems.length} items</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item: FoodItem) => (
                <FoodCard key={item.id} item={item} onAdd={addToCart} />
              ))}
            </div>

            {filteredItems.length === 0 && (
              <div className="text-center py-16">
                <p className="text-gray-500">No items match your filters. Try adjusting your selection.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
