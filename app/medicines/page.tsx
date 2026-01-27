import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MedicineList } from "@/components/medicines/medicine-list"
import { MedicineFilters } from "@/components/medicines/medicine-filters"

export default function MedicinesPage({
  searchParams,
}: {
  searchParams: { search?: string; category?: string }
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 py-8 lg:py-12">
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-foreground lg:text-4xl">Browse Medicines</h1>
            <p className="text-muted-foreground lg:text-lg">Discover from our wide range of quality medicines</p>
          </div>
          <div className="grid gap-8 lg:grid-cols-4">
            <aside className="lg:col-span-1">
              <MedicineFilters />
            </aside>
            <div className="lg:col-span-3">
              <MedicineList searchParams={searchParams} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
