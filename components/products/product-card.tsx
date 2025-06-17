"use client"

import type React from "react"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Star, ShoppingCart, Heart, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useCart } from "@/lib/store/cart-store"
import { toast } from "@/components/ui/use-toast"
import type { Product } from "@/types/product"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, loading } = useCart()

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Use the backend integration - just pass the product ID
    await addItem(product._id, 1)
  }

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    toast({
      title: "Added to wishlist",
      description: `${product.name} has been added to your wishlist.`,
    })
  }

  const getPrimaryImage = () => {
    const primaryImage = product.images?.find((img) => img.isPrimary)
    return primaryImage?.url || product.images?.[0]?.url || "/placeholder.svg?height=300&width=300"
  }

  const getImageAlt = () => {
    const primaryImage = product.images?.find((img) => img.isPrimary)
    return primaryImage?.alt || product.images?.[0]?.alt || product.name
  }

  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0

  const inStock = product.stock > 0
  const isLowStock = product.stock > 0 && product.stock <= 5

  return (
    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }} className="h-full">
      <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col">
        <div className="relative overflow-hidden">
          <Link href={`/products/${product._id}`}>
            <Image
              src={getPrimaryImage() || "/placeholder.svg"}
              alt={getImageAlt()}
              width={300}
              height={300}
              className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = "/placeholder.svg?height=300&width=300"
              }}
            />
          </Link>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {discount > 0 && <Badge className="bg-red-500 hover:bg-red-600 text-white">-{discount}%</Badge>}
            {product.featured && <Badge className="bg-blue-500 hover:bg-blue-600 text-white">Featured</Badge>}
            {!inStock && <Badge className="bg-gray-500 text-white">Out of Stock</Badge>}
            {isLowStock && <Badge className="bg-orange-500 text-white">Low Stock</Badge>}
          </div>

          {/* Action Buttons */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button size="icon" variant="secondary" onClick={handleAddToWishlist} className="h-8 w-8">
              <Heart className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="secondary" asChild className="h-8 w-8">
              <Link href={`/products/${product._id}`}>
                <Eye className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <CardContent className="p-4 flex-1 flex flex-col">
          <div className="space-y-3 flex-1">
            {/* Category and Rating */}
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-xs">
                {product.category}
              </Badge>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{product.rating?.toFixed(1) || "N/A"}</span>
                <span className="text-xs text-muted-foreground">({product.reviewCount || 0})</span>
              </div>
            </div>

            {/* Product Name */}
            <Link href={`/products/${product._id}`}>
              <h3 className="font-semibold text-lg hover:text-primary transition-colors line-clamp-2 leading-tight">
                {product.name}
              </h3>
            </Link>

            {/* Description */}
            <p className="text-sm text-muted-foreground line-clamp-2 flex-1">{product.description}</p>

            {/* Brand */}
            <div className="text-sm text-muted-foreground">
              by <span className="font-medium">{product.brand}</span>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-primary">${product.price?.toFixed(2) || "0.00"}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-muted-foreground line-through">
                  ${product.originalPrice?.toFixed(2) || "0.00"}
                </span>
              )}
            </div>

            {/* Stock Info */}
            <div className="flex items-center justify-between text-sm">
              <span className={`${inStock ? "text-green-600" : "text-red-600"}`}>
                {inStock ? `${product.stock} in stock` : "Out of stock"}
              </span>
              {product.features && product.features.length > 0 && (
                <span className="text-muted-foreground">{product.features.length} features</span>
              )}
            </div>
          </div>

          {/* Add to Cart Button */}
          <Button className="w-full mt-4" onClick={handleAddToCart} disabled={!inStock || loading}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            {loading ? "Adding..." : inStock ? "Add to Cart" : "Out of Stock"}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}
