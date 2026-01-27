import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth-server"
import { sql } from "@/lib/db"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DistributorVerificationActions } from "@/components/admin/distributor-verification-actions"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default async function AdminDistributorsPage() {
  const user = await getCurrentUser()

  if (!user || user.user_type !== "admin") {
    redirect("/signin")
  }

  const distributors = await sql`
    SELECT d.*, u.email, u.full_name, u.phone
    FROM distributor_profiles d
    JOIN users u ON d.user_id = u.id
    ORDER BY d.created_at DESC
  `

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Distributors</h1>
          <p className="text-muted-foreground">Manage and verify distributor registrations</p>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company Name</TableHead>
                  <TableHead>Contact Person</TableHead>
                  <TableHead>License Number</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {distributors.map((d: any) => (
                  <TableRow key={d.id}>
                    <TableCell className="font-medium">{d.company_name}</TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{d.full_name}</p>
                        <p className="text-xs text-muted-foreground">{d.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>{d.license_number}</TableCell>
                    <TableCell>
                      {d.city}, {d.state}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          d.verification_status === "verified"
                            ? "default"
                            : d.verification_status === "rejected"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {d.verification_status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {d.verification_status === "pending" && <DistributorVerificationActions distributorId={d.id} />}
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
