"use client"

import { useMemo } from "react"
import { useQueryStates } from "nuqs"

import { Recipe } from "@/db/schemas"

import { Catalog } from "./catalog"
import { Input } from "./input"
import { SortBySelect } from "./sort-by-select"
import { TagSelect } from "./tag-select"

type FeaturedRecipe = Recipe & { tags: string[] }

interface FeaturedRecipeSearch {
  recipes: FeaturedRecipe[]
}

export function FeaturedRecipeSearch(props: FeaturedRecipeSearch) {
  const { recipes } = props

  const [searchValues] = useQueryStates({
    search: { defaultValue: "", parse: (value) => value || "" },
    sortBy: {
      defaultValue: "newest",
      parse: (value) => value.toLowerCase() || "newest",
    },
    tag: { defaultValue: "", parse: (value) => value || "" },
    page: { defaultValue: "1", parse: (value) => value || "1" },
  })

  function extractUniqueTags(
    recipes: FeaturedRecipe[],
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

  const itemsPerPage = 6
  const recipePageCount = Math.ceil(recipes.length / itemsPerPage)
  const page = (parseInt(searchValues.page) ?? 1) - 1 // want to start with 0 instead of one

  const sortByNewestFunction = (a: Recipe, b: Recipe) =>
    b.dateUpdated.getTime() - a.dateUpdated.getTime()
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

  const catalogPageItems = useMemo(
    () =>
      recipes
        .filter((recipe) => {
          let matchesTags = true
          if (!!searchValues.tag) {
            matchesTags = recipe.tags.some((tag) => tag === searchValues.tag)
          }
          let matchesTitleOrDescription = true
          if (!!searchValues.search) {
            matchesTitleOrDescription = recipe.title
              .toLowerCase()
              .includes(searchValues.search)
            if (!matchesTitleOrDescription) {
              matchesTitleOrDescription =
                recipe.description
                  ?.toLowerCase()
                  .includes(searchValues.search) ?? false
            }
          }
          return matchesTags && matchesTitleOrDescription
        })
        .sort(
          searchValues.sortBy === "easiest"
            ? sortByEasiestFunction
            : searchValues.sortBy === "fastest"
              ? sortByFastestFunction
              : sortByNewestFunction
        )
        .slice(page * itemsPerPage, (page + 1) * itemsPerPage),
    [recipes, searchValues, page]
  )

  return (
    <div className="container" id="featured-recipe-search">
      <div className="flex flex-col items-center justify-between gap-y-6 md:flex-row">
        <div className="flex w-full flex-col items-center gap-x-10 gap-y-6 md:flex-row">
          <p className="font-header text-4xl font-bold md:w-[200px]">
            Featured Recipes
          </p>
          <Input />
        </div>
        <SortBySelect />
      </div>

      <div className="flex flex-col items-start gap-x-10 gap-y-6 pt-6 md:flex-row md:pt-10">
        <TagSelect tags={catalogTags} />
        <Catalog items={catalogPageItems} pageCount={recipePageCount} />
      </div>
    </div>
  )
}
