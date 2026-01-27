import Link from "next/link"
import { ShoppingCart, Menu, Pill, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getCurrentUser } from "@/lib/auth"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export async function Header() {
  const user = await getCurrentUser()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-6 lg:gap-8">
          <Link href="/" className="group flex items-center gap-2.5">
            <div className="gradient-primary flex h-10 w-10 items-center justify-center rounded-xl shadow-lg shadow-primary/20 transition-all group-hover:shadow-xl group-hover:shadow-primary/30">
              <Pill className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-lg font-bold leading-none text-transparent">
                LoveMedix
              </span>
              <span className="text-xs text-muted-foreground">Medicines in Minutes</span>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 lg:flex">
            <Link
              href="/medicines"
              className="text-sm font-medium text-foreground/70 transition-colors hover:text-foreground"
            >
              Medicines
            </Link>
            <Link
              href="/upload-prescription"
              className="text-sm font-medium text-foreground/70 transition-colors hover:text-foreground"
            >
              Upload Prescription
            </Link>
            <Link
              href="/health-articles"
              className="text-sm font-medium text-foreground/70 transition-colors hover:text-foreground"
            >
              Health Articles
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2 lg:gap-3">
          {user ? (
            <>
              <Button variant="ghost" size="icon" asChild className="relative">
                <Link href="/cart">
                  <ShoppingCart className="h-5 w-5" />
                  <span className="sr-only">Shopping Cart</span>
                </Link>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="gradient-primary text-primary-foreground">
                        {user.full_name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.full_name || "User"}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {user.user_type === "customer" && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard">Dashboard</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/orders">My Orders</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/prescriptions">Prescriptions</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/profile">Profile</Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  {user.user_type === "pharmacy" && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/pharmacy/dashboard">Dashboard</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/pharmacy/orders">Orders</Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  {user.user_type === "distributor" && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/distributor/dashboard">Dashboard</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/distributor/orders">Orders</Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  {user.user_type === "admin" && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">Admin Dashboard</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <form action="/api/auth/signout" method="POST">
                      <button type="submit" className="w-full text-left">
                        Sign Out
                      </button>
                    </form>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
                <Link href="/signin">Sign In</Link>
              </Button>
              <Button
                size="sm"
                asChild
                className="gradient-primary text-primary-foreground shadow-lg shadow-primary/20"
              >
                <Link href="/signup">
                  <Sparkles className="mr-1.5 h-4 w-4" />
                  Get Started
                </Link>
              </Button>
            </>
          )}

          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Menu</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
