"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"

export function Newsletter() {
  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsSubscribed(true)
    toast({
      title: "Successfully subscribed!",
      description: "Thank you for subscribing to our newsletter.",
    })

    setTimeout(() => {
      setIsSubscribed(false)
      setEmail("")
    }, 3000)
  }

  return (
    <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <Mail className="h-16 w-16 mx-auto mb-6 opacity-90" />
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Stay Secure, Stay Informed</h2>
          <p className="text-xl mb-8 opacity-90">
            Get the latest security tips, product updates, and exclusive offers delivered straight to your inbox.
          </p>

          {!isSubscribed ? (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/70"
              />
              <Button type="submit" className="bg-white text-blue-600 hover:bg-gray-100">
                Subscribe
              </Button>
            </form>
          ) : (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center justify-center space-x-2 text-green-300"
            >
              <CheckCircle className="h-6 w-6" />
              <span className="text-lg font-medium">Successfully subscribed!</span>
            </motion.div>
          )}

          <p className="text-sm mt-4 opacity-70">We respect your privacy. Unsubscribe at any time.</p>
        </motion.div>
      </div>
    </section>
  )
}
