"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"

interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
  role: "user" | "admin"
  isActive: boolean
  emailVerified: boolean
  createdAt: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>
  register: (userData: any) => Promise<{ success: boolean; message?: string }>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const isAuthenticated = !!user

  // Check if user is logged in on mount
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        setIsLoading(false)
        return
      }

      const response = await api.getProfile()
      if (response.success && response.data) {
        setUser(response.data)
      } else {
        localStorage.removeItem("token")
        setUser(null)
      }
    } catch (error) {
      console.error("Auth check failed:", error)
      localStorage.removeItem("token")
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      const response = await api.login(email, password)

      if (response.success && response.data) {
        const { token, user: userData } = response.data
        localStorage.setItem("token", token)
        setUser(userData)

        // Redirect based on user role
        if (userData.role === "admin") {
          router.push("/admin")
        } else {
          router.push("/client/dashboard")
        }

        return { success: true }
      } else {
        return { success: false, message: response.error || response.message || "Login failed" }
      }
    } catch (error: any) {
      console.error("Login error:", error)
      return { success: false, message: error.message || "Login failed" }
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: any) => {
    try {
      setIsLoading(true)
      const response = await api.register(userData)

      if (response.success && response.data) {
        const { token, user: newUser } = response.data
        localStorage.setItem("token", token)
        setUser(newUser)

        // Redirect based on user role
        if (newUser.role === "admin") {
          router.push("/admin")
        } else {
          router.push("/client/dashboard")
        }

        return { success: true }
      } else {
        return { success: false, message: response.error || response.message || "Registration failed" }
      }
    } catch (error: any) {
      console.error("Registration error:", error)
      return { success: false, message: error.message || "Registration failed" }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await api.logout()
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      localStorage.removeItem("token")
      setUser(null)
      router.push("/")
    }
  }

  const refreshUser = async () => {
    try {
      const response = await api.getProfile()
      if (response.success && response.data) {
        setUser(response.data)
      }
    } catch (error) {
      console.error("Failed to refresh user:", error)
    }
  }

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    refreshUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
