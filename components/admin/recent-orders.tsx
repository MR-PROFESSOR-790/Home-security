import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface RecentOrdersProps {
  orders: any[]
}

export function RecentOrders({ orders }: RecentOrdersProps) {
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

  return (
    <div className="space-y-8">
      {orders.map((order) => (
        <div key={order._id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={`/placeholder.svg?height=36&width=36`} alt="Avatar" />
            <AvatarFallback>
              {order.user?.firstName?.[0]}
              {order.user?.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">
              {order.user?.firstName} {order.user?.lastName}
            </p>
            <p className="text-sm text-muted-foreground">Order #{order.orderNumber}</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Badge className={getStatusColor(order.orderStatus)}>{order.orderStatus}</Badge>
            <div className="font-medium">${order.total}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
