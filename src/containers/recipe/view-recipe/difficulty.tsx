"use client"

import { TrophyIcon } from "lucide-react"

import { Recipe } from "@/db/schemas"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface RecipeDifficultyProps {
  difficulty: Recipe["difficulty"]
}

export function RecipeDifficulty(props: RecipeDifficultyProps) {
  const { difficulty } = props

  if (!difficulty) {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <div className="flex flex-row items-center gap-x-2 px-2 py-1 md:hidden">
            <TrophyIcon className="h-4 w-4" />
            <p>None</p>
          </div>
          <TooltipTrigger className="hidden flex-row items-center gap-x-2 rounded-3xl px-4 py-2 transition-colors hover:bg-primary/20 md:flex">
            <TrophyIcon className="h-4 w-4" />
            <p>None</p>
          </TooltipTrigger>
          <TooltipContent className="flex flex-row gap-x-2">
            No difficulty has been selected
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <div className="flex flex-row items-center gap-x-2 px-2 py-1 capitalize md:px-4 md:py-2">
      <TrophyIcon className="h-4 w-4" />
      <p>{difficulty}</p>
    </div>
  )
}
