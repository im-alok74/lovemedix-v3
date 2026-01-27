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
    const { deliveryAddress, phone, cartItems, paymentMethod = 'cod' } = data

    if (!deliveryAddress || !phone || !cartItems || cartItems.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (!['cod', 'online'].includes(paymentMethod)) {
      return NextResponse.json(
        { error: 'Invalid payment method' },
        { status: 400 }
      )
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
          NULL,
          'pending',
          ${paymentMethod === 'online' ? 'pending' : 'pending'},
          ${paymentMethod},
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
