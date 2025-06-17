"use client"

import { createContext, useContext, useReducer, useEffect, useCallback, type ReactNode } from "react"
import { api } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import { toast } from "@/components/ui/use-toast"

interface CartItem {
  _id: string
  product: {
    _id: string
    name: string
    price: number
    images: Array<{ url: string; alt: string; isPrimary: boolean }>
    stock: number
    brand: string
  }
  quantity: number
  price: number
  total: number
}

interface CartState {
  items: CartItem[]
  subtotal: number
  tax: number
  shipping: number
  total: number
  itemCount: number
  loading: boolean
  error: string | null
}

type CartAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_CART"; payload: Omit<CartState, "loading" | "error"> }
  | { type: "CLEAR_CART" }

const initialState: CartState = {
  items: [],
  subtotal: 0,
  tax: 0,
  shipping: 0,
  total: 0,
  itemCount: 0,
  loading: false,
  error: null,
}

interface CartContextType {
  state: CartState
  addItem: (productId: string, quantity?: number) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
  updateQuantity: (itemId: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  refreshCart: () => Promise<void>
  items: CartItem[]
  total: number
  itemCount: number
  loading: boolean
  error: string | null
}

const CartContext = createContext<CartContextType | null>(null)

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload }

    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false }

    case "SET_CART":
      return {
        ...state,
        ...action.payload,
        loading: false,
        error: null,
      }

    case "CLEAR_CART":
      return {
        ...initialState,
        loading: false,
        error: null,
      }

    default:
      return state
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)
  const { isAuthenticated } = useAuth()

  // Fetch cart when user is authenticated
  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      dispatch({ type: "CLEAR_CART" })
      return
    }

    try {
      dispatch({ type: "SET_LOADING", payload: true })
      const response = await api.getCart()

      if (response && response.success && response.cart) {
        dispatch({
          type: "SET_CART",
          payload: {
            items: response.cart.items || [],
            subtotal: response.cart.subtotal || 0,
            tax: response.cart.tax || 0,
            shipping: response.cart.shipping || 0,
            total: response.cart.total || 0,
            itemCount: response.cart.itemCount || 0,
          },
        })
      } else {
        dispatch({ type: "SET_ERROR", payload: response?.message || "Failed to load cart" })
      }
    } catch (error: any) {
      console.error("Failed to fetch cart:", error)
      dispatch({ type: "SET_ERROR", payload: error?.message || "Failed to load cart" })
    }
  }, [isAuthenticated])

  // Add item to cart
  const addItem = useCallback(
    async (productId: string, quantity = 1) => {
      if (!isAuthenticated) {
        toast({
          title: "Authentication required",
          description: "Please sign in to add items to your cart.",
          variant: "destructive",
        })
        return
      }

      if (!productId) {
        toast({
          title: "Error",
          description: "Invalid product ID.",
          variant: "destructive",
        })
        return
      }

      try {
        dispatch({ type: "SET_LOADING", payload: true })
        const response = await api.addToCart(productId, quantity)

        if (response && response.success) {
          await refreshCart()
          toast({
            title: "Added to cart",
            description: "Item has been added to your cart.",
          })
        } else {
          dispatch({ type: "SET_ERROR", payload: response?.message || "Failed to add item" })
          toast({
            title: "Error",
            description: response?.message || "Failed to add item to cart.",
            variant: "destructive",
          })
        }
      } catch (error: any) {
        console.error("Failed to add item to cart:", error)
        dispatch({ type: "SET_ERROR", payload: error?.message || "Failed to add item" })
        toast({
          title: "Error",
          description: error?.message || "Failed to add item to cart.",
          variant: "destructive",
        })
      }
    },
    [isAuthenticated, refreshCart],
  )

  // Remove item from cart
  const removeItem = useCallback(
    async (itemId: string) => {
      if (!isAuthenticated) return

      if (!itemId) {
        toast({
          title: "Error",
          description: "Invalid item ID.",
          variant: "destructive",
        })
        return
      }

      try {
        dispatch({ type: "SET_LOADING", payload: true })
        const response = await api.removeFromCart(itemId)

        if (response && response.success) {
          await refreshCart()
          toast({
            title: "Item removed",
            description: "Item has been removed from your cart.",
          })
        } else {
          dispatch({ type: "SET_ERROR", payload: response?.message || "Failed to remove item" })
          toast({
            title: "Error",
            description: response?.message || "Failed to remove item.",
            variant: "destructive",
          })
        }
      } catch (error: any) {
        console.error("Failed to remove item from cart:", error)
        dispatch({ type: "SET_ERROR", payload: error?.message || "Failed to remove item" })
        toast({
          title: "Error",
          description: error?.message || "Failed to remove item.",
          variant: "destructive",
        })
      }
    },
    [isAuthenticated, refreshCart],
  )

  // Update item quantity
  const updateQuantity = useCallback(
    async (itemId: string, quantity: number) => {
      if (!isAuthenticated) return

      if (!itemId || quantity < 0) {
        toast({
          title: "Error",
          description: "Invalid item ID or quantity.",
          variant: "destructive",
        })
        return
      }

      try {
        dispatch({ type: "SET_LOADING", payload: true })
        const response = await api.updateCartItem(itemId, quantity)

        if (response && response.success) {
          await refreshCart()
        } else {
          dispatch({ type: "SET_ERROR", payload: response?.message || "Failed to update quantity" })
          toast({
            title: "Error",
            description: response?.message || "Failed to update quantity.",
            variant: "destructive",
          })
        }
      } catch (error: any) {
        console.error("Failed to update quantity:", error)
        dispatch({ type: "SET_ERROR", payload: error?.message || "Failed to update quantity" })
        toast({
          title: "Error",
          description: error?.message || "Failed to update quantity.",
          variant: "destructive",
        })
      }
    },
    [isAuthenticated, refreshCart],
  )

  // Clear cart
  const clearCart = useCallback(async () => {
    if (!isAuthenticated) return

    try {
      dispatch({ type: "SET_LOADING", payload: true })
      const response = await api.clearCart()

      if (response && response.success) {
        dispatch({ type: "CLEAR_CART" })
        toast({
          title: "Cart cleared",
          description: "All items have been removed from your cart.",
        })
      } else {
        dispatch({ type: "SET_ERROR", payload: response?.message || "Failed to clear cart" })
        toast({
          title: "Error",
          description: response?.message || "Failed to clear cart.",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      console.error("Failed to clear cart:", error)
      dispatch({ type: "SET_ERROR", payload: error?.message || "Failed to clear cart" })
      toast({
        title: "Error",
        description: error?.message || "Failed to clear cart.",
        variant: "destructive",
      })
    }
  }, [isAuthenticated])

  // Load cart when user authentication changes
  useEffect(() => {
    if (isAuthenticated) {
      refreshCart()
    } else {
      dispatch({ type: "CLEAR_CART" })
    }
  }, [isAuthenticated, refreshCart])

  const contextValue: CartContextType = {
    state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    refreshCart,
    items: state.items,
    total: state.total,
    itemCount: state.itemCount,
    loading: state.loading,
    error: state.error,
  }

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

// Export types for use in other components
export type { CartItem, CartState }
