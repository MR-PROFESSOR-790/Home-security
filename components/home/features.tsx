"use client"

import { motion } from "framer-motion"
import { Shield, Camera, Smartphone, Clock, Lock, Zap } from "lucide-react"

const features = [
  {
    icon: Shield,
    title: "24/7 Monitoring",
    description: "Round-the-clock professional monitoring to keep your home secure at all times.",
  },
  {
    icon: Camera,
    title: "HD Video Quality",
    description: "Crystal clear 4K video recording with night vision capabilities.",
  },
  {
    icon: Smartphone,
    title: "Mobile Control",
    description: "Control and monitor your security system from anywhere using our mobile app.",
  },
  {
    icon: Clock,
    title: "Instant Alerts",
    description: "Receive immediate notifications when any security event is detected.",
  },
  {
    icon: Lock,
    title: "Smart Integration",
    description: "Seamlessly integrate with smart home devices and voice assistants.",
  },
  {
    icon: Zap,
    title: "Easy Installation",
    description: "Professional installation or DIY setup with step-by-step guidance.",
  },
]

export function Features() {
  return (
    <section className="py-16 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Why Choose SecureHome?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Advanced technology meets user-friendly design to deliver the ultimate home security experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <feature.icon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
