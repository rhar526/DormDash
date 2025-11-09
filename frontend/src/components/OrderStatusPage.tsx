/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useCart } from "./CartContext"
import { getOrder } from "../utils/api"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { CheckCircle2, Clock, Home, Package, UtensilsCrossed, Loader2 } from "lucide-react"

export default function OrderStatusPage() {
  const navigate = useNavigate()
  const { orderNumber } = useParams<{ orderNumber: string }>()
  const { setOrderInfo, clearCart } = useCart()
  const [orderData, setOrderData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pollCount, setPollCount] = useState(0)

  useEffect(() => {
    if (!orderNumber) {
      navigate("/")
      return
    }

    const fetchOrderStatus = async () => {
      try {
        const order = await getOrder(orderNumber)
        setOrderData(order)
        setError(null)

        // Auto-refresh for pending orders
        if (order.status === "pending" && pollCount < 60) {
          const timer = setTimeout(() => {
            setPollCount((p) => p + 1)
          }, 5000) // Poll every 5 seconds
          return () => clearTimeout(timer)
        }
      } catch (err) {
        setError("Failed to load order")
        console.error("Error fetching order:", err)
      } finally {
        setLoading(false)
      }
    }

    setLoading(true)
    fetchOrderStatus()
  }, [orderNumber, navigate, pollCount])

  const handleNewOrder = () => {
    clearCart()
    setOrderInfo(null)
    navigate("/order")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Loading order status...</p>
        </div>
      </div>
    )
  }

  if (error || !orderData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error || "Order not found"}</p>
            <Button onClick={() => navigate("/")} style={{ backgroundColor: "var(--umass-maroon)" }}>
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const isPending = orderData.status === "pending"
  const isAccepted = orderData.status === "accepted"
  const isDelivered = orderData.status === "delivered"

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl mb-2" style={{ color: "var(--umass-maroon)" }}>
            Order Status
          </h1>
          <p className="text-gray-600">Order #{orderData.order_number}</p>
        </div>

        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {isPending && (
                  <>
                    <Clock className="w-5 h-5 text-yellow-600" />
                    Waiting for Dasher
                  </>
                )}
                {isAccepted && (
                  <>
                    <Package className="w-5 h-5 text-blue-600" />
                    Order Confirmed
                  </>
                )}
                {isDelivered && (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    Order Delivered
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isPending && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800 flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Your order has been sent to dashers. Waiting for acceptance...
                    </p>
                  </div>
                )}

                {isAccepted && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800 mb-2">A dasher has accepted your order! Your food is on the way.</p>
                    {orderData.dasher_name && <p className="text-blue-600 text-sm">Dasher: {orderData.dasher_name}</p>}
                  </div>
                )}

                {isDelivered && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-800">Your order has been delivered. Enjoy your meal!</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Delivery Location</p>
                    <p>{orderData.delivery_address}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Contact Number</p>
                    <p>{orderData.customer_phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Pickup Location</p>
                    <p>{orderData.pickup_location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Status</p>
                    <Badge
                      className={
                        isPending ? "bg-yellow-100 text-yellow-800" : isAccepted ? "bg-blue-600" : "bg-green-600"
                      }
                    >
                      {isPending ? "Pending" : isAccepted ? "In Progress" : "Delivered"}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8">
          <h2 className="mb-4">Your Order Items</h2>
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="space-y-3">
              {orderData.items &&
                orderData.items.map((item: any, index: number) => (
                  <div key={index} className="flex gap-3 items-start">
                    <div
                      className="w-16 h-16 flex-shrink-0 rounded overflow-hidden flex items-center justify-center"
                      style={{ backgroundColor: "#fde8e8" }}
                    >
                      <UtensilsCrossed className="w-8 h-8" style={{ color: "var(--umass-maroon)" }} />
                    </div>
                    <div className="flex-1">
                      <p>{item.item_name || item.name}</p>
                      <p className="text-sm text-gray-500">{item.category}</p>
                      <p className="text-sm font-semibold">${item.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <p className="font-semibold">Total: ${orderData.total_amount.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          {isDelivered && (
            <Button
              onClick={handleNewOrder}
              className="flex-1"
              style={{ backgroundColor: "var(--umass-maroon)" }}
              onMouseEnter={(e: { currentTarget: { style: { backgroundColor: string } } }) => (e.currentTarget.style.backgroundColor = "var(--umass-maroon-dark)")}
              onMouseLeave={(e: { currentTarget: { style: { backgroundColor: string } } }) => (e.currentTarget.style.backgroundColor = "var(--umass-maroon)")}
            >
              Place New Order
            </Button>
          )}

          <Button variant="outline" onClick={() => navigate("/")} className="flex-1">
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  )
}
