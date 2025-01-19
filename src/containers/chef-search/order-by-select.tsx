"use client"

import { UsersOrderBy } from "@/types/SearchUsers"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface OrderBySelectProps {
  orderBy: UsersOrderBy
  onChange: (value: UsersOrderBy) => void
}

export function OrderBySelect(props: OrderBySelectProps) {
  const { orderBy, onChange } = props

  return (
    <div className="min-w-[225px] space-y-2">
      <Select
        value={orderBy.toLowerCase()}
        onValueChange={(value) => onChange(value as UsersOrderBy)}
      >
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
          <SelectItem value="alphabetically">Alphabetically</SelectItem>
          <SelectItem value="importedcount">Imported Count</SelectItem>
          <SelectItem value="createdcount">Created Count</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
