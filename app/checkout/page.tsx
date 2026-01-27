import { redirect } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getCurrentUser } from "@/lib/auth-server"
import { CheckoutForm } from "@/components/checkout/checkout-form"

export default async function CheckoutPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/signin")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          <h1 className="mb-8 text-3xl font-bold text-foreground">Checkout</h1>
          <CheckoutForm userId={user.id} />
        </div>
      </main>
      <Footer />
    </div>
  )
}
