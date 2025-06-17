const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
  cart?: any
  products?: any
  orders?: any
  users?: any
}

class ApiClient {
  private getAuthHeaders(): HeadersInit {
    if (typeof window === "undefined") return { "Content-Type": "application/json" }

    const token = localStorage.getItem("token")
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    }
  }

  async request<T = any>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${API_URL}${endpoint}`

    // Merge headers properly
    const mergedHeaders = {
      ...this.getAuthHeaders(),
      ...(options.headers || {}),
    }

    const config: RequestInit = {
      ...options,
      headers: mergedHeaders,
      credentials: "include",
    }

    try {
      const response = await fetch(url, config)

      // Handle non-JSON responses
      let data
      const contentType = response.headers.get("content-type")
      if (contentType && contentType.includes("application/json")) {
        data = await response.json()
      } else {
        data = { message: await response.text() }
      }

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`)
      }

      return {
        success: true,
        ...data,
      }
    } catch (error: any) {
      console.error(`API request failed: ${endpoint}`, error)
      return {
        success: false,
        error: error.message || "Network error occurred",
      }
    }
  }

  // HTTP Methods
  async get<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "GET" })
  }

  async post<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "DELETE" })
  }

  async patch<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.post("/auth/login", { email, password })
  }

  async register(userData: any) {
    return this.post("/auth/register", userData)
  }

  async getProfile() {
    return this.get("/auth/me")
  }

  async logout() {
    return this.post("/auth/logout")
  }

  // Products endpoints
  async getProducts(params?: Record<string, string | number>) {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          searchParams.append(key, String(value))
        }
      })
    }
    const query = searchParams.toString() ? `?${searchParams.toString()}` : ""
    return this.get(`/products${query}`)
  }

  async getProduct(id: string) {
    return this.get(`/products/${id}`)
  }

  async getFeaturedProducts(limit = 8) {
    return this.get(`/products/featured?limit=${limit}`)
  }

  async createProduct(productData: any) {
    return this.post("/products", productData)
  }

  async updateProduct(id: string, productData: any) {
    return this.put(`/products/${id}`, productData)
  }

  async deleteProduct(id: string) {
    return this.delete(`/products/${id}`)
  }

  // Cart endpoints
  async getCart() {
    return this.get("/cart")
  }

  async addToCart(productId: string, quantity = 1) {
    return this.post("/cart", { productId, quantity })
  }

  async updateCartItem(itemId: string, quantity: number) {
    return this.put(`/cart/${itemId}`, { quantity })
  }

  async removeFromCart(itemId: string) {
    return this.delete(`/cart/${itemId}`)
  }

  async clearCart() {
    return this.delete("/cart")
  }

  // Orders endpoints
  async getOrders(params?: Record<string, string | number>) {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          searchParams.append(key, String(value))
        }
      })
    }
    const query = searchParams.toString() ? `?${searchParams.toString()}` : ""
    return this.get(`/orders${query}`)
  }

  async getOrder(id: string) {
    return this.get(`/orders/${id}`)
  }

  async createOrder(orderData: any) {
    return this.post("/orders", orderData)
  }

  async updateOrderStatus(id: string, status: string) {
    return this.put(`/orders/${id}/status`, { status })
  }

  // Admin endpoints
  async getAdminStats() {
    return this.get("/admin/stats")
  }

  async getAdminProducts(params?: Record<string, string | number>) {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          searchParams.append(key, String(value))
        }
      })
    }
    const query = searchParams.toString() ? `?${searchParams.toString()}` : ""
    return this.get(`/admin/products${query}`)
  }

  async getAdminOrders(params?: Record<string, string | number>) {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          searchParams.append(key, String(value))
        }
      })
    }
    const query = searchParams.toString() ? `?${searchParams.toString()}` : ""
    return this.get(`/admin/orders${query}`)
  }

  async getAdminUsers(params?: Record<string, string | number>) {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          searchParams.append(key, String(value))
        }
      })
    }
    const query = searchParams.toString() ? `?${searchParams.toString()}` : ""
    return this.get(`/admin/users${query}`)
  }
}

export const api = new ApiClient()
