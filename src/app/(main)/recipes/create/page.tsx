import { assertAuthenticated } from "@/lib/session"
import { getAvailableRecipeTagsUseCase } from "@/use-cases/recipes"
import { RecipeContainer } from "@/containers/recipe"

export default async function ImportRecipePage() {
  const user = await assertAuthenticated()

  const availableTags = await getAvailableRecipeTagsUseCase()

  return (
    <div className="py-4 md:py-8">
      <RecipeContainer user={user} availableTags={availableTags} />
    </div>
  )
}
