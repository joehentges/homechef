import {
  createSearchParamsCache,
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
} from "nuqs/server"
import type { SearchParams } from "nuqs/server"

import { assertAuthenticated } from "@/lib/session"
import {
  getAvailableRecipeTagsUseCase,
  searchUserRecipesUseCase,
} from "@/use-cases/recipes"
import { RecipeSearch } from "@/containers/recipe-search"

const searchParamsCache = createSearchParamsCache({
  search: parseAsString.withDefault(""),
  sortBy: parseAsString.withDefault("newest"),
  tags: parseAsArrayOf(parseAsString, ",").withDefault([]),
  page: parseAsInteger.withDefault(1),
})

interface CookbookPageProps {
  searchParams: Promise<SearchParams>
}

export default async function CookbookPage({
  searchParams,
}: CookbookPageProps) {
  const { search, sortBy, tags, page } =
    await searchParamsCache.parse(searchParams)

  const user = await assertAuthenticated()

  const limit = 12
  const limitLOffset = (page - 1) * limit

  const availableTags = await getAvailableRecipeTagsUseCase()
  const initialRecipes = await searchUserRecipesUseCase(
    user.id,
    search,
    tags,
    sortBy.toLowerCase() as "newest" | "fastest" | "easiest",
    limit,
    limitLOffset
  )

  return (
    <div>
      <RecipeSearch
        title="Cookbook Search"
        userRecipesOnly
        recipesPerPageLimit={limit}
        initialRecipesCount={initialRecipes.count}
        initialRecipes={initialRecipes.recipes}
        availableTags={availableTags}
      />
    </div>
  )
}
