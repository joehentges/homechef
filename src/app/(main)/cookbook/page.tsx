import { assertAuthenticated } from "@/lib/session"
import {
  getAvailableRecipeTagsUseCase,
  searchRecipesUseCase,
} from "@/use-cases/recipes"
import { UserRecipeSearch } from "@/containers/coobook-search"

export default async function CookbookPage() {
  const user = await assertAuthenticated()

  const availableTags = await getAvailableRecipeTagsUseCase()
  const recipesList = await searchRecipesUseCase(
    {},
    {
      userId: user.id,
      userRecipesOnly: true,
      includeUserRecipes: true,
      includePrivateRecipes: true,
    }
  )
  const randomRecipe =
    recipesList.recipes[Math.floor(Math.random() * recipesList.recipes.length)]

  return (
    <div className="md:py-10">
      <UserRecipeSearch
        randomRecipe={randomRecipe}
        recipes={recipesList.recipes}
        recipesPerPageLimit={12}
        availableTags={availableTags}
      />
    </div>
  )
}
