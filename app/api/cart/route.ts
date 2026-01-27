import { getCurrentUser } from "@/lib/auth"
import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { medicineId, quantity } = await request.json()

    if (!medicineId || !quantity) {
      return NextResponse.json({ error: "Medicine ID and quantity are required" }, { status: 400 })
    }

    // Check if item already exists in cart
    const existing = await sql`
      SELECT * FROM cart_items
      WHERE user_id = ${user.id} AND medicine_id = ${medicineId}
    `

    if (existing.length > 0) {
      // Update quantity
      await sql`
        UPDATE cart_items
        SET quantity = quantity + ${quantity}
        WHERE user_id = ${user.id} AND medicine_id = ${medicineId}
      `
    } else {
      // Insert new item
      await sql`
        INSERT INTO cart_items (user_id, medicine_id, quantity)
        VALUES (${user.id}, ${medicineId}, ${quantity})
      `
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Add to cart error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const cartItems = await sql`
      SELECT c.id, c.quantity, c.created_at,
             m.id as medicine_id, m.name, m.mrp, m.image_url, m.requires_prescription
      FROM cart_items c
      JOIN medicines m ON c.medicine_id = m.id
      WHERE c.user_id = ${user.id}
      ORDER BY c.created_at DESC
    `

    return NextResponse.json({ cartItems })
  } catch (error) {
    console.error("[v0] Get cart error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const cartItemId = searchParams.get("id")

    if (!cartItemId) {
      return NextResponse.json({ error: "Cart item ID is required" }, { status: 400 })
    }

    await sql`
      DELETE FROM cart_items
      WHERE id = ${cartItemId} AND user_id = ${user.id}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Delete cart item error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
