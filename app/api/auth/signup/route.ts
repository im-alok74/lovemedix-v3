import { signUp } from "@/lib/auth-server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email, password, fullName, phone, userType, adminSecret } = await request.json()

    if (!email || !password || !fullName || !phone || !userType) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    if (!["customer", "pharmacy", "distributor"].includes(userType)) {
      return NextResponse.json({ error: "Invalid user type" }, { status: 400 })
    }

    const user = await signUp(email, password, fullName, phone, userType)

    return NextResponse.json({ success: true, user })
  } catch (error: any) {
    console.error("[v0] Sign up error:", error)

    if (error.message?.includes("duplicate key")) {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
