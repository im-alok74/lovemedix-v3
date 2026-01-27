import { redirect } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getCurrentUser } from "@/lib/auth-server"
import { sql } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default async function OrdersPage() {
  const user = await getCurrentUser()

  if (!user || user.user_type !== "customer") {
    redirect("/signin")
  }

  const orders = await sql`
    SELECT o.*, p.pharmacy_name, a.street_address, a.city
    FROM orders o
    LEFT JOIN pharmacy_profiles p ON o.pharmacy_id = p.id
    LEFT JOIN addresses a ON o.delivery_address_id = a.id
    WHERE o.customer_id = ${user.id}
    ORDER BY o.created_at DESC
  `

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <h1 className="mb-8 text-3xl font-bold text-foreground">My Orders</h1>

          {orders.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground">You haven't placed any orders yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {orders.map((order: any) => (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">Order #{order.order_number}</CardTitle>
                        {order.pharmacy_name && (
                          <p className="text-sm text-muted-foreground">From: {order.pharmacy_name}</p>
                        )}
                      </div>
                      <Badge
                        variant={
                          order.order_status === "delivered"
                            ? "default"
                            : order.order_status === "cancelled"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {order.order_status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-3">
                        <div>
                          <p className="text-sm text-muted-foreground">Order Date</p>
                          <p className="font-medium text-foreground">
                            {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Total Amount</p>
                          <p className="text-lg font-bold text-primary">
                            ₹{Number.parseFloat(order.total_amount).toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Payment Status</p>
                          <Badge variant={order.payment_status === "paid" ? "default" : "secondary"}>
                            {order.payment_status}
                          </Badge>
                        </div>
                        </div>

                      {order.street_address && (
                        <div>
                          <p className="text-sm text-muted-foreground">Delivery Address</p>
                          <p className="font-medium text-foreground">
                            {order.street_address}, {order.city}
                          </p>
                        </div>
                      )}

                      {order.estimated_delivery_time && (
                        <div>
                          <p className="text-sm text-muted-foreground">Estimated Delivery</p>
                          <p className="font-medium text-foreground">
                            {new Date(order.estimated_delivery_time).toLocaleString()}
                          </p>
                        </div>
                      )}

                      {order.delivered_at && (
                        <div>
                          <p className="text-sm text-muted-foreground">Delivered On</p>
                          <p className="font-medium text-foreground">{new Date(order.delivered_at).toLocaleString()}</p>
                        </div>
                      )}

                      {(order.order_status === "delivered" || order.order_status === "confirmed") && (
                        <a href={`/api/orders/${order.order_number}/invoice`} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" className="mt-4">
                            Download Invoice
                          </Button>
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
