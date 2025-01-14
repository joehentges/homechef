"use client"

import { useEffect, useMemo } from "react"
import {
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryState,
} from "nuqs"

import { RecipeWithTags } from "@/types/Recipe"
import { OrderBy } from "@/types/SearchRecipes"
import { Recipe } from "@/db/schemas"
import { Catalog } from "@/components/catalog"

import { Input } from "./input"
import { SortBySelect } from "./sort-by-select"
import { TagSelect } from "./tag-select"

interface FeaturedRecipeSearch {
  recipes: RecipeWithTags[]
  recipesPerPageLimit: number
}

export function FeaturedRecipeSearch(props: FeaturedRecipeSearch) {
  const { recipes, recipesPerPageLimit } = props

  const [search, setSearch] = useQueryState(
    "search",
    parseAsString.withDefault("")
  )
  const [orderBy, setOrderBy] = useQueryState<OrderBy>(
    "orderBy",
    parseAsStringEnum(["newest", "easiest", "fastest"]).withDefault("newest")
  )
  const [tag, setTag] = useQueryState("tag", parseAsString.withDefault(""))
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1))

  function extractUniqueTags(
    recipes: RecipeWithTags[],
    limit: number = 5
  ): string[] {
    const uniqueTags = new Set<string>()

    for (const item of recipes) {
      for (const tag of item.tags) {
        if (uniqueTags.size < limit) {
          uniqueTags.add(tag)
        } else {
          break
        }
      }
      if (uniqueTags.size === limit) {
        break
      }
    }

    return [...uniqueTags]
  }

  const catalogTags = extractUniqueTags(recipes)

  const { catalogPageItems, totalCatalogItems } = useMemo(() => {
    const sortByNewestFunction = (a: Recipe, b: Recipe) =>
      new Date(b.dateUpdated).getTime() - new Date(a.dateUpdated).getTime()
    const sortByFastestFunction = (a: Recipe, b: Recipe) =>
      a.prepTime + a.cookTime - (b.prepTime + b.cookTime)
    const difficultySortOrder = {
      beginner: 0,
      intermediate: 1,
      advanced: 2,
      null: 3,
    }
    const sortByEasiestFunction = (a: Recipe, b: Recipe) =>
      difficultySortOrder[a.difficulty ?? "null"] -
      difficultySortOrder[b.difficulty ?? "null"]

    const catalogItems = recipes
      .filter((recipe) => {
        let matchesTags = true
        if (tag) {
          matchesTags = matchesTags = recipe.tags.some(
            (recipeTag) => recipeTag === tag
          )
        }
        let matchesTitleOrDescription = true
        if (!!search) {
          matchesTitleOrDescription = recipe.title
            .toLowerCase()
            .includes(search)
          if (!matchesTitleOrDescription) {
            matchesTitleOrDescription =
              recipe.description?.toLowerCase().includes(search) ?? false
          }
        }
        return matchesTags && matchesTitleOrDescription
      })
      .sort(
        orderBy === "easiest"
          ? sortByEasiestFunction
          : orderBy === "fastest"
            ? sortByFastestFunction
            : sortByNewestFunction
      )

    return {
      catalogPageItems: catalogItems.slice(
        (page - 1) * recipesPerPageLimit,
        page * recipesPerPageLimit
      ),
      totalCatalogItems: catalogItems.length,
    }
    // eslint-disable-next-line
  }, [search, tag, orderBy, page])

  const recipePageCount = Math.ceil(totalCatalogItems / recipesPerPageLimit)

  useEffect(() => {
    if (totalCatalogItems > 0 && catalogPageItems.length === 0) {
      setPage(1)
    }
    // eslint-disable-next-line
  }, [search, tag, orderBy, page])

  return (
    <div className="container" id="featured-recipe-search">
      <div className="flex flex-col items-center justify-between gap-y-6 md:flex-row">
        <div className="flex w-full flex-col items-center gap-x-10 gap-y-6 md:flex-row">
          <p className="font-header text-4xl font-bold md:w-[200px]">
            Featured Recipes
          </p>
          <Input search={search} setSearch={setSearch} />
        </div>
        <SortBySelect orderBy={orderBy} setOrderBy={setOrderBy} />
      </div>

      <div className="flex flex-col items-start gap-x-10 gap-y-6 pt-6 md:flex-row md:pt-10">
        <TagSelect
          tags={catalogTags}
          selectedTag={tag}
          setSelectedTag={setTag}
        />
        <Catalog
          items={catalogPageItems}
          pageCount={recipePageCount}
          currentPage={page}
          onPageClicked={setPage}
        />
      </div>
    </div>
  )
}
