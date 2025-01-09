import { assertAuthenticated } from "@/lib/session"
import {
  getAvailableRecipeTagsUseCase,
  getUserRecipesUseCase,
} from "@/use-cases/recipes"
import { UserRecipeSearch } from "@/containers/coobook-search"

export default async function CookbookPage() {
  const user = await assertAuthenticated()

  const availableTags = await getAvailableRecipeTagsUseCase()
  const recipesList = await getUserRecipesUseCase(user.id)

  return (
    <UserRecipeSearch
      recipes={recipesList}
      recipesPerPageLimit={12}
      availableTags={availableTags}
    />
  )
}
