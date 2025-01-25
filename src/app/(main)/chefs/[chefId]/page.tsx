import { getCurrentUser } from "@/lib/session"
import { getRecipeUseCase, searchRecipesUseCase } from "@/use-cases/recipes"
import { getUserUseCase } from "@/use-cases/users"
import { Profile } from "@/containers/profile"

interface ChefPageProps {
  params: Promise<{
    chefId: number
  }>
}

export default async function ChefPage(props: ChefPageProps) {
  const { params } = props
  const { chefId } = await params

  const currentUser = await getCurrentUser()
  const user = await getUserUseCase(chefId)

  if (!user) {
    throw new Error("Chef not found")
  }

  let featuredRecipe
  if (user.featuredRecipeId) {
    featuredRecipe = await getRecipeUseCase(user.featuredRecipeId)
  }

  const latestRecipes = await searchRecipesUseCase(
    {
      limit: 3,
      orderBy: "newest",
    },
    {
      userId: user.id,
      includeUserRecipes: true,
      userRecipesOnly: true,
      includePrivateRecipes: currentUser?.id === user.id,
    }
  )

  return (
    <div className="md:py-8">
      <Profile
        user={user}
        canEdit={currentUser && currentUser.id === user.id}
        featuredRecipe={featuredRecipe}
        latestRecipes={latestRecipes.recipes}
      />
    </div>
  )
}
