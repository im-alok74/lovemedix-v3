import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { sql } from "@/lib/db"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Building2, Package, ShoppingCart, Pill, FileText } from "lucide-react"

export default async function AdminDashboardPage() {
  const user = await getCurrentUser()

  if (!user || user.user_type !== "admin") {
    redirect("/")
  }

  // Get statistics
  const stats = await sql`
    SELECT 
      (SELECT COUNT(*) FROM users WHERE user_type = 'customer') as total_customers,
      (SELECT COUNT(*) FROM pharmacy_profiles) as total_pharmacies,
      (SELECT COUNT(*) FROM distributor_profiles) as total_distributors,
      (SELECT COUNT(*) FROM orders) as total_orders,
      (SELECT COUNT(*) FROM medicines) as total_medicines,
      (SELECT COUNT(*) FROM prescriptions) as total_prescriptions,
      (SELECT COUNT(*) FROM pharmacy_profiles WHERE verification_status = 'pending') as pending_pharmacies,
      (SELECT COUNT(*) FROM distributor_profiles WHERE verification_status = 'pending') as pending_distributors
  `

  const data = stats[0] as any

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Overview of LoveMedix platform</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{data.total_customers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pharmacies</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{data.total_pharmacies}</div>
              {Number(data.pending_pharmacies) > 0 && (
                <p className="text-xs text-muted-foreground">{data.pending_pharmacies} pending verification</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Distributors</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{data.total_distributors}</div>
              {Number(data.pending_distributors) > 0 && (
                <p className="text-xs text-muted-foreground">{data.pending_distributors} pending verification</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{data.total_orders}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Medicines</CardTitle>
              <Pill className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{data.total_medicines}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Prescriptions</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{data.total_prescriptions}</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}
