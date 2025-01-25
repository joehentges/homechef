import Link from "next/link"
import { MoveRightIcon } from "lucide-react"

import { Recipe, User } from "@/db/schemas"
import { getAvatarImageUrl } from "@/lib/get-avatar-image-url"

import { EnableEditView } from "./enable-edit-view"
import { FeaturedRecipe } from "./featured-recipe"
import { LatestRecipe } from "./latest-recipe"

interface ViewProfileProps {
  user: User
  canEdit?: boolean
  enableEditView: () => void
  featuredRecipe?: Recipe
  latestRecipes: Recipe[]
}

export function ViewProfile(props: ViewProfileProps) {
  const { user, canEdit, enableEditView, featuredRecipe, latestRecipes } = props

  const latestRecipesFiltered = latestRecipes
    .filter((recipe) => recipe.id !== featuredRecipe?.id)
    .slice(0, 3)

  return (
    <div className="bg-primary/20 relative container max-w-[1000px] space-y-6 rounded-3xl py-8">
      {canEdit && (
        <div className="absolute right-10 hidden md:block">
          <EnableEditView enableEditView={enableEditView} />
        </div>
      )}

      <div className="flex flex-col items-center gap-x-4 md:flex-row">
        <div
          className="bg-primary max-h-[200px] min-h-[200px] max-w-[200px] min-w-[200px] rounded-2xl border-4 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('${user.image ? user.image : getAvatarImageUrl(user.displayName)}')`,
          }}
        />
        {canEdit && (
          <div className="block pt-4 md:hidden">
            <EnableEditView enableEditView={enableEditView} />
          </div>
        )}
        <div className="flex w-full flex-col gap-y-2 py-4">
          <p className="text-center text-3xl font-bold md:text-start md:text-4xl">
            {user.displayName}
          </p>
          <p className="hidden md:block">{user.summary}</p>
        </div>
      </div>
      <p className="block text-center md:hidden">{user.summary}</p>

      {featuredRecipe && (
        <div className="space-y-2">
          <p className="text-center text-xl font-bold md:text-2xl">
            Featured Recipe
          </p>
          <FeaturedRecipe
            id={featuredRecipe.id}
            photo={featuredRecipe.photo}
            title={featuredRecipe.title}
            description={featuredRecipe.description}
          />
        </div>
      )}

      {latestRecipesFiltered.length > 0 && (
        <div className="space-y-2">
          <p className="text-center text-xl font-bold md:text-2xl">
            Latest Recipes
          </p>
          <div className="flex flex-row flex-wrap justify-center">
            {latestRecipesFiltered.map((recipe) => (
              <LatestRecipe
                key={recipe.id}
                id={recipe.id}
                photo={recipe.photo}
                title={recipe.title}
                description={recipe.description}
              />
            ))}
          </div>
        </div>
      )}

      {latestRecipes.length > 0 && (
        <Link
          href={canEdit ? "/cookbook" : `/chefs/${user.id}/cookbook`}
          className="group hover:text-foreground/70 flex items-center gap-x-2 justify-self-center transition-colors"
        >
          <p className="text-center md:text-xl">
            {canEdit
              ? "View your cookbook"
              : `View ${user.displayName}${user.displayName.slice(-1) === "s" ? "'" : "'s"} cookbook`}
          </p>
          <MoveRightIcon className="hidden md:block" />
        </Link>
      )}
    </div>
  )
}
