"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Package, Building2 } from "lucide-react"

interface CartItemWithSeller {
  id: number
  quantity: number
  medicine_id: number
  name: string
  price: number
  discount_percentage: number
  image_url: string | null
  pharmacy_id: number
  pharmacy_name: string
}

export function CheckoutForm({ userId }: { userId: number }) {
  const [cartItems, setCartItems] = useState<CartItemWithSeller[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)
  const [deliveryAddress, setDeliveryAddress] = useState("")
  const [phone, setPhone] = useState("")
  const [fullName, setFullName] = useState("")
  const [addressLine1, setAddressLine1] = useState("")
  const [addressLine2, setAddressLine2] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [pincode, setPincode] = useState("")
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('cod')
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart = async () => {
    try {
      const response = await fetch("/api/cart-with-sellers")
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

  const groupByPharmacy = () => {
    return cartItems.reduce((acc, item) => {
      if (!acc[item.pharmacy_id]) {
        acc[item.pharmacy_id] = { name: item.pharmacy_name, items: [] }
      }
      acc[item.pharmacy_id].items.push(item)
      return acc
    }, {} as Record<string, { name: string; items: CartItemWithSeller[] }>)
  }

  const calculateItemPrice = (item: CartItemWithSeller) => {
    const basePrice = item.price * item.quantity
    const discount = basePrice * (item.discount_percentage / 100)
    return basePrice - discount
  }

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + calculateItemPrice(item), 0)
  }

  const handlePlaceOrder = async () => {
    if (!fullName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your full name",
        variant: "destructive",
      })
      return
    }

    if (!phone.trim()) {
      toast({
        title: "Phone Required",
        description: "Please enter your phone number",
        variant: "destructive",
      })
      return
    }

    if (!addressLine1.trim()) {
      toast({
        title: "Address Line 1 Required",
        description: "Please enter your address line 1",
        variant: "destructive",
      })
      return
    }

    if (!city.trim()) {
      toast({
        title: "City Required",
        description: "Please enter your city",
        variant: "destructive",
      })
      return
    }

    if (!state.trim()) {
      toast({
        title: "State Required",
        description: "Please enter your state",
        variant: "destructive",
      })
      return
    }

    if (!pincode.trim()) {
      toast({
        title: "Pincode Required",
        description: "Please enter your pincode",
        variant: "destructive",
      })
      return
    }

    setIsPlacingOrder(true)

    try {
      const response = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          phone,
          addressLine1,
          addressLine2,
          city,
          state,
          pincode,
          cartItems,
          paymentMethod,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // If multiple orders were created (multiple pharmacies), use the first one for the success page
        const orderNumber = Array.isArray(data.orderNumbers) ? data.orderNumbers[0] : data.orderNumbers
        router.push(`/order-success?orderId=${orderNumber}&paymentMethod=${paymentMethod}`)
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to place order",
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
      setIsPlacingOrder(false)
    }
  }

  const subtotal = calculateSubtotal()
  const deliveryFee = subtotal >= 500 ? 0 : 40
  const taxableAmount = subtotal
  const gst = taxableAmount * 0.05 // 5% GST
  const total = subtotal + gst + deliveryFee
  const pharmacyGroups = groupByPharmacy()

  if (isLoading) {
    return <div className="text-center text-muted-foreground">Loading...</div>
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
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Delivery Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="addressLine1">Address Line 1 *</Label>
              <Input
                id="addressLine1"
                type="text"
                placeholder="House No., Building, Street Name"
                value={addressLine1}
                onChange={(e) => setAddressLine1(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="addressLine2">Address Line 2</Label>
              <Input
                id="addressLine2"
                type="text"
                placeholder="Landmark, Area, Colony (Optional)"
                value={addressLine2}
                onChange={(e) => setAddressLine2(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  type="text"
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  type="text"
                  placeholder="State"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="pincode">Pincode *</Label>
                <Input
                  id="pincode"
                  type="text"
                  placeholder="Pincode"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <label className="flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all"
                style={{ borderColor: paymentMethod === 'cod' ? 'var(--color-primary)' : 'var(--color-border)', backgroundColor: paymentMethod === 'cod' ? 'var(--color-primary-light, rgba(var(--color-primary), 0.05))' : 'transparent' }}>
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={(e) => setPaymentMethod(e.target.value as 'cod' | 'online')}
                  className="w-4 h-4 cursor-pointer"
                />
                <span className="ml-3 flex flex-col">
                  <span className="font-semibold text-foreground">Cash on Delivery (COD)</span>
                  <span className="text-sm text-muted-foreground">Pay when you receive your order</span>
                </span>
              </label>

              <label className="flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all"
                style={{ borderColor: paymentMethod === 'online' ? 'var(--color-primary)' : 'var(--color-border)', backgroundColor: paymentMethod === 'online' ? 'var(--color-primary-light, rgba(var(--color-primary), 0.05))' : 'transparent' }}>
                <input
                  type="radio"
                  name="payment"
                  value="online"
                  checked={paymentMethod === 'online'}
                  onChange={(e) => setPaymentMethod(e.target.value as 'cod' | 'online')}
                  className="w-4 h-4 cursor-pointer"
                />
                <span className="ml-3 flex flex-col">
                  <span className="font-semibold text-foreground">Online Payment</span>
                  <span className="text-sm text-muted-foreground">Pay using card, UPI, or net banking</span>
                </span>
              </label>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {Object.entries(pharmacyGroups).map(([pharmacyId, group]) => (
            <Card key={pharmacyId}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-primary" />
                  <CardTitle className="text-base">{group.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {group.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 border-b border-border pb-4 last:border-0">
                    <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-muted">
                      <Image
                        src={item.image_url || "/placeholder.svg?height=64&width=64"}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      {item.discount_percentage > 0 && (
                        <p className="text-xs text-green-600">Save {item.discount_percentage}%</p>
                      )}
                    </div>
                    <p className="font-semibold text-primary">
                      ₹{calculateItemPrice(item).toFixed(2)}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="lg:col-span-1">
        <Card className="sticky top-4">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 border-b border-border pb-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium text-foreground">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">GST (5%)</span>
                <span className="font-medium text-foreground">₹{gst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery Fee</span>
                <span className="font-medium text-foreground">{deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}</span>
              </div>
              {subtotal >= 500 && <p className="text-xs text-green-600">You saved ₹40 on delivery!</p>}
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-foreground">Total Amount</span>
              <span className="text-xl font-bold text-primary">₹{total.toFixed(2)}</span>
            </div>
            <Button className="w-full" size="lg" onClick={handlePlaceOrder} disabled={isPlacingOrder}>
              {isPlacingOrder ? "Placing Order..." : "Place Order"}
            </Button>
            <p className="text-center text-xs text-muted-foreground">Cash on Delivery available</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
