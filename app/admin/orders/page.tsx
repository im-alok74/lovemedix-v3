import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { AdminLayout } from "@/components/admin/admin-layout"

export default async function AdminOrdersPage() {
  const user = await getCurrentUser()

  if (!user || user.user_type !== "admin") {
    redirect("/signin")
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Orders</h1>
          <p className="text-muted-foreground">Manage all orders on the platform</p>
        </div>

        <div className="rounded-lg border border-border bg-card p-12 text-center">
          <p className="text-muted-foreground">Order management coming soon</p>
        </div>
      </div>
    </AdminLayout>
  )
}
