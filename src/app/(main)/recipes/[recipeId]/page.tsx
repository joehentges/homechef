import { getCurrentUser } from "@/lib/session"
import {
  getAvailableRecipeTagsUseCase,
  getRecipeDetailsUseCase,
  isRecipeSavedUseCase,
} from "@/use-cases/recipes"
import { RecipeContainer } from "@/containers/recipe"

interface RecipePageProps {
  params: Promise<{
    recipeId: number
  }>
}

export default async function RecipePage(props: RecipePageProps) {
  const { params } = props
  const { recipeId } = await params

  const user = await getCurrentUser()

  const recipeDetails = await getRecipeDetailsUseCase(recipeId)

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
        recipe={recipeDetails}
        availableTags={availableTags}
        recipeIsSaved={recipeIsSaved}
      />
    </div>
  )
}
