import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth-server'
import { sql } from '@/lib/db'
import crypto from 'crypto'

function generateOrderNumber() {
  const timestamp = Date.now()
  const random = crypto.randomBytes(3).toString('hex')
  return `LM${timestamp}${random}`.toUpperCase()
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user || user.user_type !== 'customer') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    const {
      fullName,
      phone: deliveryPhone,
      addressLine1,
      addressLine2,
      city,
      state,
      pincode,
      cartItems,
    } = data

    if (
      !fullName ||
      !deliveryPhone ||
      !addressLine1 ||
      !city ||
      !state ||
      !pincode ||
      !cartItems ||
      cartItems.length === 0
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    let deliveryAddressId: number

    // Check if address already exists for the user
    const existingAddress = await sql`
      SELECT id FROM addresses
      WHERE user_id = ${user.id}
      AND full_name = ${fullName}
      AND phone = ${deliveryPhone}
      AND address_line1 = ${addressLine1}
      AND city = ${city}
      AND state = ${state}
      AND pincode = ${pincode}
      ${addressLine2 ? sql`AND address_line2 = ${addressLine2}` : sql`AND address_line2 IS NULL`}
      LIMIT 1
    `

    if (existingAddress.length > 0) {
      deliveryAddressId = existingAddress[0].id as number
    } else {
      // Insert new address
      const newAddress = await sql`
        INSERT INTO addresses (user_id, full_name, phone, address_line1, address_line2, city, state, pincode)
        VALUES (
          ${user.id},
          ${fullName},
          ${deliveryPhone},
          ${addressLine1},
          ${addressLine2 || null},
          ${city},
          ${state},
          ${pincode}
        )
        RETURNING id
      `
      deliveryAddressId = newAddress[0].id as number
    }

    // Group items by pharmacy to create separate orders
    const groupedByPharmacy = cartItems.reduce((acc: any, item: any) => {
      if (!acc[item.pharmacy_id]) {
        acc[item.pharmacy_id] = []
      }
      acc[item.pharmacy_id].push(item)
      return acc
    }, {})

    const orderNumbers: string[] = []

    // Create an order for each pharmacy
    for (const [pharmacyId, items] of Object.entries(groupedByPharmacy)) {
      const pharmacyItems = items as any[]
      
      // Calculate subtotal for this pharmacy
      const subtotal = pharmacyItems.reduce((sum, item) => {
        const itemPrice = item.price * item.quantity
        const discount = itemPrice * (item.discount_percentage / 100)
        return sum + (itemPrice - discount)
      }, 0)

      const gst = subtotal * 0.05 // 5% GST
      const deliveryFee = subtotal >= 500 ? 0 : 40
      const totalAmount = subtotal + gst + deliveryFee

      const orderNumber = generateOrderNumber()

      // Create order in database
      const orderResult = await sql`
        INSERT INTO orders (
          order_number,
          customer_id,
          pharmacy_id,
          delivery_address_id,
          order_status,
          payment_status,
          payment_method,
          subtotal,
          delivery_charge,
          total_amount
        ) VALUES (
          ${orderNumber},
          ${user.id},
          ${pharmacyId},
          ${deliveryAddressId},
          'pending',
          'pending',
          'cod',
          ${subtotal},
          ${deliveryFee},
          ${totalAmount}
        )
        RETURNING id
      `

      const orderId = (orderResult[0] as any).id

      // Add order items
      for (const item of pharmacyItems) {
        const itemPrice = item.price * item.quantity
        const discount = itemPrice * (item.discount_percentage / 100)
        const finalPrice = itemPrice - discount

        await sql`
          INSERT INTO order_items (
            order_id,
            medicine_id,
            quantity,
            unit_price,
            discount_percentage,
            total_price
          ) VALUES (
            ${orderId},
            ${item.medicine_id},
            ${item.quantity},
            ${item.price},
            ${item.discount_percentage},
            ${finalPrice}
          )
        `
      }

      orderNumbers.push(orderNumber)
    }

    // Clear cart
    await sql`
      DELETE FROM cart_items WHERE user_id = ${user.id}
    `

    return NextResponse.json({
      success: true,
      orderNumbers,
      message: `Orders created: ${orderNumbers.join(', ')}`
    })
  } catch (error) {
    console.error('[v0] Error creating orders:', error)
    return NextResponse.json(
      { error: 'Failed to create orders' },
      { status: 500 }
    )
  }
}
