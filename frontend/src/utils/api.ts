const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api"

export interface MenuItem {
  id: number
  location: string
  category: string
  item_name: string
  price: number
  dietary_info?: string[]
  available: boolean
}

export interface OrderItem {
  name: string
  category: string
  quantity: number
  price: number
  special_instructions?: string
}

export interface OrderRequest {
  customer_name: string
  customer_email: string
  customer_phone: string
  delivery_address: string
  pickup_location: string
  items: OrderItem[]
  total_amount: number
  special_instructions?: string
}

export interface Order {
  id: number
  order_number: string
  customer_name: string
  customer_email: string
  customer_phone: string
  delivery_address: string
  pickup_location: string
  total_amount: number
  status: string
  dasher_name?: string
  dasher_email?: string
  dasher_phone?: string
  created_at: string
  accepted_at?: string
  items: OrderItem[]
}

// Menu API calls
export const fetchMenu = async (location?: string): Promise<MenuItem[]> => {
  try {
    const params = new URLSearchParams()
    if (location) params.append("location", location)
    const response = await fetch(`${API_BASE}/menu?${params}`)
    const data = await response.json()
    return data.menu_items || []
  } catch (error) {
    console.error("Error fetching menu:", error)
    return []
  }
}

export const fetchLocations = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${API_BASE}/locations`)
    const data = await response.json()
    return data.locations || []
  } catch (error) {
    console.error("Error fetching locations:", error)
    return []
  }
}

export const fetchCategories = async (location?: string): Promise<string[]> => {
  try {
    const params = new URLSearchParams()
    if (location) params.append("location", location)
    const response = await fetch(`${API_BASE}/categories?${params}`)
    const data = await response.json()
    return data.categories || []
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}

// Order API calls
export const createOrder = async (orderData: OrderRequest): Promise<{ order_number: string; message: string }> => {
  try {
    const response = await fetch(`${API_BASE}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "Failed to create order")
    }
    return await response.json()
  } catch (error) {
    console.error("Error creating order:", error)
    throw error
  }
}

export const getOrder = async (orderNumber: string): Promise<Order> => {
  try {
    const response = await fetch(`${API_BASE}/orders/${orderNumber}`)
    if (!response.ok) {
      throw new Error("Order not found")
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching order:", error)
    throw error
  }
}

export const getOrderStatus = async (
  orderNumber: string,
): Promise<{ status: string; dasher_name?: string; accepted_at?: string }> => {
  try {
    const order = await getOrder(orderNumber)
    return {
      status: order.status,
      dasher_name: order.dasher_name,
      accepted_at: order.accepted_at,
    }
  } catch (error) {
    console.error("Error fetching order status:", error)
    throw error
  }
}
