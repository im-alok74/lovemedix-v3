import { revalidatePath } from 'next/cache'
import { getCurrentUser } from "@/lib/auth-server"
import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function PATCH(request: Request, { params }: { params: { pharmacyId: string } }) {
  try {
    const user = await getCurrentUser()
    console.log("[v0] Admin update pharmacy - User:", user?.id, "Type:", user?.user_type)
    
    if (!user || user.user_type !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { verificationStatus } = await request.json()
    const pharmacyId = Number(await params.pharmacyId)
    if (isNaN(pharmacyId)) {
      return NextResponse.json({ error: 'Invalid pharmacy ID' }, { status: 400 })
    }

    console.log("[v0] Updating pharmacy", pharmacyId, "to status:", verificationStatus)

    const result = await sql`
      UPDATE pharmacy_profiles
      SET verification_status = ${verificationStatus},
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${pharmacyId}
      RETURNING id, verification_status
    ` as { rows: any[] }
    revalidatePath("/admin/pharmacies")

    console.log("[v0] Update result:", result)

    if (!result || result.rows.length === 0) {
      return NextResponse.json({ error: "Pharmacy not found or update failed" }, { status: 404 })
    }

    return NextResponse.json({ 
      success: true,
      pharmacy: result.rows[0],
      message: `Pharmacy successfully ${verificationStatus}`
    })
  } catch (error) {
    console.error("[v0] Update pharmacy status error:", error)
    return NextResponse.json({ error: "Internal server error", details: String(error) }, { status: 500 })
  }
}