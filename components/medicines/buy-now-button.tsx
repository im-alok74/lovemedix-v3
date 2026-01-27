"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { ShoppingBag } from "lucide-react"

export function BuyNowButton({ medicineId }: { medicineId: number }) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleBuyNow = async () => {
    setIsLoading(true)

    try {
      // Add to cart first
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ medicineId, quantity: 1 }),
      })

      if (response.ok) {
        // Redirect directly to checkout
        router.push("/checkout")
      } else if (response.status === 401) {
        toast({
          title: "Sign in required",
          description: "Please sign in to purchase medicines",
          variant: "destructive",
        })
        router.push("/signin")
      } else {
        const data = await response.json()
        toast({
          title: "Error",
          description: data.error || "Failed to process order",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleBuyNow} disabled={isLoading} className="w-full" variant="default">
      <ShoppingBag className="mr-2 h-4 w-4" />
      {isLoading ? "Processing..." : "Buy Now"}
    </Button>
  )
}
