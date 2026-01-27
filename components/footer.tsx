import Link from "next/link"
import { Pill, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Pill className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold leading-none text-foreground">LoveMedix</span>
                <span className="text-xs text-muted-foreground">Medicines in Minutes</span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Your trusted partner for fast and reliable medicine delivery. We ensure quality healthcare products reach
              you safely.
            </p>
            <div className="flex gap-3">
              <Link
                href="#"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-secondary-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <Facebook className="h-4 w-4" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link
                href="#"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-secondary-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <Twitter className="h-4 w-4" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link
                href="#"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-secondary-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <Instagram className="h-4 w-4" />
                <span className="sr-only">Instagram</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/medicines" className="text-muted-foreground transition-colors hover:text-foreground">
                  Browse Medicines
                </Link>
              </li>
              <li>
                <Link
                  href="/upload-prescription"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Upload Prescription
                </Link>
              </li>
              <li>
                <Link href="/health-articles" className="text-muted-foreground transition-colors hover:text-foreground">
                  Health Articles
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground transition-colors hover:text-foreground">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">For Business</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/pharmacy/register"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Register as Pharmacy
                </Link>
              </li>
              <li>
                <Link
                  href="/distributor/register"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Register as Distributor
                </Link>
              </li>
              <li>
                <Link href="/partner-with-us" className="text-muted-foreground transition-colors hover:text-foreground">
                  Partner With Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Phone className="mt-0.5 h-4 w-4 text-primary" />
                <span className="text-muted-foreground">+91 9508178521</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="mt-0.5 h-4 w-4 text-primary" />
                <span className="text-muted-foreground">lovemedixpharmapvtltd@gmail.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 text-primary" />
                <span className="text-muted-foreground">Silao, Nalanda, Bihar</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-center text-sm text-muted-foreground">© 2025 LoveMedix. All rights reserved.</p>
            <div className="flex gap-6 text-sm">
              <Link href="/privacy" className="text-muted-foreground transition-colors hover:text-foreground">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-muted-foreground transition-colors hover:text-foreground">
                Terms of Service
              </Link>
              <Link href="/refund" className="text-muted-foreground transition-colors hover:text-foreground">
                Refund Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
