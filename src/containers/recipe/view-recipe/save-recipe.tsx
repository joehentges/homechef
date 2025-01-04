"use client"

import Link from "next/link"
import { BookmarkCheckIcon, BookmarkIcon } from "lucide-react"
import { useServerAction } from "zsa-react"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useFromPath } from "@/hooks/use-from-path"
import { useToast } from "@/hooks/use-toast"

import { saveRecipeAction, unsaveRecipeAction } from "../actions"

interface SaveRecipeProps {
  recipeId: number
  isAuthenticated: boolean
  isSaved: boolean
}

export function SaveRecipe(props: SaveRecipeProps) {
  const { recipeId, isAuthenticated, isSaved } = props

  const { toast } = useToast()
  const fromPath = useFromPath()

  const { execute } = useServerAction(
    isSaved ? unsaveRecipeAction : saveRecipeAction,
    {
      onError({ err }) {
        toast({
          title: "Something went wrong",
          description: err.message,
          variant: "destructive",
        })
      },
      onSuccess() {
        // note - this executes after the action - so the saved and unsaved ternary is backwards
        toast({
          title: `You have ${isSaved ? "saved" : "unsaved"} the recipe`,
          description: `You will ${isSaved ? "find" : "no longer find"} the recipe in your cookbook.`,
        })
      },
    }
  )

  if (isAuthenticated) {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger
            className="transition-colors hover:text-foreground"
            onClick={() => execute({ recipeId })}
          >
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
