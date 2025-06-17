"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Star, ThumbsUp, ThumbsDown, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Review {
  id: string
  user: {
    name: string
    avatar?: string
    verified: boolean
  }
  rating: number
  title: string
  content: string
  date: string
  helpful: number
  notHelpful: number
  images?: string[]
}

const mockReviews: Review[] = [
  {
    id: "1",
    user: {
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: true,
    },
    rating: 5,
    title: "Excellent camera with crystal clear video",
    content:
      "I've been using this camera for 3 months now and I'm extremely satisfied. The 4K video quality is outstanding, and the night vision works perfectly. Installation was straightforward, and the mobile app is user-friendly. Highly recommended!",
    date: "2024-01-15",
    helpful: 12,
    notHelpful: 1,
  },
  {
    id: "2",
    user: {
      name: "Mike Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: true,
    },
    rating: 4,
    title: "Great features, minor connectivity issues",
    content:
      "The camera quality is fantastic and the AI detection works well. However, I occasionally experience WiFi connectivity issues. Customer support was helpful in resolving most problems. Overall, a solid security camera.",
    date: "2024-01-10",
    helpful: 8,
    notHelpful: 2,
  },
  {
    id: "3",
    user: {
      name: "Emily Davis",
      verified: false,
    },
    rating: 5,
    title: "Perfect for monitoring my property",
    content:
      "Easy to install and configure. The motion detection is very accurate and I love getting instant notifications on my phone. The weatherproof design has held up well through rain and snow.",
    date: "2024-01-05",
    helpful: 15,
    notHelpful: 0,
  },
]

export function ProductReviews({ productId }: { productId: string }) {
  const [sortBy, setSortBy] = useState("newest")
  const [filterRating, setFilterRating] = useState("all")

  const averageRating = 4.8
  const totalReviews = 124

  const ratingDistribution = [
    { stars: 5, count: 89, percentage: 72 },
    { stars: 4, count: 24, percentage: 19 },
    { stars: 3, count: 8, percentage: 6 },
    { stars: 2, count: 2, percentage: 2 },
    { stars: 1, count: 1, percentage: 1 },
  ]

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Rating Summary */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Customer Reviews</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">{averageRating}</div>
                <div className="flex justify-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(averageRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-muted-foreground">{totalReviews} reviews</p>
              </div>

              <div className="space-y-3">
                {ratingDistribution.map((rating) => (
                  <div key={rating.stars} className="flex items-center space-x-3">
                    <span className="text-sm w-8">{rating.stars}★</span>
                    <Progress value={rating.percentage} className="flex-1" />
                    <span className="text-sm text-muted-foreground w-8">{rating.count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reviews List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Filters */}
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Reviews ({totalReviews})</h3>
            <div className="flex items-center space-x-4">
              <Select value={filterRating} onValueChange={setFilterRating}>
                <SelectTrigger className="w-32">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stars</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                  <SelectItem value="4">4 Stars</SelectItem>
                  <SelectItem value="3">3 Stars</SelectItem>
                  <SelectItem value="2">2 Stars</SelectItem>
                  <SelectItem value="1">1 Star</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="highest">Highest Rated</SelectItem>
                  <SelectItem value="lowest">Lowest Rated</SelectItem>
                  <SelectItem value="helpful">Most Helpful</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Reviews */}
          <div className="space-y-6">
            {mockReviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Avatar>
                        <AvatarImage src={review.user.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {review.user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{review.user.name}</span>
                            {review.user.verified && (
                              <Badge variant="secondary" className="text-xs">
                                Verified Purchase
                              </Badge>
                            )}
                          </div>
                          <span className="text-sm text-muted-foreground">{review.date}</span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="font-medium">{review.title}</span>
                        </div>

                        <p className="text-muted-foreground">{review.content}</p>

                        <div className="flex items-center space-x-4 pt-2">
                          <Button variant="ghost" size="sm" className="text-muted-foreground">
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            Helpful ({review.helpful})
                          </Button>
                          <Button variant="ghost" size="sm" className="text-muted-foreground">
                            <ThumbsDown className="h-4 w-4 mr-1" />
                            Not Helpful ({review.notHelpful})
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Button variant="outline">Load More Reviews</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
