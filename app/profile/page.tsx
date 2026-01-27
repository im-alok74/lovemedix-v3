import { redirect } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getCurrentUser } from "@/lib/auth-server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

export default async function ProfilePage() {
  const user = await getCurrentUser()

  if (!user || user.user_type !== "customer") {
    redirect("/signin")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <h1 className="mb-8 text-3xl font-bold text-foreground">My Profile</h1>

          <Card className="mx-auto max-w-2xl">
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Full Name</Label>
                <p className="mt-1 text-foreground">{user.full_name}</p>
              </div>
              <div>
                <Label>Email</Label>
                <p className="mt-1 text-foreground">{user.email}</p>
              </div>
              <div>
                <Label>Phone</Label>
                <p className="mt-1 text-foreground">{user.phone || "Not provided"}</p>
              </div>
              <div>
                <Label>Account Type</Label>
                <p className="mt-1 text-foreground">{user.user_type}</p>
              </div>
              <div>
                <Label>Status</Label>
                <p className="mt-1 text-foreground">{user.status}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
