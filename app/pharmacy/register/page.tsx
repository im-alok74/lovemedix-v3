import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PharmacyRegisterForm } from "@/components/pharmacy/pharmacy-register-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function PharmacyRegisterPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 items-center justify-center bg-muted/30 py-12">
        <div className="container px-4">
          <Card className="mx-auto max-w-2xl">
            <CardHeader>
              <CardTitle className="text-2xl">Register Your Pharmacy</CardTitle>
              <CardDescription>Join LoveMedix network and reach more customers</CardDescription>
            </CardHeader>
            <CardContent>
              <PharmacyRegisterForm />
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
