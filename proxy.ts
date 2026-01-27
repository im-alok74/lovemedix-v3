import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getCurrentUser } from "@/lib/auth"

const protectedRoutes = [
  "/dashboard",
  "/cart",
  "/checkout",
  "/orders",
  "/prescriptions",
  "/profile",
  "/addresses",
  "/pharmacy/dashboard",
  "/pharmacy/orders",
  "/pharmacy/inventory",
  "/distributor/dashboard",
  "/distributor/orders",
  "/admin",
]

const adminRoutes = ["/admin"]
const pharmacyRoutes = ["/pharmacy"]
const distributorRoutes = ["/distributor"]

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  if (isProtectedRoute) {
    const user = await getCurrentUser()

    // Redirect to signin if not authenticated
    if (!user) {
      const signInUrl = new URL("/signin", request.url)
      signInUrl.searchParams.set("redirect", pathname)
      return NextResponse.redirect(signInUrl)
    }

    // Check role-based access
    if (adminRoutes.some((route) => pathname.startsWith(route)) && user.user_type !== "admin") {
      return NextResponse.redirect(new URL("/", request.url))
    }

    if (pharmacyRoutes.some((route) => pathname.startsWith(route)) && user.user_type !== "pharmacy") {
      return NextResponse.redirect(new URL("/", request.url))
    }

    if (distributorRoutes.some((route) => pathname.startsWith(route)) && user.user_type !== "distributor") {
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
}
