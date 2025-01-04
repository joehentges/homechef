import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { LoaderButton } from "@/components/loader-button"

interface SaveRecipeProps {
  isPending: boolean
  isDirty: boolean
  label: string
  isRecipeOwner: boolean
}

export function SaveRecipe(props: SaveRecipeProps) {
  const { isPending, isDirty, label, isRecipeOwner } = props

  if (isRecipeOwner) {
    return (
      <LoaderButton isLoading={isPending} disabled={!isDirty} type="submit">
        {label}
      </LoaderButton>
    )
  }

  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <span>
            <LoaderButton
              isLoading={isPending}
              disabled={!isDirty}
              type="submit"
            >
              {label}
            </LoaderButton>
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p>Updating this recipe will create a new recipe</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
