"use client"

import { useRef } from "react"
import Link from "next/link"
import { PrinterIcon, Share2Icon } from "lucide-react"
import { useReactToPrint } from "react-to-print"

import { FormattedRecipeDetails } from "@/types/Recipe"
import { User } from "@/db/schemas"

import { RecipeCookTime } from "./cook-time"
import { DeleteRecipe } from "./delete-recipe"
import { RecipeDifficulty } from "./difficulty"
import { ViewRecipeDirections } from "./directions"
import { DisplayStatus } from "./display-status"
import { EnableEditView } from "./enable-edit-view"
import { RecipeImage } from "./image"
import { ImportDetails } from "./import-details"
import { ViewRecipeIngredients } from "./ingredients"
import { RecipePrintVersion } from "./print-version"
import { SaveRecipe } from "./save-recipe"
import { RecipeTags } from "./tags"

interface ViewRecipeProps {
  isRecipeOwner: boolean
  recipeIsSaved: boolean
  user?: User
  recipe: FormattedRecipeDetails
  onEditRecipeClicked: () => void
}

export function ViewRecipe(props: ViewRecipeProps) {
  const {
    isRecipeOwner,
    recipeIsSaved,
    user,
    recipe: recipeDetails,
    onEditRecipeClicked,
  } = props
  const { author, importDetails, recipe, ingredients, directions, tags } =
    recipeDetails
  const isAuthenticated = !!user

  const recipePrintVersionRef = useRef(null)
  const reactToPrintFn = useReactToPrint({
    contentRef: recipePrintVersionRef,
    pageStyle: `
    @page {
      size: A4;
    }
    `,
  })

  return (
    <>
      <div className="hidden">
        <RecipePrintVersion
          recipe={recipeDetails}
          ref={recipePrintVersionRef}
        />
      </div>
      <div className="container max-w-[1000px] space-y-6 rounded-3xl bg-primary/20 p-4 md:p-8">
        <div className="flex flex-col items-center gap-x-6 gap-y-4 md:flex-row md:items-start">
          <RecipeImage photo={recipe.photo} />

          <div className="flex w-full flex-col justify-between space-y-2 md:space-y-4">
            <div className="flex flex-col-reverse items-center justify-between gap-y-4 md:flex-row md:items-start">
              <div className="flex flex-col items-center gap-y-2 md:w-[75%] md:items-start">
                <p className="text-center text-3xl font-bold md:text-start md:text-4xl">
                  {recipe.title}
                </p>
                {author && (
                  <Link
                    href={`/profile/${author.id}`}
                    target="_blank"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <p>From: {author.displayName}</p>
                  </Link>
                )}
                {!author && importDetails && (
                  <ImportDetails
                    importedBy={importDetails.importedBy}
                    url={importDetails.url}
                  />
                )}
              </div>
              <div className="flex flex-row gap-x-4 pt-2 text-muted-foreground">
                {author && user && user.id === author.id && (
                  <DisplayStatus isPrivate={recipe.private} />
                )}
                {isRecipeOwner && recipe.id && (
                  <DeleteRecipe recipeId={recipe.id} title={recipe.title} />
                )}
                {!isRecipeOwner && recipe.id && (
                  <SaveRecipe
                    recipeId={recipe.id}
                    isAuthenticated={isAuthenticated}
                    isSaved={recipeIsSaved}
                  />
                )}
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
                <EnableEditView
                  isAuthenticated={isAuthenticated}
                  enableEditView={onEditRecipeClicked}
                />
              </div>
            </div>

            <div className="flex flex-col items-center gap-x-2 gap-y-2 md:flex-row">
              <p className="py-1 md:py-2 md:pr-4">{recipe.servings}</p>
              <RecipeCookTime
                prepTime={recipe.prepTime}
                cookTime={recipe.cookTime}
              />
              <RecipeTags tags={tags} />
              <RecipeDifficulty difficulty={recipe.difficulty} />
            </div>
          </div>
        </div>

        {recipe.description && <p className="pb-2">{recipe.description}</p>}

        <div className="flex flex-col gap-x-16 gap-y-12 md:flex-row md:items-start">
          <div className="md:w-1/2">
            <p className="text-2xl font-bold">Ingredients</p>
            <ViewRecipeIngredients ingredients={ingredients} />
          </div>

          <div className="w-full">
            <p className="text-2xl font-bold">Directions</p>
            <ViewRecipeDirections directions={directions} />
          </div>
        </div>
      </div>
    </>
  )
}
