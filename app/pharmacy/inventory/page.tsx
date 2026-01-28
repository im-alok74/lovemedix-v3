import { redirect } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getCurrentUser } from "@/lib/auth-server"
import { sql } from "@/lib/db"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"

export default async function PharmacyInventoryPage() {
  const user = await getCurrentUser()

  if (!user || user.user_type !== "pharmacy") {
    redirect("/signin")
  }

  const pharmacyProfile = await sql`
    SELECT * FROM pharmacy_profiles
    WHERE user_id = ${user.id}
    LIMIT 1
  `

  if (pharmacyProfile.length === 0) {
    redirect("/pharmacy/register")
  }

  const pharmacyInventory = await sql`
    SELECT 
      pi.id,
      m.name as medicine_name,
      m.salt_composition,
      pi.stock_quantity,
      pi.selling_price,
      pi.discount_percentage,
      pi.batch_number,
      pi.expiry_date,
      pi.created_at
    FROM pharmacy_inventory pi
    JOIN medicines m ON pi.medicine_id = m.id
    WHERE pi.pharmacy_id = ${(pharmacyProfile[0] as any).id}
    ORDER BY pi.created_at DESC
  `

  return (
    <div className=\"flex min-h-screen flex-col\">
      <Header />
      <main className=\"flex-1\">
        <div className=\"container mx-auto px-4 py-8\">
          <div className=\"mb-8 flex items-center justify-between\">
            <h1 className=\"text-3xl font-bold text-foreground\">Inventory Management</h1>
            <Button asChild>
              <Link href=\"/pharmacy/inventory/add\">
                <Plus className=\"mr-2 h-4 w-4\" />
                Add Medicine
              </Link>
            </Button>
          </div>

          {pharmacyInventory.length === 0 ? (
            <div className=\"rounded-lg border border-border bg-card p-12 text-center\">
              <p className=\"text-muted-foreground\">No medicines in your inventory yet. Add some to get started!</p>
              <Button asChild className=\"mt-4\">
                <Link href=\"/pharmacy/inventory/add\">Add Medicine</Link>
              </Button>
            </div>
          ) : (
            <div className=\"rounded-lg border border-border bg-card\">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Medicine Name</TableHead>
                    <TableHead>Salt Composition</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Selling Price</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>Batch Number</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pharmacyInventory.map((item: any) => (
                    <TableRow key={item.id}>
                      <TableCell className=\"font-medium\">{item.medicine_name}</TableCell>
                      <TableCell>{item.salt_composition}</TableCell>
                      <TableCell>{item.stock_quantity}</TableCell>
                      <TableCell>₹{item.selling_price.toFixed(2)}</TableCell>
                      <TableCell>{item.discount_percentage}%</TableCell>
                      <TableCell>{item.batch_number}</TableCell>
                      <TableCell>{new Date(item.expiry_date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Link href={\`/pharmacy/inventory/\${item.id}/edit\`} className=\"text-primary hover:underline\">Edit</Link>
                      </TableCell>
                    </TableRow>
                  ))}\n                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
