"use client"

import { useState, useEffect } from "react"
import { ProductGrid } from "@/components/products/product-grid"
import { ProductFilters } from "@/components/products/product-filters"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"
import type { Product, ProductFilters as IProductFilters, ProductsResponse } from "@/types/product"

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [totalProducts, setTotalProducts] = useState(0)
  const [availableCategories, setAvailableCategories] = useState<string[]>([])
  const [availableBrands, setAvailableBrands] = useState<string[]>([])

  const [filters, setFilters] = useState<IProductFilters>({
    category: "",
    brand: "",
    minPrice: 0,
    maxPrice: 1000,
    rating: 0,
    inStock: false,
    featured: false,
    search: "",
  })

  useEffect(() => {
    fetchProducts()
  }, [filters])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError("")

      const params: Record<string, string | number> = {}

      if (filters.category) params.category = filters.category
      if (filters.brand) params.brand = filters.brand
      if (filters.minPrice > 0) params.minPrice = filters.minPrice
      if (filters.maxPrice < 1000) params.maxPrice = filters.maxPrice
      if (filters.rating > 0) params.rating = filters.rating
      if (filters.inStock) params.inStock = "true"
      if (filters.featured) params.featured = "true"
      if (filters.search) params.search = filters.search

      const response = await api.getProducts(params)

      if (response.success && response.data) {
        const data = response.data as ProductsResponse
        setProducts(data.products || [])
        setTotalProducts(data.pagination?.totalProducts || data.products?.length || 0)

        if (data.filters) {
          setAvailableCategories(data.filters.categories || [])
          setAvailableBrands(data.filters.brands || [])
        }
      } else {
        throw new Error(response.error || "Failed to fetch products")
      }
    } catch (err: any) {
      console.error("Error fetching products:", err)
      setError(err.message || "Failed to load products. Please try again.")
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const handleRetry = () => {
    fetchProducts()
  }

  if (error && !loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Alert variant="destructive" className="max-w-2xl mx-auto">
            <AlertDescription className="text-center">
              <div className="space-y-4">
                <p className="font-semibold">Unable to load products</p>
                <p>{error}</p>
                <Button onClick={handleRetry} variant="outline">
                  Try Again
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Security Products</h1>
          <p className="text-muted-foreground">
            Discover our comprehensive range of professional home security solutions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-4">
              <ProductFilters
                filters={filters}
                onFiltersChange={setFilters}
                availableCategories={availableCategories}
                availableBrands={availableBrands}
                loading={loading}
              />
            </div>
          </aside>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {loading && products.length === 0 ? (
              <div className="flex justify-center items-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : (
              <ProductGrid products={products} loading={loading} totalProducts={totalProducts} />
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
