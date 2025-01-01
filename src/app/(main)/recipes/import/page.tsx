import { importRecipe } from "@/lib/import-recipe"
import { getCurrentUser } from "@/lib/session"
import {
  addRecipeUseCase,
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
    const importRecipeData = await importRecipe(url)

    if (!importRecipeData) {
      throw new Error("Recipe not found")
    }

    recipeDetails = await addRecipeUseCase(importRecipeData)
  }

  const user = await getCurrentUser()

  return (
    <div className="py-4 md:py-8">
      <RecipeContainer user={user} recipe={recipeDetails} />
    </div>
  )
}
