import { revalidatePath } from "next/cache"
import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth-server"
import { sql } from "@/lib/db"
import crypto from "crypto"

function generateOrderNumber() {
  const timestamp = Date.now()
  const random = crypto.randomBytes(3).toString("hex")
  return `LM${timestamp}${random}`.toUpperCase()
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user || user.user_type !== "customer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const {
      addressLine1,
      addressLine2,
      city,
      state,
      pincode,
      cartItems,
    } = data

    if (
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

    // 1️⃣ Check if address already exists
    const existingAddress = await sql`
      SELECT id FROM addresses
      WHERE user_id = ${user.id}
        AND street_address = ${addressLine1}
        AND city = ${city}
        AND state = ${state}
        AND pincode = ${pincode}
      LIMIT 1
    `

    if (existingAddress.length > 0) {
      deliveryAddressId = existingAddress[0].id
    } else {
      // 2️⃣ Insert new address
      console.log("[v0] Inserting new address with addressLine1:", addressLine1);
      const newAddress = await sql`
        INSERT INTO addresses (
          user_id,
          address_type,
          street_address,
          landmark,
          city,
          state,
          pincode,
          is_default
        ) VALUES (
          ${user.id},
          'home',
          ${addressLine1 || ''}, -- Ensure non-null value for street_address
          ${addressLine2 || null},
          ${city},
          ${state},
          ${pincode},
          true
        )
        RETURNING id
      `;
      deliveryAddressId = newAddress[0].id;
    }

    // 3️⃣ Group cart items by pharmacy
    const groupedByPharmacy = cartItems.reduce((acc: any, item: any) => {
      if (!acc[item.pharmacy_id]) {
        acc[item.pharmacy_id] = []
      }
      acc[item.pharmacy_id].push(item)
      return acc
    }, {})

    const orderNumbers: string[] = []

    // 4️⃣ Create orders per pharmacy
    for (const [pharmacyId, items] of Object.entries(groupedByPharmacy)) {
      const pharmacyItems = items as any[]

      const subtotal = pharmacyItems.reduce((sum, item) => {
        const itemPrice = item.price * item.quantity
        const discount = itemPrice * (item.discount_percentage / 100)
        return sum + (itemPrice - discount)
      }, 0)

      const gst = subtotal * 0.05
      const deliveryFee = subtotal >= 500 ? 0 : 40
      const totalAmount = subtotal + gst + deliveryFee

      const orderNumber = generateOrderNumber()

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

      const orderId = orderResult[0].id

      // 5️⃣ Insert order items
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

    // 6️⃣ Clear cart
    await sql`
      DELETE FROM cart_items WHERE user_id = ${user.id}
    `

    revalidatePath("/orders")

    return NextResponse.json({
      success: true,
      orderNumbers,
      message: `Orders created: ${orderNumbers.join(", ")}`
    })
  } catch (error) {
    console.error("[v0] Error creating orders:", error)
    return NextResponse.json(
      { error: "Failed to create orders" },
      { status: 500 }
    )
  }
}
