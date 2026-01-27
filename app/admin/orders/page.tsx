import { redirect } from "next/navigation"
import { requireRole } from "@/lib/auth-server"
import { AdminOrdersTable } from "@/components/admin/admin-orders-table"
import { AdminLayout } from "@/components/admin/admin-layout"

export default async function AdminOrdersPage() {
  const user = await requireRole(["admin"])

  if (!user) {
    redirect("/signin")
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Orders</h1>
          <p className="text-muted-foreground">Manage all orders on the platform</p>
        </div>

        <AdminOrdersTable />
      </div>
    </AdminLayout>
  )
}
