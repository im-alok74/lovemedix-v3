import { getCurrentUser } from "@/lib/auth"
import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function PATCH(request: Request, { params }: { params: { orderId: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user || user.user_type !== "pharmacy") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { status } = await request.json()
    const orderId = params.orderId

    await sql`
      UPDATE orders
      SET order_status = ${status}, updated_at = NOW()
      WHERE id = ${orderId}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Update order status error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
