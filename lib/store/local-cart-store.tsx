"use client"

import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react"
import { toast } from "@/components/ui/use-toast"

interface LocalCartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
}

interface LocalCartState {
  items: LocalCartItem[]
  total: number
}

type LocalCartAction =
  | { type: "ADD_ITEM"; payload: Omit<LocalCartItem, "quantity"> }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: LocalCartState }

const LocalCartContext = createContext<{
  state: LocalCartState
  addItem: (item: Omit<LocalCartItem, "quantity">) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  items: LocalCartItem[]
  total: number
} | null>(null)

function localCartReducer(state: LocalCartState, action: LocalCartAction): LocalCartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.items.find((item) => item.id === action.payload.id)

      if (existingItem) {
        const updatedItems = state.items.map((item) =>
          item.id === action.payload.id ? { ...item, quantity: item.quantity + 1 } : item,
        )
        return {
          items: updatedItems,
          total: updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
        }
      }

      const newItems = [...state.items, { ...action.payload, quantity: 1 }]
      return {
        items: newItems,
        total: newItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
      }
    }

    case "REMOVE_ITEM": {
      const newItems = state.items.filter((item) => item.id !== action.payload)
      return {
        items: newItems,
        total: newItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
      }
    }

    case "UPDATE_QUANTITY": {
      const newItems = state.items
        .map((item) =>
          item.id === action.payload.id ? { ...item, quantity: Math.max(0, action.payload.quantity) } : item,
        )
        .filter((item) => item.quantity > 0)

      return {
        items: newItems,
        total: newItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
      }
    }

    case "CLEAR_CART":
      return { items: [], total: 0 }

    case "LOAD_CART":
      return action.payload

    default:
      return state
  }
}

// Load cart from localStorage
const loadCartFromStorage = (): LocalCartState => {
  if (typeof window === "undefined") {
    return { items: [], total: 0 }
  }

  try {
    const savedCart = localStorage.getItem("localCart")
    if (savedCart) {
      return JSON.parse(savedCart)
    }
  } catch (error) {
    console.error("Failed to load cart from localStorage:", error)
  }

  return { items: [], total: 0 }
}

// Save cart to localStorage
const saveCartToStorage = (cart: LocalCartState) => {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem("localCart", JSON.stringify(cart))
  } catch (error) {
    console.error("Failed to save cart to localStorage:", error)
  }
}

export function LocalCartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(localCartReducer, { items: [], total: 0 })

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = loadCartFromStorage()
    dispatch({ type: "LOAD_CART", payload: savedCart })
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    saveCartToStorage(state)
  }, [state])

  const addItem = (item: Omit<LocalCartItem, "quantity">) => {
    dispatch({ type: "ADD_ITEM", payload: item })
    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart.`,
    })
  }

  const removeItem = (id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: id })
    toast({
      title: "Item removed",
      description: "Item has been removed from your cart.",
    })
  }

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" })
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart.",
    })
  }

  return (
    <LocalCartContext.Provider
      value={{
        state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        items: state.items,
        total: state.total,
      }}
    >
      {children}
    </LocalCartContext.Provider>
  )
}

export function useLocalCart() {
  const context = useContext(LocalCartContext)
  if (!context) {
    throw new Error("useLocalCart must be used within a LocalCartProvider")
  }
  return context
}
