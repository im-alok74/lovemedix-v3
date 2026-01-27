"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useRouter, useSearchParams } from "next/navigation"
import { ChevronDown } from "lucide-react"
import { useState } from "react"

const categories = [
  "All Categories",
  "Pain Relief",
  "Antibiotic",
  "Allergy",
  "Digestive",
  "Diabetes",
  "Cardiovascular",
  "Vitamin",
  "Respiratory",
]

export function MedicineFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get("category") || ""
  const [isOpen, setIsOpen] = useState(true)

  const handleCategoryChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === "All Categories") {
      params.delete("category")
    } else {
      params.set("category", value)
    }
    router.push(`/medicines?${params.toString()}`)
  }

  return (
    <Card>
      <CardHeader className="cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <div className="flex items-center justify-between">
          <CardTitle>Filters</CardTitle>
          <ChevronDown className={`h-5 w-5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </div>
      </CardHeader>
      {isOpen && (
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="mb-3 text-sm font-semibold text-foreground">Category</h3>
              <RadioGroup value={currentCategory || "All Categories"} onValueChange={handleCategoryChange}>
                {categories.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <RadioGroupItem value={category === "All Categories" ? "" : category} id={category} />
                    <Label htmlFor={category} className="cursor-pointer text-sm">
                      {category}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
