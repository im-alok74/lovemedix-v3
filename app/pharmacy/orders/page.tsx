import { redirect } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getCurrentUser } from "@/lib/auth-server"
import { sql } from "@/lib/db"
import { PharmacyOrdersList } from "@/components/pharmacy/pharmacy-orders-list"

export default async function PharmacyOrdersPage() {
  const user = await getCurrentUser()

  if (!user || user.user_type !== "pharmacy") {
    redirect("/signin")
  }

  const pharmacyProfile = await sql`
    SELECT * FROM pharmacy_profiles
    WHERE user_id = ${user.id}
    LIMIT 1
  `

  if (pharmacyProfile.length === 0) {
    redirect("/pharmacy/register")
  }

  const profile = pharmacyProfile[0] as any

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <h1 className="mb-8 text-3xl font-bold text-foreground">Orders</h1>
          <PharmacyOrdersList pharmacyId={profile.id} />
        </div>
      </main>
      <Footer />
    </div>
  )
}
