"use client"

import { useQueryState } from "nuqs"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function SortBySelect() {
  const [sortBy, setSortBy] = useQueryState("sortBy", {
    defaultValue: "Newest",
  })

  return (
    <div className="w-[180px] space-y-2">
      <Select value={sortBy} onValueChange={(value) => setSortBy(value)}>
        <SelectTrigger
          id="select-17"
          className="relative rounded-2xl bg-white ps-[4.5rem] font-bold dark:bg-black"
        >
          <p className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 font-medium group-has-[[disabled]]:opacity-50">
            Sort By:
          </p>
          <SelectValue placeholder="" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Newest">Newest</SelectItem>
          <SelectItem value="Rating">Rating</SelectItem>
          <SelectItem value="Fastest">Fastest</SelectItem>
          <SelectItem value="Easiest">Easiest</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
