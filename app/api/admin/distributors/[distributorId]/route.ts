import { revalidatePath } from 'next/cache'
import { getCurrentUser } from "@/lib/auth-server"
import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function PATCH(request: Request, { params }: { params: { distributorId: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user || user.user_type !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { verificationStatus } = await request.json()
    const distributorId = await params.distributorId

    const result = await sql`
      UPDATE distributor_profiles
      SET verification_status = ${verificationStatus}
      WHERE id = ${distributorId}
      RETURNING id, verification_status
    ` as { rows: any[] }
    
    if (!result || result.rows.length === 0) {
        return NextResponse.json({ error: "Distributor not found or update failed" }, { status: 404 })
    }

    revalidatePath("/admin/distributors")

    return NextResponse.json({ success: true, distributor: result.rows[0] })
  } catch (error) {
    console.error("[v0] Update distributor status error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}