"use client"

import { Dispatch, SetStateAction } from "react"
import { SearchIcon } from "lucide-react"
import { useQueryState } from "nuqs"

import { Input as InputElement } from "@/components/ui/input"

interface InputProps {
  onChange: Dispatch<SetStateAction<string>>
}

export function Input(props: InputProps) {
  const { onChange } = props

  const [search, setInput] = useQueryState("search", { defaultValue: "" })

  function onInputChange(newValue: string) {
    onChange(newValue)
    setInput(newValue)
  }

  return (
    <div className="md:min-w-[400px]">
      <div className="relative">
        <InputElement
          id="featured-recipe-search-input"
          className="peer rounded-2xl bg-white pe-9 ps-9 dark:bg-black"
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
