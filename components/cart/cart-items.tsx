"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import Image from "next/image"

interface CartItem {
  id: number
  quantity: number
  medicine_id: number
  name: string
  mrp: string
  image_url: string | null
  requires_prescription: boolean
}

export function CartItems() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart = async () => {
    try {
      const response = await fetch("/api/cart")
      const data = await response.json()

      if (response.ok) {
        setCartItems(data.cartItems)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load cart",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const removeItem = async (itemId: number) => {
    try {
      const response = await fetch(`/api/cart?id=${itemId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setCartItems(cartItems.filter((item) => item.id !== itemId))
        toast({
          title: "Success",
          description: "Item removed from cart",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove item",
        variant: "destructive",
      })
    }
  }

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + Number.parseFloat(item.mrp) * item.quantity, 0)
  }

  if (isLoading) {
    return <div className="text-center text-muted-foreground">Loading cart...</div>
  }

  if (cartItems.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <p className="mb-4 text-muted-foreground">Your cart is empty</p>
          <Button onClick={() => router.push("/medicines")}>Browse Medicines</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <div className="space-y-4">
          {cartItems.map((item) => (
            <Card key={item.id}>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="relative h-20 w-20 overflow-hidden rounded-lg bg-muted">
                  <Image
                    src={item.image_url || "/placeholder.svg?height=80&width=80"}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                  <p className="mt-1 font-semibold text-primary">
                    ₹{(Number.parseFloat(item.mrp) * item.quantity).toFixed(2)}
                  </p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)}>
                  <Trash2 className="h-5 w-5" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="lg:col-span-1">
        <Card>
          <CardContent className="p-6">
            <h2 className="mb-4 text-xl font-semibold text-foreground">Order Summary</h2>
            <div className="space-y-2 border-b border-border pb-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium text-foreground">₹{calculateTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Delivery</span>
                <span className="font-medium text-foreground">{calculateTotal() >= 500 ? "FREE" : "₹40"}</span>
              </div>
            </div>
            <div className="mt-4 flex justify-between">
              <span className="font-semibold text-foreground">Total</span>
              <span className="text-lg font-bold text-primary">
                ₹{(calculateTotal() + (calculateTotal() >= 500 ? 0 : 40)).toFixed(2)}
              </span>
            </div>
            <Button className="mt-6 w-full" size="lg" onClick={() => router.push("/checkout")}>
              Proceed to Checkout
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
