import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/auth-server'
import { sql } from '@/lib/db'

// GET /api/admin/orders - Get all orders with search, filter, and pagination
export async function GET(request: NextRequest) {
  try {
    await requireRole(['admin'])

    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query') || ''
    const statusFilter = searchParams.get('status') || 'all'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit

    let whereClause = ''
    const queryParams: (string | number)[] = []

    // Search by order_number or customer_name
    if (query) {
      whereClause += `(o.order_number ILIKE $${queryParams.length + 1} OR u.full_name ILIKE $${queryParams.length + 2})`
      queryParams.push(`%${query}%`, `%${query}%`)
    }

    // Filter by order_status
    if (statusFilter !== 'all') {
      if (whereClause) whereClause += ' AND '
      whereClause += `o.order_status = $${queryParams.length + 1}`
      queryParams.push(statusFilter)
    }

    const finalWhereClause = whereClause ? `WHERE ${whereClause}` : ''

    const orders = await sql.query(`
      SELECT 
        o.id,
        o.order_number,
        o.total_amount,
        o.order_status,
        o.payment_status,
        o.created_at,
        u.full_name as customer_name,
        pp.pharmacy_name
      FROM orders o
      JOIN users u ON o.customer_id = u.id
      JOIN pharmacy_profiles pp ON o.pharmacy_id = pp.id
      ${finalWhereClause}
      ORDER BY o.created_at DESC
      LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}
    `, [...queryParams, limit, offset])

    const totalOrdersResult = await sql.query(`
      SELECT COUNT(*) as total
      FROM orders o
      JOIN users u ON o.customer_id = u.id
      JOIN pharmacy_profiles pp ON o.pharmacy_id = pp.id
      ${finalWhereClause}
    `, queryParams)

    const totalOrders = totalOrdersResult.rows.length > 0 ? (totalOrdersResult.rows[0] as any).total : 0

    return NextResponse.json({
      orders: orders.rows,
      totalOrders,
      page,
      limit,
      totalPages: Math.ceil(totalOrders / limit),
    })
  } catch (error: any) {
    console.error('[v0] Error fetching admin orders:', error)
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    return NextResponse.json(
      { error: 'Failed to fetch orders', details: String(error) },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/orders/[orderId] - Update order status
export async function PATCH(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    await requireRole(['admin'])

    const orderId = Number(params.orderId)
    if (isNaN(orderId)) {
      return NextResponse.json({ error: 'Invalid order ID' }, { status: 400 })
    }

    const { status } = await request.json()

    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 })
    }

    await sql`
      UPDATE orders
      SET order_status = ${status},
      updated_at = CURRENT_TIMESTAMP
      WHERE id = ${orderId}
    `

    return NextResponse.json({ success: true, message: 'Order status updated successfully' })
  } catch (error: any) {
    console.error('[v0] Error updating order status:', error)
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    return NextResponse.json(
      { error: 'Failed to update order status', details: String(error) },
      { status: 500 }
    )
  }
}
