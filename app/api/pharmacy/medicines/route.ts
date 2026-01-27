import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser, requireRole } from '@/lib/auth-server'
import { checkSellerVerification, getSellerProfile, logAccessAttempt } from '@/lib/seller-auth'
import { sql } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    let user
    try {
      user = await requireRole(['pharmacy'])
    } catch (error: any) {
      if (error.message === 'Unauthorized') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      if (error.message === 'Forbidden') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }

    // Check if pharmacy is verified
    const verification = await checkSellerVerification(user.id, 'pharmacy')
    
    if (!verification.verified) {
      await logAccessAttempt(user.id, 'pharmacy', 'add_medicine', false)
      return NextResponse.json(
        { error: 'Pharmacy not verified', reason: verification.reason },
        { status: 403 }
      )
    }

    const profile = await getSellerProfile(user.id, 'pharmacy')
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    const data = await request.json()
    const { medicine_id, stock_quantity, selling_price, discount_percentage, batch_number, expiry_date } = data

    // Validate input
    if (!medicine_id || !stock_quantity || !selling_price) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if medicine exists
    const medicine = await sql`
      SELECT id FROM medicines WHERE id = ${medicine_id}
    `

    if (medicine.length === 0) {
      return NextResponse.json({ error: 'Medicine not found' }, { status: 404 })
    }

    // Add or update inventory
    const result = await sql`
      INSERT INTO pharmacy_inventory (pharmacy_id, medicine_id, stock_quantity, selling_price, discount_percentage, batch_number, expiry_date)
      VALUES (${profile.id}, ${medicine_id}, ${stock_quantity}, ${selling_price}, ${discount_percentage || 0}, ${batch_number || null}, ${expiry_date || null})
      ON CONFLICT (pharmacy_id, medicine_id, batch_number)
      DO UPDATE SET 
        stock_quantity = ${stock_quantity},
        selling_price = ${selling_price},
        discount_percentage = ${discount_percentage || 0},
        expiry_date = ${expiry_date || null},
        last_updated = CURRENT_TIMESTAMP
      RETURNING id
    `

    await logAccessAttempt(user.id, 'pharmacy', 'add_medicine', true)

    return NextResponse.json({ 
      success: true,
      inventory_id: result[0].id,
      message: 'Medicine added to inventory successfully'
    })
  } catch (error) {
    console.error('[v0] Error adding medicine to pharmacy inventory:', error)
    return NextResponse.json(
      { error: 'Failed to add medicine to inventory' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    let user
    try {
      user = await requireRole(['pharmacy'])
    } catch (error: any) {
      if (error.message === 'Unauthorized') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      if (error.message === 'Forbidden') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }

    const profile = await getSellerProfile(user.id, 'pharmacy')
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    const inventory = await sql`
      SELECT 
        pi.*,
        m.name as medicine_name,
        m.generic_name,
        m.manufacturer,
        m.category
      FROM pharmacy_inventory pi
      JOIN medicines m ON pi.medicine_id = m.id
      WHERE pi.pharmacy_id = ${profile.id}
      ORDER BY m.category, m.name
    `

    return NextResponse.json({ inventory })
  } catch (error) {
    console.error('[v0] Error fetching pharmacy inventory:', error)
    return NextResponse.json(
      { error: 'Failed to fetch inventory' },
      { status: 500 }
    )
  }
}
