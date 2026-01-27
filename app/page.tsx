import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SearchBar } from "@/components/search-bar"
import { Clock, Shield, Truck, Pill, Sparkles, ArrowRight } from "lucide-react"
import { sql } from "@/lib/db"
import { MedicineCard } from "@/components/medicines/medicine-card"

interface Medicine {
  id: number
  name: string
  generic_name: string | null
  manufacturer: string | null
  category: string | null
  form: string | null
  strength: string | null
  pack_size: string | null
  description: string | null
  requires_prescription: boolean
  mrp: string
  image_url: string | null
  status: string
}

async function getFeaturedMedicines() {
  const medicines = (await sql`
    SELECT * FROM medicines
    WHERE status = 'active'
    ORDER BY name
    LIMIT 8
  `) as Medicine[]
  return medicines
}

export default async function HomePage() {
  const featuredMedicines = await getFeaturedMedicines()

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5 py-20 md:py-28 lg:py-32">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
          <div className="container relative mx-auto px-4">
            <div className="mx-auto max-w-4xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-sm">
                <Sparkles className="h-4 w-4" />
                Trusted by 10,000+ customers
              </div>
              <h1 className="mb-6 text-balance text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl xl:text-7xl">
                Medicines Delivered{" "}
                <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  in Minutes
                </span>
              </h1>
              <p className="mb-10 text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl lg:text-2xl">
                Order prescription and over-the-counter medicines from verified pharmacies. Fast delivery, trusted
                quality, affordable prices.
              </p>
              <div className="mx-auto mb-10 max-w-2xl">
                <SearchBar />
              </div>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Button
                  size="lg"
                  className="gradient-primary h-12 px-8 text-base shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30"
                  asChild
                >
                  <Link href="/medicines">
                    Browse Medicines
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="h-12 px-8 text-base bg-transparent" asChild>
                  <Link href="/upload-prescription">Upload Prescription</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 md:py-24">
          <div className="container mx-auto px-4">
            <h2 className="mb-4 text-center text-3xl font-bold text-foreground lg:text-4xl">Why Choose LoveMedix?</h2>
            <p className="mx-auto mb-12 max-w-2xl text-center text-muted-foreground lg:text-lg">
              Experience healthcare delivery that's fast, reliable, and designed around your needs
            </p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
              <Card className="group border-border/50 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                <CardContent className="flex flex-col items-center gap-4 p-6 text-center lg:p-8">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/10">
                    <Clock className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground lg:text-2xl">Fast Delivery</h3>
                  <p className="leading-relaxed text-muted-foreground">
                    Get your medicines delivered within 30 minutes in your area
                  </p>
                </CardContent>
              </Card>

              <Card className="group border-border/50 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                <CardContent className="flex flex-col items-center gap-4 p-6 text-center lg:p-8">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/10">
                    <Shield className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground lg:text-2xl">100% Genuine</h3>
                  <p className="leading-relaxed text-muted-foreground">
                    All medicines sourced from verified and licensed pharmacies
                  </p>
                </CardContent>
              </Card>

              <Card className="group border-border/50 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                <CardContent className="flex flex-col items-center gap-4 p-6 text-center lg:p-8">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/10">
                    <Truck className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground lg:text-2xl">Free Delivery</h3>
                  <p className="leading-relaxed text-muted-foreground">
                    Free delivery on orders above ₹500, nominal charges below
                  </p>
                </CardContent>
              </Card>

              <Card className="group border-border/50 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                <CardContent className="flex flex-col items-center gap-4 p-6 text-center lg:p-8">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/10">
                    <Pill className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground lg:text-2xl">Wide Range</h3>
                  <p className="leading-relaxed text-muted-foreground">
                    Access to thousands of medicines and healthcare products
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {featuredMedicines.length > 0 && (
          <section className="bg-gradient-to-b from-muted/30 to-background py-20 md:py-24">
            <div className="container mx-auto px-4">
              <div className="mb-12 text-center">
                <h2 className="mb-4 text-3xl font-bold text-foreground lg:text-4xl">Featured Medicines</h2>
                <p className="mx-auto max-w-2xl text-muted-foreground lg:text-lg">
                  Popular and trusted medicines available for immediate delivery
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
                {featuredMedicines.map((medicine) => (
                  <MedicineCard key={medicine.id} medicine={medicine} />
                ))}
              </div>
              <div className="mt-12 text-center">
                <Button size="lg" className="gradient-primary h-12 px-8 text-base shadow-lg shadow-primary/20" asChild>
                  <Link href="/medicines">
                    Browse More Medicines
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        )}

        <section className="py-20 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl rounded-3xl border border-border/50 bg-gradient-to-br from-card to-card/50 p-8 text-center shadow-xl lg:p-12">
              <h2 className="mb-4 text-balance text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
                Are You a Pharmacy or Distributor?
              </h2>
              <p className="mb-10 text-pretty text-lg leading-relaxed text-muted-foreground lg:text-xl">
                Partner with LoveMedix to expand your reach and serve more customers. Join our growing network of
                healthcare providers.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Button size="lg" variant="outline" className="h-12 px-8 text-base bg-transparent" asChild>
                  <Link href="/pharmacy/register">Register as Pharmacy</Link>
                </Button>
                <Button size="lg" variant="outline" className="h-12 px-8 text-base bg-transparent" asChild>
                  <Link href="/distributor/register">Register as Distributor</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
