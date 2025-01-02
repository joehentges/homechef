"use client"

import { RecipeDetails } from "@/types/Recipe"
import { getDomain } from "@/lib/get-domain"

import { RecipeCookTime } from "./cook-time"

interface RecipePrintVersionProps {
  ref: React.Ref<HTMLDivElement>
  recipe: RecipeDetails
}

export function RecipePrintVersion(props: RecipePrintVersionProps) {
  const { ref, recipe: recipeDetails } = props
  const { author, importDetails, recipe, ingredients, directions } =
    recipeDetails

  return (
    <div ref={ref} className="container space-y-6 p-8">
      <div className="flex flex-row items-start gap-x-6 gap-y-4">
        <div className="flex w-full flex-col justify-between space-y-4">
          <div className="flex flex-col items-start gap-y-2">
            <p className="text-center text-3xl font-bold md:text-start md:text-4xl">
              {recipe.title}
            </p>
            {importDetails && (
              <p className="text-muted-foreground">
                From: {getDomain(importDetails.url)}
              </p>
            )}
          </div>

          <div className="flex flex-row items-center gap-x-2">
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
            {ingredients
              .sort((a, b) => a.orderNumber - b.orderNumber)
              .map((ingredient, index) => {
                return (
                  <li key={ingredient.orderNumber}>
                    <p>{ingredient.description}</p>
                    {index < ingredients.length - 1 && (
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
              {directions
                .sort((a, b) => a.orderNumber - b.orderNumber)
                .map((direction) => {
                  return (
                    <li
                      key={`${direction.orderNumber}-direction`}
                      className="flex flex-row gap-x-2"
                    >
                      <p className="text-xl font-bold text-muted-foreground">
                        {direction.orderNumber}
                      </p>
                      <p className="text-lg">{direction.description}</p>
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
