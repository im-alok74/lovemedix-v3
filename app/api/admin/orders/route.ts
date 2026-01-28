import { NextRequest, NextResponse } from "next/server"
import { requireRole } from "@/lib/auth-server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    await requireRole(["admin"])

    const { searchParams } = new URL(request.url)
    const query = searchParams.get("query")?.trim()
    const status = searchParams.get("status")
    const page = Number(searchParams.get("page") || 1)
    const limit = Number(searchParams.get("limit") || 10)
    const offset = (page - 1) * limit

    /* ✅ BUILD FILTERS SAFELY */
    const filters = []

    if (query) {
      filters.push(sql`
        (o.order_number ILIKE ${"%" + query + "%"}
         OR u.full_name ILIKE ${"%" + query + "%"})
      `)
    }

    if (status && status !== "all") {
      filters.push(sql`o.order_status = ${status}`)
    }

    const whereClause =
      filters.length > 0
        ? sql`WHERE ${sql.join(filters, sql` AND `)}`
        : sql``

    /* ✅ MAIN QUERY */
    const orders = await sql`
      SELECT
        o.id,
        o.order_number,
        u.full_name AS customer_name,
        pp.pharmacy_name,
        o.total_amount,
        o.order_status,
        o.payment_status,
        o.created_at
      FROM orders o
      JOIN users u ON o.customer_id = u.id
      LEFT JOIN pharmacy_profiles pp ON o.pharmacy_id = pp.id
      ${whereClause}
      ORDER BY o.created_at DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `

    /* ✅ COUNT QUERY */
    const totalResult = await sql`
      SELECT COUNT(*)::int AS total
      FROM orders o
      JOIN users u ON o.customer_id = u.id
      ${whereClause}
    `

    return NextResponse.json({
      orders,
      totalOrders: totalResult[0].total,
      page,
      limit,
      totalPages: Math.ceil(totalResult[0].total / limit),
    })
  } catch (error) {
    console.error("[ADMIN ORDERS ERROR]", error)
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    )
  }
}
