"use client"

import { SearchIcon } from "lucide-react"
import { useQueryState } from "nuqs"

import { Input as InputElement } from "@/components/ui/input"

export function Input() {
  const [search, setInput] = useQueryState("search", { defaultValue: "" })

  return (
    <div className="w-full space-y-2 md:w-[50%]">
      <div className="relative">
        <InputElement
          id="featured-recipe-search-input"
          className="peer rounded-2xl bg-white pe-9 ps-9 dark:bg-black"
          type="search"
          placeholder="Search recipes..."
          value={search}
          onChange={(e) => setInput(e.target.value)}
        />
        <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
          <SearchIcon size={16} strokeWidth={2} />
        </div>
      </div>
    </div>
  )
}
