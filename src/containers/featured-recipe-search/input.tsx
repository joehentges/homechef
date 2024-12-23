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
          className="peer rounded-2xl pe-9 ps-9"
          type="search"
          placeholder="Search recipes..."
          value={search}
          onChange={(e) => setInput(e.target.value)}
        />
        <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
          <SearchIcon size={16} strokeWidth={2} />
        </div>
        <button
          className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Submit search"
          type="submit"
        ></button>
      </div>
    </div>
  )
}
