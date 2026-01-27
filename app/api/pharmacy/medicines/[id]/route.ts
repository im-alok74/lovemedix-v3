import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth-server'
import { checkSellerVerification, getSellerProfile } from '@/lib/seller-auth'
import { sql } from '@/lib/db'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()

    if (!user || user.user_type !== 'pharmacy') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if pharmacy is verified
    const verification = await checkSellerVerification(user.id, 'pharmacy')
    if (!verification.verified) {
      return NextResponse.json(
        { error: 'Pharmacy not verified' },
        { status: 403 }
      )
    }

    const profile = await getSellerProfile(user.id, 'pharmacy')
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    const inventoryId = Number(params.id)

    // Verify ownership
    const inventory = await sql`
      SELECT id FROM pharmacy_inventory
      WHERE id = ${inventoryId} AND pharmacy_id = ${(profile as any).id}
    `

    if (inventory.length === 0) {
      return NextResponse.json(
        { error: 'Medicine not found or unauthorized' },
        { status: 404 }
      )
    }

    // Delete the medicine from inventory
    await sql`
      DELETE FROM pharmacy_inventory
      WHERE id = ${inventoryId}
    `

    return NextResponse.json({
      success: true,
      message: 'Medicine removed from inventory'
    })
  } catch (error) {
    console.error('[v0] Error deleting medicine:', error)
    return NextResponse.json(
      { error: 'Failed to delete medicine' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()

    if (!user || user.user_type !== 'pharmacy') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if pharmacy is verified
    const verification = await checkSellerVerification(user.id, 'pharmacy')
    if (!verification.verified) {
      return NextResponse.json(
        { error: 'Pharmacy not verified' },
        { status: 403 }
      )
    }

    const profile = await getSellerProfile(user.id, 'pharmacy')
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    const inventoryId = Number(params.id)
    const data = await request.json()
    const { stock_quantity, selling_price, discount_percentage } = data

    // Verify ownership
    const inventory = await sql`
      SELECT id FROM pharmacy_inventory
      WHERE id = ${inventoryId} AND pharmacy_id = ${(profile as any).id}
    `

    if (inventory.length === 0) {
      return NextResponse.json(
        { error: 'Medicine not found or unauthorized' },
        { status: 404 }
      )
    }

    // Update the medicine
    await sql`
      UPDATE pharmacy_inventory
      SET 
        stock_quantity = ${stock_quantity || null},
        selling_price = ${selling_price || null},
        discount_percentage = ${discount_percentage || null},
        last_updated = CURRENT_TIMESTAMP
      WHERE id = ${inventoryId}
    `

    return NextResponse.json({
      success: true,
      message: 'Medicine updated successfully'
    })
  } catch (error) {
    console.error('[v0] Error updating medicine:', error)
    return NextResponse.json(
      { error: 'Failed to update medicine' },
      { status: 500 }
    )
  }
}
