import { getCurrentUser } from "@/lib/session"
import { searchRecipesUseCase } from "@/use-cases/recipes"
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

  const recipes = await searchRecipesUseCase(
    {},
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
      />
    </div>
  )
}
