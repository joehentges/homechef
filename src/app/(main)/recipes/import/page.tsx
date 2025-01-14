import { getCurrentUser } from "@/lib/session"
import {
  addUserRecipeImportUseCase,
  importRecipeUseCase,
} from "@/use-cases/import-recipe"
import {
  getAvailableRecipeTagsUseCase,
  getRecipeByIdUseCase,
  getRecipeImportDetailsByUrlUseCase,
  isRecipeSavedUseCase,
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

  const user = await getCurrentUser()

  // check Database to see if recipe has already been imported
  // skip next part if it has
  const { recipeImportDetails, userRecipeImport } =
    await getRecipeImportDetailsByUrlUseCase(url, user?.id)
  let recipeDetails
  if (recipeImportDetails) {
    recipeDetails = await getRecipeByIdUseCase(recipeImportDetails.recipeId)
    if (user && !userRecipeImport) {
      await addUserRecipeImportUseCase(recipeImportDetails.id, user.id)
    }
  } else {
    recipeDetails = await importRecipeUseCase(url, user?.id)
  }

  const availableTags = await getAvailableRecipeTagsUseCase()

  const recipeIsSaved = user
    ? await isRecipeSavedUseCase(recipeDetails.recipe.id, user.id)
    : false

  return (
    <div className="py-4 md:py-8">
      <RecipeContainer
        importedRecipe
        user={user}
        recipe={recipeDetails}
        availableTags={availableTags}
        recipeIsSaved={recipeIsSaved}
      />
    </div>
  )
}
