import { formatRecipe } from "@/lib/format-recipe"
import { getCurrentUser } from "@/lib/session"
import {
  getAvailableRecipeTagsUseCase,
  getRecipeByIdUseCase,
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
    throw new Error("Recioe not found")
  }

  const user = await getCurrentUser()

  const recipeDetails = await getRecipeByIdUseCase(recipeIdNum)

  const availableTags = await getAvailableRecipeTagsUseCase()

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
