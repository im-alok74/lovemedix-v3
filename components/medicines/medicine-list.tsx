import { sql } from "@/lib/db"
import { MedicineCard } from "./medicine-card"

interface Medicine {
  id: number
  name: string
  generic_name: string | null
  manufacturer: string | null
  category: string | null
  form: string | null
  strength: string | null
  pack_size: string | null
  description: string | null
  requires_prescription: boolean
  mrp: string
  image_url: string | null
  status: string
}

export async function MedicineList({
  searchParams,
}: {
  searchParams: { search?: string; category?: string }
}) {
  const searchQuery = searchParams.search || ""
  const category = searchParams.category || ""

  let medicines: Medicine[]

  if (searchQuery) {
    medicines = (await sql`
      SELECT * FROM medicines
      WHERE status = 'active'
        AND (name ILIKE ${"%" + searchQuery + "%"} OR generic_name ILIKE ${"%" + searchQuery + "%"})
      ORDER BY name
      LIMIT 250
    `) as Medicine[]
  } else if (category) {
    medicines = (await sql`
      SELECT * FROM medicines
      WHERE status = 'active' AND category = ${category}
      ORDER BY name
      LIMIT 250
    `) as Medicine[]
  } else {
    medicines = (await sql`
      SELECT * FROM medicines
      WHERE status = 'active'
      ORDER BY name
      LIMIT 250
    `) as Medicine[]
  }

  if (medicines.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-12 text-center">
        <p className="text-muted-foreground">No medicines found. Try adjusting your search.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {medicines.map((medicine) => (
        <MedicineCard key={medicine.id} medicine={medicine} />
      ))}
    </div>
  )
}
