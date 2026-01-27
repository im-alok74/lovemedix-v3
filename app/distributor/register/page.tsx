import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { DistributorRegisterForm } from "@/components/distributor/distributor-register-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function DistributorRegisterPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 items-center justify-center bg-muted/30 py-12">
        <div className="container px-4">
          <Card className="mx-auto max-w-2xl">
            <CardHeader>
              <CardTitle className="text-2xl">Register as Distributor</CardTitle>
              <CardDescription>Join LoveMedix distribution network</CardDescription>
            </CardHeader>
            <CardContent>
              <DistributorRegisterForm />
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
