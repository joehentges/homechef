import Link from "next/link"
import {
  BookIcon,
  ClockIcon,
  EllipsisVerticalIcon,
  PrinterIcon,
  Share2Icon,
} from "lucide-react"

import { formatTime } from "@/lib/format-time"
import { importRecipe } from "@/lib/import-recipe"

interface ImportRecipePageProps {
  searchParams: Promise<{
    url: string
  }>
}

export default async function ImportRecipePage(props: ImportRecipePageProps) {
  const { searchParams } = props
  const { url } = await searchParams

  if (!url) {
    throw new Error("Url not found")
  }

  const recipeData = await importRecipe(url)

  if (!recipeData) {
    throw new Error("Recipe not found")
  }

  function selectPrimaryPhoto(photos: { defaultPhoto: boolean }[] | string[]) {
    return (
      photos.find((photo) =>
        typeof photo === "object" ? photo.defaultPhoto : false
      ) ?? photos[Math.floor(Math.random() * photos.length)]
    )
  }

  return (
    <div className="container my-8 max-w-[1000px] space-y-8 rounded-3xl bg-primary/20 p-8">
      <div className="flex flex-row gap-x-6">
        <div
          className="h-[150px] w-[175px] rounded-2xl bg-cover bg-center bg-no-repeat md:rounded-l-3xl"
          style={{
            backgroundImage: `url('${selectPrimaryPhoto(recipeData.photos as string[])}')`,
          }}
        />

        <div className="flex w-full flex-col justify-between space-y-3">
          <div className="flex flex-row justify-between">
            <div className="flex w-[75%] flex-col gap-y-2">
              <p className="text-4xl font-bold">{recipeData.title}</p>
              <Link href={recipeData.author.url}>
                <p>From: {recipeData.author.name}</p>
              </Link>
            </div>
            <div className="flex flex-row gap-x-4 pt-2">
              <BookIcon />
              <PrinterIcon />
              <Share2Icon />
              <EllipsisVerticalIcon />
            </div>
          </div>

          <div className="flex flex-row gap-x-6 text-lg">
            <p>{recipeData.servings}</p>
            <div className="flex flex-row items-center gap-x-1">
              <ClockIcon className="h-5 w-5" />
              <p>
                {formatTime((recipeData.prepTime ?? 0) + recipeData.cookTime)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <p className="w-[75%] text-muted-foreground">{recipeData.description}</p>

      <div className="flex flex-row gap-x-16">
        <div className="w-1/2">
          <p className="text-3xl font-bold">Ingredients</p>
          <ul className="space-y-2 pt-4">
            {recipeData.ingredients?.map(
              (ingredient: string, index: number) => {
                return (
                  <li key={ingredient}>
                    <p>{ingredient}</p>
                    {index < recipeData.ingredients.length - 1 && (
                      <div className="my-3 border-t border-t-muted-foreground" />
                    )}
                  </li>
                )
              }
            )}
          </ul>
        </div>

        <div className="w-full">
          <p className="text-3xl font-bold">Directions</p>
          <ul>
            <ul className="space-y-4 pt-4">
              {recipeData.directions.map((direction: string, index: number) => {
                return (
                  <li key={direction} className="flex flex-row gap-x-2">
                    <p className="text-xl font-bold text-red-500">
                      {index + 1}
                    </p>
                    <p className="text-lg">{direction}</p>
                  </li>
                )
              })}
            </ul>
          </ul>
        </div>
      </div>
    </div>
  )

  return (
    <div>
      <pre>{JSON.stringify(recipeData, null, 2)}</pre>
    </div>
  )
}
