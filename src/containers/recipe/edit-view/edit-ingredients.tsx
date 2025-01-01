"use client"

import { useEffect, useRef, useState } from "react"
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core"
import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from "@dnd-kit/modifiers"
import { GripVerticalIcon } from "lucide-react"

import { AutogrowTextarea } from "@/components/autogrow-textarea"

interface EditIngredientsProps {
  ingredients: string[]
}

export function EditIngredients(props: EditIngredientsProps) {
  const { ingredients: initialIngredients } = props
  const [ingredients, setIngredients] = useState<string[]>(initialIngredients)

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (!over) return

    const taskId = active.id as string
    const newStatus = over.id as Task["status"]

    setIngredients(() =>
      tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: newStatus,
            }
          : task
      )
    )
  }

  return (
    <DndContext onDragEnd={handleDragEnd} modifiers={[restrictToVerticalAxis]}>
      {parent === null ? draggableMarkup : null}

      {containers.map((id) => (
        // We updated the Droppable component so it would accept an `id`
        // prop and pass it to `useDroppable`
        <Droppable key={id} id={id}>
          {parent === id ? draggableMarkup : "Drop here"}
        </Droppable>
      ))}
    </DndContext>
  )

  if (true) {
    return (
      <DndContext modifiers={[restrictToVerticalAxis]}>
        <DragOverlay modifiers={[restrictToWindowEdges]}>
          {ingredients.map((ingredient) => {
            return (
              <Droppable id={ingredient} key={ingredient}>
                <div className="group flex flex-row items-center gap-x-2">
                  {ingredient}
                  <GripVerticalIcon className="h-4 w-4 cursor-pointer opacity-0 group-hover:opacity-100" />
                </div>
              </Droppable>
            )
          })}
        </DragOverlay>
      </DndContext>
    )
  }

  return (
    <ul ref={containerRef} className="select-none space-y-2 pt-4">
      {ingredients.map((ingredient: string, index: number) => {
        return (
          <li data-swapy-slot={ingredient} key={ingredient}>
            <div
              data-swapy-item={ingredient}
              className="group flex flex-row items-center gap-x-2"
            >
              <AutogrowTextarea defaultValue={`${ingredient} with peanuts`} />
              <div data-swapy-handle>
                <GripVerticalIcon className="h-4 w-4 cursor-grab opacity-0 transition-opacity active:cursor-grabbing group-hover:opacity-100" />
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
