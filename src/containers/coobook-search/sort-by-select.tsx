"use client"

import { OrderBy } from "@/types/SearchRecipes"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface SortBySelectProps {
  orderBy: string
  setOrderBy: (value: OrderBy) => void
}

export function SortBySelect(props: SortBySelectProps) {
  const { orderBy, setOrderBy } = props

  return (
    <div className="min-w-[180px] space-y-2">
      <Select value={orderBy.toLowerCase()} onValueChange={setOrderBy}>
        <SelectTrigger
          id="select-17"
          className="relative rounded-3xl bg-white ps-[4.5rem] font-bold dark:bg-black"
        >
          <p className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 font-medium group-has-[[disabled]]:opacity-50">
            Sort By:
          </p>
          <SelectValue placeholder="" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest</SelectItem>
          <SelectItem value="fastest">Fastest</SelectItem>
          <SelectItem value="easiest">Easiest</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
