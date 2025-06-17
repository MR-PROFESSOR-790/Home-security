"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Star, ShoppingCart, Heart, Share2, Shield, Truck, RotateCcw, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/lib/store/cart-store"
import { toast } from "@/components/ui/use-toast"

interface ProductDetailsProps {
  product: {
    id: string
    name: string
    description: string
    longDescription: string
    price: number
    originalPrice?: number
    image: string
    images: string[]
    category: string
    brand: string
    rating: number
    reviews: number
    inStock: boolean
    stock: number
    features: string[]
    specifications: Record<string, string>
  }
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      })
    }
    toast({
      title: "Added to cart",
      description: `${quantity} × ${product.name} added to your cart.`,
    })
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="aspect-square rounded-lg overflow-hidden bg-gray-100"
          >
            <Image
              src={product.images[selectedImage] || "/placeholder.svg"}
              alt={product.name}
              width={600}
              height={600}
              className="w-full h-full object-cover"
            />
          </motion.div>

          <div className="grid grid-cols-4 gap-4">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                  selectedImage === index ? "border-blue-500" : "border-gray-200"
                }`}
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${product.name} view ${index + 1}`}
                  width={150}
                  height={150}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <Badge variant="outline" className="mb-2">
              {product.category}
            </Badge>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center space-x-1">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{product.rating}</span>
                <span className="text-muted-foreground">({product.reviews} reviews)</span>
              </div>
              <span className="text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">Brand: {product.brand}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold">${product.price}</span>
              {product.originalPrice && (
                <>
                  <span className="text-xl text-muted-foreground line-through">${product.originalPrice}</span>
                  <Badge className="bg-red-500 hover:bg-red-600">Save {discount}%</Badge>
                </>
              )}
            </div>
            <p className="text-muted-foreground">{product.description}</p>
          </div>

          {/* Stock Status */}
          <div className="flex items-center space-x-2">
            {product.inStock ? (
              <>
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-green-600 font-medium">In Stock ({product.stock} available)</span>
              </>
            ) : (
              <span className="text-red-600 font-medium">Out of Stock</span>
            )}
          </div>

          {/* Quantity and Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <label className="font-medium">Quantity:</label>
              <div className="flex items-center border rounded-md">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                >
                  +
                </Button>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button size="lg" className="flex-1" onClick={handleAddToCart} disabled={!product.inStock}>
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
              <Button size="lg" variant="outline">
                <Heart className="h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Features */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Key Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {product.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Guarantees */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <Shield className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <p className="text-sm font-medium">2 Year Warranty</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Truck className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <p className="text-sm font-medium">Free Shipping</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <RotateCcw className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <p className="text-sm font-medium">30-Day Returns</p>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-16">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="installation">Installation</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="prose max-w-none">
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{product.longDescription}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="specifications" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {Object.entries(product.specifications).map(([key, value], index) => (
                    <div key={key}>
                      <div className="flex justify-between py-3">
                        <span className="font-medium">{key}</span>
                        <span className="text-muted-foreground">{value}</span>
                      </div>
                      {index < Object.entries(product.specifications).length - 1 && <Separator />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="installation" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Installation Guide</h3>
                    <div className="space-y-4">
                      <div className="flex space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold">1</span>
                        </div>
                        <div>
                          <h4 className="font-medium">Choose Installation Location</h4>
                          <p className="text-muted-foreground">
                            Select a location with good WiFi coverage and clear view of the area you want to monitor.
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold">2</span>
                        </div>
                        <div>
                          <h4 className="font-medium">Mount the Camera</h4>
                          <p className="text-muted-foreground">
                            Use the included mounting bracket and screws to securely attach the camera.
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold">3</span>
                        </div>
                        <div>
                          <h4 className="font-medium">Connect Power</h4>
                          <p className="text-muted-foreground">
                            Connect the power adapter or PoE cable to provide power to the camera.
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold">4</span>
                        </div>
                        <div>
                          <h4 className="font-medium">Setup via Mobile App</h4>
                          <p className="text-muted-foreground">
                            Download the SecureHome app and follow the in-app setup wizard to connect your camera.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
