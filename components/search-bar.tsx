"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface Suggestion {
  id: number
  name: string
  generic_name: string | null
}

export function SearchBar() {
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const router = useRouter()
  const suggestionsRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node)) {
        if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
          setShowSuggestions(false)
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const fetchSuggestions = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/medicines/search?q=${encodeURIComponent(searchQuery)}&limit=8`)
      const data = await response.json()
      setSuggestions(data.medicines || [])
      setShowSuggestions(true)
    } catch (error) {
      console.error("[v0] Error fetching suggestions:", error)
      setSuggestions([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    
    if (value.trim()) {
      fetchSuggestions(value)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      setShowSuggestions(false)
      router.push(`/medicines?search=${encodeURIComponent(query.trim())}`)
    }
  }

  const handleSuggestionClick = (medicine: Suggestion) => {
    router.push(`/medicines?search=${encodeURIComponent(medicine.name)}`)
    setShowSuggestions(false)
  }

  const clearSearch = () => {
    setQuery("")
    setSuggestions([])
    setShowSuggestions(false)
    inputRef.current?.focus()
  }

  return (
    <form onSubmit={handleSearch} className="relative w-full">
      <div className="flex w-full gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="search"
            placeholder="Search for medicines..."
            value={query}
            onChange={handleInputChange}
            onFocus={() => {
              if (query.trim() && suggestions.length > 0) {
                setShowSuggestions(true)
              }
            }}
            className="pl-10 pr-10"
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          {/* Autocomplete Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div
              ref={suggestionsRef}
              className="absolute top-full left-0 right-0 z-50 mt-2 border border-border bg-background rounded-lg shadow-lg max-h-96 overflow-y-auto"
            >
              {suggestions.map((medicine) => (
                <button
                  key={medicine.id}
                  type="button"
                  onClick={() => handleSuggestionClick(medicine)}
                  className="w-full text-left px-4 py-3 border-b border-border last:border-b-0 hover:bg-muted transition-colors flex items-center justify-between group"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{medicine.name}</p>
                    {medicine.generic_name && (
                      <p className="text-xs text-muted-foreground truncate">{medicine.generic_name}</p>
                    )}
                  </div>
                  <Search className="h-4 w-4 text-muted-foreground ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          )}

          {/* No Results Message */}
          {showSuggestions && query.trim() && suggestions.length === 0 && !isLoading && (
            <div className="absolute top-full left-0 right-0 z-50 mt-2 border border-border bg-background rounded-lg shadow-lg p-4 text-center text-muted-foreground">
              No medicines found matching "{query}"
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="absolute top-full left-0 right-0 z-50 mt-2 border border-border bg-background rounded-lg shadow-lg p-4 text-center text-muted-foreground">
              Searching...
            </div>
          )}
        </div>
        <Button type="submit">Search</Button>
      </div>
    </form>
  )
}
