"use client"

import { useState } from "react"
import { InfoIcon, Loader2Icon } from "lucide-react"
import { useServerAction } from "zsa-react"

import { Recipe } from "@/db/schemas"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useDebounce } from "@/hooks/use-debounce"
import { useToast } from "@/hooks/use-toast"

import { featuredRecipeSearchAction } from "../actions"
import { FeaturedRecipeOption } from "./featured-recipe-option"
import { SelectedFeaturedRecipe } from "./selected-featured-recipe"

interface FeaturedRecipeSearchProps {
  currentFeaturedRecipe?: Recipe
  initialFeaturedRecipesOptions: Recipe[]
  onFeaturedRecipeChange: (recipeId: number) => void
}

export function FeaturedRecipeSearch(props: FeaturedRecipeSearchProps) {
  const {
    currentFeaturedRecipe,
    initialFeaturedRecipesOptions,
    onFeaturedRecipeChange,
  } = props
  const { toast } = useToast()

  const [selectedFeaturecRecipe, setSelectedFeaturedRecipe] = useState<
    Recipe | undefined
  >(currentFeaturedRecipe)
  const [featuredRecipeResults, setFeaturedRecipeResults] = useState<Recipe[]>(
    initialFeaturedRecipesOptions
  )

  const { execute, isPending } = useServerAction(featuredRecipeSearchAction, {
    onError({ err }) {
      toast({
        title: "Something went wrong",
        description: err.message,
        variant: "destructive",
      })
    },
    onSuccess({ data }) {
      setFeaturedRecipeResults(
        data.recipes.filter(
          (recipe) => recipe.id !== selectedFeaturecRecipe?.id
        )
      )
    },
  })

  const debouncedSearch = useDebounce(
    (search) =>
      execute({
        search,
      }),
    500
  )

  function onSearchChange(value: string) {
    debouncedSearch(value)
  }

  function onFeaturedRecipeOptionClicked(recipe: Recipe) {
    execute({
      search: "",
    })
    setSelectedFeaturedRecipe(recipe)
    onFeaturedRecipeChange(recipe.id)
  }

  return (
    <div className="justify-items-center space-y-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger
            type="button"
            className="flex items-center gap-x-1 text-lg"
          >
            Featured Recipe
            <InfoIcon
              className={cn(
                "inline-block h-4 w-4 text-sky-800 dark:text-sky-300",
                isPending ? "hidden" : ""
              )}
            />
            <Loader2Icon
              className={cn(
                "inline-block h-4 w-4 animate-spin text-sky-800 dark:text-sky-300",
                isPending ? "" : "hidden"
              )}
            />
          </TooltipTrigger>
          <TooltipContent>
            You can only feature public recipes that you have saved to your
            cookbook.
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Input
        className="w-3/4"
        placeholder="Search recipes..."
        onChange={(e) => onSearchChange(e.target.value)}
      />

      {selectedFeaturecRecipe && (
        <SelectedFeaturedRecipe
          title={selectedFeaturecRecipe.title}
          description={selectedFeaturecRecipe.description}
          photo={selectedFeaturecRecipe.photo}
        />
      )}

      {featuredRecipeResults.length > 0 && (
        <ul className="w-3/4 space-y-4 border-t border-black py-4 dark:border-white">
          {featuredRecipeResults.map((recipe) => (
            <li
              key={recipe.id}
              onClick={() => onFeaturedRecipeOptionClicked(recipe)}
              className="cursor-pointer"
            >
              <FeaturedRecipeOption
                title={recipe.title}
                description={recipe.description}
                photo={recipe.photo}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
