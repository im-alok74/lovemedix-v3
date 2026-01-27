import { redirect } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getCurrentUser } from "@/lib/auth-server"

export default async function AddressesPage() {
  const user = await getCurrentUser()

  if (!user || user.user_type !== "customer") {
    redirect("/signin")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <h1 className="mb-8 text-3xl font-bold text-foreground">Manage Addresses</h1>

          <div className="rounded-lg border border-border bg-card p-12 text-center">
            <p className="text-muted-foreground">Address management coming soon</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
