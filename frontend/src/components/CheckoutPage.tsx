"use client"

import type React from "react"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useCart } from "./CartContext"
import { createOrder } from "../utils/api"
import CartItem from "./CartItem"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { ArrowLeft, ShoppingBag, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { cart, removeFromCart, setOrderInfo, locations } = useCart()
  const [customerName, setCustomerName] = useState("")
  const [customerEmail, setCustomerEmail] = useState("")
  const [location, setLocation] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [pickupLocation, setPickupLocation] = useState(locations[0] || "")
  const [specialInstructions, setSpecialInstructions] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (cart.length === 0) {
      toast.error("Your cart is empty")
      return
    }

    if (!customerName.trim() || !customerEmail.trim() || !location.trim() || !phoneNumber.trim() || !pickupLocation) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)

    try {
      const orderData = {
        customer_name: customerName.trim(),
        customer_email: customerEmail.trim(),
        customer_phone: phoneNumber.trim(),
        delivery_address: location.trim(),
        pickup_location: pickupLocation,
        special_instructions: specialInstructions.trim(),
        items: cart.map((item) => ({
          name: item.item_name,
          category: item.category,
          quantity: 1,
          price: item.price,
        })),
        total_amount: cart.reduce((sum, item) => sum + item.price, 0),
      }

      const result = await createOrder(orderData)

      // Store order info in context for status page
      setOrderInfo({
        location: location.trim(),
        phoneNumber: phoneNumber.trim(),
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        orderNumber: result.order_number,
        estimatedTime: "25-30 minutes",
        dasherAccepted: false,
      })

      toast.success("Order placed successfully!")

      // Navigate to status page after a short delay
      setTimeout(() => {
        navigate(`/status/${result.order_number}`)
      }, 500)
    } catch (error) {
      console.error("Error submitting order:", error)
      toast.error(error instanceof Error ? error.message : "Failed to place order. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <Button variant="ghost" onClick={() => navigate("/order")} className="gap-2 mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to Order
          </Button>
          <div className="text-center py-16">
            <ShoppingBag className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h2 className="mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-4">Add some items to get started</p>
            <Button
              onClick={() => navigate("/order")}
              style={{ backgroundColor: "var(--umass-maroon)" }}
              onMouseEnter={(e: { currentTarget: { style: { backgroundColor: string } } }) =>
                (e.currentTarget.style.backgroundColor = "var(--umass-maroon-dark)")
              }
              onMouseLeave={(e: { currentTarget: { style: { backgroundColor: string } } }) =>
                (e.currentTarget.style.backgroundColor = "var(--umass-maroon)")
              }
            >
              Browse Menu
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={() => navigate("/order")} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Order
          </Button>
          <h1 className="text-3xl" style={{ color: "var(--umass-maroon)" }}>
            Checkout
          </h1>
          <div className="w-24"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="mb-4">Your Order</h2>
            <div className="space-y-3">
              {cart.map((item) => (
                <CartItem key={item.cartItemId} item={item} onRemove={removeFromCart} />
              ))}
            </div>
            <div className="mt-4 p-4 bg-white rounded-lg shadow-sm border">
              <p className="text-gray-600">Total Items: {cart.length}</p>
              <p className="font-semibold text-lg mt-2">Total: ${totalPrice.toFixed(2)}</p>
            </div>
          </div>

          <div>
            <h2 className="mb-4">Delivery Information</h2>
            <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-sm border">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="e.g., John Doe"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="e.g., john@umass.edu"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="pickup">Pickup Location</Label>
                <Select value={pickupLocation} onValueChange={setPickupLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select dining hall" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((loc) => (
                      <SelectItem key={loc} value={loc}>
                        {loc}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="location">Delivery Location</Label>
                <Input
                  id="location"
                  type="text"
                  placeholder="e.g., Southwest Tower 401"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                  className="mt-1"
                />
                <p className="text-sm text-gray-500 mt-1">Enter your dorm name and room number</p>
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="e.g., (555) 123-4567"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  className="mt-1"
                />
                <p className="text-sm text-gray-500 mt-1">We'll use this to contact you about your order</p>
              </div>

              <div>
                <Label htmlFor="instructions">Special Instructions (Optional)</Label>
                <Input
                  id="instructions"
                  type="text"
                  placeholder="e.g., No onions, extra sauce"
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  className="mt-1"
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                style={{ backgroundColor: "var(--umass-maroon)" }}
                onMouseEnter={(e: { currentTarget: { style: { backgroundColor: string } } }) =>
                  (e.currentTarget.style.backgroundColor = "var(--umass-maroon-dark)")
                }
                onMouseLeave={(e: { currentTarget: { style: { backgroundColor: string } } }) =>
                  (e.currentTarget.style.backgroundColor = "var(--umass-maroon)")
                }
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  "Place Order"
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
