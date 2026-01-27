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
