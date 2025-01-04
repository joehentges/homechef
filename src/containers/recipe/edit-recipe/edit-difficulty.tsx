import { Dispatch, SetStateAction } from "react"

import { RecipeDifficulty } from "@/types/Recipe"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface EditDifficultyProps {
  difficulty?: RecipeDifficulty
  setDifficulty: Dispatch<
    SetStateAction<Omit<RecipeDifficulty, "null"> | undefined>
  >
}

export function EditDifficulty(props: EditDifficultyProps) {
  const { difficulty, setDifficulty } = props

  function onValueChange(value: string) {
    if (value === "none") {
      setDifficulty(undefined)
    } else {
      setDifficulty(value)
    }
  }

  return (
    <Select
      onValueChange={onValueChange}
      defaultValue={difficulty ?? undefined}
    >
      <SelectTrigger className="w-full md:min-w-[150px] lg:min-w-[200px]">
        <SelectValue placeholder="Difficulty" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="none">None</SelectItem>
        <SelectItem value="beginner">Beginner</SelectItem>
        <SelectItem value="intermediate">Intermediate</SelectItem>
        <SelectItem value="advanced">Advanced</SelectItem>
      </SelectContent>
    </Select>
  )
}
