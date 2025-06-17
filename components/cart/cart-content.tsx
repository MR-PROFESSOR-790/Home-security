"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/lib/store/cart-store"

export function CartContent() {
  const { items, updateQuantity, removeItem, total, clearCart } = useCart()
  const [isLoading, setIsLoading] = useState(false)

  const shipping = total > 100 ? 0 : 9.99
  const tax = total * 0.08
  const finalTotal = total + shipping + tax

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity === 0) {
      removeItem(id)
    } else {
      updateQuantity(id, newQuantity)
    }
  }

  const handleCheckout = () => {
    setIsLoading(true)
    // Simulate checkout process
    setTimeout(() => {
      setIsLoading(false)
      // Redirect to checkout page
      window.location.href = "/checkout"
    }, 1000)
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <ShoppingBag className="h-24 w-24 mx-auto mb-6 text-muted-foreground" />
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <p className="text-muted-foreground mb-8">
          Looks like you haven't added any security products to your cart yet.
        </p>
        <Button asChild size="lg">
          <Link href="/products">
            Continue Shopping
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Cart Items */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Cart Items ({items.length})</h2>
          <Button variant="ghost" onClick={clearCart} className="text-red-600 hover:text-red-700">
            Clear Cart
          </Button>
        </div>

        <AnimatePresence>
          {items.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">${item.price.toFixed(2)} each</p>
                      <Badge variant="outline" className="mt-1">
                        In Stock
                      </Badge>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="h-8 w-8"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-12 text-center font-medium">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="h-8 w-8"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-700 mt-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Order Summary */}
      <div className="lg:col-span-1">
        <Card className="sticky top-4">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
              </div>

              <div className="flex justify-between">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>

              <Separator />

              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            {shipping > 0 && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">Add ${(100 - total).toFixed(2)} more for free shipping!</p>
              </div>
            )}

            <div className="mt-6 space-y-3">
              <Button className="w-full" size="lg" onClick={handleCheckout} disabled={isLoading}>
                {isLoading ? "Processing..." : "Proceed to Checkout"}
              </Button>

              <Button variant="outline" className="w-full" asChild>
                <Link href="/products">Continue Shopping</Link>
              </Button>
            </div>

            <div className="mt-4 text-center">
              <p className="text-xs text-muted-foreground">Secure checkout with 256-bit SSL encryption</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
