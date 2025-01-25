"use client"

import { SearchIcon } from "lucide-react"

import { Input as InputElement } from "@/components/ui/input"

interface InputProps {
  search: string
  setSearch: (value: string) => void
}

export function Input(props: InputProps) {
  const { search, setSearch } = props

  return (
    <div className="w-full space-y-2 md:w-[50%]">
      <div className="relative">
        <InputElement
          id="featured-recipe-search-input"
          className="peer rounded-3xl ps-9 pe-9"
          type="search"
          placeholder="Search recipes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
          <SearchIcon size={16} strokeWidth={2} />
        </div>
      </div>
    </div>
  )
}
