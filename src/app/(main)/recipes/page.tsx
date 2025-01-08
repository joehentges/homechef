import {
  createSearchParamsCache,
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from "nuqs/server"
import type { SearchParams } from "nuqs/server"

import {
  getAvailableRecipeTagsUseCase,
  searchRecipesUseCase,
} from "@/use-cases/recipes"
import { RecipeSearch } from "@/containers/recipe-search"

const searchParamsCache = createSearchParamsCache({
  search: parseAsString.withDefault(""),
  sortBy: parseAsString.withDefault("newest"),
  tags: parseAsArrayOf(parseAsString, ",").withDefault([]),
  page: parseAsInteger.withDefault(1),
})

interface RecipesPageProps {
  searchParams: Promise<SearchParams>
}

export default async function RecipesPage({ searchParams }: RecipesPageProps) {
  const { search, sortBy, tags, page } =
    await searchParamsCache.parse(searchParams)

  const limit = 12
  const limitLOffset = (page - 1) * limit

  const availableTags = await getAvailableRecipeTagsUseCase()
  const initialRecipes = await searchRecipesUseCase(
    search,
    tags,
    sortBy.toLowerCase() as "newest" | "fastest" | "easiest",
    limit,
    limitLOffset
  )

  return (
    <div>
      <RecipeSearch
        title="Recipe Search"
        recipesPerPageLimit={limit}
        initialRecipesCount={initialRecipes.count}
        initialRecipes={initialRecipes.recipes}
        availableTags={availableTags}
      />
    </div>
  )
}
