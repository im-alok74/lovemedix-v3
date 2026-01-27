import { signIn } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  console.log("[v0] Sign in API called")
  try {
    const { email, password } = await request.json()
    console.log("[v0] Sign in attempt for email:", email)

    if (!email || !password) {
      console.log("[v0] Missing email or password")
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const user = await signIn(email, password)
    console.log("[v0] Sign in result:", user ? "Success" : "Failed")

    if (!user) {
      console.log("[v0] Invalid credentials")
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    console.log("[v0] Sign in successful for user:", user.email, "Type:", user.user_type)
    return NextResponse.json({ success: true, user })
  } catch (error) {
    console.error("[v0] Sign in error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
