import { formatRecipe } from "@/lib/format-recipe"
import { getCurrentUser } from "@/lib/session"
import {
  getAvailableRecipeTagsUseCase,
  getRecipeByIdUseCase,
  isRecipeSavedUseCase,
} from "@/use-cases/recipes"
import { RecipeContainer } from "@/containers/recipe"

interface ImportRecipePageProps {
  params: Promise<{
    recipeId: string
  }>
}

export default async function ImportRecipePage(props: ImportRecipePageProps) {
  const { params } = props
  const { recipeId } = await params

  const recipeIdNum = parseInt(recipeId)

  if (!recipeIdNum) {
    throw new Error("Recipe not found")
  }

  const user = await getCurrentUser()

  const recipeDetails = await getRecipeByIdUseCase(recipeIdNum)

  if (recipeDetails.recipe.private && !user) {
    throw new Error("Recipe not found")
  }
  if (
    recipeDetails.recipe.private &&
    user &&
    recipeDetails.recipe.userId !== user.id
  ) {
    throw new Error("Recipe not found")
  }

  const availableTags = await getAvailableRecipeTagsUseCase()

  const recipeIsSaved = user
    ? await isRecipeSavedUseCase(recipeDetails.recipe.id, user.id)
    : false

  return (
    <div className="py-4 md:py-8">
      <RecipeContainer
        user={user}
        recipe={formatRecipe(recipeDetails)}
        availableTags={availableTags}
        recipeIsSaved={recipeIsSaved}
      />
    </div>
  )
}
