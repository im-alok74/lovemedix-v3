import { cookies } from "next/headers"
import { sql } from "./db"
import bcrypt from "bcryptjs"
import { cache } from "react"

export interface User {
  id: number
  email: string
  full_name: string
  phone: string | null
  user_type: "customer" | "pharmacy" | "distributor" | "admin"
  status: string
}

export interface Session {
  id: number
  user_id: number
  session_token: string
  expires_at: Date
}

// Generate a secure random session token
function generateSessionToken(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("")
}

// Create a new session
export async function createSession(userId: number): Promise<string> {
  const sessionToken = generateSessionToken()
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days

  await sql`
    INSERT INTO sessions (user_id, session_token, expires_at)
    VALUES (${userId}, ${sessionToken}, ${expiresAt})
  `

  const cookieStore = await cookies()
  cookieStore.set("session_token", sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  })

  return sessionToken
}

// Get current user from session
export const getCurrentUser = cache(async (): Promise<User | null> => {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get("session_token")?.value

  if (!sessionToken) {
    return null
  }

  const result = await sql`
    SELECT u.* FROM users u
    INNER JOIN sessions s ON u.id = s.user_id
    WHERE s.session_token = ${sessionToken}
      AND s.expires_at > NOW()
      AND u.status = 'active'
    LIMIT 1
  `

  if (result.length === 0) {
    return null
  }

  return result[0] as User
})

// Sign in
export async function signIn(email: string, password: string): Promise<User | null> {
  console.log("[v0] Auth: Looking up user with email:", email)

  const result = await sql`
    SELECT * FROM users
    WHERE email = ${email} AND status = 'active'
    LIMIT 1
  `

  console.log("[v0] Auth: User query returned", result.length, "results")

  if (result.length === 0) {
    console.log("[v0] Auth: No user found")
    return null
  }

  const user = result[0] as User & { password_hash: string }
  console.log("[v0] Auth: Found user:", user.email, "Type:", user.user_type)
  console.log("[v0] Auth: Password hash from DB:", user.password_hash)
  console.log("[v0] Auth: Password hash length:", user.password_hash?.length)
  console.log("[v0] Auth: Password hash starts with $2:", user.password_hash?.startsWith("$2"))
  console.log("[v0] Auth: Input password length:", password.length)

  console.log("[v0] Auth: Verifying password...")
  const isValidPassword = await bcrypt.compare(password, user.password_hash)
  console.log("[v0] Auth: Password valid:", isValidPassword)

  if (!isValidPassword) {
    console.log("[v0] Auth: Invalid password")
    return null
  }

  console.log("[v0] Auth: Creating session for user:", user.id)
  await createSession(user.id)
  console.log("[v0] Auth: Session created successfully")

  return {
    id: user.id,
    email: user.email,
    full_name: user.full_name,
    phone: user.phone,
    user_type: user.user_type,
    status: user.status,
  }
}

// Sign up
export async function signUp(
  email: string,
  password: string,
  fullName: string,
  phone: string,
  userType: "customer" | "pharmacy" | "distributor",
): Promise<User> {
  const passwordHash = await bcrypt.hash(password, 10)

  const result = await sql`
    INSERT INTO users (email, password_hash, full_name, phone, user_type)
    VALUES (${email}, ${passwordHash}, ${fullName}, ${phone}, ${userType})
    RETURNING id, email, full_name, phone, user_type, status
  `

  const user = result[0] as User

  await createSession(user.id)

  return user
}

// Sign out
export async function signOut(): Promise<void> {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get("session_token")?.value

  if (sessionToken) {
    await sql`
      DELETE FROM sessions
      WHERE session_token = ${sessionToken}
    `
  }

  cookieStore.delete("session_token")
}

// Check if user has specific role
export async function requireRole(allowedRoles: string[]): Promise<User> {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  if (!allowedRoles.includes(user.user_type)) {
    throw new Error("Forbidden")
  }

  return user
}
