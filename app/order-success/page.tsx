import { redirect } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getCurrentUser } from "@/lib/auth-server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Package, Phone, Home } from "lucide-react"
import Link from "next/link"

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: { orderId?: string }
}) {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/signin")
  }

  const orderId = searchParams.orderId

  if (!orderId) {
    redirect("/orders")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-gradient-to-b from-background via-muted/10 to-background">
        <div className="container mx-auto px-4 py-12">
          <div className="mx-auto max-w-2xl">
            <Card className="border-2 border-primary/20 shadow-lg">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                  <CheckCircle2 className="h-12 w-12 text-primary" />
                </div>
                <CardTitle className="text-3xl font-bold">
                  Order Placed Successfully!
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="rounded-lg bg-muted/50 p-6 text-center">
                  <p className="mb-2 text-sm text-muted-foreground">
                    Your Order Number
                  </p>
                  <p className="text-2xl font-bold text-primary">
                    {orderId}
                  </p>
                </div>

                <div className="space-y-4 border-t pt-6">
                  <h3 className="font-semibold">What happens next?</h3>

                  <div className="flex items-start gap-4">
                    <Package className="h-5 w-5 text-primary" />
                    <div>
                      <h4 className="font-medium">Order Processing</h4>
                      <p className="text-sm text-muted-foreground">
                        We're preparing your medicines for delivery
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Phone className="h-5 w-5 text-primary" />
                    <div>
                      <h4 className="font-medium">Delivery Confirmation</h4>
                      <p className="text-sm text-muted-foreground">
                        Our team will call you to confirm the delivery address
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Home className="h-5 w-5 text-primary" />
                    <div>
                      <h4 className="font-medium">Quick Delivery</h4>
                      <p className="text-sm text-muted-foreground">
                        Your order will be delivered within 30–60 minutes
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button asChild className="flex-1">
                    <Link href="/orders">View My Orders</Link>
                  </Button>
                  <Button asChild variant="outline" className="flex-1">
                    <Link href="/">Continue Shopping</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
