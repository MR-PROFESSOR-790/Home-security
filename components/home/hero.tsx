"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, Camera, Lock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />

      <div className="container mx-auto px-4 py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center space-x-2 text-blue-400"
              >
                <Shield className="h-5 w-5" />
                <span className="text-sm font-medium">Professional Security Solutions</span>
              </motion.div>

              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                Protect Your
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  {" "}
                  Home
                </span>
                <br />
                With Smart Security
              </h1>

              <p className="text-xl text-slate-300 max-w-lg">
                Advanced security systems, smart cameras, and intelligent monitoring solutions to keep your family and
                property safe 24/7.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild className="bg-blue-600 hover:bg-blue-700">
                <Link href="/products">
                  Shop Now <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-slate-600 text-white hover:bg-slate-800">
                Learn More
              </Button>
            </div>

            <div className="flex items-center space-x-8 pt-8">
              <div className="flex items-center space-x-2">
                <Camera className="h-5 w-5 text-blue-400" />
                <span className="text-sm">Smart Cameras</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-green-400" />
                <span className="text-sm">24/7 Monitoring</span>
              </div>
              <div className="flex items-center space-x-2">
                <Lock className="h-5 w-5 text-purple-400" />
                <span className="text-sm">Smart Locks</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10">
              <Image
                src="/placeholder.svg?height=600&width=600"
                alt="Smart Security System"
                width={600}
                height={600}
                className="rounded-2xl shadow-2xl"
                priority
              />
            </div>

            {/* Floating Elements */}
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
              className="absolute top-10 -left-10 bg-blue-500/20 backdrop-blur-sm rounded-full p-4 border border-blue-400/30"
            >
              <Camera className="h-8 w-8 text-blue-400" />
            </motion.div>

            <motion.div
              animate={{ y: [10, -10, 10] }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
              className="absolute bottom-10 -right-10 bg-green-500/20 backdrop-blur-sm rounded-full p-4 border border-green-400/30"
            >
              <Shield className="h-8 w-8 text-green-400" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
