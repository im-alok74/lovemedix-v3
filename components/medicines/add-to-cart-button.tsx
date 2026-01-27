"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export function AddToCartButton({ medicineId }: { medicineId: number }) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleAddToCart = async () => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ medicineId, quantity: 1 }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success",
          description: "Medicine added to cart",
        })
        router.refresh()
      } else if (response.status === 401) {
        toast({
          title: "Sign in required",
          description: "Please sign in to add items to cart",
          variant: "destructive",
        })
        router.push("/signin")
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to add to cart",
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
    <Button onClick={handleAddToCart} disabled={isLoading} className="w-full">
      {isLoading ? "Adding..." : "Add to Cart"}
    </Button>
  )
}
