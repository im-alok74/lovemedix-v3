import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AddToCartButton } from "./add-to-cart-button"
import { BuyNowButton } from "./buy-now-button"
import Image from "next/image"

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

export function MedicineCard({ medicine }: { medicine: Medicine }) {
  return (
    <Card className="group flex flex-col overflow-hidden border border-border/50 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
      <CardContent className="flex-1 p-3 lg:p-4">
        <div className="relative mb-3 aspect-square overflow-hidden rounded-lg bg-gradient-to-br from-muted to-muted/50">
          <Image
            src={medicine.image_url || "/placeholder.svg?height=200&width=200&query=medicine pill tablet"}
            alt={medicine.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {medicine.requires_prescription && (
            <Badge
              variant="secondary"
              className="absolute right-2 top-2 bg-accent/90 text-accent-foreground shadow-sm backdrop-blur-sm"
            >
              ℞ Rx
            </Badge>
          )}
        </div>
        <h3 className="mb-1 line-clamp-2 text-balance text-sm font-semibold text-foreground lg:text-base">
          {medicine.name}
        </h3>
        {medicine.generic_name && (
          <p className="mb-1 line-clamp-1 text-xs text-muted-foreground">{medicine.generic_name}</p>
        )}
        <p className="mb-2 line-clamp-1 text-xs text-muted-foreground">{medicine.manufacturer}</p>
        <p className="text-lg font-bold text-primary lg:text-xl">₹{Number.parseFloat(medicine.mrp).toFixed(2)}</p>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 p-3 pt-0 lg:p-4 lg:pt-0">
        <BuyNowButton medicineId={medicine.id} />
        <AddToCartButton medicineId={medicine.id} />
      </CardFooter>
    </Card>
  )
}
