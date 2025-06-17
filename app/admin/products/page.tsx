"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminLayout } from "@/components/admin/admin-layout"
import { ProductsTable } from "@/components/admin/products-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function AdminProductsPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token")
      const userData = localStorage.getItem("user")

      if (!token || !userData) {
        router.push("/auth/signin")
        return
      }

      try {
        const user = JSON.parse(userData)
        if (user.role !== "admin") {
          router.push("/")
          return
        }

        setUser(user)
      } catch (error) {
        router.push("/auth/signin")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Products</h1>
            <p className="text-muted-foreground">Manage your product inventory</p>
          </div>
          <Button onClick={() => router.push("/admin/products/new")}>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>
        <ProductsTable />
      </div>
    </AdminLayout>
  )
}
