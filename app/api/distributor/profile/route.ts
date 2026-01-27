import { getCurrentUser } from "@/lib/auth-server"
import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user || user.user_type !== "distributor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { companyName, licenseNumber, gstNumber, address, city, state, pincode } = await request.json()

    const result = await sql`
      INSERT INTO distributor_profiles 
        (user_id, company_name, license_number, gst_number, address, city, state, pincode)
      VALUES 
        (${user.id}, ${companyName}, ${licenseNumber}, ${gstNumber || null}, ${address}, ${city}, ${state}, ${pincode})
      RETURNING *
    `

    return NextResponse.json({ success: true, profile: result[0] })
  } catch (error: any) {
    console.error("[v0] Distributor profile error:", error)

    if (error.message?.includes("duplicate key")) {
      return NextResponse.json({ error: "License number already registered" }, { status: 409 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user || user.user_type !== "distributor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const result = await sql`
      SELECT * FROM distributor_profiles
      WHERE user_id = ${user.id}
      LIMIT 1
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    return NextResponse.json({ profile: result[0] })
  } catch (error) {
    console.error("[v0] Get distributor profile error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
