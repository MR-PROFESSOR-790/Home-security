"use client"

import type React from "react"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Phone, Mail, Clock, MessageSquare, Headphones, Shield } from "lucide-react"

const contactInfo = [
  {
    icon: Phone,
    title: "Phone Support",
    details: ["1-800-SECURE-1", "Available 24/7"],
    description: "Call us anytime for immediate assistance",
  },
  {
    icon: Mail,
    title: "Email Support",
    details: ["support@securehome.com", "Response within 2 hours"],
    description: "Send us your questions and we'll get back to you quickly",
  },
  {
    icon: MapPin,
    title: "Visit Our Office",
    details: ["123 Security Blvd", "New York, NY 10001"],
    description: "Come see our products in person",
  },
  {
    icon: MessageSquare,
    title: "Live Chat",
    details: ["Available on website", "Mon-Fri 8AM-8PM"],
    description: "Get instant help from our support team",
  },
]

const departments = [
  { value: "sales", label: "Sales & New Customers" },
  { value: "support", label: "Technical Support" },
  { value: "billing", label: "Billing & Accounts" },
  { value: "general", label: "General Inquiry" },
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    department: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      // Simulate form submission
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setSubmitStatus("success")
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        department: "",
        subject: "",
        message: "",
      })
    } catch (error) {
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">Get in Touch</h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Have questions about our security solutions? Our expert team is here to help you find the perfect
                security system for your home.
              </p>
              <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>24/7 Support</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Headphones className="h-4 w-4" />
                  <span>Expert Advice</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4" />
                  <span>Trusted Service</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">How Can We Help?</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactInfo.map((info, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <info.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">{info.title}</h3>
                    <div className="space-y-1 mb-3">
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="text-sm font-medium text-gray-900">
                          {detail}
                        </p>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600">{info.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Send Us a Message</h2>
                <p className="text-gray-600">
                  Fill out the form below and we'll get back to you within 2 hours during business hours.
                </p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Contact Form</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {submitStatus === "success" && (
                      <Alert>
                        <AlertDescription>
                          Thank you for your message! We'll get back to you within 2 hours.
                        </AlertDescription>
                      </Alert>
                    )}

                    {submitStatus === "error" && (
                      <Alert variant="destructive">
                        <AlertDescription>
                          There was an error sending your message. Please try again or call us directly.
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          required
                          value={formData.firstName}
                          onChange={handleChange}
                          placeholder="John"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          required
                          value={formData.lastName}
                          onChange={handleChange}
                          placeholder="Doe"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="john@example.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="(555) 123-4567"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Select
                        value={formData.department}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, department: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a department" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map((dept) => (
                            <SelectItem key={dept.value} value={dept.value}>
                              {dept.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="How can we help you?"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        required
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Please provide details about your inquiry..."
                        rows={6}
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? "Sending Message..." : "Send Message"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Visit Our Showroom</h2>
            <div className="max-w-4xl mx-auto">
              <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Interactive map would be displayed here</p>
                  <p className="text-sm text-gray-500 mt-2">123 Security Blvd, New York, NY 10001</p>
                </div>
              </div>
              <div className="mt-8 grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <h3 className="font-semibold mb-2">Store Hours</h3>
                  <p className="text-sm text-gray-600">Mon-Fri: 9AM-7PM</p>
                  <p className="text-sm text-gray-600">Sat: 10AM-6PM</p>
                  <p className="text-sm text-gray-600">Sun: 12PM-5PM</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Parking</h3>
                  <p className="text-sm text-gray-600">Free parking available</p>
                  <p className="text-sm text-gray-600">Handicap accessible</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">What to Expect</h3>
                  <p className="text-sm text-gray-600">Product demonstrations</p>
                  <p className="text-sm text-gray-600">Expert consultations</p>
                  <p className="text-sm text-gray-600">Installation planning</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
