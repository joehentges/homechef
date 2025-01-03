import { getCurrentUser } from "@/lib/session"
import { importRecipeUseCase } from "@/use-cases/import-recipe"
import {
  getAvailableRecipeTagsUseCase,
  getRecipeByIdUseCase,
  getRecipeImportDetailsByUrlUseCase,
} from "@/use-cases/recipes"
import { RecipeContainer } from "@/containers/recipe"

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

  // check Database to see if recipe has already been imported
  // skip next part if it has
  let recipeImportDetails = await getRecipeImportDetailsByUrlUseCase(url)
  let recipeDetails
  if (recipeImportDetails) {
    recipeDetails = await getRecipeByIdUseCase(recipeImportDetails.recipeId)
  } else {
    recipeDetails = await importRecipeUseCase(url)
  }

  const user = await getCurrentUser()

  const availableTags = await getAvailableRecipeTagsUseCase()

  return (
    <div className="py-4 md:py-8">
      <RecipeContainer
        user={user}
        recipe={recipeDetails}
        availableTags={availableTags}
      />
    </div>
  )
}
