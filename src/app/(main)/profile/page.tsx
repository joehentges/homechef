import { assertAuthenticated } from "@/lib/session"
import { getRecipeUseCase, searchRecipesUseCase } from "@/use-cases/recipes"
import { Profile } from "@/containers/profile"

export default async function ProfilePage() {
  const user = await assertAuthenticated()

  let featuredRecipe
  if (user.featuredRecipeId) {
    featuredRecipe = await getRecipeUseCase(user.featuredRecipeId)
  }
  const latestRecipes = await searchRecipesUseCase(
    {
      limit: 4,
      orderBy: "newest",
    },
    {
      userId: user.id,
      includeUserRecipes: true,
      userRecipesOnly: true,
      includePrivateRecipes: true,
    }
  )

  return (
    <div className="md:py-8">
      <Profile
        user={user}
        canEdit={true}
        featuredRecipe={featuredRecipe}
        latestRecipes={latestRecipes.recipes}
      />
    </div>
  )
}
