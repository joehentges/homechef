"use client"

import React, { Dispatch, SetStateAction } from "react"
import { Reorder, useDragControls } from "framer-motion"
import { GripVerticalIcon } from "lucide-react"

import { Input } from "@/components/ui/input"
import { AutosizeTextarea } from "@/components/autosize-textarea"

// NOTE! the orderNumber here is being used as an id
// when the form is submitted - it is correctly numbered based on the array order
type Ingredient = {
  orderNumber: number
  description: string
}

interface EditIngredientsProps {
  ingredients: Ingredient[]
  setIngredients: Dispatch<SetStateAction<Ingredient[]>>
}

export function EditIngredients(props: EditIngredientsProps) {
  const { ingredients, setIngredients } = props

  function onEditIngredientInputBlur(
    event: React.FocusEvent<HTMLTextAreaElement, Element>,
    orderNumber: number
  ) {
    const value = event.target.value
    let newIngredientsList
    if (!value) {
      // field is empty -> remove from ingredients list
      newIngredientsList = ingredients.filter(
        (ingredient) => ingredient.orderNumber !== orderNumber
      )
    } else {
      // update ingredients list with new value
      newIngredientsList = [...ingredients]
      const updatedIngredient = newIngredientsList.find(
        (ingredient) => ingredient.orderNumber === orderNumber
      ) as Ingredient
      updatedIngredient.description = value
    }
    setIngredients(newIngredientsList)
  }

  function getNextOrderNumber() {
    let maxNumber = -Infinity
    let nextAvailable = null
    for (const ingredient of ingredients) {
      if (ingredient.orderNumber > maxNumber) {
        maxNumber = ingredient.orderNumber
        nextAvailable = ingredient.orderNumber
      }
    }
    nextAvailable ??= 0

    return nextAvailable + 1
  }

  function onAddIngredientInputBlur(
    event: React.FocusEvent<HTMLTextAreaElement, Element>
  ) {
    const value = event.target.value
    if (!!value) {
      setIngredients([
        ...ingredients,
        { description: value, orderNumber: getNextOrderNumber() },
      ])
      event.target.value = ""
    }
  }

  return (
    <Reorder.Group axis="y" values={ingredients} onReorder={setIngredients}>
      {ingredients.map((ingredient) => (
        <IngredientItem
          key={`edit-ingredient-${ingredient.orderNumber}`}
          ingredient={ingredient}
          onBlur={onEditIngredientInputBlur}
        />
      ))}
      <div className="my-2 flex flex-row items-center gap-x-2">
        <AutosizeTextarea
          placeholder="Enter an ingredient"
          onBlur={onAddIngredientInputBlur}
        />
        <GripVerticalIcon className="h-6 w-6 opacity-0" />
      </div>
    </Reorder.Group>
  )
}

interface IngredientItemProps {
  ingredient: Ingredient
  onBlur: (
    event: React.FocusEvent<HTMLTextAreaElement, Element>,
    orderNumber: number
  ) => void
}

function IngredientItem(props: IngredientItemProps) {
  const { ingredient, onBlur } = props
  const dragControls = useDragControls()

  return (
    <Reorder.Item
      value={ingredient}
      id={ingredient}
      dragListener={false}
      dragControls={dragControls}
    >
      <div className="group my-2 flex flex-row items-center gap-x-2">
        <AutosizeTextarea
          defaultValue={ingredient.description}
          onBlur={(e) => onBlur(e, ingredient.orderNumber)}
        />
        <GripVerticalIcon
          onPointerDown={(event) => dragControls.start(event)}
          className="h-6 w-6 cursor-pointer opacity-0 transition-opacity group-hover:opacity-100"
        />
      </div>
    </Reorder.Item>
  )
}
