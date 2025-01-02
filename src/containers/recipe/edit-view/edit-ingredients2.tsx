"use client"

import { Dispatch, SetStateAction, useEffect, useMemo, useRef } from "react"
import { GripVerticalIcon } from "lucide-react"
import { createSwapy, Swapy } from "swapy"

import { Input } from "@/components/ui/input"
import { AutogrowTextarea } from "@/components/autogrow-textarea"

type Ingredient = {
  id: number
  orderNumber: number
  description: string
}

interface EditIngredientsProps {
  initialIngredients: Ingredient[]
  movingIngredients: Ingredient[]
  setMovingIngredients: Dispatch<SetStateAction<Ingredient[]>>
}

export function EditIngredients(props: EditIngredientsProps) {
  const { movingIngredients, setMovingIngredients } = props

  const swapy = useRef<Swapy>(null)
  const container = useRef(null)

  useEffect(() => {
    // If container element is loaded
    if (container.current) {
      swapy.current = createSwapy(container.current, {
        dragAxis: "y",
      })

      // Your event listeners
      swapy.current.onSwap((event) => {
        console.log("swap", event)
        setMovingIngredients(
          event.newSlotItemMap.asArray.map((ing) => {
            const id = parseInt(ing.item)
            const foundIngredient = movingIngredients.find(
              (ingredient) => ingredient.id === id
            ) as Ingredient
            return foundIngredient
          })
        )
      })
    }

    return () => {
      // Destroy the swapy instance on component destroy
      swapy.current?.destroy()
    }
  }, [])

  function onInputChange(value: string, orderNumber: number) {
    //
  }

  return (
    <div ref={container} className="space-y-2">
      {movingIngredients.map((ingredient) => (
        <div data-swapy-slot={ingredient.id}>
          <div
            data-swapy-item={ingredient.id}
            className="group flex flex-row items-center gap-x-2"
          >
            <Input defaultValue={ingredient.description} />
            <GripVerticalIcon
              data-swapy-handle
              className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100"
            />
          </div>
        </div>
      ))}
      <div className="flex flex-row items-center gap-x-2">
        <Input placeholder="Add an ingredient" />
        <GripVerticalIcon className="h-4 w-4 opacity-0" />
      </div>
    </div>
  )
}
