import { neon } from "@neondatabase/serverless"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set")
}

let connectionString = process.env.DATABASE_URL.trim()

// Remove 'psql ' prefix if present
if (connectionString.startsWith("psql ")) {
  connectionString = connectionString.substring(5)
}

// Remove surrounding quotes if present
connectionString = connectionString.replace(/^['"]|['"]$/g, "")

export const sql = neon(connectionString)
