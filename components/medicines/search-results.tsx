'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Pill } from 'lucide-react'

interface SearchResultsProps {
  searchParams: Record<string, string | string[] | undefined>
}

export function SearchResults({ searchParams }: SearchResultsProps) {
  const [medicines, setMedicines] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true)
      const params = new URLSearchParams()

      Object.entries(searchParams).forEach(([key, value]) => {
        if (value) {
          params.set(key, String(value))
        }
      })

      try {
        const response = await fetch(`/api/medicines/search?${params.toString()}`)
        const data = await response.json()
        setMedicines(data.medicines || [])
        setTotal(data.total || 0)
      } catch (error) {
        console.error('[v0] Search error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [searchParams])

  if (loading) {
    return (
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        {[...Array(8)].map((_, i) => (
          <Card key={i} className='animate-pulse'>
            <CardContent className='p-4 space-y-4'>
              <div className='h-40 bg-muted rounded' />
              <div className='h-4 bg-muted rounded' />
              <div className='h-4 w-2/3 bg-muted rounded' />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (medicines.length === 0) {
    return (
      <Card>
        <CardContent className='p-12 text-center'>
          <Pill className='h-12 w-12 mx-auto mb-4 text-muted-foreground' />
          <h3 className='font-semibold text-foreground mb-2'>No medicines found</h3>
          <p className='text-sm text-muted-foreground'>Try adjusting your filters or search term</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div>
      <p className='text-sm text-muted-foreground mb-4'>
        Showing {medicines.length} of {total} results
      </p>
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        {medicines.map((med) => (
          <Card key={`${med.id}-${med.pharmacy_id}`} className='hover:shadow-lg transition-shadow flex flex-col'>
            <CardContent className='p-4 flex-1 flex flex-col'>
              <div className='relative h-40 mb-3 rounded-lg overflow-hidden bg-muted'>
                <Image
                  src={med.image_url || '/placeholder.svg?height=160&width=160'}
                  alt={med.name}
                  fill
                  className='object-cover'
                />
              </div>

              <div className='flex-1'>
                <h3 className='font-semibold text-sm text-foreground line-clamp-2 mb-1'>
                  {med.name}
                </h3>
                <p className='text-xs text-muted-foreground mb-2'>
                  {med.generic_name}
                </p>
                {med.requires_prescription && (
                  <span className='inline-block text-xs bg-destructive/10 text-destructive px-2 py-1 rounded mb-2'>
                    Rx Required
                  </span>
                )}
              </div>

              <div className='space-y-2 mt-4'>
                <div className='flex justify-between items-center'>
                  <span className='text-lg font-bold text-primary'>
                    ₹{Number(med.final_price).toFixed(0)}
                  </span>
                  {med.discount_percentage > 0 && (
                    <span className='text-xs text-green-600 font-semibold'>
                      {med.discount_percentage}% OFF
                    </span>
                  )}
                </div>
                {med.discount_percentage > 0 && (
                  <p className='text-xs text-muted-foreground line-through'>
                    ₹{Number(med.selling_price).toFixed(0)}
                  </p>
                )}
                <p className='text-xs text-muted-foreground'>
                  {med.pharmacy_name}
                </p>
              </div>

              <div className='flex gap-2 mt-4'>
                <Button
                  size='sm'
                  className='flex-1'
                  onClick={async () => {
                    try {
                      await fetch('/api/cart', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          medicine_id: med.id,
                          quantity: 1
                        })
                      })
                    } catch (error) {
                      console.error('[v0] Add to cart error:', error)
                    }
                  }}
                >
                  <ShoppingCart className='h-4 w-4' />
                </Button>
                <Button size='sm' variant='outline' className='flex-1'>
                  Buy Now
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
