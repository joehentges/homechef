import { getCurrentUser } from "@/lib/session"
import { getFeaturedRecipesUseCase } from "@/use-cases/recipes"
import { getFeaturedUsersUseCase } from "@/use-cases/users"
import { SiteHeader } from "@/containers/site-header"
import { SiteFooter } from "@/components/site-footer"

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()
  const featuredRecipes = await getFeaturedRecipesUseCase()
  const featuredUsers = await getFeaturedUsersUseCase()

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader
        user={user}
        initialrecipes={featuredRecipes.slice(0, 5)}
        initialusers={featuredUsers.slice(0, 5)}
      />
      <main className="flex-1 pb-4">{children}</main>
      <SiteFooter />
    </div>
  )
}
