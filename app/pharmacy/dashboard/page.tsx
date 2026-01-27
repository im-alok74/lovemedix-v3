import { redirect } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getCurrentUser, requireRole } from "@/lib/auth-server"
import { checkSellerVerification, getSellerProfile } from "@/lib/seller-auth"
import { sql } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Package, DollarSign, CheckCircle, Clock, TrendingUp, AlertCircle, FileText, Plus } from "lucide-react"

export default async function PharmacyDashboardPage() {
  const user = await requireRole(["pharmacy"])

  if (!user) {
    redirect("/signin")
  }

  const verification = await checkSellerVerification(user.id, "pharmacy")
  const profile = await getSellerProfile(user.id, "pharmacy")

  if (!profile) {
    redirect("/pharmacy/register")
  }

  const pharmacyId = (profile as any).id

  // Get comprehensive analytics
  const orderStats = await sql`
    SELECT 
      COUNT(*) as total_orders,
      COUNT(CASE WHEN order_status = 'pending' THEN 1 END) as pending_orders,
      COUNT(CASE WHEN order_status = 'confirmed' THEN 1 END) as confirmed_orders,
      COUNT(CASE WHEN order_status = 'preparing' THEN 1 END) as preparing_orders,
      COUNT(CASE WHEN order_status = 'out_for_delivery' THEN 1 END) as out_for_delivery_orders,
      COUNT(CASE WHEN order_status = 'delivered' THEN 1 END) as delivered_orders,
      COUNT(CASE WHEN order_status = 'cancelled' THEN 1 END) as cancelled_orders,
      COALESCE(SUM(CASE WHEN order_status = 'delivered' THEN total_amount ELSE 0 END), 0) as total_revenue,
      COALESCE(AVG(CASE WHEN order_status = 'delivered' THEN total_amount END), 0) as avg_order_value
    FROM orders
    WHERE pharmacy_id = ${pharmacyId}
  `

  const stats = orderStats[0] as any

  // Get inventory metrics
  const inventoryMetrics = await sql`
    SELECT 
      COUNT(*) as total_medicines,
      COUNT(CASE WHEN stock_quantity = 0 THEN 1 END) as out_of_stock,
      COUNT(CASE WHEN stock_quantity < 10 THEN 1 END) as low_stock,
      AVG(stock_quantity) as avg_stock_level
    FROM pharmacy_inventory
    WHERE pharmacy_id = ${pharmacyId}
  `

  const inventory = inventoryMetrics[0] as any

  // Get top selling medicines
  const topMedicines = await sql`
    SELECT 
      m.name,
      m.generic_name,
      SUM(oi.quantity) as total_sold,
      SUM(oi.total_price) as revenue
    FROM order_items oi
    JOIN medicines m ON oi.medicine_id = m.id
    JOIN orders o ON oi.order_id = o.id
    WHERE o.pharmacy_id = ${pharmacyId} AND o.order_status = 'delivered'
    GROUP BY m.id, m.name, m.generic_name
    ORDER BY total_sold DESC
    LIMIT 5
  `

  // Get recent orders
  const recentOrders = await sql`
    SELECT 
      o.id,
      o.order_number,
      o.order_status,
      o.total_amount,
      o.created_at,
      u.full_name
    FROM orders o
    JOIN users u ON o.customer_id = u.id
    WHERE o.pharmacy_id = ${pharmacyId}
    ORDER BY o.created_at DESC
    LIMIT 10
  `

  const commissionAmount = stats.total_revenue ? (stats.total_revenue * (profile as any).commission_rate / 100) : 0
  const yourEarnings = stats.total_revenue ? (stats.total_revenue - commissionAmount) : 0

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">{(profile as any).pharmacy_name}</h1>
            <div className="mt-2 flex items-center gap-2">
              <p className="text-muted-foreground">
                {(profile as any).city}, {(profile as any).state}
              </p>
              <Badge variant={verification.verified ? "default" : "secondary"}>
                {(profile as any).verification_status}
              </Badge>
            </div>
          </div>

          {!verification.verified && (
            <Card className="border-destructive/50 bg-destructive/5 mb-8">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <AlertCircle className="h-5 w-5 text-destructive mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Verification Pending</h3>
                    <p className="text-sm text-muted-foreground">
                      Your pharmacy is not yet verified. Once verified, you can add medicines and start accepting orders.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Key Metrics */}
          <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <Package className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stats.total_orders}</div>
                <p className="text-xs text-muted-foreground mt-2">
                  <span className="text-green-600 font-medium">{stats.delivered_orders}</span> delivered
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
                <Clock className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {stats.pending_orders + stats.confirmed_orders + stats.preparing_orders + stats.out_for_delivery_orders}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  <span className="font-medium">{stats.pending_orders}</span> awaiting confirmation
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  ₹{Number(stats.total_revenue).toFixed(0)}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Avg: ₹{Number(stats.avg_order_value).toFixed(0)}/order
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Your Earnings</CardTitle>
                <TrendingUp className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  ₹{yourEarnings.toFixed(0)}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  After {(profile as any).commission_rate}% commission
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Inventory Overview */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Inventory Overview</CardTitle>
                  {verification.verified && (
                    <Link href="/pharmacy/medicines">
                      <Button size="sm" variant="outline">View All</Button>
                    </Link>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">Total Medicines</p>
                      <p className="text-2xl font-bold text-foreground">{inventory.total_medicines}</p>
                    </div>
                    <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                      <p className="text-sm text-muted-foreground">Low Stock</p>
                      <p className="text-2xl font-bold text-yellow-600">{inventory.low_stock}</p>
                    </div>
                    <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                      <p className="text-sm text-muted-foreground">Out of Stock</p>
                      <p className="text-2xl font-bold text-red-600">{inventory.out_of_stock}</p>
                    </div>
                  </div>
                  {verification.verified && (
                    <Link href="/pharmacy/medicines/add" className="mt-4 block">
                      <Button className="w-full bg-transparent" variant="outline">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Medicine
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>

              {/* Top Selling Medicines */}
              {topMedicines.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Top Selling Medicines</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {(topMedicines as any[]).map((med, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div>
                            <p className="font-medium text-foreground">{med.name}</p>
                            <p className="text-xs text-muted-foreground">{med.generic_name}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-foreground">{med.total_sold} sold</p>
                            <p className="text-xs text-primary">₹{Number(med.revenue).toFixed(0)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {verification.verified && (
                    <>
                      <Link href="/pharmacy/medicines" className="block">
                        <Button variant="outline" className="w-full justify-start bg-transparent">
                          <Package className="h-4 w-4 mr-2" />
                          Manage Medicines
                        </Button>
                      </Link>
                      <Link href="/pharmacy/orders" className="block">
                        <Button variant="outline" className="w-full justify-start bg-transparent">
                          <FileText className="h-4 w-4 mr-2" />
                          View Orders
                        </Button>
                      </Link>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Recent Orders */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  {recentOrders.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No orders yet</p>
                  ) : (
                    <div className="space-y-3">
                      {(recentOrders as any[]).slice(0, 5).map((order) => (
                        <div key={order.id} className="text-sm border-b border-border pb-3 last:border-0">
                          <div className="flex justify-between items-start mb-1">
                            <p className="font-medium text-foreground">{order.order_number}</p>
                            <Badge variant="outline" className="text-xs">
                              {order.order_status}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{order.full_name}</p>
                          <p className="text-xs font-semibold text-primary">₹{Number(order.total_amount).toFixed(0)}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
