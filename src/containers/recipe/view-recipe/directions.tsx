import { useState } from "react"
import { CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"

type Direction = {
  orderNumber: number
  description: string
}

interface DirectionsProps {
  directions: Direction[]
}

export function ViewRecipeDirections(props: DirectionsProps) {
  const { directions } = props

  return (
    <ul className="space-y-4 pt-4">
      {directions.length < 1 && <p className="text-destructive">None</p>}
      {directions
        .sort((a, b) => a.orderNumber - b.orderNumber)
        .map((direction) => (
          <DirectionItem
            key={`${direction.orderNumber}-direction`}
            direction={direction}
          />
        ))}
    </ul>
  )
}

function DirectionItem({ direction }: { direction: Direction }) {
  const [checked, setChecked] = useState<boolean | "indeterminate">(false)

  return (
    <li
      className="flex cursor-pointer flex-row gap-x-2"
      onClick={() => setChecked(!checked)}
    >
      <div>
        {checked ? (
          <CheckIcon className="text-foreground h-6 w-6" />
        ) : (
          <p className="w-6 text-xl font-bold text-red-500">
            {direction.orderNumber + 1}
          </p>
        )}
      </div>

      <p className={cn("text-lg", checked ? "line-through" : "")}>
        {direction.description}
      </p>
    </li>
  )
}
