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
    <div>
      <UserRecipeSearch
        recipes={recipesList.recipes}
        recipesPerPageLimit={12}
        recipesCount={recipesList.count}
        availableTags={availableTags}
      />
    </div>
  )
}
