import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth-server"
import { AdminLayout } from "@/components/admin/admin-layout"
import { sql } from "@/lib/db"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"

export default async function AdminMedicinesPage() {
  const user = await getCurrentUser()

  if (!user || user.user_type !== "admin") {
    redirect("/signin")
  }

  const medicines = await sql`
    SELECT id, name, generic_name, manufacturer, category, form, strength, mrp, requires_prescription
    FROM medicines
    ORDER BY name ASC
  `

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Medicines</h1>
          <p className="text-muted-foreground">Manage medicine catalog</p>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Medicine Name</TableHead>
                  <TableHead>Generic Name</TableHead>
                  <TableHead>Manufacturer</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Form</TableHead>
                  <TableHead>Strength</TableHead>
                  <TableHead>MRP</TableHead>
                  <TableHead>Prescription Required</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {medicines.map((medicine: any) => (
                  <TableRow key={medicine.id}>
                    <TableCell className="font-medium">{medicine.name}</TableCell>
                    <TableCell>{medicine.generic_name}</TableCell>
                    <TableCell>{medicine.manufacturer}</TableCell>
                    <TableCell>{medicine.category}</TableCell>
                    <TableCell>{medicine.form}</TableCell>
                    <TableCell>{medicine.strength}</TableCell>
                    <TableCell>₹{parseFloat(medicine.mrp).toFixed(2)}</TableCell>
                    <TableCell>{medicine.requires_prescription ? "Yes" : "No"}</TableCell>
                    <TableCell>
                      {/* Add edit/delete actions here later */}
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
