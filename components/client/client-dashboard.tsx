"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Package, Truck, Clock, CheckCircle, Eye, Download } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

const mockOrders = [
  {
    id: "ORD-001",
    date: "2024-01-15",
    status: "delivered",
    total: 299.99,
    items: [{ name: "SecureCam Pro 4K", quantity: 1, price: 299.99 }],
    tracking: "1Z999AA1234567890",
    estimatedDelivery: "2024-01-18",
  },
  {
    id: "ORD-002",
    date: "2024-01-20",
    status: "shipped",
    total: 199.99,
    items: [{ name: "SmartLock Elite", quantity: 1, price: 199.99 }],
    tracking: "1Z999AA1234567891",
    estimatedDelivery: "2024-01-25",
  },
  {
    id: "ORD-003",
    date: "2024-01-22",
    status: "processing",
    total: 79.99,
    items: [{ name: "Motion Sensor Pro", quantity: 1, price: 79.99 }],
    tracking: null,
    estimatedDelivery: "2024-01-28",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "delivered":
      return "bg-green-500"
    case "shipped":
      return "bg-blue-500"
    case "processing":
      return "bg-yellow-500"
    default:
      return "bg-gray-500"
  }
}

const getStatusProgress = (status: string) => {
  switch (status) {
    case "delivered":
      return 100
    case "shipped":
      return 75
    case "processing":
      return 25
    default:
      return 0
  }
}

export function ClientDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  const totalOrders = mockOrders.length
  const totalSpent = mockOrders.reduce((sum, order) => sum + order.total, 0)
  const activeOrders = mockOrders.filter((order) => order.status !== "delivered").length

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">My Dashboard</h1>
        <p className="text-muted-foreground">Track your orders and manage your security products</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOrders}</div>
              <p className="text-xs text-muted-foreground">All time orders</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalSpent.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Lifetime value</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeOrders}</div>
              <p className="text-xs text-muted-foreground">In progress</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="orders">Order History</TabsTrigger>
          <TabsTrigger value="tracking">Track Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockOrders.slice(0, 3).map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(order.status)}`} />
                      <div>
                        <p className="font-medium">{order.id}</p>
                        <p className="text-sm text-muted-foreground">{order.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${order.total}</p>
                      <Badge variant="outline" className="capitalize">
                        {order.status}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>All Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockOrders.map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border rounded-lg p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold">{order.id}</h3>
                        <p className="text-sm text-muted-foreground">Ordered on {order.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${order.total}</p>
                        <Badge variant="outline" className="capitalize">
                          {order.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      {order.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex justify-between text-sm">
                          <span>
                            {item.name} × {item.quantity}
                          </span>
                          <span>${item.price}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Download Invoice
                      </Button>
                      {order.tracking && (
                        <Button variant="outline" size="sm">
                          <Truck className="mr-2 h-4 w-4" />
                          Track Package
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tracking" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Track Your Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {mockOrders
                  .filter((order) => order.status !== "delivered")
                  .map((order, index) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border rounded-lg p-6"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold">{order.id}</h3>
                          <p className="text-sm text-muted-foreground">Estimated delivery: {order.estimatedDelivery}</p>
                        </div>
                        <Badge variant="outline" className="capitalize">
                          {order.status}
                        </Badge>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>Order Progress</span>
                            <span>{getStatusProgress(order.status)}%</span>
                          </div>
                          <Progress value={getStatusProgress(order.status)} />
                        </div>

                        <div className="grid grid-cols-4 gap-4 text-center">
                          <div className="space-y-2">
                            <div
                              className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center ${
                                getStatusProgress(order.status) >= 25 ? "bg-blue-500 text-white" : "bg-gray-200"
                              }`}
                            >
                              <Package className="h-4 w-4" />
                            </div>
                            <p className="text-xs">Order Placed</p>
                          </div>
                          <div className="space-y-2">
                            <div
                              className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center ${
                                getStatusProgress(order.status) >= 50 ? "bg-blue-500 text-white" : "bg-gray-200"
                              }`}
                            >
                              <Clock className="h-4 w-4" />
                            </div>
                            <p className="text-xs">Processing</p>
                          </div>
                          <div className="space-y-2">
                            <div
                              className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center ${
                                getStatusProgress(order.status) >= 75 ? "bg-blue-500 text-white" : "bg-gray-200"
                              }`}
                            >
                              <Truck className="h-4 w-4" />
                            </div>
                            <p className="text-xs">Shipped</p>
                          </div>
                          <div className="space-y-2">
                            <div
                              className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center ${
                                getStatusProgress(order.status) >= 100 ? "bg-green-500 text-white" : "bg-gray-200"
                              }`}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </div>
                            <p className="text-xs">Delivered</p>
                          </div>
                        </div>

                        {order.tracking && (
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm font-medium">Tracking Number</p>
                            <p className="text-sm text-muted-foreground font-mono">{order.tracking}</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
