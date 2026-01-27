import { getCurrentUser } from "@/lib/auth-server"
import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user || user.user_type !== "pharmacy") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { pharmacyName, licenseNumber, gstNumber, address, city, state, pincode, is24x7 } = await request.json()

    const result = await sql`
      INSERT INTO pharmacy_profiles 
        (user_id, pharmacy_name, license_number, gst_number, address, city, state, pincode, is_24x7)
      VALUES 
        (${user.id}, ${pharmacyName}, ${licenseNumber}, ${gstNumber || null}, ${address}, ${city}, ${state}, ${pincode}, ${is24x7})
      RETURNING *
    `

    return NextResponse.json({ success: true, profile: result[0] })
  } catch (error: any) {
    console.error("[v0] Pharmacy profile error:", error)

    if (error.message?.includes("duplicate key")) {
      return NextResponse.json({ error: "License number already registered" }, { status: 409 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user || user.user_type !== "pharmacy") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const result = await sql`
      SELECT * FROM pharmacy_profiles
      WHERE user_id = ${user.id}
      LIMIT 1
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    return NextResponse.json({ profile: result[0] })
  } catch (error) {
    console.error("[v0] Get pharmacy profile error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
