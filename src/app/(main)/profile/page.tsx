import { assertAuthenticated } from "@/lib/session"
import { searchRecipesUseCase } from "@/use-cases/recipes"
import { Profile } from "@/containers/profile"

export default async function ProfilePage() {
  const user = await assertAuthenticated()

  const recipes = await searchRecipesUseCase(
    {},
    {
      userId: user.id,
      includeUserRecipes: true,
      userRecipesOnly: true,
      includePrivateRecipes: true,
    }
  )

  return (
    <div className="md:py-8">
      <Profile user={user} canEdit={true} />
    </div>
  )
}
