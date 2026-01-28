import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/auth-server'
import { sql } from '@/lib/db'

// GET /api/admin/prescriptions - Get all prescriptions
export async function GET(request: NextRequest) {
  try {
    await requireRole(['admin'])

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

    return NextResponse.json({ prescriptions })
  } catch (error: any) {
    console.error('[v0] Error fetching admin prescriptions:', error)
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    return NextResponse.json(
      { error: 'Failed to fetch prescriptions', details: String(error) },
      { status: 500 }
    )
  }
}