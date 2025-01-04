"use client"

import React, { Dispatch, SetStateAction } from "react"
import { Reorder, useDragControls } from "framer-motion"
import { GripVerticalIcon } from "lucide-react"

import { AutosizeTextarea } from "@/components/autosize-textarea"

// NOTE! the orderNumber here is being used as an id
// when the form is submitted - it is correctly numbered based on the array order
type Direction = {
  orderNumber: number
  description: string
}

interface EditDirectionsProps {
  directions: Direction[]
  setDirections: Dispatch<SetStateAction<Direction[]>>
}

export function EditDirections(props: EditDirectionsProps) {
  const { directions, setDirections } = props

  function onEditDirectionInputBlur(
    event: React.FocusEvent<HTMLTextAreaElement, Element>,
    orderNumber: number
  ) {
    const value = event.target.value
    let newDirectionsList
    if (!value) {
      // field is empty -> remove from directions list
      newDirectionsList = directions.filter(
        (direction) => direction.orderNumber !== orderNumber
      )
    } else {
      // update directions list with new value
      newDirectionsList = [...directions]
      const updatedDirection = newDirectionsList.find(
        (direction) => direction.orderNumber === orderNumber
      ) as Direction
      updatedDirection.description = value
    }
    setDirections(newDirectionsList)
  }

  function getNextOrderNumber() {
    let maxNumber = -Infinity
    let nextAvailable = null
    for (const direction of directions) {
      if (direction.orderNumber > maxNumber) {
        maxNumber = direction.orderNumber
        nextAvailable = direction.orderNumber
      }
    }
    nextAvailable ??= 0

    return nextAvailable + 1
  }

  function onAddDirectionInputBlur(
    event: React.FocusEvent<HTMLTextAreaElement, Element>
  ) {
    const value = event.target.value
    if (!!value) {
      setDirections([
        ...directions,
        { description: value, orderNumber: getNextOrderNumber() },
      ])
      event.target.value = ""
    }
  }

  return (
    <Reorder.Group axis="y" values={directions} onReorder={setDirections}>
      {directions.map((direction, index) => (
        <DirectionItem
          key={`edit-direction-${direction.orderNumber}`}
          direction={direction}
          orderNumber={index + 1}
          onBlur={onEditDirectionInputBlur}
        />
      ))}
      <div className="my-2 flex flex-row items-center gap-x-2">
        <p className="w-[30px] text-xl font-bold text-red-500">
          {getNextOrderNumber()}
        </p>
        <AutosizeTextarea
          placeholder="Enter an direction"
          onBlur={onAddDirectionInputBlur}
        />
        <GripVerticalIcon className="h-6 w-6 opacity-0" />
      </div>
    </Reorder.Group>
  )
}

interface DirectionItemProps {
  direction: Direction
  orderNumber: number
  onBlur: (
    event: React.FocusEvent<HTMLTextAreaElement, Element>,
    orderNumber: number
  ) => void
}

function DirectionItem(props: DirectionItemProps) {
  const { direction, orderNumber, onBlur } = props
  const dragControls = useDragControls()

  return (
    <Reorder.Item
      value={direction}
      id={direction}
      dragListener={false}
      dragControls={dragControls}
    >
      <div className="group my-2 flex flex-row items-center gap-x-2">
        <p className="w-[30px] text-xl font-bold text-red-500">{orderNumber}</p>
        <AutosizeTextarea
          defaultValue={direction.description}
          onBlur={(e) => onBlur(e, direction.orderNumber)}
        />
        <GripVerticalIcon
          onPointerDown={(event) => dragControls.start(event)}
          className="h-6 w-6 cursor-pointer opacity-0 transition-opacity group-hover:opacity-100"
        />
      </div>
    </Reorder.Item>
  )
}
