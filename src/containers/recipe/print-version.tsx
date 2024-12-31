"use client"

import { RecipeCookTime } from "./cook-time"
import { RecipeDetails } from "./recipe.types"

interface RecipePrintVersionProps {
  ref: React.Ref<HTMLDivElement>
  recipe: RecipeDetails
}

export function RecipePrintVersion(props: RecipePrintVersionProps) {
  const { ref, recipe } = props

  return (
    <div ref={ref} className="container space-y-6 p-8">
      <div className="flex flex-row items-start gap-x-6 gap-y-4">
        <div className="flex w-full flex-col justify-between space-y-4">
          <div className="flex flex-col items-start gap-y-2">
            <p className="text-center text-3xl font-bold md:text-start md:text-4xl">
              {recipe.title}
            </p>
            <p className="text-muted-foreground">From: {recipe.author.name}</p>
          </div>

          <div className="flex flex-row items-center gap-x-6">
            <p className="py-1 md:py-2 md:pr-4">{recipe.servings}</p>
            <RecipeCookTime
              prepTime={recipe.prepTime}
              cookTime={recipe.cookTime}
            />
          </div>
        </div>
      </div>

      {recipe.description && <p className="pb-2">{recipe.description}</p>}
      <div className="flex flex-row gap-x-6">
        <div className="w-1/2">
          <p className="text-2xl font-bold">Ingredients</p>
          <ul className="space-y-2 pt-4">
            {recipe.ingredients?.map((ingredient: string, index: number) => {
              return (
                <li key={ingredient}>
                  <p>{ingredient}</p>
                  {index < recipe.ingredients.length - 1 && (
                    <div className="my-3 border-t border-t-muted-foreground" />
                  )}
                </li>
              )
            })}
          </ul>
        </div>

        <div className="w-full">
          <p className="text-2xl font-bold">Directions</p>
          <ul>
            <ul className="space-y-4 pt-4">
              {recipe.directions.map((direction: string, index: number) => {
                return (
                  <li key={direction} className="flex flex-row gap-x-2">
                    <p className="text-lg font-bold text-muted-foreground">
                      {index + 1}
                    </p>
                    <p>{direction}</p>
                  </li>
                )
              })}
            </ul>
          </ul>
        </div>
      </div>
    </div>
  )
}
