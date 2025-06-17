"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { X, Search } from "lucide-react"
import type { ProductFilters as IProductFilters } from "@/types/product"

interface ProductFiltersProps {
  filters: IProductFilters
  onFiltersChange: (filters: IProductFilters) => void
  availableCategories?: string[]
  availableBrands?: string[]
  loading?: boolean
}

export function ProductFilters({
  filters,
  onFiltersChange,
  availableCategories = [],
  availableBrands = [],
  loading = false,
}: ProductFiltersProps) {
  const [searchTerm, setSearchTerm] = useState(filters.search || "")

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchTerm !== filters.search) {
        updateFilters("search", searchTerm)
      }
    }, 500)

    return () => clearTimeout(debounceTimer)
  }, [searchTerm])

  const updateFilters = (key: keyof IProductFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    })
  }

  const clearAllFilters = () => {
    setSearchTerm("")
    onFiltersChange({
      category: "",
      brand: "",
      minPrice: 0,
      maxPrice: 1000,
      rating: 0,
      inStock: false,
      featured: false,
      search: "",
    })
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.category) count++
    if (filters.brand) count++
    if (filters.rating > 0) count++
    if (filters.inStock) count++
    if (filters.featured) count++
    if (filters.search) count++
    if (filters.minPrice > 0 || filters.maxPrice < 1000) count++
    return count
  }

  const activeFiltersCount = getActiveFiltersCount()

  return (
    <div className="space-y-6">
      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Search Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Active Filters */}
      {activeFiltersCount > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Active Filters ({activeFiltersCount})</CardTitle>
              <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                Clear All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-2">
              {filters.search && (
                <Badge variant="secondary" className="text-xs">
                  Search: {filters.search}
                  <X
                    className="ml-1 h-3 w-3 cursor-pointer"
                    onClick={() => {
                      setSearchTerm("")
                      updateFilters("search", "")
                    }}
                  />
                </Badge>
              )}
              {filters.category && (
                <Badge variant="secondary" className="text-xs">
                  {filters.category}
                  <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => updateFilters("category", "")} />
                </Badge>
              )}
              {filters.brand && (
                <Badge variant="secondary" className="text-xs">
                  {filters.brand}
                  <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => updateFilters("brand", "")} />
                </Badge>
              )}
              {filters.rating > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {filters.rating}+ Stars
                  <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => updateFilters("rating", 0)} />
                </Badge>
              )}
              {filters.inStock && (
                <Badge variant="secondary" className="text-xs">
                  In Stock
                  <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => updateFilters("inStock", false)} />
                </Badge>
              )}
              {filters.featured && (
                <Badge variant="secondary" className="text-xs">
                  Featured
                  <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => updateFilters("featured", false)} />
                </Badge>
              )}
              {(filters.minPrice > 0 || filters.maxPrice < 1000) && (
                <Badge variant="secondary" className="text-xs">
                  ${filters.minPrice} - ${filters.maxPrice}
                  <X
                    className="ml-1 h-3 w-3 cursor-pointer"
                    onClick={() => {
                      updateFilters("minPrice", 0)
                      updateFilters("maxPrice", 1000)
                    }}
                  />
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Price Range */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Price Range</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Slider
              value={[filters.minPrice, filters.maxPrice]}
              onValueChange={([min, max]) => {
                updateFilters("minPrice", min)
                updateFilters("maxPrice", max)
              }}
              max={1000}
              step={10}
              className="w-full"
            />
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>${filters.minPrice}</span>
              <span>${filters.maxPrice}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      {availableCategories.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {availableCategories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category}`}
                    checked={filters.category === category}
                    onCheckedChange={(checked) => updateFilters("category", checked ? category : "")}
                  />
                  <Label htmlFor={`category-${category}`} className="text-sm font-normal">
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Brands */}
      {availableBrands.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Brands</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {availableBrands.map((brand) => (
                <div key={brand} className="flex items-center space-x-2">
                  <Checkbox
                    id={`brand-${brand}`}
                    checked={filters.brand === brand}
                    onCheckedChange={(checked) => updateFilters("brand", checked ? brand : "")}
                  />
                  <Label htmlFor={`brand-${brand}`} className="text-sm font-normal">
                    {brand}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rating Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Minimum Rating</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center space-x-2">
                <Checkbox
                  id={`rating-${rating}`}
                  checked={filters.rating === rating}
                  onCheckedChange={(checked) => updateFilters("rating", checked ? rating : 0)}
                />
                <Label htmlFor={`rating-${rating}`} className="text-sm font-normal flex items-center">
                  {rating}+ Stars
                  <div className="ml-2 flex">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`text-xs ${i < rating ? "text-yellow-400" : "text-gray-300"}`}>
                        ★
                      </span>
                    ))}
                  </div>
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Additional Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Additional Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="in-stock"
                checked={filters.inStock}
                onCheckedChange={(checked) => updateFilters("inStock", checked as boolean)}
              />
              <Label htmlFor="in-stock" className="text-sm font-normal">
                In Stock Only
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="featured"
                checked={filters.featured}
                onCheckedChange={(checked) => updateFilters("featured", checked as boolean)}
              />
              <Label htmlFor="featured" className="text-sm font-normal">
                Featured Products
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
