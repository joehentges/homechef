import { useState } from "react"

import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"

type Ingredient = {
  orderNumber: number
  description: string
}

interface IngredientsProps {
  ingredients: Ingredient[]
}

export function ViewRecipeIngredients(props: IngredientsProps) {
  const { ingredients } = props

  return (
    <ul className="space-y-4 pt-4">
      {ingredients
        .sort((a, b) => a.orderNumber - b.orderNumber)
        .map((ingredient) => (
          <IngredientItem
            key={`${ingredient.orderNumber}-ingredient`}
            ingredient={ingredient}
          />
        ))}
    </ul>
  )
}

function IngredientItem({ ingredient }: { ingredient: Ingredient }) {
  const [checked, setChecked] = useState<boolean | "indeterminate">(false)

  return (
    <li className="flex items-center space-x-4">
      <Checkbox
        id={`${ingredient.orderNumber}-${ingredient.description}`}
        checked={checked}
        onCheckedChange={setChecked}
      />
      <label
        htmlFor={`${ingredient.orderNumber}-${ingredient.description}`}
        className={cn("cursor-pointer", checked ? "line-through" : "")}
      >
        {ingredient.description}
      </label>
    </li>
  )
}
