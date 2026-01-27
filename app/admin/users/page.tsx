'use client'

import { redirect } from "next/navigation"
import { requireRole } from "@/lib/auth-server"
import { AdminLayout } from "@/components/admin/admin-layout"
import { AdminUsersTable } from "@/components/admin/users-table"

export default async function AdminUsersPage() {
  const user = await requireRole(["admin"])

  if (!user) {
    redirect("/signin")
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Users</h1>
          <p className="text-muted-foreground">Manage all users on the platform</p>
        </div>
        <AdminUsersTable />
      </div>
    </AdminLayout>
  )
}
