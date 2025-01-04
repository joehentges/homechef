"use client"

import Link from "next/link"
import { BookmarkCheckIcon, BookmarkIcon } from "lucide-react"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useFromPath } from "@/hooks/use-from-path"

interface SaveRecipeProps {
  isAuthenticated: boolean
  isSaved: boolean
}

export function SaveRecipe(props: SaveRecipeProps) {
  const { isAuthenticated, isSaved } = props

  const fromPath = useFromPath()

  if (isAuthenticated) {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger className="transition-colors hover:text-foreground">
            {isSaved ? (
              <BookmarkCheckIcon className="h-5 w-5" />
            ) : (
              <BookmarkIcon className="h-5 w-5" />
            )}
          </TooltipTrigger>
          <TooltipContent>
            <p>{isSaved ? "Remove from" : "Save to"} your cookbook</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger>
          <Link
            href={`/sign-in?from=${fromPath}`}
            className="transition-colors hover:text-foreground"
          >
            <BookmarkIcon className="h-5 w-5" />
          </Link>
        </TooltipTrigger>
        <TooltipContent>
          <p>Sign in to save to your cookbook</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
