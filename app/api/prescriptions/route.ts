import { getCurrentUser } from "@/lib/auth-server"
import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user || user.user_type !== "customer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { doctorName, hospitalName, prescriptionDate, prescriptionImage, notes } = await request.json()

    if (!prescriptionImage) {
      return NextResponse.json({ error: "Prescription image is required" }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO prescriptions 
        (customer_id, doctor_name, hospital_name, prescription_date, prescription_image, notes)
      VALUES 
        (${user.id}, ${doctorName || null}, ${hospitalName || null}, ${prescriptionDate || null}, ${prescriptionImage}, ${notes || null})
      RETURNING *
    `

    return NextResponse.json({ success: true, prescription: result[0] })
  } catch (error) {
    console.error("[v0] Upload prescription error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user || user.user_type !== "customer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const prescriptions = await sql`
      SELECT * FROM prescriptions
      WHERE customer_id = ${user.id}
      ORDER BY created_at DESC
    `

    return NextResponse.json({ prescriptions })
  } catch (error) {
    console.error("[v0] Get prescriptions error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
