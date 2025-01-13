import {
  createSearchParamsCache,
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
} from "nuqs/server"
import type { SearchParams } from "nuqs/server"

import { SortBy } from "@/types/SortBy"
import {
  getAvailableRecipeTagsUseCase,
  getRandomRecipeUseCase,
  searchRecipesByTitleDescriptionTagsAndSortByUseCase,
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
  const initialRecipes =
    await searchRecipesByTitleDescriptionTagsAndSortByUseCase(
      search,
      tags,
      sortBy.toLowerCase() as SortBy,
      limit,
      limitLOffset
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
      />
    </div>
  )
}
