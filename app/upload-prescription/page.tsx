import { redirect } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getCurrentUser } from "@/lib/auth-server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PrescriptionUploadForm } from "@/components/prescription/prescription-upload-form"

export default async function UploadPrescriptionPage() {
  const user = await getCurrentUser()

  if (!user || user.user_type !== "customer") {
    redirect("/signin")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <Card className="mx-auto max-w-2xl">
            <CardHeader>
              <CardTitle>Upload Prescription</CardTitle>
              <CardDescription>
                Upload your prescription to order medicines. Our pharmacists will verify it before processing your
                order.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PrescriptionUploadForm />
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
