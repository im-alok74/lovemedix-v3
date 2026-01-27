import { redirect } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getCurrentUser } from "@/lib/auth-server"
import { sql } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"

export default async function PrescriptionsPage() {
  const user = await getCurrentUser()

  if (!user || user.user_type !== "customer") {
    redirect("/signin")
  }

  const prescriptions = await sql`
    SELECT * FROM prescriptions
    WHERE customer_id = ${user.id}
    ORDER BY created_at DESC
  `

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-bold text-foreground">My Prescriptions</h1>
            <Button asChild>
              <Link href="/upload-prescription">
                <Plus className="mr-2 h-4 w-4" />
                Upload New
              </Link>
            </Button>
          </div>

          {prescriptions.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="mb-4 text-muted-foreground">You haven't uploaded any prescriptions yet</p>
                <Button asChild>
                  <Link href="/upload-prescription">Upload Prescription</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {prescriptions.map((prescription: any) => (
                <Card key={prescription.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">Prescription #{prescription.id}</CardTitle>
                        {prescription.doctor_name && (
                          <p className="text-sm text-muted-foreground">Dr. {prescription.doctor_name}</p>
                        )}
                      </div>
                      <Badge
                        variant={
                          prescription.status === "verified"
                            ? "default"
                            : prescription.status === "rejected"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {prescription.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      {prescription.hospital_name && (
                        <div>
                          <p className="text-sm text-muted-foreground">Hospital/Clinic</p>
                          <p className="font-medium text-foreground">{prescription.hospital_name}</p>
                        </div>
                      )}
                      {prescription.prescription_date && (
                        <div>
                          <p className="text-sm text-muted-foreground">Prescription Date</p>
                          <p className="font-medium text-foreground">
                            {new Date(prescription.prescription_date).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                      <div>
                        <p className="text-sm text-muted-foreground">Uploaded On</p>
                        <p className="font-medium text-foreground">
                          {new Date(prescription.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
