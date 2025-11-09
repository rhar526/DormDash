"use client"

import { useNavigate } from "react-router-dom"
import { Button } from "./ui/button"
import { UtensilsCrossed, Clock, MapPin } from "lucide-react"

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f4f4] to-[#fef9f7]">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-6xl mb-4 text-umass-maroon">DormDash</h1>
          <p className="text-xl text-gray-600 mb-8">UMass Amherst Dining Hall Delivery</p>
          <Button
            onClick={() => navigate("/order")}
            size="lg"
            className="text-xl px-8 py-6 bg-umass-maroon hover:bg-umass-maroon-dark"
          >
            Start Your Order
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-[#fde8e8]">
              <UtensilsCrossed className="w-8 h-8 text-umass-maroon" />
            </div>
            <h3 className="mb-2 font-semibold">Choose Your Meal</h3>
            <p className="text-gray-600">Browse menus from all UMass dining halls in one place</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-[#fde8e8]">
              <MapPin className="w-8 h-8 text-umass-maroon" />
            </div>
            <h3 className="mb-2 font-semibold">Set Your Location</h3>
            <p className="text-gray-600">Enter your dorm or campus location for delivery</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-[#fde8e8]">
              <Clock className="w-8 h-8 text-umass-maroon" />
            </div>
            <h3 className="mb-2 font-semibold">Track Delivery</h3>
            <p className="text-gray-600">Get real-time updates on your order status</p>
          </div>
        </div>

        <div className="mt-16 text-center text-gray-500">
          <p>Serving Worcester • Hampshire • Berkshire • Franklin</p>
        </div>
      </div>
    </div>
  )
}
