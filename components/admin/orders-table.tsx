"use client"

import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye } from "lucide-react"

interface Order {
  _id: string
  orderNumber: string
  user: {
    firstName: string
    lastName: string
    email: string
  }
  total: number
  orderStatus: string
  paymentStatus: string
  createdAt: string
  items: any[]
  shippingAddress: any
}

export function OrdersTable() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchOrders = async (page = 1, status = "") => {
    try {
      const token = localStorage.getItem("token")
      const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/admin/orders`)
      url.searchParams.append("page", page.toString())
      url.searchParams.append("limit", "10")
      if (status) url.searchParams.append("status", status)

      const res = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      })

      const data = await res.json()
      if (data.success) {
        setOrders(data.data.orders)
        setTotalPages(data.data.pagination.totalPages)
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders(currentPage, statusFilter)
  }, [currentPage, statusFilter])

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
        credentials: "include",
      })

      if (res.ok) {
        fetchOrders(currentPage, statusFilter)
      }
    } catch (error) {
      console.error("Error updating order status:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "processing":
        return "bg-purple-100 text-purple-800"
      case "shipped":
        return "bg-indigo-100 text-indigo-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Orders...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Orders ({orders.length})</CardTitle>
          <div className="flex items-center space-x-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order #</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Order Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order._id}>
                <TableCell className="font-medium">{order.orderNumber}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">
                      {order.user.firstName} {order.user.lastName}
                    </div>
                    <div className="text-sm text-muted-foreground">{order.user.email}</div>
                  </div>
                </TableCell>
                <TableCell>${order.total}</TableCell>
                <TableCell>
                  <Select value={order.orderStatus} onValueChange={(value) => updateOrderStatus(order._id, value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue>
                        <Badge className={getStatusColor(order.orderStatus)}>{order.orderStatus}</Badge>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Badge className={getPaymentStatusColor(order.paymentStatus)}>{order.paymentStatus}</Badge>
                </TableCell>
                <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(order)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Order Details - {selectedOrder?.orderNumber}</DialogTitle>
                      </DialogHeader>
                      {selectedOrder && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold">Customer</h4>
                              <p>
                                {selectedOrder.user.firstName} {selectedOrder.user.lastName}
                              </p>
                              <p className="text-sm text-muted-foreground">{selectedOrder.user.email}</p>
                            </div>
                            <div>
                              <h4 className="font-semibold">Shipping Address</h4>
                              <p>{selectedOrder.shippingAddress.street}</p>
                              <p>
                                {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}{" "}
                                {selectedOrder.shippingAddress.zipCode}
                              </p>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold mb-2">Order Items</h4>
                            <div className="space-y-2">
                              {selectedOrder.items.map((item: any, index: number) => (
                                <div key={index} className="flex justify-between items-center p-2 border rounded">
                                  <div className="flex items-center space-x-2">
                                    <img
                                      src={item.image || "/placeholder.svg?height=40&width=40"}
                                      alt={item.name}
                                      className="h-10 w-10 rounded object-cover"
                                    />
                                    <div>
                                      <p className="font-medium">{item.name}</p>
                                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                    </div>
                                  </div>
                                  <p className="font-medium">${item.price * item.quantity}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="flex justify-between items-center pt-4 border-t">
                            <span className="font-semibold">Total:</span>
                            <span className="font-bold text-lg">${selectedOrder.total}</span>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center justify-between space-x-2 py-4">
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
