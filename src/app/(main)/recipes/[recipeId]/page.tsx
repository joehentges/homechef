import {
  BookIcon,
  ClockIcon,
  EllipsisVerticalIcon,
  PrinterIcon,
  Share2Icon,
} from "lucide-react"

import { RecipePhoto } from "@/db/schemas"
import { formatTime } from "@/lib/formatTime"
import { getRecipeById } from "@/use-cases/recipes"

interface RecipePageProps {
  params: Promise<{ recipeId: string }>
}

export default async function RecipePage(props: RecipePageProps) {
  const { params } = props
  const { recipeId } = await params

  const recipeIdParsed = parseInt(recipeId)

  if (!recipeIdParsed) {
    throw new Error("Recipe not found")
  }

  const recipe = await getRecipeById(recipeIdParsed)

  function formatIngredientDescription(description?: string) {
    if (!description) {
      return ""
    }

    const ch1 = description.charAt(0)
    const ch2 = description.slice(-1)
    let trimmed = description
    if (ch1 === "(") {
      trimmed = trimmed.substring(1)
    }
    if (ch2 === ")") {
      trimmed = trimmed.slice(0, -1)
    }
    return `(${trimmed})`
  }

  function selectPrimaryPhoto(photos: RecipePhoto[]) {
    return (
      photos.find((photo) => photo.defaultPhoto) ??
      photos[Math.floor(Math.random() * photos.length)]
    )
  }

  return (
    <div className="container mt-8 max-w-[1000px] space-y-10 rounded-3xl bg-primary/20 p-12">
      <div className="flex flex-row gap-x-6">
        <div
          className="group relative h-[150px] w-[150px] cursor-pointer rounded-2xl bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('${selectPrimaryPhoto(recipe.photos || []).photoUrl}')`,
          }}
        >
          <div className="h-full w-full rounded-l-3xl bg-primary/10 opacity-0 transition-opacity group-hover:opacity-100" />
        </div>

        <div className="w-full space-y-4">
          <div className="flex flex-row justify-between">
            <p className="w-[50%] text-4xl font-bold">{recipe.title}</p>
            <div className="flex flex-row gap-x-4 pt-2">
              <BookIcon />
              <PrinterIcon />
              <Share2Icon />
              <EllipsisVerticalIcon />
            </div>
          </div>

          <div className="flex flex-row gap-x-6">
            <p>
              {recipe.servings} {recipe.servingsUnit}
            </p>
            <div className="flex flex-row items-center gap-x-1">
              <ClockIcon className="h-4 w-4" />{" "}
              <p>{formatTime((recipe.prepTime ?? 0) + recipe.cookTime)}</p>
            </div>
          </div>

          <p className="w-[75%] text-muted-foreground">{recipe.description}</p>
        </div>
      </div>

      <div className="flex flex-row gap-x-16">
        <div className="w-1/2">
          <p className="text-3xl font-bold">Ingredients</p>
          <ul className="space-y-2 pt-4">
            {recipe.ingredients?.map((ingredient, index) => {
              return (
                <li key={ingredient.id}>
                  <p>
                    {ingredient.quantity}
                    {ingredient.unit ? ` ${ingredient.unit}` : ""}{" "}
                    {ingredient.name}{" "}
                    {formatIngredientDescription(ingredient.description)}
                  </p>
                  {index < recipe.ingredients.length - 1 && (
                    <hr className="my-3 h-[1.5px] border-t-0 bg-foreground/20" />
                  )}
                </li>
              )
            })}
          </ul>
        </div>

        <div className="w-full">
          <p className="text-3xl font-bold">Steps</p>
          <ul>
            <ul className="space-y-4 pt-4">
              {recipe.steps
                ?.sort((a, b) => a.stepNumber - b.stepNumber)
                .map((step) => {
                  return (
                    <li key={step.id} className="flex flex-row gap-x-2">
                      <p className="text-xl font-bold text-red-500">
                        {step.stepNumber}
                      </p>
                      <p className="text-lg">{step.description}</p>
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
