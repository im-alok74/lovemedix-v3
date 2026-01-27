import { redirect } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getCurrentUser } from "@/lib/auth"
import { sql } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, Building2, MapPin } from "lucide-react"

export default async function DistributorDashboardPage() {
  const user = await getCurrentUser()

  if (!user || user.user_type !== "distributor") {
    redirect("/signin")
  }

  // Get distributor profile
  const distributorProfile = await sql`
    SELECT * FROM distributor_profiles
    WHERE user_id = ${user.id}
    LIMIT 1
  `

  if (distributorProfile.length === 0) {
    redirect("/distributor/register")
  }

  const profile = distributorProfile[0] as any

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">{profile.company_name}</h1>
            <div className="mt-2 flex items-center gap-2">
              <p className="text-muted-foreground">
                {profile.city}, {profile.state}
              </p>
              <Badge variant={profile.verification_status === "verified" ? "default" : "secondary"}>
                {profile.verification_status}
              </Badge>
            </div>
          </div>

          <div className="mb-8 grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Deliveries</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">0</div>
                <p className="text-xs text-muted-foreground">Coming soon</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Pharmacies</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">0</div>
                <p className="text-xs text-muted-foreground">Coming soon</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Service Areas</CardTitle>
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">0</div>
                <p className="text-xs text-muted-foreground">Coming soon</p>
              </CardContent>
            </Card>
          </div>

          {profile.verification_status === "pending" && (
            <Card className="border-primary/50 bg-primary/5">
              <CardContent className="p-6">
                <h3 className="mb-2 font-semibold text-foreground">Verification Pending</h3>
                <p className="text-sm text-muted-foreground">
                  Your distributor registration is under review. You will be notified once verified by our team.
                </p>
              </CardContent>
            </Card>
          )}

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">License Number</p>
                  <p className="font-medium text-foreground">{profile.license_number}</p>
                </div>
                {profile.gst_number && (
                  <div>
                    <p className="text-sm text-muted-foreground">GST Number</p>
                    <p className="font-medium text-foreground">{profile.gst_number}</p>
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="font-medium text-foreground">
                  {profile.address}, {profile.city}, {profile.state} - {profile.pincode}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Commission Rate</p>
                <p className="font-medium text-foreground">{profile.commission_rate}%</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
