import {
  createSearchParamsCache,
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
} from "nuqs/server"
import type { SearchParams } from "nuqs/server"

import { OrderBy } from "@/types/SearchRecipes"
import { getCurrentUser } from "@/lib/session"
import {
  getAvailableRecipeTagsUseCase,
  getRandomRecipeUseCase,
  searchRecipesUseCase,
} from "@/use-cases/recipes"
import { RecipeSearch } from "@/containers/recipe-search"

const searchParamsCache = createSearchParamsCache({
  search: parseAsString.withDefault(""),
  orderBy: parseAsString.withDefault("newest"),
  tags: parseAsArrayOf(parseAsString, ",").withDefault([]),
  page: parseAsInteger.withDefault(1),
})

interface RecipesPageProps {
  searchParams: Promise<SearchParams>
}

export default async function RecipesPage({ searchParams }: RecipesPageProps) {
  const { search, orderBy, tags, page } =
    await searchParamsCache.parse(searchParams)

  const user = await getCurrentUser()

  const limit = 12
  const limitLOffset = (page - 1) * limit

  const availableTags = await getAvailableRecipeTagsUseCase()
  const initialRecipes = await searchRecipesUseCase(
    {
      search,
      tags,
      orderBy: orderBy.toLowerCase() as OrderBy,
      limit,
      offset: limitLOffset,
    },
    {
      userId: user?.id,
      includeUserRecipes: !!user,
    }
  )
  const randomRecipe = await getRandomRecipeUseCase()

  return (
    <div>
      <RecipeSearch
        recipesPerPageLimit={limit}
        randomRecipe={randomRecipe}
        initialRecipesCount={initialRecipes.count}
        initialRecipes={initialRecipes.recipes}
        availableTags={availableTags}
        userId={user?.id}
      />
    </div>
  )
}
