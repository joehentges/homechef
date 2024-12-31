"use client"

import { useMemo, useRef, useState } from "react"
import Link from "next/link"
import {
  CookingPotIcon,
  PencilIcon,
  PrinterIcon,
  Share2Icon,
} from "lucide-react"
import { useReactToPrint } from "react-to-print"

import { RecipeDetails, RecipeDetailsPhoto } from "@/types/Recipe"

import { RecipeCookTime } from "./cook-time"
import { RecipeImage } from "./image"
import { RecipePrintVersion } from "./print-version"
import { SaveRecipe } from "./save-recipe"
import { RecipeTags } from "./tags"

interface RecipeProps {
  isAuthenticated?: boolean
  recipe: RecipeDetails
}

export function RecipeContainer(props: RecipeProps) {
  const { isAuthenticated, recipe } = props

  const recipePrintVersionRef = useRef(null)
  const reactToPrintFn = useReactToPrint({
    contentRef: recipePrintVersionRef,
    pageStyle: `
    @page {
      size: A4;
    }
    `,
  })
  const [currentRecipe, setCurrentRecipe] = useState(recipe)

  return (
    <>
      <div className="hidden">
        <RecipePrintVersion
          recipe={currentRecipe}
          ref={recipePrintVersionRef}
        />
      </div>
      <div className="container max-w-[850px] space-y-6 rounded-3xl bg-primary/20 p-4 md:p-8">
        <div className="flex flex-col items-center gap-x-6 gap-y-4 md:flex-row md:items-start">
          <RecipeImage photos={currentRecipe.photos} />

          <div className="flex w-full flex-col justify-between space-y-2 md:space-y-4">
            <div className="flex flex-col-reverse items-center justify-between gap-y-4 md:flex-row md:items-start">
              <div className="flex flex-col items-center gap-y-2 md:w-[75%] md:items-start">
                <p className="text-center text-3xl font-bold md:text-start md:text-4xl">
                  {currentRecipe.title}
                </p>
                {currentRecipe.importDetails && (
                  <Link
                    href={currentRecipe.importDetails.url}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <p>From: {currentRecipe.importDetails.name}</p>
                  </Link>
                )}
              </div>
              <div className="flex flex-row gap-x-4 pt-2 text-muted-foreground">
                <SaveRecipe isAuthenticated={isAuthenticated} />
                <button
                  onClick={() => reactToPrintFn()}
                  className="transition-colors hover:text-foreground"
                >
                  <PrinterIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() =>
                    navigator.share({
                      title: recipe.title,
                      url: window.location.href,
                    })
                  }
                  className="transition-colors hover:text-foreground"
                >
                  <Share2Icon className="h-5 w-5" />
                </button>
                <PencilIcon className="h-5 w-5" />
              </div>
            </div>

            <div className="flex flex-col items-center gap-x-6 gap-y-2 md:flex-row">
              <p className="py-1 md:py-2 md:pr-4">{currentRecipe.servings}</p>
              <RecipeCookTime
                prepTime={currentRecipe.prepTime}
                cookTime={currentRecipe.cookTime}
              />
              <RecipeTags tags={currentRecipe.tags} />
            </div>
          </div>
        </div>

        {currentRecipe.description && (
          <p className="pb-2">{currentRecipe.description}</p>
        )}
        <div className="flex flex-col gap-x-16 gap-y-12 md:flex-row md:items-start">
          <div className="md:w-1/2">
            <p className="text-2xl font-bold">Ingredients</p>
            <ul className="space-y-2 pt-4">
              {currentRecipe.ingredients?.map(
                (ingredient: string, index: number) => {
                  return (
                    <li key={ingredient}>
                      <p>{ingredient}</p>
                      {index < currentRecipe.ingredients.length - 1 && (
                        <div className="my-3 border-t border-t-muted-foreground" />
                      )}
                    </li>
                  )
                }
              )}
            </ul>
          </div>

          <div className="w-full">
            <p className="text-2xl font-bold">Directions</p>
            <ul>
              <ul className="space-y-4 pt-4">
                {currentRecipe.directions.map((direction) => {
                  return (
                    <li
                      key={`${direction.stepNumber}-direction`}
                      className="flex flex-row gap-x-2"
                    >
                      <p className="text-xl font-bold text-red-500">
                        {direction.stepNumber}
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
    </>
  )
}
