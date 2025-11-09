"use client"

import { createContext, useContext, useState, type ReactNode, useCallback, useEffect } from "react"

export interface FoodItem {
  id: number
  location: string
  category: string
  item_name: string
  price: number
  dietary_info?: string[]
  available: boolean
}

interface CartItem extends FoodItem {
  cartItemId: string // Unique identifier for duplicate items in cart
}

interface CartContextType {
  cart: CartItem[]
  addToCart: (item: FoodItem) => void
  removeFromCart: (cartItemId: string) => void
  clearCart: () => void
  orderInfo: OrderInfo | null
  setOrderInfo: (info: OrderInfo | null) => void
  locations: string[]
  loadingLocations: boolean
  categories: string[]
  loadingCategories: boolean
  fetchLocations: () => Promise<void>
  fetchCategories: (location?: string) => Promise<void>
}

export interface OrderInfo {
  location: string
  phoneNumber: string
  customerName: string
  customerEmail: string
  orderId?: string
  orderNumber?: string
  estimatedTime?: string
  dasherAccepted?: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [orderInfo, setOrderInfo] = useState<OrderInfo | null>(null)
  const [locations, setLocations] = useState<string[]>([])
  const [loadingLocations, setLoadingLocations] = useState(false)
  const [categories, setCategories] = useState<string[]>([])
  const [loadingCategories, setLoadingCategories] = useState(false)

  useEffect(() => {
    const loadLocations = async () => {
      setLoadingLocations(true)
      try {
        const { fetchLocations: fetchLocationsAPI } = await import("../utils/api")
        const locs = await fetchLocationsAPI()
        setLocations(locs)
      } catch (error) {
        console.error("Error loading locations:", error)
      } finally {
        setLoadingLocations(false)
      }
    }
    loadLocations()
  }, [])

  const fetchLocationsCallback = useCallback(async () => {
    setLoadingLocations(true)
    try {
      const { fetchLocations: fetchLocationsAPI } = await import("../utils/api")
      const locs = await fetchLocationsAPI()
      setLocations(locs)
    } catch (error) {
      console.error("Error loading locations:", error)
    } finally {
      setLoadingLocations(false)
    }
  }, [])

  const fetchCategoriesCallback = useCallback(async (location?: string) => {
    setLoadingCategories(true)
    try {
      const { fetchCategories: fetchCategoriesAPI } = await import("../utils/api")
      const cats = await fetchCategoriesAPI(location)
      setCategories(cats)
    } catch (error) {
      console.error("Error loading categories:", error)
    } finally {
      setLoadingCategories(false)
    }
  }, [])

  const addToCart = (item: FoodItem) => {
    const cartItemId = `${item.id}-${Date.now()}`
    setCart((prev) => [...prev, { ...item, cartItemId }])
  }

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId))
  }

  const clearCart = () => {
    setCart([])
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        orderInfo,
        setOrderInfo,
        locations,
        loadingLocations,
        categories,
        loadingCategories,
        fetchLocations: fetchLocationsCallback,
        fetchCategories: fetchCategoriesCallback,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
