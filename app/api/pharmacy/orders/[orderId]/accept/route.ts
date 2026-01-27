import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/auth-server'
import { sql } from '@/lib/db'

export async function POST(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const user = await requireRole(['pharmacy'])

    const orderId = Number(params.orderId)
    if (isNaN(orderId)) {
      return NextResponse.json({ error: 'Invalid order ID' }, { status: 400 })
    }

    // Verify the pharmacy owns this order
    const orderCheck = await sql`
      SELECT id FROM orders
      WHERE id = ${orderId} AND pharmacy_id IN (SELECT id FROM pharmacy_profiles WHERE user_id = ${user.id})
      LIMIT 1
    `

    if (orderCheck.length === 0) {
      return NextResponse.json({ error: 'Order not found or unauthorized' }, { status: 404 })
    }

    // Update order status to 'confirmed'
    await sql`
      UPDATE orders
      SET order_status = 'confirmed',
      updated_at = CURRENT_TIMESTAMP
      WHERE id = ${orderId}
    `

    return NextResponse.json({
      success: true,
      message: `Order ${orderId} confirmed successfully`,
    })
  } catch (error: any) {
    console.error('[v0] Error accepting order:', error)
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    return NextResponse.json({ error: 'Failed to accept order' }, { status: 500 })
  }
}
