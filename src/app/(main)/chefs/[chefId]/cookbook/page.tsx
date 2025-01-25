import { getCurrentUser } from "@/lib/session"
import {
  getAvailableRecipeTagsUseCase,
  searchRecipesUseCase,
} from "@/use-cases/recipes"
import { getUserUseCase } from "@/use-cases/users"
import { UserRecipeSearch } from "@/containers/coobook-search"

interface ChefPageProps {
  params: Promise<{
    chefId: number
  }>
}

export default async function ChefCookbookPage(props: ChefPageProps) {
  const { params } = props
  const { chefId } = await params

  if (!chefId) {
    throw new Error("Chef not found")
  }

  let user = await getCurrentUser()
  const currentUserIsChef = chefId == user?.id

  if (!currentUserIsChef) {
    user = await getUserUseCase(chefId)
  }

  if (!user) {
    throw new Error("Chef not found")
  }

  const availableTags = await getAvailableRecipeTagsUseCase()
  const recipesList = await searchRecipesUseCase(
    {},
    {
      userId: chefId,
      userRecipesOnly: true,
      includeUserRecipes: true,
      includePrivateRecipes: currentUserIsChef,
    }
  )
  const randomRecipe =
    recipesList.recipes[Math.floor(Math.random() * recipesList.recipes.length)]

  return (
    <div className="md:py-10">
      <UserRecipeSearch
        title={
          currentUserIsChef
            ? undefined
            : `${user.displayName}${user.displayName.slice(-1) === "s" ? "'" : "'s"} Cookbook`
        }
        randomRecipe={randomRecipe}
        recipes={recipesList.recipes}
        recipesPerPageLimit={12}
        availableTags={availableTags}
        showCreateRecipeButton={currentUserIsChef}
      />
    </div>
  )
}
