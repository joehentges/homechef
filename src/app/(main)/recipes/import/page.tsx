import { formatRecipe } from "@/lib/format-recipe"
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

  const user = await getCurrentUser()

  // check Database to see if recipe has already been imported
  // skip next part if it has
  let recipeImportDetails = await getRecipeImportDetailsByUrlUseCase(url)
  let recipeDetails
  if (recipeImportDetails) {
    recipeDetails = await getRecipeByIdUseCase(recipeImportDetails.recipeId)
  } else {
    recipeDetails = await importRecipeUseCase(url, user?.id)
  }

  const availableTags = await getAvailableRecipeTagsUseCase()

  console.log(recipeDetails)

  return (
    <div className="py-4 md:py-8">
      <RecipeContainer
        user={user}
        recipe={formatRecipe(recipeDetails)}
        availableTags={availableTags}
      />
    </div>
  )
}
