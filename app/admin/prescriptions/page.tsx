import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth-server"
import { AdminLayout } from "@/components/admin/admin-layout"

export default async function AdminPrescriptionsPage() {
  const user = await getCurrentUser()

  if (!user || user.user_type !== "admin") {
    redirect("/signin")
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Prescriptions</h1>
          <p className="text-muted-foreground">Review and verify prescriptions</p>
        </div>

        <div className="rounded-lg border border-border bg-card p-12 text-center">
          <p className="text-muted-foreground">Prescription management coming soon</p>
        </div>
      </div>
    </AdminLayout>
  )
}
