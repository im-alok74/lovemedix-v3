import { redirect } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getCurrentUser } from "@/lib/auth"
import { sql } from "@/lib/db"

export default async function DistributorOrdersPage() {
  const user = await getCurrentUser()

  if (!user || user.user_type !== "distributor") {
    redirect("/signin")
  }

  const distributorProfile = await sql`
    SELECT * FROM distributor_profiles
    WHERE user_id = ${user.id}
    LIMIT 1
  `

  if (distributorProfile.length === 0) {
    redirect("/distributor/register")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <h1 className="mb-8 text-3xl font-bold text-foreground">Orders</h1>
          <div className="rounded-lg border border-border bg-card p-12 text-center">
            <p className="text-muted-foreground">Order management coming soon</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
