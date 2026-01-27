import { signOut } from "@/lib/auth-server"
import { redirect } from "next/navigation"

export async function POST() {
  await signOut()
  redirect("/")
}
