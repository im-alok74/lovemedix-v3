'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronDown, X } from 'lucide-react'
import { useState } from 'react'

interface AdvancedFiltersProps {
  categories: string[]
  onSearchChange?: (filters: Record<string, string>) => void
}

export function AdvancedFilters({ categories, onSearchChange }: AdvancedFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isExpanded, setIsExpanded] = useState(true)

  const [filters, setFilters] = useState({
    q: searchParams.get('q') || '',
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    prescription: searchParams.get('prescription') || '',
    sortBy: searchParams.get('sortBy') || 'popularity'
  })

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
  }

  const applyFilters = () => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value)
      }
    })
    router.push(`/medicines?${params.toString()}`)
    onSearchChange?.(filters)
  }

  const clearFilters = () => {
    setFilters({
      q: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      prescription: '',
      sortBy: 'popularity'
    })
    router.push('/medicines')
    onSearchChange?.({})
  }

  const hasActiveFilters = Object.values(filters).some(v => v && v !== 'popularity')

  return (
    <Card>
      <CardHeader
        className='cursor-pointer'
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className='flex items-center justify-between'>
          <CardTitle className='text-lg'>Filters</CardTitle>
          <ChevronDown
            className={`h-5 w-5 transition-transform ${isExpanded ? 'rotate-0' : '-rotate-90'}`}
          />
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className='space-y-6'>
          {/* Search */}
          <div>
            <label className='block text-sm font-medium mb-2'>Search Medicine</label>
            <Input
              type='text'
              placeholder='Name, generic name...'
              value={filters.q}
              onChange={(e) => handleFilterChange('q', e.target.value)}
              className='w-full'
            />
          </div>

          {/* Category */}
          <div>
            <label className='block text-sm font-medium mb-2'>Category</label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className='w-full px-3 py-2 border border-input rounded-md text-foreground bg-background'
            >
              <option value=''>All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label className='block text-sm font-medium mb-2'>Price Range (₹)</label>
            <div className='flex gap-2'>
              <Input
                type='number'
                placeholder='Min'
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                min='0'
                className='w-full'
              />
              <Input
                type='number'
                placeholder='Max'
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                min='0'
                className='w-full'
              />
            </div>
          </div>

          {/* Prescription */}
          <div>
            <label className='block text-sm font-medium mb-2'>Prescription</label>
            <select
              value={filters.prescription}
              onChange={(e) => handleFilterChange('prescription', e.target.value)}
              className='w-full px-3 py-2 border border-input rounded-md text-foreground bg-background'
            >
              <option value=''>All Medicines</option>
              <option value='true'>Requires Prescription</option>
              <option value='false'>OTC Only</option>
            </select>
          </div>

          {/* Sort */}
          <div>
            <label className='block text-sm font-medium mb-2'>Sort By</label>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className='w-full px-3 py-2 border border-input rounded-md text-foreground bg-background'
            >
              <option value='popularity'>Most Popular</option>
              <option value='price_low'>Price: Low to High</option>
              <option value='price_high'>Price: High to Low</option>
              <option value='name'>A to Z</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className='flex gap-2'>
            <Button onClick={applyFilters} className='flex-1'>
              Apply Filters
            </Button>
            {hasActiveFilters && (
              <Button
                onClick={clearFilters}
                variant='outline'
                className='flex-1'
              >
                <X className='h-4 w-4 mr-2' />
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  )
}
