"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { CheckCircle2, Home, Package, AlertCircle, UtensilsCrossed, Loader2 } from "lucide-react"
import { toast } from "sonner"

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api"

interface OrderDetails {
  order_number: string
  items: Array<{
    item_name: string
    category: string
    quantity: number
    price: number
  }>
  delivery_address: string
  customer_phone: string
  customer_name: string
  customer_email: string
  pickup_location: string
  total_amount: number
  created_at: string
}

export default function DasherConfirmPage() {
  const { token } = useParams<{ token: string }>()
  const navigate = useNavigate()
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)
  const [isAccepted, setIsAccepted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!token) {
        setError("Invalid token")
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch(`${API_BASE}/dasher/order/${token}`)
        if (!response.ok) {
          throw new Error("Order not found or token expired")
        }
        const data = await response.json()
        setOrderDetails(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load order details")
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrderDetails()
  }, [token])

  const handleAcceptOrder = async () => {
    if (!token) return

    setIsSubmitting(true)
    try {
      const response = await fetch(`${API_BASE}/dasher/accept/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      if (!response.ok) {
        throw new Error("Failed to accept order")
      }

      setIsAccepted(true)
      toast.success("Order accepted! Customer has been notified.")
    } catch (err) {
      console.error("Error accepting order:", err)
      toast.error(err instanceof Error ? err.message : "Failed to accept order")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    )
  }

  if (error || !orderDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-umass-maroon">
              <AlertCircle className="w-5 h-5" />
              Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{error || "Order not found"}</p>
            <Button onClick={() => navigate("/")} className="w-full">
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl mb-2 text-umass-maroon">Dasher Portal</h1>
          <p className="text-gray-600">Order #{orderDetails.order_number}</p>
        </div>

        {isAccepted ? (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="text-center">
                <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h2 className="mb-2 text-xl font-semibold">Order Accepted!</h2>
                <p className="text-gray-600 mb-6">The customer has been notified and is waiting for their delivery.</p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-left">
                  <p className="mb-2">
                    <span className="text-gray-600 font-semibold">Customer:</span> {orderDetails.customer_name}
                  </p>
                  <p className="mb-2">
                    <span className="text-gray-600 font-semibold">Email:</span> {orderDetails.customer_email}
                  </p>
                  <p className="mb-2">
                    <span className="text-gray-600 font-semibold">Phone:</span> {orderDetails.customer_phone}
                  </p>
                  <p className="mb-2">
                    <span className="text-gray-600 font-semibold">Pickup:</span> {orderDetails.pickup_location}
                  </p>
                  <p>
                    <span className="text-gray-600 font-semibold">Delivery:</span> {orderDetails.delivery_address}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  New Order Available
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Customer Name</p>
                    <p className="font-semibold">{orderDetails.customer_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Pickup Location</p>
                    <p>{orderDetails.pickup_location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Delivery Address</p>
                    <p>{orderDetails.delivery_address}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Customer Contact</p>
                    <p>{orderDetails.customer_phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Order Total</p>
                    <p className="text-lg font-semibold">${orderDetails.total_amount.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Order Items ({orderDetails.items.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {orderDetails.items.map((item, index) => (
                    <div key={index} className="flex gap-3 items-start p-3 bg-gray-50 rounded-lg">
                      <div className="w-16 h-16 flex-shrink-0 rounded overflow-hidden flex items-center justify-center bg-[#fde8e8]">
                        <UtensilsCrossed className="w-8 h-8 text-umass-maroon" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">{item.item_name}</p>
                        <p className="text-sm text-gray-500">{item.category}</p>
                        <p className="text-sm font-semibold">
                          ${item.price.toFixed(2)} x {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={handleAcceptOrder}
              className="w-full bg-green-600 hover:bg-green-700"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Accepting...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Accept This Order
                </>
              )}
            </Button>
          </>
        )}

        <div className="mt-4">
          <Button variant="outline" onClick={() => navigate("/")} className="w-full">
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  )
}
