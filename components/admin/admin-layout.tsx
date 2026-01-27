import type React from "react"

import Link from "next/link"
import { Pill, Users, Building2, Package, ShoppingCart, FileText, Settings, Home } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card">
        <div className="flex h-16 items-center gap-2 border-b border-border px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Pill className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold leading-none text-foreground">LoveMedix</span>
            <span className="text-xs text-muted-foreground">Admin Panel</span>
          </div>
        </div>

        <nav className="space-y-1 p-4">
          <Link href="/admin">
            <Button variant="ghost" className="w-full justify-start gap-3" size="sm">
              <Home className="h-4 w-4" />
              Dashboard
            </Button>
          </Link>

          <Link href="/admin/users">
            <Button variant="ghost" className="w-full justify-start gap-3" size="sm">
              <Users className="h-4 w-4" />
              Users
            </Button>
          </Link>

          <Link href="/admin/pharmacies">
            <Button variant="ghost" className="w-full justify-start gap-3" size="sm">
              <Building2 className="h-4 w-4" />
              Pharmacies
            </Button>
          </Link>

          <Link href="/admin/distributors">
            <Button variant="ghost" className="w-full justify-start gap-3" size="sm">
              <Package className="h-4 w-4" />
              Distributors
            </Button>
          </Link>

          <Link href="/admin/orders">
            <Button variant="ghost" className="w-full justify-start gap-3" size="sm">
              <ShoppingCart className="h-4 w-4" />
              Orders
            </Button>
          </Link>

          <Link href="/admin/medicines">
            <Button variant="ghost" className="w-full justify-start gap-3" size="sm">
              <Pill className="h-4 w-4" />
              Medicines
            </Button>
          </Link>

          <Link href="/admin/prescriptions">
            <Button variant="ghost" className="w-full justify-start gap-3" size="sm">
              <FileText className="h-4 w-4" />
              Prescriptions
            </Button>
          </Link>

          <div className="pt-4">
            <Link href="/admin/settings">
              <Button variant="ghost" className="w-full justify-start gap-3" size="sm">
                <Settings className="h-4 w-4" />
                Settings
              </Button>
            </Link>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
          <div />
          <form action="/api/auth/signout" method="POST">
            <Button type="submit" variant="ghost" size="sm">
              Sign Out
            </Button>
          </form>
        </header>

        <main className="flex-1 overflow-auto bg-muted/30 p-6">{children}</main>
      </div>
    </div>
  )
}
