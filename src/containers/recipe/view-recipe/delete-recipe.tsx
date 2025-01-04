import { BookmarkCheckIcon, BookmarkIcon, TrashIcon } from "lucide-react"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface DeleteRecipeProps {
  //
}

export function DeleteRecipe(props: DeleteRecipeProps) {
  const {} = props

  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger className="transition-colors hover:text-foreground">
          <TrashIcon className="h-5 w-5" />
        </TooltipTrigger>
        <TooltipContent>
          <p>Delete the recipe</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
