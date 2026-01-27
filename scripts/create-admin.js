import { neon } from "@neondatabase/serverless"
import bcrypt from "bcryptjs"

const sql = neon(process.env.DATABASE_URL)

async function createAdmin() {
  const email = "speeclo@gmail.com"
  const password = "123456"

  console.log("[v0] Creating admin account...")
  console.log("[v0] Email:", email)
  console.log("[v0] Password:", password)

  // Delete existing admin if exists
  await sql`DELETE FROM users WHERE email = ${email}`
  console.log("[v0] Deleted existing admin (if any)")

  // Hash password
  const passwordHash = await bcrypt.hash(password, 10)
  console.log("[v0] Password hash generated:", passwordHash.substring(0, 20) + "...")

  // Create new admin user
  const result = await sql`
    INSERT INTO users (email, password_hash, user_type, created_at)
    VALUES (${email}, ${passwordHash}, 'admin', NOW())
    RETURNING id, email, user_type
  `

  console.log("[v0] Admin created successfully!")
  console.log("[v0] User ID:", result[0].id)
  console.log("[v0] Email:", result[0].email)
  console.log("[v0] Type:", result[0].user_type)
  console.log("\n=== LOGIN CREDENTIALS ===")
  console.log("Email:", email)
  console.log("Password:", password)
  console.log("========================\n")

  return result[0]
}

createAdmin()
  .then(() => {
    console.log("[v0] Admin creation complete!")
    process.exit(0)
  })
  .catch((error) => {
    console.error("[v0] Error creating admin:", error)
    process.exit(1)
  })
