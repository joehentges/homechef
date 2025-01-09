"use client"

import { Dispatch, SetStateAction } from "react"
import { SearchIcon } from "lucide-react"

import { Input as InputElement } from "@/components/ui/input"

interface InputProps {
  search: string
  setSearch: (value: string) => void
  onChange: Dispatch<SetStateAction<string>>
}

export function Input(props: InputProps) {
  const { search, setSearch, onChange } = props

  function onInputChange(newValue: string) {
    onChange(newValue)
    setSearch(newValue)
  }

  return (
    <div className="md:min-w-[400px]">
      <div className="relative">
        <InputElement
          id="featured-recipe-search-input"
          className="peer rounded-3xl bg-white pe-9 ps-9 dark:bg-black"
          type="search"
          placeholder="Search recipes..."
          value={search}
          onChange={(e) => onInputChange(e.target.value)}
        />
        <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
          <SearchIcon size={16} strokeWidth={2} />
        </div>
      </div>
    </div>
  )
}
