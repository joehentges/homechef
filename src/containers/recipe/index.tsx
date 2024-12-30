"use client"

import { useState } from "react"
import Link from "next/link"
import {
  BookIcon,
  EllipsisVerticalIcon,
  PrinterIcon,
  Share2Icon,
} from "lucide-react"

import { RecipeCookTime } from "./cook-time"
import { RecipeDetails, RecipeDetailsPhoto } from "./recipe.types"
import { RecipeTags } from "./tags"

interface RecipeProps {
  recipe: RecipeDetails
}

export function RecipeContainer(props: RecipeProps) {
  const { recipe } = props

  const [currentRecipe, setCurrentRecipe] = useState(recipe)

  function selectPrimaryPhoto(photos: RecipeDetailsPhoto[] | undefined) {
    if (!photos) {
      return
    }

    return (
      photos.find((photo) => photo.defaultPhoto) ??
      photos[Math.floor(Math.random() * photos.length)]
    )
  }

  return (
    <div className="container max-w-[850px] space-y-6 rounded-3xl bg-primary/20 p-4 md:p-8">
      <div className="flex flex-col items-center gap-x-6 gap-y-4 md:flex-row md:items-start">
        <div
          className="center h-[250px] w-[350px] max-w-full rounded-2xl bg-cover bg-center bg-no-repeat md:h-[125px] md:w-[175px] md:rounded-l-3xl"
          style={{
            backgroundImage: `url('${selectPrimaryPhoto(currentRecipe.photos)?.photoUrl}')`,
          }}
        />

        <div className="flex w-full flex-col justify-between space-y-2 md:space-y-4">
          <div className="flex flex-col-reverse items-center justify-between gap-y-4 md:flex-row md:items-start">
            <div className="flex flex-col items-center gap-y-2 md:w-[75%] md:items-start">
              <p className="text-center text-3xl font-bold md:text-start md:text-4xl">
                {currentRecipe.title}
              </p>
              <Link
                href={currentRecipe.author.url}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <p>From: {currentRecipe.author.name}</p>
              </Link>
            </div>
            <div className="flex flex-row gap-x-4 pt-2">
              <BookIcon />
              <PrinterIcon />
              <Share2Icon />
              <EllipsisVerticalIcon />
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
      <div className="flex flex-col gap-16 md:flex-row md:items-start">
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
              {currentRecipe.directions.map(
                (direction: string, index: number) => {
                  return (
                    <li key={direction} className="flex flex-row gap-x-2">
                      <p className="text-xl font-bold text-red-500">
                        {index + 1}
                      </p>
                      <p className="text-lg">{direction}</p>
                    </li>
                  )
                }
              )}
            </ul>
          </ul>
        </div>
      </div>
    </div>
  )
}
