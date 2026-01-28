import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth-server"
import { sql } from "@/lib/db"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PharmacyVerificationActions } from "@/components/admin/pharmacy-verification-actions"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default async function AdminPharmaciesPage() {
  const user = await getCurrentUser()

  if (!user || user.user_type !== "admin") {
    redirect("/signin")
  }

  const pharmaciesResult = await sql`
    SELECT p.*, u.email, u.full_name, u.phone
    FROM pharmacy_profiles p
    JOIN users u ON p.user_id = u.id
    ORDER BY p.created_at DESC
  ` as { rows: any[] }
  const pharmacies = (pharmaciesResult && pharmaciesResult.rows) ? pharmaciesResult.rows : []

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Pharmacies</h1>
          <p className="text-muted-foreground">Manage and verify pharmacy registrations</p>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pharmacy Name</TableHead>
                  <TableHead>Contact Person</TableHead>
                  <TableHead>License Number</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pharmacies.map((p: any) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.pharmacy_name}</TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{p.full_name}</p>
                        <p className="text-xs text-muted-foreground">{p.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>{p.license_number}</TableCell>
                    <TableCell>
                      {p.city}, {p.state}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          p.verification_status === "verified"
                            ? "default"
                            : p.verification_status === "rejected"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {p.verification_status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {p.verification_status === "pending" && <PharmacyVerificationActions pharmacyId={p.id} />}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}