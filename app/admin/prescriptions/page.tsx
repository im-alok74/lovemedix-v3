import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth-server"
import { AdminLayout } from "@/components/admin/admin-layout"
import { sql } from "@/lib/db"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default async function AdminPrescriptionsPage() {
  const user = await getCurrentUser()

  if (!user || user.user_type !== "admin") {
    redirect("/signin")
  }

  const prescriptionsResult = await sql.query(`
    SELECT 
      p.id,
      p.image_url,
      p.status,
      p.created_at,
      u.full_name as customer_name,
      u.email as customer_email
    FROM prescriptions p
    JOIN users u ON p.user_id = u.id
    ORDER BY p.created_at DESC
  `) as { rows: any[] }
  const prescriptions = (prescriptionsResult && prescriptionsResult.rows) ? prescriptionsResult.rows : []

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Prescriptions</h1>
          <p className="text-muted-foreground">Review and verify prescriptions</p>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Uploaded On</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {prescriptions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      No prescriptions found.
                    </TableCell>
                  </TableRow>
                ) : (
                  prescriptions.map((p: any) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{p.customer_name}</p>
                          <p className="text-xs text-muted-foreground">{p.customer_email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            p.status === "verified"
                              ? "default"
                              : p.status === "rejected"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {p.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(p.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Link href={p.image_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          View Prescription
                        </Link>
                        {/* Add verify/reject actions here later */}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}