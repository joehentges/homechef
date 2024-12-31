"use client"

import { ClockIcon } from "lucide-react"

import { formatTime } from "@/lib/format-time"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface RecipeCookTimeProps {
  prepTime?: number | null
  cookTime: number
}

export function RecipeCookTime(props: RecipeCookTimeProps) {
  const { prepTime, cookTime } = props

  return (
    <>
      <TooltipProvider>
        <Tooltip delayDuration={250}>
          <div className="flex flex-row items-center gap-x-2 px-2 py-1 md:hidden">
            <ClockIcon className="h-4 w-4" />
            <p>Prep: {formatTime(prepTime ?? 0)}</p>
            <div className="h-[1.5em] border-l border-l-muted-foreground" />
            <p>Cook: {formatTime(cookTime)}</p>
          </div>
          <TooltipTrigger className="hidden flex-row items-center gap-x-1 rounded-3xl px-4 py-2 transition-colors hover:bg-primary/20 md:flex">
            <ClockIcon className="h-4 w-4" />
            <p>{formatTime((prepTime ?? 0) + cookTime)}</p>
          </TooltipTrigger>
          <TooltipContent className="flex flex-row gap-x-2">
            <p>Prep: {formatTime(prepTime ?? 0)}</p>
            <div className="border-l" />
            <p>Cook: {formatTime(cookTime)}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  )
}
