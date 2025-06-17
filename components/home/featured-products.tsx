"use client"

import { useState, useEffect } from "react"
import { ProductCard } from "@/components/products/product-card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { api } from "@/lib/api"
import type { Product } from "@/types/product"
import Link from "next/link"

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchFeaturedProducts()
  }, [])

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true)
      setError("")

      const response = await api.getFeaturedProducts(8)

      if (response.success && response.data) {
        setProducts(response.data.products || [])
      } else {
        throw new Error(response.error || "Failed to fetch featured products")
      }
    } catch (err: any) {
      console.error("Error fetching featured products:", err)
      setError(err.message || "Failed to load featured products")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Products</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our most popular and highly-rated security products
            </p>
          </div>
          <div className="flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Products</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our most popular and highly-rated security products
            </p>
          </div>
          <Alert variant="destructive" className="max-w-2xl mx-auto">
            <AlertDescription className="text-center">
              <div className="space-y-4">
                <p>{error}</p>
                <Button onClick={fetchFeaturedProducts} variant="outline">
                  Try Again
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </section>
    )
  }

  if (products.length === 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Products</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our most popular and highly-rated security products
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-500 mb-4">No featured products available at the moment.</p>
            <Button asChild>
              <Link href="/products">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Featured Products</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our most popular and highly-rated security products, carefully selected for their quality and
            performance.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        <div className="text-center">
          <Button asChild size="lg">
            <Link href="/products">View All Products</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
