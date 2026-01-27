import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import bcrypt from "bcryptjs"

const sql = neon(process.env.DATABASE_URL!)

// This is a development-only route to create an admin account
export async function POST(request: NextRequest) {
  try {
    const { email, password, secretKey } = await request.json()

    // Simple secret key check - in production, remove this route entirely
    if (secretKey !== "create-lovemedix-admin-2024") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if admin already exists
    const existingAdmin = await sql`
      SELECT id FROM users WHERE email = ${email}
    `

    if (existingAdmin.length > 0) {
      return NextResponse.json({ error: "Admin user already exists" }, { status: 400 })
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // Create admin user
    await sql`
      INSERT INTO users (email, password_hash, user_type, created_at)
      VALUES (${email}, ${passwordHash}, 'admin', NOW())
    `

    return NextResponse.json({
      success: true,
      message: "Admin account created successfully",
      email,
    })
  } catch (error: any) {
    console.error("[v0] Create admin error:", error.message)
    return NextResponse.json({ error: "Failed to create admin account" }, { status: 500 })
  }
}
