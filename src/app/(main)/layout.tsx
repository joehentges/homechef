import { getCurrentUser } from "@/lib/session"
import { geFeaturedRecipesUseCase } from "@/use-cases/recipes"
import { geFeaturedUsersUseCase } from "@/use-cases/users"
import { SiteHeader } from "@/containers/site-header"
import { SiteFooter } from "@/components/site-footer"

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()
  const featuredRecipes = await geFeaturedRecipesUseCase(24)
  const featuredUsers = await geFeaturedUsersUseCase(5)

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader
        user={user}
        initialSearchRecipes={featuredRecipes}
        initialSearchUsers={featuredUsers}
      />
      <main className="flex-1 pb-4">{children}</main>
      <SiteFooter />
    </div>
  )
}
